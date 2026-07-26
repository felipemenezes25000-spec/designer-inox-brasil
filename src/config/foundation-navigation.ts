import type { FooterNavigation, SiteNavigation } from '@/components/layout/navigation'

/**
 * Navegação de fundação.
 *
 * Contém somente rotas confirmadas na especificação. **Não** inclui Projetos,
 * Blog, clientes nem depoimentos: essas entradas só podem existir quando
 * houver conteúdo aprovado, e publicá-las agora levaria a páginas vazias —
 * exatamente o que a especificação proíbe.
 *
 * O Plano 02 substitui este objeto por dados hidratados do CMS.
 */

export const FOUNDATION_NAVIGATION: SiteNavigation = {
  primary: [
    {
      kind: 'group',
      label: 'Soluções',
      href: '/solucoes-em-inox',
      items: [
        { kind: 'link', label: 'Cozinhas industriais', href: '/cozinhas-industriais' },
        { kind: 'link', label: 'Equipamentos em inox', href: '/equipamentos-em-inox' },
        {
          kind: 'link',
          label: 'Coifas, ventilação e exaustão',
          href: '/coifas-ventilacao-e-exaustao',
        },
        { kind: 'link', label: 'Sistemas integrados em inox', href: '/sistemas-integrados-em-inox' },
        {
          kind: 'link',
          label: 'Projeto técnico e fabricação CNC',
          href: '/projeto-tecnico-e-fabricacao-cnc',
        },
        { kind: 'link', label: 'Reformas e modernizações', href: '/reformas-e-modernizacoes' },
        { kind: 'link', label: 'Manutenção', href: '/manutencao' },
      ],
    },
    { kind: 'link', label: 'Segmentos', href: '/segmentos' },
    { kind: 'link', label: 'Empresa', href: '/empresa' },
  ],
  cta: { kind: 'link', label: 'Solicitar avaliação', href: '/orcamento' },
}

export const FOUNDATION_FOOTER: FooterNavigation = {
  primary: [
    { kind: 'link', label: 'Soluções em inox', href: '/solucoes-em-inox' },
    { kind: 'link', label: 'Segmentos', href: '/segmentos' },
    { kind: 'link', label: 'Manutenção', href: '/manutencao' },
    { kind: 'link', label: 'Empresa', href: '/empresa' },
    { kind: 'link', label: 'Solicitar avaliação', href: '/orcamento' },
  ],
  legal: [
    { kind: 'link', label: 'Política de privacidade', href: '/politica-de-privacidade' },
    { kind: 'link', label: 'Termos de uso', href: '/termos-de-uso' },
  ],
  // Vazio de propósito: o usuário oficial do Instagram ainda não foi
  // confirmado, e a especificação proíbe publicar um perfil inventado.
  social: [],
}

/** Número confirmado na especificação §10.1. */
export const WHATSAPP_NUMBER = '+55 61 99683-1052'
export const WHATSAPP_BASE_URL = 'https://wa.me/5561996831052'
