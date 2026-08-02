/**
 * Casca HTML compartilhada.
 *
 * Header, footer, meta tags, dados estruturados e o botão de WhatsApp vivem
 * aqui. Antes existiam copiados em cada um dos 17 arquivos HTML, o que fazia
 * qualquer correção de navegação virar 17 edições — e qualquer esquecimento
 * virar uma página inconsistente.
 */

import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'

import { site, contact, company, nav, whatsapp, photos, legalNotice } from '../content/site.mjs'

const placeholders = JSON.parse(
  readFileSync(new URL('../content/placeholders.json', import.meta.url), 'utf8'),
)

/**
 * Sufixo de cache-busting derivado do conteúdo do arquivo.
 *
 * Nenhum asset tem hash no nome, e o vercel.json serve /assets/ com
 * `immutable, max-age=31536000`. Sem o ?v=, trocar um arquivo mantendo o nome
 * nunca chegaria a quem já visitou: a URL não muda, e `immutable` instrui o
 * navegador a nem revalidar. O sufixo muda junto com o conteúdo e força o
 * download só quando algo mudou de fato.
 *
 * DUAS EXCEÇÕES DELIBERADAS — não "corrija":
 *
 * 1. As fontes. O <link rel="preload"> vive aqui, mas o @font-face que as
 *    consome está dentro do styles.css, que é estático e não pode chamar esta
 *    função. Hashear só o preload faria as duas URLs divergirem: o navegador
 *    baixaria cada fonte DUAS vezes e ainda avisaria no console que o preload
 *    não foi usado. Como não dá para hashear os dois lados, o certo é não
 *    hashear nenhum.
 *
 * 2. og:image e o `logo` do JSON-LD. São buscados por crawler e por scraper de
 *    rede social, que não compartilham o cache do visitante — a armadilha do
 *    immutable não os atinge. E URL estável é preferível em dado estruturado.
 */
const assetUrlCache = new Map()

function assetUrl(relativePath) {
  // Memoizado porque agora as fotos passam por aqui: são 70 arquivos, cada um
  // referenciado em várias das 26 páginas. Sem cache o build releria e
  // reidrataria o mesmo SHA centenas de vezes.
  const cached = assetUrlCache.get(relativePath)
  if (cached) return cached

  const bytes = readFileSync(new URL(`../../${relativePath}`, import.meta.url))
  const hash = createHash('sha256').update(bytes).digest('hex').slice(0, 10)
  const url = `/${relativePath}?v=${hash}`
  assetUrlCache.set(relativePath, url)
  return url
}

const CSS_URL = assetUrl('assets/css/styles.css')
const JS_URL = assetUrl('assets/js/main.js')

/**
 * Símbolo da marca — com hash, e por dois motivos.
 *
 * O primeiro é reparo. O vercel.json manda `immutable, max-age=31536000` para
 * todo /assets/brand/, e a Vercel aplica o header por CAMINHO, não por status:
 * enquanto o .vercelignore excluía estes arquivos, o 404 foi servido com essa
 * mesma diretiva. Todo navegador que abriu o site naquela janela gravou o 404
 * por um ano, e `immutable` significa literalmente "não revalide" — nenhum
 * deploy alcança esse cache. Só uma URL nova, que é outra chave.
 *
 * O segundo é prevenção. Sem hash, trocar a logo também nunca chegaria a quem
 * já visitou: o arquivo mudaria, a URL não, e o cache do visitante venceria em
 * 2027. Com o sufixo derivado do conteúdo, qualquer alteração se propaga
 * sozinha — mesma garantia que styles.css e main.js já tinham.
 */
const BRAND_SYMBOL = {
  avif: assetUrl('assets/brand/symbol-negative.avif'),
  webp: assetUrl('assets/brand/symbol-negative.webp'),
  png: assetUrl('assets/brand/symbol-negative.png'),
}

/**
 * O <picture> da marca. Header e rodapé usavam o mesmo bloco copiado, o que já
 * foi meio caminho para a divergência: bastava alguém corrigir um dos dois.
 *
 * `loading` é parâmetro porque a marca do cabeçalho está acima da dobra e não
 * pode ser adiada, enquanto a do rodapé nunca é vista no primeiro quadro.
 */
const brandSymbol = ({ loading = null } = {}) => `<picture class="brand-symbol">
<source type="image/avif" srcset="${attr(BRAND_SYMBOL.avif)}">
<source type="image/webp" srcset="${attr(BRAND_SYMBOL.webp)}">
<img src="${attr(BRAND_SYMBOL.png)}" alt="" width="512" height="512"${loading ? ` loading="${loading}"` : ''} decoding="async">
</picture>`

/** Escapa texto para inserção segura em conteúdo HTML. */
export const esc = value =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

/** Escapa texto para inserção dentro de um atributo. */
export const attr = value => esc(value)

const PHOTO_WIDTHS = [640, 1280, 1920]

/**
 * Monta um <picture> responsivo com AVIF, WebP e fallback JPEG.
 *
 * width/height explícitos e aspect-ratio no CSS reservam o espaço antes do
 * download, então a página não pula quando a imagem chega. O placeholder de
 * 20px entra como background inline e cobre o intervalo com a cor certa.
 */
export function picture(key, { sizes = '100vw', className = '', loading = 'lazy', priority = false } = {}) {
  const meta = photos[key]
  if (!meta) throw new Error(`Foto desconhecida: ${key}`)

  // As URLs levam hash de conteúdo pelo mesmo motivo do símbolo da marca: o
  // vercel.json serve /assets/img/ como immutable por um ano, então substituir
  // uma foto mantendo o nome jamais chegaria a quem já visitou o site. O
  // sufixo ?v= é seguro dentro de srcset — o separador ali é a vírgula, e o
  // hash é hexadecimal.
  const srcset = ext =>
    PHOTO_WIDTHS.map(w => `${assetUrl(`assets/img/photos/${key}-${w}.${ext}`)} ${w}w`).join(', ')

  const placeholder = placeholders[key]
  const style = placeholder ? ` style="background-image:url(${placeholder})"` : ''
  const load = priority ? 'eager' : loading
  const fetchPriority = priority ? ' fetchpriority="high"' : ''

  return `<picture class="photo${className ? ` ${className}` : ''}"${style}>
<source type="image/avif" srcset="${srcset('avif')}" sizes="${attr(sizes)}">
<source type="image/webp" srcset="${srcset('webp')}" sizes="${attr(sizes)}">
<img src="${assetUrl(`assets/img/photos/${key}-1280.jpg`)}" alt="${attr(meta.alt)}" width="1280" height="853" loading="${load}" decoding="async"${fetchPriority}>
</picture>`
}

/** Rótulo obrigatório em toda foto de banco. Nenhuma é obra da empresa. */
export const illustrativeNote = (text = 'Imagem ilustrativa') =>
  `<p class="illustrative-note">${esc(text)}</p>`

const navMarkup = (current, { activeNav } = {}) =>
  nav
    .map(item => {
      const match = activeNav
        ? item.href === activeNav
        : current && current.startsWith(item.href)
      const active = match ? ' aria-current="page"' : ''
      return `<a href="${attr(item.href)}"${active}>${esc(item.label)}</a>`
    })
    .join('')

const header = (current, opts) => `<header class="site-header">
<div class="container nav">
<a class="brand" href="/" aria-label="${attr(`${site.name} — página inicial`)}">
${brandSymbol()}
<span class="brand-name" translate="no">${esc(site.name)}</span>
</a>
<button class="menu-button" type="button" aria-label="Abrir navegação" aria-expanded="false" aria-controls="navegacao" data-menu-button><span></span></button>
<nav class="nav-links" id="navegacao" aria-label="Navegação principal" data-menu>
${navMarkup(current, opts)}
<a class="btn btn-sm" data-cta="header-orcamento" href="/orcamento/">Pedir orçamento <span class="arrow" aria-hidden="true">→</span></a>
</nav>
</div>
</header>`

const footer = () => `<footer class="footer">
<div class="container">
<div class="footer-grid">
<div class="footer-brand">
<div class="footer-lockup">
${brandSymbol({ loading: 'lazy' })}
<span class="brand-name" translate="no">${esc(site.name)}</span>
</div>
<p>Projeto técnico, fabricação, instalação, sistemas e manutenção em aço inox, coordenados conforme a necessidade real do espaço e do uso.</p>
<div class="footer-contact">
<a class="footer-phone" data-cta="footer-whatsapp" href="${attr(whatsapp())}" target="_blank" rel="noopener noreferrer">${esc(contact.whatsappDisplay)}</a>
${contact.email ? `<a href="mailto:${attr(contact.email)}">${esc(contact.email)}</a>` : ''}
<span>${esc(contact.hours)}</span>
<span>${esc(site.region)}</span>
${company.legalName ? `<span>${esc(company.legalName)}${company.cnpj ? ` · CNPJ ${esc(company.cnpj)}` : ''}</span>` : '<!-- TODO: razão social e CNPJ -->'}
</div>
</div>
<div class="footer-col">
<h2>Serviços</h2>
<nav aria-label="Serviços no rodapé">
<a href="/cozinhas-industriais/">Cozinhas industriais</a>
<a href="/equipamentos-em-inox/">Equipamentos sob medida</a>
<a href="/coifas-ventilacao-e-exaustao/">Coifas e exaustão</a>
<a href="/refrigeracao-industrial/">Refrigeração</a>
<a href="/aquecimento-industrial/">Aquecimento</a>
<a href="/automacao-eletrica/">Automação elétrica</a>
<a href="/servicos/">Ver todos os serviços</a>
</nav>
</div>
<div class="footer-col">
<h2>Navegação</h2>
<nav aria-label="Navegação no rodapé">
<a href="/segmentos/">Segmentos</a>
<a href="/clientes/">Clientes</a>
<a href="/empresa/">Empresa</a>
<a href="/orcamento/">Pedir orçamento</a>
<a href="${attr(contact.instagramUrl)}" target="_blank" rel="noopener noreferrer">Instagram <span aria-hidden="true">↗</span></a>
<a href="${attr(whatsapp())}" target="_blank" rel="noopener noreferrer">WhatsApp <span aria-hidden="true">↗</span></a>
</nav>
</div>
</div>
<p class="footer-legal">${esc(legalNotice)}</p>
<div class="footer-bottom">
<span>© <span data-year>2026</span> ${esc(site.name)}</span>
<span><a href="/politica-de-privacidade/">Privacidade</a> · <a href="/termos-de-uso/">Termos de uso</a></span>
</div>
</div>
</footer>`

const whatsappFloat = () => `<a class="whatsapp-float" data-cta="whatsapp-flutuante" href="${attr(whatsapp())}" target="_blank" rel="noopener noreferrer" aria-label="Falar com a Designer Inox Brasil pelo WhatsApp">
<span class="whatsapp-icon" aria-hidden="true"><svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.65-2.05-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.47s1.06 2.86 1.21 3.06c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.28.17-1.41-.07-.13-.27-.2-.57-.35M12.04 21.5h-.01a9.4 9.4 0 0 1-4.79-1.31l-.34-.2-3.56.93.95-3.47-.22-.36a9.38 9.38 0 0 1-1.44-5.01c0-5.18 4.22-9.4 9.42-9.4 2.51 0 4.88.98 6.65 2.76a9.35 9.35 0 0 1 2.75 6.65c0 5.19-4.22 9.41-9.41 9.41M20.4 3.6A11.7 11.7 0 0 0 12.04 0C5.6 0 .36 5.24.36 11.68c0 2.06.54 4.07 1.56 5.84L.26 24l6.62-1.74a11.66 11.66 0 0 0 5.16 1.24h.01c6.44 0 11.68-5.24 11.68-11.68 0-3.12-1.21-6.05-3.42-8.26"/></svg></span>
<span class="whatsapp-label">Pedir orçamento</span>
</a>`

/**
 * Dados estruturados.
 *
 * Emitir Organization + LocalBusiness na home e Service nas páginas de serviço
 * dá ao Google o vocabulário para mostrar telefone, área atendida e catálogo —
 * coisas que o texto sozinho não comunica de forma legível por máquina.
 */
function structuredData({ type, title, description, path, breadcrumbs, faq }) {
  const graph = []
  const url = `${site.origin}${path}`

  if (type === 'home') {
    const org = {
      '@type': ['Organization', 'LocalBusiness'],
      '@id': `${site.origin}/#organization`,
      name: site.name,
      description: site.description,
      url: site.origin,
      logo: `${site.origin}/assets/brand/symbol-negative.png`,
      image: `${site.origin}/assets/img/og-default.jpg`,
      telephone: `+${contact.whatsappNumber}`,
      openingHoursSpecification: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '08:00',
        closes: '18:00',
      },
      sameAs: [contact.instagramUrl],
      address: {
        '@type': 'PostalAddress',
        addressLocality: site.city,
        addressRegion: site.state,
        addressCountry: 'BR',
      },
      areaServed: { '@type': 'AdministrativeArea', name: site.region },
    }
    if (contact.email) org.email = contact.email
    if (company.legalName) org.legalName = company.legalName
    graph.push(org)

    graph.push({
      '@type': 'WebSite',
      '@id': `${site.origin}/#website`,
      url: site.origin,
      name: site.name,
      publisher: { '@id': `${site.origin}/#organization` },
    })
  }

  if (type === 'service') {
    graph.push({
      '@type': 'Service',
      name: title,
      description,
      url,
      serviceType: title,
      provider: { '@id': `${site.origin}/#organization` },
      areaServed: { '@type': 'AdministrativeArea', name: site.region },
    })
  }

  if (breadcrumbs?.length) {
    graph.push({
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.label,
        item: `${site.origin}${crumb.href}`,
      })),
    })
  }

  if (faq?.length) {
    graph.push({
      '@type': 'FAQPage',
      mainEntity: faq.map(item => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: { '@type': 'Answer', text: item.a },
      })),
    })
  }

  if (!graph.length) return ''
  const json = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph })
  // </script> dentro de JSON encerraria o bloco cedo; escapamos a barra.
  return `<script type="application/ld+json">${json.replace(/</g, '\\u003c')}</script>`
}

const breadcrumbMarkup = crumbs => {
  if (!crumbs || crumbs.length < 2) return ''
  const items = crumbs
    .map((crumb, index) =>
      index === crumbs.length - 1
        ? `<li aria-current="page">${esc(crumb.label)}</li>`
        : `<li><a href="${attr(crumb.href)}">${esc(crumb.label)}</a></li>`,
    )
    .join('')
  return `<nav class="breadcrumb" aria-label="Trilha de navegação"><div class="container"><ol>${items}</ol></div></nav>`
}

/**
 * Monta a página completa.
 *
 * `path` precisa terminar em barra (o vercel.json usa trailingSlash) porque ele
 * vira o canonical e o og:url — canonical divergente da URL servida é motivo
 * clássico de página não indexar.
 */
export function page({
  title,
  description,
  path,
  body,
  type = 'default',
  accent = null,
  breadcrumbs = null,
  ogImage = '/assets/img/og-default.jpg',
  bodyClass = '',
  activeNav = null,
  faq = null,
}) {
  const fullTitle = path === '/' ? title : `${title} | ${site.name}`
  const canonical = `${site.origin}${path}`
  const cls = [accent ? `accent-${accent}` : '', bodyClass].filter(Boolean).join(' ')

  return `<!doctype html>
<html lang="${attr(site.locale)}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${attr(description)}">
<link rel="canonical" href="${attr(canonical)}">
<meta name="theme-color" content="#0b0e10">
<meta name="format-detection" content="telephone=no">
<meta property="og:type" content="website">
<meta property="og:locale" content="pt_BR">
<meta property="og:site_name" content="${attr(site.name)}">
<meta property="og:title" content="${attr(fullTitle)}">
<meta property="og:description" content="${attr(description)}">
<meta property="og:url" content="${attr(canonical)}">
<meta property="og:image" content="${attr(site.origin + ogImage)}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${attr(fullTitle)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${attr(fullTitle)}">
<meta name="twitter:description" content="${attr(description)}">
<meta name="twitter:image" content="${attr(site.origin + ogImage)}">
<link rel="icon" href="${attr(assetUrl('assets/brand/icon-32.png'))}" sizes="32x32">
<link rel="icon" href="${attr(assetUrl('assets/brand/icon-16.png'))}" sizes="16x16">
<link rel="apple-touch-icon" href="${attr(assetUrl('assets/brand/icon-180.png'))}">
<link rel="manifest" href="/manifest.webmanifest">
<link rel="preload" href="/assets/fonts/sora-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/inter-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${CSS_URL}">
${structuredData({ type, title: fullTitle, description, path, breadcrumbs, faq })}
</head>
<body${cls ? ` class="${attr(cls)}"` : ''}>
<a class="skip-link" href="#conteudo">Ir para o conteúdo principal</a>
<div class="topline"><div class="container"><span>Projeto · Fabricação · Sistemas · Manutenção</span><span>${esc(site.region)}</span></div></div>
${header(path, { activeNav })}
${breadcrumbMarkup(breadcrumbs)}
<main id="conteudo" tabindex="-1">
${body}
</main>
${footer()}
${whatsappFloat()}
<script src="${JS_URL}" defer></script>
</body>
</html>
`
}
