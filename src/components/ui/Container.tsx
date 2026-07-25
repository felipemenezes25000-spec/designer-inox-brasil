import type { ElementType, ReactElement, ReactNode } from 'react'

import styles from './Container.module.css'

export type ContainerProps = {
  children: ReactNode
  className?: string
  /** Elemento renderizado; use `section`, `header` ou `footer` conforme o papel. */
  as?: ElementType
}

/** Faixa de conteúdo com largura máxima e recuo lateral consistentes. */
export function Container({
  children,
  className,
  as: Component = 'div',
}: ContainerProps): ReactElement {
  return (
    <Component className={[styles.container, className].filter(Boolean).join(' ')}>
      {children}
    </Component>
  )
}
