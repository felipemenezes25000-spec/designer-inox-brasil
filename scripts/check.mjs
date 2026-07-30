#!/usr/bin/env node
/**
 * Verificador do site.
 *
 * Roda depois do gerador e falha o build em qualquer problema. Cobre as
 * classes de erro que um site estático publica em silêncio: link interno
 * morto, imagem sem alt, asset referenciado que não existe, canonical errado,
 * id duplicado e — a mais traiçoeira — HTML no disco divergente do que os
 * dados produzem hoje, sinal de que alguém editou o arquivo gerado à mão.
 */

import { readdir, readFile, stat } from 'node:fs/promises'
import path from 'node:path'

import { site } from '../src/content/site.mjs'
import { routes, errorPage } from './generate.mjs'

const root = process.cwd()
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

async function collectHtml(dir, out = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (['node_modules', '.git', '.vercel', 'src', 'scripts', 'docs', 'assets'].includes(entry.name)) continue
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) await collectHtml(full, out)
    else if (entry.name.endsWith('.html')) out.push(full)
  }
  return out
}

async function main() {
  const files = await collectHtml(root)

  for (const file of files) {
    const rel = path.relative(root, file).replace(/\\/g, '/')
    const html = await readFile(file, 'utf8')

    // ── Estrutura ────────────────────────────────────────────────────────
    const h1Count = (html.match(/<h1[\s>]/gi) || []).length
    if (h1Count !== 1) fail(rel, `esperado exatamente 1 <h1>, encontrado ${h1Count}`)

    if (!/<html lang="pt-BR">/.test(html)) fail(rel, 'atributo lang ausente ou diferente de pt-BR')
    if (!/<meta charset="utf-8">/i.test(html)) fail(rel, 'meta charset ausente')
    if (!/name="viewport"/.test(html)) fail(rel, 'meta viewport ausente')

    const title = html.match(/<title>([^<]*)<\/title>/)?.[1]
    if (!title) fail(rel, '<title> ausente')
    else if (title.length > 70) warn(rel, `title com ${title.length} caracteres (o Google corta perto de 60)`)

    const description = html.match(/<meta name="description" content="([^"]*)"/)?.[1]
    if (!description) fail(rel, 'meta description ausente')
    else if (description.length > 170) warn(rel, `description com ${description.length} caracteres (corta perto de 160)`)

    // ── Canonical ────────────────────────────────────────────────────────
    // Canonical divergente da URL servida é causa clássica de página que
    // simplesmente não indexa.
    const canonical = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1]
    if (rel !== '404.html') {
      if (!canonical) {
        fail(rel, 'canonical ausente')
      } else {
        const expected =
          rel === 'index.html' ? `${site.origin}/` : `${site.origin}/${rel.replace(/index\.html$/, '')}`
        if (canonical !== expected) fail(rel, `canonical "${canonical}" difere da URL servida "${expected}"`)
      }
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
    const references = [
      ...[...html.matchAll(/\shref="([^"]+)"/g)].map(m => m[1]),
      ...[...html.matchAll(/\ssrc="([^"]+)"/g)].map(m => m[1]),
      ...[...html.matchAll(/\ssrcset="([^"]+)"/g)].flatMap(m =>
        m[1].split(',').map(part => part.trim().split(/\s+/)[0]),
      ),
    ]

    for (const reference of references) {
      const target = resolveTarget(reference, file)
      if (target && !(await exists(target))) fail(rel, `referência quebrada: ${reference}`)
    }
  }

  // ── Divergência entre disco e gerador ──────────────────────────────────
  // Se alguém editar um HTML gerado à mão, a próxima execução do gerador
  // apaga a mudança sem avisar. Melhor falhar aqui, alto e claro.
  const generated = [...routes(), errorPage]
  for (const route of generated) {
    const target = path.join(root, route.file)
    if (!(await exists(target))) {
      fail(route.file, 'declarado pelo gerador mas ausente no disco — rode npm run generate')
      continue
    }
    const onDisk = await readFile(target, 'utf8')
    if (onDisk !== route.html) {
      fail(route.file, 'conteúdo no disco difere do que o gerador produz — rode npm run generate')
    }
  }

  const generatedPaths = new Set(generated.map(route => path.join(root, route.file)))
  for (const file of files) {
    if (!generatedPaths.has(file)) {
      warn(path.relative(root, file).replace(/\\/g, '/'), 'HTML órfão: não é produzido pelo gerador')
    }
  }

  // ── Sitemap e robots ───────────────────────────────────────────────────
  if (await exists(path.join(root, 'sitemap.xml'))) {
    const sitemap = await readFile(path.join(root, 'sitemap.xml'), 'utf8')
    const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1])
    const expected = routes().map(route => `${site.origin}${route.path}`)
    for (const loc of locs) {
      if (!expected.includes(loc)) fail('sitemap.xml', `URL não corresponde a nenhuma rota: ${loc}`)
    }
    for (const url of expected) {
      if (!locs.includes(url)) fail('sitemap.xml', `rota ausente no sitemap: ${url}`)
    }
  } else {
    fail('sitemap.xml', 'ausente')
  }

  if (!(await exists(path.join(root, 'robots.txt')))) fail('robots.txt', 'ausente')

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

  console.log('\n✓ Estrutura, canonical, alt, ids, links, assets, sitemap e sincronia com o gerador verificados.')
}

await main()
