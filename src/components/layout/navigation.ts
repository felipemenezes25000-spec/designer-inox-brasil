/**
 * Contratos de navegação do shell.
 *
 * O shell recebe estes valores já hidratados e síncronos. Ele não consulta o
 * Payload, não aceita `Promise` e não decide se Projetos ou Blog existem —
 * essa decisão pertence a quem monta os dados (Plano 02). Manter o shell
 * ignorante do CMS é o que permite testá-lo sem banco e reusá-lo em qualquer
 * rota, inclusive na 404.
 */

export type NavigationLink = {
  kind: 'link'
  label: string
  href: string
  external?: boolean
}

export type NavigationGroup = {
  kind: 'group'
  label: string
  href?: string
  items: readonly NavigationLink[]
}

export type NavigationItem = NavigationLink | NavigationGroup

export type SiteNavigation = {
  primary: readonly NavigationItem[]
  cta: NavigationLink
}

export type FooterNavigation = {
  primary: readonly NavigationLink[]
  legal: readonly NavigationLink[]
  social: readonly NavigationLink[]
}

export function isNavigationGroup(item: NavigationItem): item is NavigationGroup {
  return item.kind === 'group'
}
