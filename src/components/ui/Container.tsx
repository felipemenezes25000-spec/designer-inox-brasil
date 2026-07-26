import type { ElementType, ReactElement, ReactNode } from 'react'

import styles from './Container.module.css'

export type ContainerProps = {
  children: ReactNode
  className?: string
  id?: string
  /** Elemento renderizado; use `section`, `header` ou `footer` conforme o papel. */
  as?: ElementType
}

/** Faixa de conteúdo com largura máxima e recuo lateral consistentes. */
export function Container({
  children,
  className,
  id,
  as: Component = 'div',
}: ContainerProps): ReactElement {
  return (
    <Component id={id} className={[styles.container, className].filter(Boolean).join(' ')}>
      {children}
    </Component>
  )
}
