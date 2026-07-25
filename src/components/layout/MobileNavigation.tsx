'use client'

import Link from 'next/link'
import { useRef, useState, type ReactElement } from 'react'

import { ButtonLink } from '@/components/ui/Button'
import { Dialog } from '@/components/ui/Dialog'
import { isNavigationGroup, type SiteNavigation } from './navigation'
import styles from './SiteShell.module.css'

export type MobileNavigationProps = {
  navigation: SiteNavigation
}

/**
 * Painel de navegação para telas abaixo de 1024 px.
 *
 * Reusa o `Dialog` nativo, de onde vêm prisão de foco, `Esc` e inertização do
 * restante da página. Os grupos são listas aninhadas visíveis, e não
 * acordeões fechados: com um catálogo pequeno, esconder itens atrás de mais
 * um clique custa mais do que a rolagem que economiza.
 */
export function MobileNavigation({ navigation }: MobileNavigationProps): ReactElement {
  const [open, setOpen] = useState(false)
  const firstLinkRef = useRef<HTMLAnchorElement>(null)

  return (
    <>
      <button
        type="button"
        className={styles.menuButton}
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
      >
        Menu
      </button>

      <Dialog open={open} title="Navegação" onClose={() => setOpen(false)}>
        <nav className={styles.mobilePanel} aria-label="Navegação principal">
          <ul>
            {navigation.primary.map((item, index) => (
              <li key={item.label}>
                {isNavigationGroup(item) ? (
                  <>
                    {item.href ? (
                      <Link
                        ref={index === 0 ? firstLinkRef : undefined}
                        className={styles.mobileLink}
                        href={item.href}
                        onClick={() => setOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <span className={styles.mobileGroupLabel}>{item.label}</span>
                    )}
                    <ul className={styles.mobileSublist}>
                      {item.items.map((child) => (
                        <li key={child.href}>
                          <Link
                            className={styles.mobileLink}
                            href={child.href}
                            onClick={() => setOpen(false)}
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <Link
                    ref={index === 0 ? firstLinkRef : undefined}
                    className={styles.mobileLink}
                    href={item.href}
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>

          <ButtonLink href={navigation.cta.href} variant="primary" size="lg" block>
            {navigation.cta.label}
          </ButtonLink>
        </nav>
      </Dialog>
    </>
  )
}
