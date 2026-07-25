import type { ReactElement } from 'react'

export type FoldLineProps = {
  className?: string
}

/**
 * Elemento gráfico da direção "Linha de Dobra".
 *
 * Puramente decorativo: `aria-hidden` e `focusable="false"` mantêm o SVG fora
 * da árvore de acessibilidade e da ordem de tabulação. Não carrega
 * significado, então não recebe título nem descrição.
 */
export function FoldLine({ className }: FoldLineProps): ReactElement {
  return (
    <svg
      className={className}
      viewBox="0 0 1200 8"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
      role="presentation"
    >
      <defs>
        <linearGradient id="fold-line-gradient" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--color-blue-industrial)" stopOpacity="0" />
          <stop offset="28%" stopColor="var(--color-blue-ice)" stopOpacity="0.9" />
          <stop offset="72%" stopColor="var(--color-blue-industrial)" stopOpacity="0.55" />
          <stop offset="100%" stopColor="var(--color-blue-industrial)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M0 6 L420 6 L470 1 L1200 1" fill="none" stroke="url(#fold-line-gradient)" strokeWidth="1.5" />
    </svg>
  )
}
