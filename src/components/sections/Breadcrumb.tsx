import Link from 'next/link'
import type { ReactElement } from 'react'

import { Container } from '@/components/ui/Container'
import styles from './sections.module.css'

export type BreadcrumbItem = {
  label: string
  href?: string
}

export type BreadcrumbProps = {
  items: readonly BreadcrumbItem[]
}

/**
 * Trilha de navegação.
 *
 * O item atual não é link e recebe `aria-current="page"`. Transformá-lo em
 * link para a própria página adicionaria um destino inútil à navegação por
 * teclado e por leitor de tela.
 */
export function Breadcrumb({ items }: BreadcrumbProps): ReactElement {
  return (
    <Container className={styles.breadcrumb}>
      <nav aria-label="Trilha de navegação">
        <ol className={styles.breadcrumbList}>
          {items.map((item, index) => {
            const isLast = index === items.length - 1

            return (
              <li key={item.label}>
                {item.href && !isLast ? (
                  <Link className={styles.breadcrumbLink} href={item.href}>
                    {item.label}
                  </Link>
                ) : (
                  <span aria-current="page">{item.label}</span>
                )}
                {isLast ? null : (
                  <span className={styles.breadcrumbSeparator} aria-hidden="true">
                    {' / '}
                  </span>
                )}
              </li>
            )
          })}
        </ol>
      </nav>
    </Container>
  )
}
