import type { WhatsAppContext } from '@/modules/whatsapp/contexts'

/**
 * DTOs públicos.
 *
 * As páginas consomem exclusivamente estes tipos — nunca documentos do
 * Payload. Essa fronteira é o que permite trocar o repositório local pelo
 * adapter do CMS no Plano 03 sem tocar em uma única página.
 *
 * Nenhum campo carrega registro de autorização, estado de workflow ou dado
 * pessoal: o que chega aqui já está aprovado e anonimizado na origem.
 */

export type SeoFields = {
  title: string
  description: string
  noIndex?: boolean
  image?: PublicMedia
}

export type PublicMedia = {
  id: string
  src: string
  width: number
  height: number
  alt: string
  /**
   * `illustrative` exige legenda visível "Imagem ilustrativa" e nunca aparece
   * em projetos nem é apresentada como trabalho próprio.
   */
  kind: 'company' | 'illustrative'
  caption: string | null
  credit: string | null
  sourceUrl: string | null
  licenseName: string | null
  licenseUrl: string | null
  licenseCheckedAt: string | null
}

export type ProcessStep = {
  id: 'understand' | 'survey' | 'define' | 'fabricate' | 'install' | 'follow'
  title: string
  description: string
}

export type PublicFaq = {
  id: string
  question: string
  answer: string
}

export type PublicPageKind =
  | 'home'
  | 'company'
  | 'solutionsHub'
  | 'segmentsHub'
  | 'projectsHub'
  | 'quote'
  | 'notFound'

export type PublicPageBlock =
  | { type: 'richText'; heading: string; paragraphs: readonly string[] }
  | { type: 'journeyRouter'; items: readonly { title: string; body: string; href: string }[] }
  | { type: 'process'; steps: readonly ProcessStep[] }
  | { type: 'services'; serviceSlugs: readonly string[] }
  | { type: 'segments'; segmentSlugs: readonly string[] }
  | { type: 'clients'; clientSlugs: readonly string[] }
  | { type: 'testimonials'; testimonialIds: readonly string[] }
  | { type: 'latestArticles'; articleSlugs: readonly string[] }
  | { type: 'faq'; faqs: readonly PublicFaq[] }
  | { type: 'finalCta'; heading: string; body: string; whatsappContext: WhatsAppContext }

export type PublicPage = {
  id: string
  slug: string
  kind: PublicPageKind
  title: string
  heading: string
  intro: string
  hero: {
    eyebrow: string | null
    heading: string
    summary: string
    microcopy: string | null
    media: PublicMedia | null
  }
  blocks: readonly PublicPageBlock[]
  seo: SeoFields
  updatedAt: string
}

export type PublicService = {
  id: string
  slug: string
  title: string
  eyebrow: string
  summary: string
  needs: readonly string[]
  deliverables: readonly string[]
  process: readonly ProcessStep[]
  relatedServiceSlugs: readonly string[]
  faqs: readonly PublicFaq[]
  heroMedia: PublicMedia | null
  whatsappContext: Exclude<WhatsAppContext, 'general' | 'project'>
  seo: SeoFields
  updatedAt: string
}

export type PublicSegment = {
  id: string
  slug: string
  title: string
  summary: string
  operationalContext: string
  carePoints: readonly string[]
  serviceSlugs: readonly string[]
  faqs: readonly PublicFaq[]
  whatsappContext: 'general'
  heroMedia: PublicMedia | null
  seo: SeoFields
  updatedAt: string
}

export type PublicProject = {
  id: string
  slug: string
  title: string
  summary: string
  cover: PublicMedia
  segment: { slug: string; title: string }
  locality: string | null
  /** Já chega anonimizado quando a autorização está ausente, revogada ou vencida. */
  clientName: string | null
  challenge: string
  scope: readonly string[]
  solution: string
  systems: readonly string[]
  result: string
  gallery: readonly PublicMedia[]
  beforeAfter: { before: PublicMedia; after: PublicMedia } | null
  video: {
    src: string
    poster: PublicMedia
    captionsSrc: string
    captionsLanguage: 'pt-BR'
  } | null
  relatedProjectSlugs: readonly string[]
  seo: SeoFields
  updatedAt: string
}

export type PublicLegalDocument = {
  type: 'privacy' | 'terms'
  title: string
  version: string
  effectiveAt: string
  body: readonly { heading: string; paragraphs: readonly string[] }[]
  seo: SeoFields
  updatedAt: string
}

export type PublicLink = {
  label: string
  href: string
  external?: boolean
}

export type PublicNavigation = {
  solutionGroups: readonly {
    label: 'Construir' | 'Fabricar' | 'Integrar' | 'Transformar' | 'Manter'
    serviceSlugs: readonly string[]
  }[]
  projectsLabel: string
  articlesLabel: string
  segmentsLabel: string
  maintenanceLabel: string
  companyLabel: string
  quoteLabel: string
}

export type PublicFooter = {
  primary: readonly PublicLink[]
  legal: readonly PublicLink[]
  social: readonly PublicLink[]
  cookiePreferencesLabel: 'Preferências de cookies'
}

export type PublicArticle = {
  id: string
  slug: string
  title: string
  summary: string
  author: string
  technicalReviewer: string | null
  categories: readonly { slug: string; title: string }[]
  publishedAt: string
  updatedAt: string
  sections: readonly {
    id: string
    heading: string
    paragraphs: readonly string[]
  }[]
  sources: readonly { title: string; url: `https://${string}`; checkedAt: string | null }[]
  media: readonly PublicMedia[]
  seo: SeoFields
}

export type PublicClient = {
  id: string
  slug: string
  name: string
  logo: PublicMedia | null
  summary: string | null
  updatedAt: string
}

export type PublicTestimonial = {
  id: string
  client: { slug: string; name: string } | null
  name: string
  role: string | null
  text: string
  updatedAt: string
}

export type PublicRedirect = {
  sourcePath: `/${string}`
  targetPath: `/${string}`
  permanent: boolean
}

export type PublicSiteSettings = {
  brandName: 'Designer Inox Brasil'
  phoneDisplay: '+55 61 99683-1052'
  whatsappDigits: '5561996831052'
  /** Nulo enquanto o dado não for confirmado. Nulo significa não renderizar. */
  email: string | null
  address: {
    streetAddress: string
    addressLocality: string
    addressRegion: string
    postalCode: string
    addressCountry: 'BR'
  } | null
  geo: { latitude: number; longitude: number } | null
  areaServed: readonly string[]
  businessHours: readonly {
    days: readonly string[]
    opens: string
    closes: string
  }[]
  socialLinks: readonly { label: string; href: string }[]
}
