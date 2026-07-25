import type { MetadataRoute } from 'next'

import { getPublicContentRepository } from '@/modules/content/public/composition-root'

export const dynamic = 'force-dynamic'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://127.0.0.1:3000'

/**
 * Sitemap condicional.
 *
 * Só entra o que está publicado. Projetos, artigos e documentos legais ficam
 * fora enquanto as coleções estiverem vazias — anunciar uma URL que responde
 * 404 desperdiça orçamento de rastreamento e sinaliza site incompleto.
 *
 * A 404 nunca entra, por definição.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const repository = getPublicContentRepository()

  const [services, segments, projects, articles, privacy, terms] = await Promise.all([
    repository.listServices(),
    repository.listSegments(),
    repository.listProjects(),
    repository.listArticles(),
    repository.getLegalDocument('privacy'),
    repository.getLegalDocument('terms'),
  ])

  const url = (path: string) => new URL(path, siteUrl).toString()

  const entries: MetadataRoute.Sitemap = [
    { url: url('/'), changeFrequency: 'monthly', priority: 1 },
    { url: url('/empresa'), changeFrequency: 'yearly', priority: 0.6 },
    { url: url('/solucoes-em-inox'), changeFrequency: 'monthly', priority: 0.9 },
    { url: url('/segmentos'), changeFrequency: 'monthly', priority: 0.7 },
    { url: url('/orcamento'), changeFrequency: 'monthly', priority: 0.8 },
  ]

  for (const service of services) {
    entries.push({
      url: url(`/${service.slug}`),
      lastModified: new Date(service.updatedAt),
      changeFrequency: 'monthly',
      priority: 0.9,
    })
  }

  for (const segment of segments) {
    entries.push({
      url: url(`/segmentos/${segment.slug}`),
      lastModified: new Date(segment.updatedAt),
      changeFrequency: 'monthly',
      priority: 0.7,
    })
  }

  if (projects.length > 0) {
    entries.push({ url: url('/projetos'), changeFrequency: 'monthly', priority: 0.8 })
    for (const project of projects) {
      entries.push({
        url: url(`/projetos/${project.slug}`),
        lastModified: new Date(project.updatedAt),
        changeFrequency: 'yearly',
        priority: 0.6,
      })
    }
  }

  for (const article of articles) {
    entries.push({
      url: url(`/conteudos/${article.slug}`),
      lastModified: new Date(article.updatedAt),
      changeFrequency: 'yearly',
      priority: 0.5,
    })
  }

  if (privacy) {
    entries.push({ url: url('/politica-de-privacidade'), changeFrequency: 'yearly', priority: 0.3 })
  }
  if (terms) {
    entries.push({ url: url('/termos-de-uso'), changeFrequency: 'yearly', priority: 0.3 })
  }

  return entries
}
