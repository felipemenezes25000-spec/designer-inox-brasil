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
 *
 * A `nav` de documentos legais permanece presente como landmark (o shell tem
 * um contrato de acessibilidade que a exige), mas seu conteúdo só aparece
 * quando houver links aprovados. Enquanto isso, a barra inferior mostra apenas
 * o copyright dinâmico.
 */
export function SiteFooter({ footer }: SiteFooterProps): ReactElement {
  const year = new Date().getFullYear()
  const hasLegal = footer.legal.length > 0
  const hasSocial = footer.social.length > 0

  return (
    <footer className={styles.footer}>
      <Container>
        <div className={styles.footerGrid}>
          <div className={styles.footerBrand}>
            <BrandLockup tone="negative" className={styles.footerLockup} />
            <p className={styles.footerTagline}>
              Soluções coordenadas em aço inox, do projeto à instalação.
            </p>
            <p className={styles.footerCapabilities}>
              Projeto técnico, fabricação, instalação e manutenção coordenados conforme a operação.
            </p>
            <p className={styles.footerCapabilities}>
              Brasília/DF · Atendimento em Brasília, Distrito Federal e região.
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
        </div>

        <div className={styles.footerBottom}>
          <p className={styles.footerCopy}>
            © {year} Designer Inox Brasil · Soluções industriais em aço inox
          </p>

          <nav aria-label="Documentos legais" className={styles.footerMeta}>
            {hasLegal ? (
              <ul className={styles.footerMetaList}>
                {footer.legal.map((link) => (
                  <li key={link.href}>
                    <a className={styles.footerLink} href={link.href}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}

            {hasSocial ? (
              <ul className={styles.footerMetaList}>
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
            ) : null}
          </nav>
        </div>
      </Container>
    </footer>
  )
}
