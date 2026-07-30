#!/usr/bin/env node
/**
 * Gera todas as páginas HTML a partir dos dados em src/content.
 *
 * A saída vai para a raiz do repositório porque o vercel.json publica a raiz
 * direto, sem etapa de build. Os arquivos gerados são versionados: o deploy não
 * depende de o Node rodar na Vercel.
 *
 * Rode `npm run build` depois de qualquer mudança em src/. O check compara o
 * que está no disco com o que os dados produzem e falha se houver divergência.
 */

import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

import { site } from '../src/content/site.mjs'
import { services } from '../src/content/services.mjs'
import { segments } from '../src/content/segments.mjs'
import { page } from '../src/templates/layout.mjs'
import {
  homePage,
  servicesIndexPage,
  servicePage,
  segmentsIndexPage,
  segmentPage,
  clientsPage,
  companyPage,
  quotePage,
  privacyPage,
  termsPage,
  notFoundPage,
} from '../src/templates/pages.mjs'

const root = process.cwd()

const HOME = { label: 'Início', href: '/' }

/** Todas as rotas do site, na ordem em que entram no sitemap. */
export function routes() {
  const list = [
    {
      path: '/',
      file: 'index.html',
      priority: '1.0',
      html: page({
        title: `${site.name} | Cozinhas industriais e manutenção`,
        description: site.description,
        path: '/',
        type: 'home',
        body: homePage(),
        ogImage: '/assets/img/og-default.jpg',
      }),
    },
    {
      path: '/servicos/',
      file: 'servicos/index.html',
      priority: '0.9',
      html: page({
        title: 'Serviços',
        description: `Catálogo completo dos ${services.length} serviços: cozinhas industriais, equipamentos em inox, corte CNC, exaustão, refrigeração, aquecimento, CO₂, automação e manutenção.`,
        path: '/servicos/',
        breadcrumbs: [HOME, { label: 'Serviços', href: '/servicos/' }],
        body: servicesIndexPage(),
      }),
    },
    {
      path: '/segmentos/',
      file: 'segmentos/index.html',
      priority: '0.8',
      html: page({
        title: 'Segmentos de atuação',
        description:
          'Restaurantes, hotelaria e alimentação coletiva, produção e varejo de alimentos, saúde e ambientes hospitalares.',
        path: '/segmentos/',
        breadcrumbs: [HOME, { label: 'Segmentos', href: '/segmentos/' }],
        body: segmentsIndexPage(),
      }),
    },
    {
      path: '/clientes/',
      file: 'clientes/index.html',
      priority: '0.8',
      html: page({
        title: 'Clientes',
        description:
          'Hospitais, embaixadas, redes de varejo, restaurantes, hotelaria e construtoras atendidas pela Designer Inox Brasil.',
        path: '/clientes/',
        breadcrumbs: [HOME, { label: 'Clientes', href: '/clientes/' }],
        body: clientsPage(),
      }),
    },
    {
      path: '/empresa/',
      file: 'empresa/index.html',
      priority: '0.7',
      html: page({
        title: 'Empresa',
        description:
          'A Designer Inox Brasil projeta, fabrica, instala, integra sistemas e mantém estruturas em aço inox para operações profissionais.',
        path: '/empresa/',
        breadcrumbs: [HOME, { label: 'Empresa', href: '/empresa/' }],
        body: companyPage(),
      }),
    },
    {
      path: '/orcamento/',
      file: 'orcamento/index.html',
      priority: '0.9',
      html: page({
        title: 'Solicitar avaliação',
        description:
          'Monte uma mensagem organizada com cidade, tipo de operação e necessidade, e abra o WhatsApp com o texto pronto.',
        path: '/orcamento/',
        breadcrumbs: [HOME, { label: 'Solicitar avaliação', href: '/orcamento/' }],
        body: quotePage(),
        bodyClass: 'page-form',
      }),
    },
  ]

  for (const service of services) {
    list.push({
      path: `/${service.slug}/`,
      file: `${service.slug}/index.html`,
      priority: '0.8',
      html: page({
        // seoTitle encurta os títulos longos: somado a " | Designer Inox
        // Brasil", o <title> precisa caber nos ~60 caracteres que o Google
        // exibe antes de cortar.
        title: service.seoTitle || service.title,
        description: service.meta,
        path: `/${service.slug}/`,
        type: 'service',
        accent: service.accent,
        breadcrumbs: [HOME, { label: 'Serviços', href: '/servicos/' }, { label: service.navTitle, href: `/${service.slug}/` }],
        body: servicePage(service),
        ogImage: service.photo ? `/assets/img/photos/${service.photo}-1280.jpg` : '/assets/img/og-default.jpg',
      }),
    })
  }

  for (const segment of segments) {
    list.push({
      path: `/segmentos/${segment.slug}/`,
      file: `segmentos/${segment.slug}/index.html`,
      priority: '0.7',
      html: page({
        title: segment.title,
        description: segment.meta,
        path: `/segmentos/${segment.slug}/`,
        accent: segment.accent,
        breadcrumbs: [
          HOME,
          { label: 'Segmentos', href: '/segmentos/' },
          { label: segment.navTitle, href: `/segmentos/${segment.slug}/` },
        ],
        body: segmentPage(segment),
        ogImage: `/assets/img/photos/${segment.photo}-1280.jpg`,
      }),
    })
  }

  list.push(
    {
      path: '/politica-de-privacidade/',
      file: 'politica-de-privacidade/index.html',
      priority: '0.3',
      html: page({
        title: 'Política de privacidade',
        description: 'Como a Designer Inox Brasil trata dados neste site. O site é estático e não coleta dados.',
        path: '/politica-de-privacidade/',
        breadcrumbs: [HOME, { label: 'Política de privacidade', href: '/politica-de-privacidade/' }],
        body: privacyPage(),
        bodyClass: 'page-legal',
      }),
    },
    {
      path: '/termos-de-uso/',
      file: 'termos-de-uso/index.html',
      priority: '0.3',
      html: page({
        title: 'Termos de uso',
        description: 'Condições de uso do site da Designer Inox Brasil e natureza informativa do conteúdo publicado.',
        path: '/termos-de-uso/',
        breadcrumbs: [HOME, { label: 'Termos de uso', href: '/termos-de-uso/' }],
        body: termsPage(),
        bodyClass: 'page-legal',
      }),
    },
  )

  return list
}

/** Página de erro: fica fora do sitemap e é servida pelo host em 404. */
export const errorPage = {
  file: '404.html',
  html: page({
    title: 'Página não encontrada',
    description: 'A página solicitada não existe neste site.',
    path: '/404',
    body: notFoundPage(),
    bodyClass: 'page-404',
  }),
}

async function main() {
  const list = routes()
  const lastmod = new Date().toISOString().slice(0, 10)

  for (const route of [...list, errorPage]) {
    const target = path.join(root, route.file)
    await mkdir(path.dirname(target), { recursive: true })
    await writeFile(target, route.html)
  }

  const urls = list
    .map(
      route => `  <url>
    <loc>${site.origin}${route.path}</loc>
    <lastmod>${lastmod}</lastmod>
    <priority>${route.priority}</priority>
  </url>`,
    )
    .join('\n')

  await writeFile(
    path.join(root, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`,
  )

  await writeFile(
    path.join(root, 'robots.txt'),
    `User-agent: *
Allow: /

Sitemap: ${site.origin}/sitemap.xml
`,
  )

  console.log(`Páginas geradas: ${list.length + 1} (inclui 404). Sitemap com ${list.length} URLs.`)
}

// Só grava quando executado direto. Importado pelo check.mjs, o módulo precisa
// expor as rotas sem escrever nada em disco.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main()
}
