import type {
  PublicArticle,
  PublicClient,
  PublicLegalDocument,
  PublicNavigation,
  PublicProject,
  PublicRedirect,
  PublicTestimonial,
} from '@/modules/content/public/types'

export { globalFaqs, segmentFaqs, serviceFaqs } from './faqs'
export { initialMedia, MEDIA_KITCHEN, MEDIA_PLASMA, MEDIA_WELDING } from './media'
export { initialPages } from './pages'
export { commonProcess } from './process'
export { initialSegments } from './segments'
export { initialServices, SERVICE_CONTEXT_BY_SLUG } from './services'
export { initialFooter, initialSiteSettings } from './settings'

/**
 * Coleções deliberadamente vazias.
 *
 * Não é pendência de implementação: sem projeto, cliente, depoimento, artigo
 * ou documento legal **aprovado**, publicar qualquer um deles criaria prova
 * social fictícia, o que a especificação §4.2 lista entre as exclusões do
 * produto.
 *
 * O efeito é intencional e testado: "Projetos" some do menu, da home, do CTA
 * secundário do hero e do sitemap; `/projetos` responde 404; o rodapé não
 * exibe links legais. Quando o Plano 03 publicar conteúdo real, tudo aparece
 * sem mudar uma linha de página.
 */
export const initialProjects: readonly PublicProject[] = []
export const initialClients: readonly PublicClient[] = []
export const initialTestimonials: readonly PublicTestimonial[] = []
export const initialArticles: readonly PublicArticle[] = []
export const initialLegalDocuments: readonly PublicLegalDocument[] = []
export const initialRedirects: readonly PublicRedirect[] = []

/**
 * Agrupamento do mega menu por jornada comercial.
 *
 * "Manutenção" aparece no menu principal e dentro de Soluções de forma
 * intencional: no principal funciona como oferta recorrente de alta intenção;
 * aqui explica sua relação com o ciclo completo.
 */
export const initialNavigation: PublicNavigation = {
  solutionGroups: [
    { label: 'Construir', serviceSlugs: ['cozinhas-industriais'] },
    {
      label: 'Fabricar',
      serviceSlugs: ['equipamentos-em-inox', 'projeto-tecnico-e-fabricacao-cnc'],
    },
    {
      label: 'Integrar',
      serviceSlugs: ['coifas-ventilacao-e-exaustao', 'sistemas-integrados-em-inox'],
    },
    { label: 'Transformar', serviceSlugs: ['reformas-e-modernizacoes'] },
    { label: 'Manter', serviceSlugs: ['manutencao'] },
  ],
  projectsLabel: 'Projetos',
  articlesLabel: 'Conteúdos',
  segmentsLabel: 'Segmentos',
  maintenanceLabel: 'Manutenção',
  companyLabel: 'Empresa',
  quoteLabel: 'Solicitar orçamento',
}
