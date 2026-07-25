import type { ReactElement } from 'react'

import styles from './SkipLink.module.css'

export type SkipLinkProps = {
  targetId: string
  label?: string
}

/**
 * Atalho para o conteúdo principal.
 *
 * Fica fora da tela até receber foco — não usa `display: none`, que o
 * removeria da ordem de tabulação e anularia sua razão de existir. É o
 * primeiro elemento focável do documento.
 */
export function SkipLink({
  targetId,
  label = 'Ir para o conteúdo principal',
}: SkipLinkProps): ReactElement {
  return (
    <a className={styles.skipLink} href={`#${targetId}`}>
      {label}
    </a>
  )
}
