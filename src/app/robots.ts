import type { MetadataRoute } from 'next'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://127.0.0.1:3000'
const indexable = process.env.INDEX_PUBLIC_SITE === 'true'

/**
 * Robots.
 *
 * O padrão é bloquear tudo. A liberação exige `INDEX_PUBLIC_SITE=true`, que
 * só deve ser ligado quando existir conteúdo publicado e domínio real — um
 * preview indexado por engano gera resultados duplicados difíceis de remover.
 *
 * Painel, APIs e preview ficam bloqueados mesmo depois da liberação.
 */
export default function robots(): MetadataRoute.Robots {
  if (!indexable) {
    return { rules: [{ userAgent: '*', disallow: '/' }] }
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api/', '/preview', '/orcamento/confirmacao'],
      },
    ],
    sitemap: new URL('/sitemap.xml', siteUrl).toString(),
    host: siteUrl,
  }
}
