import Link from 'next/link'
import type { ReactElement } from 'react'

import { BrandLockup } from '@/components/ui/Brand'
import { ButtonLink } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { MobileNavigation } from './MobileNavigation'
import { isNavigationGroup, type SiteNavigation } from './navigation'
import styles from './SiteShell.module.css'

export type SiteHeaderProps = {
  navigation: SiteNavigation
}

/**
 * Cabeçalho fixo.
 *
 * A alternância entre navegação desktop e painel mobile é feita por media
 * query no CSS, não por JavaScript medindo a janela: assim o estado correto
 * já vale no primeiro pintar do HTML do servidor, sem salto de hidratação e
 * sem depender de JavaScript para navegar.
 */
export function SiteHeader({ navigation }: SiteHeaderProps): ReactElement {
  return (
    <header className={styles.header}>
      <Container className={styles.headerInner}>
        <Link className={styles.brandLink} href="/" aria-label="Designer Inox Brasil, página inicial">
          <BrandLockup tone="negative" priority className={styles.brandLockup} />
        </Link>

        <nav className={styles.desktopNav} aria-label="Navegação principal">
          <ul className={styles.navList}>
            {navigation.primary.map((item) => (
              <li key={item.label} className={styles.navItem}>
                {isNavigationGroup(item) ? (
                  <>
                    <Link className={styles.navLink} href={item.href ?? '#'}>
                      {item.label}
                    </Link>
                    <ul className={styles.megaMenu}>
                      {item.items.map((child) => (
                        <li key={child.href}>
                          <Link className={styles.megaMenuLink} href={child.href}>
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <Link className={styles.navLink} href={item.href}>
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.headerActions}>
          <ButtonLink
            className={styles.headerCta}
            href={navigation.cta.href}
            variant="primary"
            size="sm"
          >
            {navigation.cta.label}
          </ButtonLink>
          <MobileNavigation navigation={navigation} />
        </div>
      </Container>
    </header>
  )
}
