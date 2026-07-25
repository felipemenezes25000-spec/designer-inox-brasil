import type { FooterNavigation, SiteNavigation } from '@/components/layout/navigation'
import type {
  PublicFooter,
  PublicNavigation,
  PublicService,
} from '@/modules/content/public/types'

export type BuildSiteNavigationInput = {
  navigation: PublicNavigation
  services: readonly PublicService[]
  hasProjects: boolean
  hasArticles: boolean
}

/**
 * Converte o contrato de conteúdo na navegação que o shell consome.
 *
 * Aqui mora a regra de publicação condicional: "Projetos" e "Conteúdos" só
 * entram no menu quando as coleções correspondentes têm material aprovado.
 * Manter a decisão nesta função — e não dentro do shell — é o que permite ao
 * shell continuar síncrono, sem conhecer o CMS.
 */
export function buildSiteNavigation({
  navigation,
  services,
  hasProjects,
  hasArticles,
}: BuildSiteNavigationInput): SiteNavigation {
  const serviceBySlug = new Map(services.map((service) => [service.slug, service]))

  const solutionItems = navigation.solutionGroups.flatMap((group) =>
    group.serviceSlugs
      .map((slug) => serviceBySlug.get(slug))
      .filter((service): service is PublicService => Boolean(service))
      .map((service) => ({
        kind: 'link' as const,
        label: service.title,
        href: `/${service.slug}`,
        group: group.label,
      })),
  )

  return {
    primary: [
      {
        kind: 'group',
        label: 'Soluções',
        href: '/solucoes-em-inox',
        items: solutionItems.map(({ group: _group, ...link }) => link),
      },
      ...(hasProjects
        ? [{ kind: 'link' as const, label: navigation.projectsLabel, href: '/projetos' }]
        : []),
      { kind: 'link', label: navigation.segmentsLabel, href: '/segmentos' },
      { kind: 'link', label: navigation.maintenanceLabel, href: '/manutencao' },
      ...(hasArticles
        ? [{ kind: 'link' as const, label: navigation.articlesLabel, href: '/conteudos' }]
        : []),
      { kind: 'link', label: navigation.companyLabel, href: '/empresa' },
    ],
    cta: { kind: 'link', label: navigation.quoteLabel, href: '/orcamento' },
  }
}

export function buildFooterNavigation(footer: PublicFooter): FooterNavigation {
  return {
    primary: footer.primary.map((link) => ({ kind: 'link', ...link })),
    legal: footer.legal.map((link) => ({ kind: 'link', ...link })),
    social: footer.social.map((link) => ({ kind: 'link', ...link, external: true })),
  }
}

/**
 * Agrupamento por jornada para o mega menu do desktop.
 * Retorna as cinco seções na ordem contratada, sem grupo vazio.
 */
export function buildSolutionSections({
  navigation,
  services,
}: Pick<BuildSiteNavigationInput, 'navigation' | 'services'>) {
  const serviceBySlug = new Map(services.map((service) => [service.slug, service]))

  return navigation.solutionGroups
    .map((group) => ({
      label: group.label,
      items: group.serviceSlugs
        .map((slug) => serviceBySlug.get(slug))
        .filter((service): service is PublicService => Boolean(service))
        .map((service) => ({
          kind: 'link' as const,
          label: service.title,
          href: `/${service.slug}`,
        })),
    }))
    .filter((group) => group.items.length > 0)
}
