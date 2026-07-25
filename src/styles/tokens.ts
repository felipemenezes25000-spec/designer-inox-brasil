/**
 * Tokens da direção visual "Linha de Dobra".
 *
 * Este módulo é a fonte de verdade em TypeScript; `tokens.css` publica os
 * mesmos valores como custom properties. `tests/unit/styles/tokens.test.ts`
 * compara os dois arquivos e reprova qualquer divergência — um token só pode
 * mudar em ambos ao mesmo tempo.
 */

export const colors = {
  /** Preto industrial — fundo de maior profundidade. */
  blackIndustrial: '#06090D',
  /** Grafite profundo — superfície padrão do site. */
  graphiteDeep: '#0D1218',
  /** Grafite secundário — cartões e camadas elevadas. */
  graphiteSecondary: '#151C24',
  /** Cinza aço — texto de apoio sobre fundo claro. */
  steelGray: '#7E8994',
  /** Prata — bordas e separadores. */
  silver: '#BFC8D0',
  /** Prata clara — texto secundário sobre fundo escuro. */
  silverLight: '#E7EDF2',
  /** Branco técnico — texto principal sobre fundo escuro. */
  whiteTechnical: '#F8FAFC',
  /** Azul gelo — acento, foco e destaque. */
  blueIce: '#74D9FF',
  /** Azul industrial — ação primária. */
  blueIndustrial: '#168DC3',
  /** Azul profundo — estado pressionado. */
  blueDeep: '#0B5F87',
  /** Verde WhatsApp — exclusivo de ações do WhatsApp. */
  whatsapp: '#25D366',
} as const

export type ColorToken = keyof typeof colors

/**
 * Cor de texto sobre o verde do WhatsApp.
 *
 * Grafite, não branco: `#F8FAFC` sobre `#25D366` fica em 1,8:1, muito abaixo
 * do mínimo AA. Está fixado aqui para que nenhum componente possa escolher
 * outra combinação por engano.
 */
export const whatsappInk = colors.graphiteDeep

/**
 * Cor de texto sobre a ação primária.
 *
 * Preto industrial, não branco: `#F8FAFC` sobre `#168DC3` fica em 3,58:1 —
 * suficiente para texto grande, reprovado para texto normal, que é o tamanho
 * real do rótulo dos botões. Medido pelo axe em navegador, não estimado.
 */
export const primaryInk = colors.blackIndustrial

export const spacing = {
  '3xs': 4,
  '2xs': 8,
  xs: 12,
  sm: 16,
  md: 24,
  lg: 32,
  xl: 48,
  '2xl': 64,
  '3xl': 96,
} as const

export const radii = {
  sm: 4,
  md: 8,
  lg: 12,
  pill: 999,
} as const

export const layout = {
  /** Largura máxima do conteúdo. */
  contentMaxWidth: 1200,
  /** Altura do cabeçalho fixo no desktop. */
  headerHeightDesktop: 72,
  /** Altura do cabeçalho fixo no mobile. */
  headerHeightMobile: 64,
  /** Largura mínima suportada sem quebra de layout. */
  minimumViewport: 320,
  /** Largura a partir da qual a navegação desktop substitui o painel mobile. */
  desktopBreakpoint: 1024,
} as const

export const motion = {
  /** Microinteração: estados de botão e link. */
  fast: 120,
  /** Transição padrão de componente. */
  base: 180,
  /** Entrada de painel e diálogo. */
  slow: 240,
} as const

/**
 * Alvo mínimo de toque em CSS px (WCAG 2.2 AA, critério 2.5.8).
 * Nenhum controle interativo pode ficar abaixo disso.
 */
export const minimumTouchTarget = 44

export const focusRing = {
  width: 3,
  offset: 3,
  color: colors.blueIce,
} as const

/* ------------------------------------------------------- contraste (WCAG) */

/**
 * Luminância relativa conforme WCAG 2.x.
 * @param hex cor no formato `#RRGGBB`
 */
export function relativeLuminance(hex: string): number {
  const value = hex.replace('#', '')
  const channels = [0, 2, 4].map((offset) => {
    const srgb = Number.parseInt(value.slice(offset, offset + 2), 16) / 255
    return srgb <= 0.03928 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4
  })

  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2]
}

/** Razão de contraste entre duas cores, de 1 a 21. */
export function contrastRatio(foreground: string, background: string): number {
  const a = relativeLuminance(foreground)
  const b = relativeLuminance(background)
  const lighter = Math.max(a, b)
  const darker = Math.min(a, b)

  return (lighter + 0.05) / (darker + 0.05)
}

/** Mínimos da WCAG 2.2 AA usados pelo produto. */
export const contrastMinimums = {
  normalText: 4.5,
  largeText: 3,
  nonText: 3,
} as const
