import {
  initialArticles,
  initialClients,
  initialFooter,
  initialLegalDocuments,
  initialNavigation,
  initialPages,
  initialProjects,
  initialRedirects,
  initialSegments,
  initialServices,
  initialSiteSettings,
  initialTestimonials,
  globalFaqs,
} from '@/modules/content/initial'

import type { PublicContentRepository } from './repository'
import type { PublicFaq } from './types'

/**
 * Adapter local de conteúdo público.
 *
 * É o binding de desenvolvimento do Plano 02. O Plano 03 troca apenas o
 * composition root pelo adapter da Local API do Payload; nenhuma página muda.
 *
 * A guarda vive DENTRO de cada método, nunca no import ou no construtor.
 * Isso é o que permite ao `next build` analisar o módulo sem consultar
 * conteúdo, banco ou storage — requisito explícito do plano.
 */

export const LOCAL_CONTENT_FORBIDDEN_IN_PRODUCTION = 'LOCAL_PUBLIC_CONTENT_FORBIDDEN_IN_PRODUCTION'
export const BUILD_CONTENT_ACCESS_FORBIDDEN = 'BUILD_CONTENT_ACCESS_FORBIDDEN'
export const INDEXED_SEED_PREVIEW_FORBIDDEN = 'INDEXED_SEED_PREVIEW_FORBIDDEN'

/**
 * Modo de pré-visualização com conteúdo semeado.
 *
 * O contrato do roadmap é que produção use o adapter do Payload. Mas um
 * preview em nuvem também roda com `NODE_ENV=production`, e sem o banco do
 * Plano 03 ele não teria nenhuma fonte de conteúdo — o mesmo vale para o
 * servidor de produção local que a suíte E2E levanta.
 *
 * O escape é explícito e estreito:
 *   - exige `CONTENT_SOURCE=seed` declarado no ambiente, nunca por padrão;
 *   - **recusa** operar com o site indexável, porque o conteúdo semeado não
 *     passou pelo workflow editorial e não pode entrar em buscador.
 *
 * O gate de release do Plano 05 continua exigindo o adapter Payload para
 * aprovar a liberação pública definitiva.
 */
function isSeedPreview(): boolean {
  return process.env.CONTENT_SOURCE === 'seed'
}

function assertLocalContentAllowed(): void {
  // Sentinela usada pelo teste e pelo gate de release para provar que o build
  // não lê conteúdo.
  if (process.env.CONTENT_ACCESS_SENTINEL === 'throw') {
    throw new Error(BUILD_CONTENT_ACCESS_FORBIDDEN)
  }

  if (process.env.NODE_ENV !== 'production') return

  if (!isSeedPreview()) {
    throw new Error(LOCAL_CONTENT_FORBIDDEN_IN_PRODUCTION)
  }

  if (process.env.INDEX_PUBLIC_SITE === 'true') {
    throw new Error(INDEXED_SEED_PREVIEW_FORBIDDEN)
  }
}

const bySlug = <T extends { slug: string }>(items: readonly T[], slug: string): T | null =>
  items.find((item) => item.slug === slug) ?? null

export function createLocalPublicContentRepository(): PublicContentRepository {
  return {
    async getSiteSettings() {
      assertLocalContentAllowed()
      return initialSiteSettings
    },

    async getNavigation() {
      assertLocalContentAllowed()
      return initialNavigation
    },

    async getFooter() {
      assertLocalContentAllowed()
      return initialFooter
    },

    async getPageBySlug(slug) {
      assertLocalContentAllowed()
      return bySlug(initialPages, slug)
    },

    async listServices() {
      assertLocalContentAllowed()
      return initialServices
    },

    async getServiceBySlug(slug) {
      assertLocalContentAllowed()
      return bySlug(initialServices, slug)
    },

    async listSegments() {
      assertLocalContentAllowed()
      return initialSegments
    },

    async getSegmentBySlug(slug) {
      assertLocalContentAllowed()
      return bySlug(initialSegments, slug)
    },

    async listProjects() {
      assertLocalContentAllowed()
      return initialProjects
    },

    async getProjectBySlug(slug) {
      assertLocalContentAllowed()
      return bySlug(initialProjects, slug)
    },

    async listClients() {
      assertLocalContentAllowed()
      return initialClients
    },

    async listTestimonials() {
      assertLocalContentAllowed()
      return initialTestimonials
    },

    async listFaqs(scope) {
      assertLocalContentAllowed()

      if (scope.kind === 'global') return globalFaqs
      if (scope.kind === 'service') {
        return (bySlug(initialServices, scope.slug ?? '')?.faqs ?? []) as readonly PublicFaq[]
      }
      return (bySlug(initialSegments, scope.slug ?? '')?.faqs ?? []) as readonly PublicFaq[]
    },

    async listArticles() {
      assertLocalContentAllowed()
      return initialArticles
    },

    async getArticleBySlug(slug) {
      assertLocalContentAllowed()
      return bySlug(initialArticles, slug)
    },

    async getLegalDocument(type) {
      assertLocalContentAllowed()
      return initialLegalDocuments.find((document) => document.type === type) ?? null
    },

    async getRedirectBySourcePath(path) {
      assertLocalContentAllowed()
      return initialRedirects.find((redirect) => redirect.sourcePath === path) ?? null
    },

    async listRedirects() {
      assertLocalContentAllowed()
      return initialRedirects
    },
  }
}
