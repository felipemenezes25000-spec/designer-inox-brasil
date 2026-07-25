import type { ReactElement } from 'react'

import type { PublicMedia } from '@/modules/content/public/types'
import styles from './sections.module.css'

export type MediaFigureProps = {
  media: PublicMedia
  priority?: boolean
  className?: string
}

/**
 * Figura com atribuição obrigatória.
 *
 * Para mídia `illustrative`, a legenda "Imagem ilustrativa" e o crédito são
 * renderizados sempre e visivelmente — não em `title`, não em `alt`, não
 * escondidos por CSS. É o que impede a imagem de ser lida como registro de
 * trabalho, equipe ou cliente da empresa.
 *
 * `width` e `height` intrínsecos reservam espaço e evitam deslocamento
 * cumulativo de layout enquanto a imagem carrega.
 */
export function MediaFigure({ media, priority = false, className }: MediaFigureProps): ReactElement {
  const isIllustrative = media.kind === 'illustrative'

  return (
    <figure className={[styles.figure, className].filter(Boolean).join(' ')}>
      {/* eslint-disable-next-line @next/next/no-img-element -- ativos estáticos
          já otimizados; o otimizador reencodaria sem ganho. */}
      <img
        className={styles.figureImage}
        src={media.src}
        alt={media.alt}
        width={media.width}
        height={media.height}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        fetchPriority={priority ? 'high' : 'auto'}
      />

      {isIllustrative ? (
        <figcaption className={styles.figureCaption}>
          <span>{media.caption}</span>
          {media.credit ? (
            <span className={styles.figureCredit}>
              Foto de {media.credit}
              {media.licenseName ? ` — ${media.licenseName}` : null}
            </span>
          ) : null}
        </figcaption>
      ) : null}
    </figure>
  )
}
