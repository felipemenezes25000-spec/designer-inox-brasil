import type { ServiceWhatsAppContext } from '@/modules/whatsapp/contexts'

/**
 * Catálogo fechado de rotas públicas.
 *
 * Vale como contrato: uma rota só é criada quando existe intenção de busca
 * distinta, serviço confirmado, conteúdo original, prova própria e CTA
 * específico. Não há rota de blog, e proteção contra incêndio está ausente do
 * catálogo inteiro — inclusive de rótulos e descrições.
 */

export type PublicRouteKind =
  | 'home'
  | 'company'
  | 'solutionsHub'
  | 'service'
  | 'segmentsHub'
  | 'segment'
  | 'projectsHub'
  | 'project'
  | 'quote'
  | 'legal'

export type PublicRoute = {
  path: string
  kind: PublicRouteKind
  label: string
  /**
   * Rotas condicionais só existem publicamente quando há conteúdo aprovado.
   * Sem conteúdo elas respondem 404 e ficam fora de menu, CTA e sitemap.
   */
  conditional: boolean
}

/** Rota canônica de cada serviço, indexada pelo contexto de WhatsApp. */
export const SERVICE_ROUTES = {
  kitchen: '/cozinhas-industriais',
  equipment: '/equipamentos-em-inox',
  ventilation: '/coifas-ventilacao-e-exaustao',
  'integrated-systems': '/sistemas-integrados-em-inox',
  cnc: '/projeto-tecnico-e-fabricacao-cnc',
  renovation: '/reformas-e-modernizacoes',
  maintenance: '/manutencao',
} as const satisfies Record<ServiceWhatsAppContext, `/${string}`>

export type ServiceRoute = (typeof SERVICE_ROUTES)[ServiceWhatsAppContext]

/** Slug de cada serviço, derivado da rota para não haver duas listas. */
export const SERVICE_SLUGS = Object.values(SERVICE_ROUTES).map((route) =>
  route.slice(1),
) as readonly string[]

export const PUBLIC_ROUTE_CATALOG: readonly PublicRoute[] = [
  { path: '/', kind: 'home', label: 'Início', conditional: false },
  { path: '/empresa', kind: 'company', label: 'Empresa', conditional: false },
  {
    path: '/solucoes-em-inox',
    kind: 'solutionsHub',
    label: 'Soluções em inox',
    conditional: false,
  },
  {
    path: SERVICE_ROUTES.kitchen,
    kind: 'service',
    label: 'Cozinhas industriais',
    conditional: false,
  },
  {
    path: SERVICE_ROUTES.equipment,
    kind: 'service',
    label: 'Equipamentos em inox',
    conditional: false,
  },
  {
    path: SERVICE_ROUTES.ventilation,
    kind: 'service',
    label: 'Coifas, ventilação e exaustão',
    conditional: false,
  },
  {
    path: SERVICE_ROUTES['integrated-systems'],
    kind: 'service',
    label: 'Sistemas integrados em inox',
    conditional: false,
  },
  {
    path: SERVICE_ROUTES.cnc,
    kind: 'service',
    label: 'Projeto técnico e fabricação CNC',
    conditional: false,
  },
  {
    path: SERVICE_ROUTES.renovation,
    kind: 'service',
    label: 'Reformas e modernizações',
    conditional: false,
  },
  { path: SERVICE_ROUTES.maintenance, kind: 'service', label: 'Manutenção', conditional: false },
  { path: '/segmentos', kind: 'segmentsHub', label: 'Segmentos', conditional: false },
  { path: '/segmentos/[slug]', kind: 'segment', label: 'Segmento', conditional: true },
  { path: '/projetos', kind: 'projectsHub', label: 'Projetos', conditional: true },
  { path: '/projetos/[slug]', kind: 'project', label: 'Projeto', conditional: true },
  { path: '/orcamento', kind: 'quote', label: 'Solicitar orçamento', conditional: false },
  {
    path: '/politica-de-privacidade',
    kind: 'legal',
    label: 'Política de privacidade',
    conditional: true,
  },
  { path: '/termos-de-uso', kind: 'legal', label: 'Termos de uso', conditional: true },
]

export function publicRoutePaths(): readonly string[] {
  return PUBLIC_ROUTE_CATALOG.map((route) => route.path)
}

/** Rotas estáticas, isto é, sem segmento dinâmico. */
export function staticPublicRoutes(): readonly PublicRoute[] {
  return PUBLIC_ROUTE_CATALOG.filter((route) => !route.path.includes('['))
}

export function isPublicRoute(path: string): boolean {
  return staticPublicRoutes().some((route) => route.path === path)
}

export function routeForService(context: ServiceWhatsAppContext): ServiceRoute {
  return SERVICE_ROUTES[context]
}
