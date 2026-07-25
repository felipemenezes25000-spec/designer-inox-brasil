export type ViewportCase = {
  readonly name: string
  readonly width: number
  readonly height: number
}

/**
 * Matriz de larguras da seção 20 da especificação. Não é uma amostra
 * conveniente: cada largura corresponde a um ponto real de quebra do layout
 * (320 é o piso de suporte, 1024 é o limiar desktop do shell).
 */
export const SUPPORTED_VIEWPORTS = [
  { name: '320', width: 320, height: 800 },
  { name: '360', width: 360, height: 800 },
  { name: '390', width: 390, height: 844 },
  { name: '768', width: 768, height: 1024 },
  { name: '1024', width: 1024, height: 768 },
  { name: '1440', width: 1440, height: 900 },
  { name: '1920', width: 1920, height: 1080 },
] as const satisfies readonly ViewportCase[]

/** Largura mínima em que a navegação desktop substitui o painel mobile. */
export const DESKTOP_BREAKPOINT = 1024

/** Alvo mínimo de toque exigido pela WCAG 2.2 AA, em CSS px. */
export const MINIMUM_TOUCH_TARGET = 44
