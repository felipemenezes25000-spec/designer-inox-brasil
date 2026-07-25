import localFont from 'next/font/local'

/**
 * Fontes locais, subconjunto latino, versionadas com hash conferido em
 * `assets/brand/logo-manifest.json`.
 *
 * Locais e não hospedadas por terceiros porque isso remove uma requisição
 * externa do caminho crítico de LCP e elimina um vetor de rastreamento antes
 * de qualquer decisão de consentimento.
 *
 * `display: 'swap'` evita texto invisível durante o carregamento; a métrica
 * de fallback é ajustada pelo próprio `next/font` para reduzir o salto de
 * layout na troca.
 */

export const headingFont = localFont({
  src: [
    {
      path: '../assets/fonts/sora-latin.woff2',
      weight: '100 800',
      style: 'normal',
    },
  ],
  variable: '--font-sora',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'Segoe UI', 'Roboto', 'sans-serif'],
})

export const bodyFont = localFont({
  src: [
    {
      path: '../assets/fonts/inter-latin.woff2',
      weight: '100 900',
      style: 'normal',
    },
  ],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'Segoe UI', 'Roboto', 'sans-serif'],
})
