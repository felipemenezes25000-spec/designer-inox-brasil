import type { ReactElement, ReactNode } from 'react'

import { Container } from '@/components/ui/Container'
import type { PublicMedia } from '@/modules/content/public/types'
import { MediaFigure } from './MediaFigure'
import styles from './sections.module.css'

export type PageHeroProps = {
  eyebrow: string | null
  heading: string
  summary: string
  microcopy?: string | null
  media?: PublicMedia | null
  actions?: ReactNode
}

/**
 * Hero das páginas públicas.
 *
 * O H1 é sempre o `heading` — um por página, conforme a §15. A mídia é
 * opcional e, quando ilustrativa, entra pelo `MediaFigure`, que renderiza a
 * legenda obrigatória.
 */
export function PageHero({
  eyebrow,
  heading,
  summary,
  microcopy,
  media,
  actions,
}: PageHeroProps): ReactElement {
  return (
    <Container as="section" className={styles.hero}>
      <div className={styles.heroGrid}>
        <div>
          {eyebrow ? <span className={`text-eyebrow ${styles.heroEyebrow}`}>{eyebrow}</span> : null}
          <h1 className={`text-display ${styles.heroTitle}`}>{heading}</h1>
          <p className={`text-lead ${styles.heroSummary}`}>{summary}</p>
          {actions ? <div className={styles.heroActions}>{actions}</div> : null}
          {microcopy ? <p className={styles.heroMicrocopy}>{microcopy}</p> : null}
        </div>

        {media ? <MediaFigure media={media} priority /> : null}
      </div>
    </Container>
  )
}
