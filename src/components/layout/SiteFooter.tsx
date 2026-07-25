import Link from 'next/link'
import type { ReactElement } from 'react'

import { BrandLockup } from '@/components/ui/Brand'
import { Container } from '@/components/ui/Container'
import type { FooterNavigation } from './navigation'
import styles from './SiteShell.module.css'

export type SiteFooterProps = {
  footer: FooterNavigation
}

/**
 * Rodapé.
 *
 * Não publica razão social, CNPJ, endereço, telefone fixo, horários nem
 * perfil social: esses dados ainda não foram confirmados pelo proprietário, e
 * a especificação proíbe criar fato substituto. As seções correspondentes
 * simplesmente não são renderizadas — nada de "em breve" nem de placeholder.
 */
export function SiteFooter({ footer }: SiteFooterProps): ReactElement {
  return (
    <footer className={styles.footer}>
      <Container>
        <div className={styles.footerGrid}>
          <div className={styles.footerBrand}>
            <BrandLockup tone="negative" className={styles.footerLockup} />
            <p className={styles.footerTagline}>
              Soluções industriais completas em aço inox, do espaço vazio à operação pronta.
            </p>
          </div>

          <nav aria-label="Navegação do rodapé">
            <h2 className={styles.footerHeading}>Navegação</h2>
            <ul className={styles.footerList}>
              {footer.primary.map((link) => (
                <li key={link.href}>
                  <Link className={styles.footerLink} href={link.href}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Documentos legais">
            <h2 className={styles.footerHeading}>Legal</h2>
            <ul className={styles.footerList}>
              {footer.legal.map((link) => (
                <li key={link.href}>
                  <a className={styles.footerLink} href={link.href}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            {footer.social.length > 0 ? (
              <>
                <h2 className={styles.footerHeading}>Redes</h2>
                <ul className={styles.footerList}>
                  {footer.social.map((link) => (
                    <li key={link.href}>
                      <a
                        className={styles.footerLink}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
          </nav>
        </div>

        <p className={styles.footerBottom}>Designer Inox Brasil</p>
      </Container>
    </footer>
  )
}
