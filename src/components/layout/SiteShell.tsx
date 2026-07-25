import type { ReactElement, ReactNode } from 'react'

import { ButtonLink } from '@/components/ui/Button'
import { FoldLine } from '@/components/ui/FoldLine'
import { SkipLink } from '@/components/ui/SkipLink'
import type { FooterNavigation, SiteNavigation } from './navigation'
import { SiteFooter } from './SiteFooter'
import { SiteHeader } from './SiteHeader'
import styles from './SiteShell.module.css'

/** Identificador do alvo do skip link. Compartilhado com os testes E2E. */
export const MAIN_CONTENT_ID = 'main-content'

export type SiteShellProps = {
  children: ReactNode
  navigation: SiteNavigation
  footer: FooterNavigation
  /** Link e mensagem do botão flutuante do WhatsApp, já montados pela página. */
  whatsapp?: { href: string; label: string }
}

/**
 * Estrutura comum a todas as páginas públicas.
 *
 * Recebe navegação e rodapé como valores síncronos e já hidratados: não
 * consulta o Payload, não aceita `Promise` e não decide se Projetos ou Blog
 * existem. Essa ignorância deliberada é o que mantém CMS, apresentação e
 * consultas públicas desacoplados, e o que permite testar o shell sem banco.
 */
export function SiteShell({
  children,
  navigation,
  footer,
  whatsapp,
}: SiteShellProps): ReactElement {
  return (
    <div className={styles.shell}>
      <SkipLink targetId={MAIN_CONTENT_ID} />
      <SiteHeader navigation={navigation} />

      <main className={styles.main} id={MAIN_CONTENT_ID} tabIndex={-1}>
        {children}
      </main>

      <FoldLine className={styles.foldLine} />
      <SiteFooter footer={footer} />

      {whatsapp ? (
        <ButtonLink
          className={styles.whatsappFloat}
          href={whatsapp.href}
          variant="whatsapp"
          external
        >
          {whatsapp.label}
        </ButtonLink>
      ) : null}
    </div>
  )
}
