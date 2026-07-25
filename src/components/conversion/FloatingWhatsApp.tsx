import type { ReactElement } from 'react'

import type { WhatsAppContext } from '@/modules/whatsapp/contexts'
import styles from './FloatingWhatsApp.module.css'
import { WHATSAPP_LABEL, WhatsAppLink } from './WhatsAppLink'

export type FloatingWhatsAppProps = {
  context: WhatsAppContext
}

/**
 * Botão flutuante de WhatsApp.
 *
 * No desktop mostra ícone e texto; no mobile mostra só o ícone, mantendo o
 * nome acessível pelo `aria-label` e o alvo mínimo de 44 px.
 *
 * Fica ancorado ao canto inferior direito com recuo e respeita
 * `safe-area-inset` para não cobrir campos, rodapé, navegação nem a barra de
 * gestos do sistema.
 */
export function FloatingWhatsApp({ context }: FloatingWhatsAppProps): ReactElement {
  return (
    <WhatsAppLink context={context} className={styles.floating} ariaLabel={WHATSAPP_LABEL}>
      <span className={styles.label}>{WHATSAPP_LABEL}</span>
    </WhatsAppLink>
  )
}
