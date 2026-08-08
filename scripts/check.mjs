#!/usr/bin/env node
/**
 * Verificador da saída do build.
 *
 * Roda depois do build e falha em qualquer problema que um site
 * pré-renderizado publica em silêncio: link interno morto, imagem sem alt,
 * asset referenciado que não existe, canonical errado, id duplicado e
 * sitemap divergente das páginas realmente publicadas.
 *
 * Lê a saída do build (dist/client por padrão), não a raiz do repositório.
 * Não existe mais HTML versionado que possa divergir de um gerador — por
 * isso o antigo scripts/generate.mjs e a checagem de "disco diverge do que o
 * gerador produz" saíram daqui. O mesmo vale para o aviso de "HTML órfão":
 * toda página em dist/client é, por construção, saída do build.
 */

import { readdir, readFile, stat } from 'node:fs/promises'
import path from 'node:path'

import { site } from '../src/content/site'

const root = path.resolve(process.cwd(), process.argv[2] ?? 'dist/client')
const errors = []
const warnings = []

const fail = (file, message) => errors.push(`${file}: ${message}`)
const warn = (file, message) => warnings.push(`${file}: ${message}`)

const exists = async target => {
  try {
    await stat(target)
    return true
  } catch {
    return false
  }
}

/** Resolve um href/src para o arquivo que deveria existir no disco. */
function resolveTarget(reference, fromFile) {
  if (!reference) return null
  if (reference.startsWith('#') || reference.startsWith('data:')) return null
  if (/^(https?:|mailto:|tel:|javascript:)/i.test(reference)) return null

  const clean = reference.split('#')[0].split('?')[0]
  if (!clean) return null

  let resolved = clean.startsWith('/') ? path.join(root, clean) : path.resolve(path.dirname(fromFile), clean)
  if (clean.endsWith('/')) resolved = path.join(resolved, 'index.html')
  else if (!path.extname(resolved)) resolved = path.join(resolved, 'index.html')
  return resolved
}

/**
 * Padrões efetivos do .vercelignore.
 *
 * Existe porque um asset excluído do deploy é invisível em desenvolvimento: o
 * dev server serve o disco inteiro e o arquivo está lá. A divergência só
 * aparece em produção, como 404 — e foi exatamente assim que a marca do
 * cabeçalho ficou quebrada nas 25 páginas por vários deploys.
 *
 * Sempre lido da raiz do REPOSITÓRIO (process.cwd()), não da raiz de
 * varredura (a saída do build): é lá que o .vercelignore mora, e as regras
 * dentro dele descrevem caminhos relativos a ela, não à saída do build.
 */
async function loadDeployIgnore() {
  try {
    const raw = await readFile(path.join(process.cwd(), '.vercelignore'), 'utf8')
    return raw
      .split('\n')
      .map(line => line.trim())
      .filter(line => line && !line.startsWith('#'))
  } catch {
    return []
  }
}

/**
 * O caminho servido cai em algum padrão de exclusão?
 *
 * Cobre o subconjunto de sintaxe que o .vercelignore deste projeto usa:
 * caminho literal, prefixo de diretório e glob de um segmento. É
 * deliberadamente conservador — na dúvida devolve false. Um falso negativo
 * apenas mantém o status quo; um falso positivo quebraria o build por um
 * problema inexistente.
 */
function isDeployExcluded(servedPath, patterns) {
  return patterns.some(pattern => {
    const clean = pattern.replace(/^\/+/, '').replace(/\/+$/, '')
    if (!clean) return false

    if (clean.includes('*')) {
      const source = clean
        .split('*')
        .map(part => part.replace(/[.+?^${}()|[\]\\]/g, '\\$&'))
        .join('[^/]*')
      const rx = new RegExp(`^${source}$`)
      // Padrão sem barra casa pelo nome do arquivo, em qualquer nível — é a
      // regra do gitignore, e é o que faz `*.md` pegar docs aninhados.
      return clean.includes('/') ? rx.test(servedPath) : rx.test(servedPath.split('/').pop())
    }

    return servedPath === clean || servedPath.startsWith(`${clean}/`)
  })
}

/**
 * Todo arquivo em dist/client que não é um HTML gerado pelo prerender veio de
 * public/ verbatim — é o que o Vite faz com publicDir. Precisa do prefixo
 * "public/" para casar com os padrões do .vercelignore, que descrevem
 * caminhos a partir da raiz do repositório, não da saída do build.
 *
 * Um bundle com hash (dist/client/assets/*.js, *.css) nasce dentro do
 * container a partir de src/ e não tem um caminho de origem em public/ —
 * prefixá-lo do mesmo jeito só faz o padrão não casar com nada, igual a
 * antes. Uma referência relativa entre páginas (href para outra rota) sofre
 * o mesmo: não é um caminho real, mas também não casa com nenhum padrão do
 * .vercelignore, então não gera falso positivo.
 */
function toRepoPath(servedFromBuildRoot) {
  return `public/${servedFromBuildRoot}`
}

async function collectHtml(dir, out = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) await collectHtml(full, out)
    else if (entry.name.endsWith('.html')) out.push(full)
  }
  return out
}

async function main() {
  const files = await collectHtml(root)
  const deployIgnore = await loadDeployIgnore()
  // Substitui o antigo routes() de generate.mjs para a checagem do sitemap:
  // em vez de comparar sitemap.xml contra uma lista declarada à parte, compara
  // contra as páginas que o build realmente produziu (abaixo, por arquivo).
  const builtUrls = []

  for (const file of files) {
    const rel = path.relative(root, file).replace(/\\/g, '/')
    const html = await readFile(file, 'utf8')

    // ── Estrutura ────────────────────────────────────────────────────────
    const h1Count = (html.match(/<h1[\s>]/gi) || []).length
    if (h1Count !== 1) fail(rel, `esperado exatamente 1 <h1>, encontrado ${h1Count}`)

    if (!/<html lang="pt-BR">/.test(html)) fail(rel, 'atributo lang ausente ou diferente de pt-BR')
    // React/TanStack Start serializam <meta charSet="utf-8"/> — void element
    // autofechado, e "charSet" com o C maiúsculo do prop original, não o
    // <meta charset="..."> em minúsculas e sem barra que o gerador estático
    // antigo escrevia à mão. Nome de atributo HTML é case-insensitive e
    // "/>" é só a forma XML-compatível do mesmo void element, então o /i e o
    // "/?" tornam a checagem correta para esse formato, não mais frouxa.
    if (!/<meta\s+charset="utf-8"\s*\/?>/i.test(html)) fail(rel, 'meta charset ausente')
    if (!/name="viewport"/.test(html)) fail(rel, 'meta viewport ausente')

    const title = html.match(/<title>([^<]*)<\/title>/)?.[1]
    if (!title) fail(rel, '<title> ausente')
    else if (title.length > 70) warn(rel, `title com ${title.length} caracteres (o Google corta perto de 60)`)

    const description = html.match(/<meta name="description" content="([^"]*)"/)?.[1]
    if (!description) fail(rel, 'meta description ausente')
    else if (description.length > 170) warn(rel, `description com ${description.length} caracteres (corta perto de 160)`)

    // ── Canonical ────────────────────────────────────────────────────────
    // Canonical divergente da URL servida é causa clássica de página que
    // simplesmente não indexa. A URL "certa" vem do caminho do arquivo, não
    // do que o canonical afirma — por isso builtUrls recebe `expected` mesmo
    // quando o canonical está errado: a página existe e será publicada nessa
    // URL de qualquer forma, e o sitemap precisa listá-la.
    const canonical = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1]
    if (rel !== '404.html') {
      const expected =
        rel === 'index.html' ? `${site.origin}/` : `${site.origin}/${rel.replace(/index\.html$/, '')}`
      builtUrls.push(expected)

      if (!canonical) fail(rel, 'canonical ausente')
      else if (canonical !== expected) fail(rel, `canonical "${canonical}" difere da URL servida "${expected}"`)
    }

    // ── Acessibilidade ───────────────────────────────────────────────────
    for (const tag of html.matchAll(/<img\b[^>]*>/gi)) {
      if (!/\salt=("[^"]*"|'[^']*')/.test(tag[0])) fail(rel, `imagem sem atributo alt: ${tag[0].slice(0, 90)}`)
      if (!/\swidth=/.test(tag[0]) || !/\sheight=/.test(tag[0])) {
        warn(rel, `imagem sem width/height explícitos (causa layout shift): ${tag[0].slice(0, 70)}`)
      }
    }

    const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(m => m[1])
    const duplicated = ids.filter((id, index) => ids.indexOf(id) !== index)
    if (duplicated.length) fail(rel, `id duplicado: ${[...new Set(duplicated)].join(', ')}`)

    if (/href=["']#["']/.test(html)) fail(rel, 'href="#" vazio')

    // ── Segurança de links externos ──────────────────────────────────────
    for (const tag of html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/gi)) {
      if (!/rel="[^"]*noopener/.test(tag[0])) fail(rel, `target="_blank" sem rel="noopener": ${tag[0].slice(0, 80)}`)
    }

    // ── Links e assets referenciados ─────────────────────────────────────
    // srcset é /i porque React serializa o atributo do <source>/<img> como
    // "srcSet" (case do prop JSX preservado) — igual ao charSet acima. Sem o
    // /i essa checagem casava zero vezes neste build (208 ocorrências, todas
    // em maiúscula) e nunca detectaria uma variante responsiva quebrada.
    const references = [
      ...[...html.matchAll(/\shref="([^"]+)"/g)].map(m => m[1]),
      ...[...html.matchAll(/\ssrc="([^"]+)"/g)].map(m => m[1]),
      ...[...html.matchAll(/\ssrcset="([^"]+)"/gi)].flatMap(m =>
        m[1].split(',').map(part => part.trim().split(/\s+/)[0]),
      ),
    ]

    for (const reference of references) {
      const target = resolveTarget(reference, file)
      if (!target) continue

      if (!(await exists(target))) {
        fail(rel, `referência quebrada: ${reference}`)
        continue
      }

      // Existe no disco não é o mesmo que existe em produção.
      const served = path.relative(root, target).replace(/\\/g, '/')
      if (isDeployExcluded(toRepoPath(served), deployIgnore)) {
        fail(rel, `.vercelignore exclui um arquivo que o HTML referencia — 404 em produção: ${reference}`)
      }
    }
  }

  // ── Sitemap e robots ───────────────────────────────────────────────────
  if (await exists(path.join(root, 'sitemap.xml'))) {
    const sitemap = await readFile(path.join(root, 'sitemap.xml'), 'utf8')
    const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1])
    for (const loc of locs) {
      if (!builtUrls.includes(loc)) fail('sitemap.xml', `URL não corresponde a nenhuma página publicada: ${loc}`)
    }
    for (const url of builtUrls) {
      if (!locs.includes(url)) fail('sitemap.xml', `página publicada ausente no sitemap: ${url}`)
    }
  } else {
    fail('sitemap.xml', 'ausente')
  }

  if (!(await exists(path.join(root, 'robots.txt')))) fail('robots.txt', 'ausente')

  // ── Manifesto ──────────────────────────────────────────────────────────
  // O manifest.webmanifest referencia ícones e o símbolo da marca, mas não é
  // HTML — ficava inteiramente fora da varredura acima. Estava apontando para
  // symbol-negative.png durante todo o período em que o .vercelignore o
  // excluía, e nada acusou.
  const manifestPath = path.join(root, 'manifest.webmanifest')
  if (await exists(manifestPath)) {
    let manifest
    try {
      manifest = JSON.parse(await readFile(manifestPath, 'utf8'))
    } catch (error) {
      fail('manifest.webmanifest', `JSON inválido: ${error.message}`)
    }

    for (const icon of manifest?.icons ?? []) {
      const target = resolveTarget(icon.src, manifestPath)
      if (!target) continue

      if (!(await exists(target))) {
        fail('manifest.webmanifest', `ícone inexistente: ${icon.src}`)
        continue
      }

      const served = path.relative(root, target).replace(/\\/g, '/')
      if (isDeployExcluded(toRepoPath(served), deployIgnore)) {
        fail('manifest.webmanifest', `.vercelignore exclui um ícone do manifesto — 404 em produção: ${icon.src}`)
      }
    }
  } else {
    warn('manifest.webmanifest', 'ausente — o HTML declara <link rel="manifest">')
  }

  // ── Relatório ──────────────────────────────────────────────────────────
  console.log(`HTML verificados: ${files.length}`)

  if (warnings.length) {
    console.warn(`\nAvisos (${warnings.length}):`)
    console.warn(warnings.map(w => `  · ${w}`).join('\n'))
  }

  if (errors.length) {
    console.error(`\nErros (${errors.length}):`)
    console.error(errors.map(e => `  ✗ ${e}`).join('\n'))
    process.exitCode = 1
    return
  }

  console.log('\n✓ Estrutura, canonical, alt, ids, links, assets, sitemap e manifesto verificados.')
}

await main()
