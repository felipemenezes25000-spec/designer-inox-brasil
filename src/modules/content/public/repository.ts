import type {
  PublicArticle,
  PublicClient,
  PublicFaq,
  PublicFooter,
  PublicLegalDocument,
  PublicNavigation,
  PublicPage,
  PublicProject,
  PublicRedirect,
  PublicSegment,
  PublicService,
  PublicSiteSettings,
  PublicTestimonial,
} from './types'

/**
 * Porta de leitura do conteúdo público.
 *
 * O Plano 02 fornece um adapter local; o Plano 03 troca APENAS o binding em
 * `composition-root.ts` pelo adapter da Local API do Payload. Nenhuma página
 * conhece a implementação.
 *
 * A interface é somente de leitura por desenho: publicação, aprovação e
 * invalidação são responsabilidade do CMS, não do site público.
 */
export interface PublicContentRepository {
  getSiteSettings(): Promise<PublicSiteSettings>
  getNavigation(): Promise<PublicNavigation>
  getFooter(): Promise<PublicFooter>
  getPageBySlug(slug: string): Promise<PublicPage | null>
  listServices(): Promise<readonly PublicService[]>
  getServiceBySlug(slug: string): Promise<PublicService | null>
  listSegments(): Promise<readonly PublicSegment[]>
  getSegmentBySlug(slug: string): Promise<PublicSegment | null>
  listProjects(): Promise<readonly PublicProject[]>
  getProjectBySlug(slug: string): Promise<PublicProject | null>
  listClients(): Promise<readonly PublicClient[]>
  listTestimonials(): Promise<readonly PublicTestimonial[]>
  listFaqs(scope: { kind: 'global' | 'service' | 'segment'; slug?: string }): Promise<
    readonly PublicFaq[]
  >
  listArticles(): Promise<readonly PublicArticle[]>
  getArticleBySlug(slug: string): Promise<PublicArticle | null>
  getLegalDocument(type: 'privacy' | 'terms'): Promise<PublicLegalDocument | null>
  getRedirectBySourcePath(path: string): Promise<PublicRedirect | null>
  listRedirects(): Promise<readonly PublicRedirect[]>
}

/**
 * Superfície do contrato em forma de dado.
 *
 * Existe para que o teste possa provar que um adapter implementa tudo e
 * **nada além** — um método extra seria acoplamento que o Plano 03 herdaria
 * sem perceber.
 */
export const PUBLIC_CONTENT_METHODS = [
  'getSiteSettings',
  'getNavigation',
  'getFooter',
  'getPageBySlug',
  'listServices',
  'getServiceBySlug',
  'listSegments',
  'getSegmentBySlug',
  'listProjects',
  'getProjectBySlug',
  'listClients',
  'listTestimonials',
  'listFaqs',
  'listArticles',
  'getArticleBySlug',
  'getLegalDocument',
  'getRedirectBySourcePath',
  'listRedirects',
] as const satisfies readonly (keyof PublicContentRepository)[]
