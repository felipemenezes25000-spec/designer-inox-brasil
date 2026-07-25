/**
 * Tags de cache do conteúdo público.
 *
 * Uma tag por entidade, mais uma por coleção. Publicar um serviço invalida a
 * própria página e as listagens que o contêm — não o site inteiro. Invalidar
 * tudo a cada publicação jogaria fora cache quente de páginas não afetadas.
 */

export const CONTENT_TAGS = {
  settings: 'content:settings',
  navigation: 'content:navigation',
  footer: 'content:footer',
  pages: 'content:pages',
  services: 'content:services',
  segments: 'content:segments',
  projects: 'content:projects',
  clients: 'content:clients',
  testimonials: 'content:testimonials',
  faqs: 'content:faqs',
  articles: 'content:articles',
  legal: 'content:legal',
  redirects: 'content:redirects',
} as const

export type ContentTag = (typeof CONTENT_TAGS)[keyof typeof CONTENT_TAGS]

export const pageTag = (slug: string) => `content:page:${slug}`
export const serviceTag = (slug: string) => `content:service:${slug}`
export const segmentTag = (slug: string) => `content:segment:${slug}`
export const projectTag = (slug: string) => `content:project:${slug}`
export const articleTag = (slug: string) => `content:article:${slug}`

/**
 * Expiração máxima do conteúdo público.
 *
 * A especificação §12.3 exige que uma alteração deixe de ser servida em até
 * 60 segundos. A invalidação por tag é imediata; este teto é a rede de
 * segurança para o caso de a invalidação falhar.
 */
export const PUBLIC_CONTENT_MAX_AGE_SECONDS = 60

export type ContentChange =
  | { entity: 'page'; slug: string }
  | { entity: 'service'; slug: string }
  | { entity: 'segment'; slug: string }
  | { entity: 'project'; slug: string }
  | { entity: 'article'; slug: string }
  | { entity: 'client' }
  | { entity: 'testimonial' }
  | { entity: 'faq' }
  | { entity: 'legal' }
  | { entity: 'redirect' }
  | { entity: 'settings' }

/**
 * Tags atingidas por uma alteração.
 *
 * Publicar um projeto afeta também a home e a navegação: o primeiro projeto
 * aprovado faz "Projetos" aparecer no menu e troca o CTA secundário do hero.
 * Essa dependência é invisível no modelo de dados e precisa ser explícita
 * aqui, senão o menu ficaria desatualizado até a expiração natural.
 */
export function tagsAffectedBy(change: ContentChange): readonly string[] {
  switch (change.entity) {
    case 'page':
      return [CONTENT_TAGS.pages, pageTag(change.slug)]
    case 'service':
      return [
        CONTENT_TAGS.services,
        serviceTag(change.slug),
        CONTENT_TAGS.navigation,
        CONTENT_TAGS.pages,
      ]
    case 'segment':
      return [CONTENT_TAGS.segments, segmentTag(change.slug), CONTENT_TAGS.pages]
    case 'project':
      return [
        CONTENT_TAGS.projects,
        projectTag(change.slug),
        CONTENT_TAGS.navigation,
        CONTENT_TAGS.pages,
      ]
    case 'article':
      return [CONTENT_TAGS.articles, articleTag(change.slug), CONTENT_TAGS.navigation]
    case 'client':
      return [CONTENT_TAGS.clients, CONTENT_TAGS.pages]
    case 'testimonial':
      return [CONTENT_TAGS.testimonials, CONTENT_TAGS.pages]
    case 'faq':
      return [CONTENT_TAGS.faqs, CONTENT_TAGS.pages, CONTENT_TAGS.services, CONTENT_TAGS.segments]
    case 'legal':
      return [CONTENT_TAGS.legal, CONTENT_TAGS.footer]
    case 'redirect':
      return [CONTENT_TAGS.redirects]
    case 'settings':
      return [CONTENT_TAGS.settings, CONTENT_TAGS.navigation, CONTENT_TAGS.footer]
  }
}

/** Caminhos públicos afetados, para invalidação de CDN. */
export function pathsAffectedBy(change: ContentChange): readonly string[] {
  switch (change.entity) {
    case 'page':
      return change.slug === 'home' ? ['/'] : [`/${change.slug}`]
    case 'service':
      return ['/', `/${change.slug}`, '/solucoes-em-inox', '/sitemap.xml']
    case 'segment':
      return ['/segmentos', `/segmentos/${change.slug}`, '/', '/sitemap.xml']
    case 'project':
      return ['/', '/projetos', `/projetos/${change.slug}`, '/sitemap.xml']
    case 'article':
      return ['/', `/conteudos/${change.slug}`, '/sitemap.xml']
    case 'legal':
      return ['/politica-de-privacidade', '/termos-de-uso', '/sitemap.xml']
    case 'client':
    case 'testimonial':
    case 'faq':
      return ['/']
    case 'settings':
      return ['/']
    case 'redirect':
      return []
  }
}
