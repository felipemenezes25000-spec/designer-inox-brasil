import Image from 'next/image'
import type { ReactElement } from 'react'

export type BrandTone = 'positive' | 'negative'

type BrandProps = {
  /**
   * `negative` é a arte prateada, para fundos escuros.
   * `positive` é a silhueta grafite, para fundos claros.
   */
  tone: BrandTone
  priority?: boolean
  className?: string
}

/**
 * Texto alternativo da marca.
 *
 * Quando a logo é o link para a página inicial, o nome acessível precisa ser
 * o nome da empresa — não "logo" nem o nome do arquivo.
 */
const BRAND_NAME = 'Designer Inox Brasil'

/** Dimensões intrínsecas dos ativos gerados por `scripts/brand`. */
const SYMBOL_SIZE = 512
const LOCKUP_WIDTH = 1200
const LOCKUP_HEIGHT = 320

/**
 * Símbolo isolado (engrenagem e floco), sem o nome da empresa.
 *
 * As dimensões são declaradas para reservar espaço no layout e evitar
 * deslocamento cumulativo (CLS) enquanto a imagem carrega.
 */
export function BrandMark({ tone, priority = false, className }: BrandProps): ReactElement {
  return (
    <Image
      className={className}
      src={`/brand/symbol-${tone}.avif`}
      alt={BRAND_NAME}
      width={SYMBOL_SIZE}
      height={SYMBOL_SIZE}
      priority={priority}
      sizes="(min-width: 1024px) 48px, 40px"
    />
  )
}

/**
 * Lockup horizontal: símbolo mais "Designer Inox Brasil".
 *
 * O texto faz parte do raster, então o `alt` carrega o nome; repetir o nome
 * como texto adjacente produziria anúncio duplicado no leitor de tela.
 */
export function BrandLockup({ tone, priority = false, className }: BrandProps): ReactElement {
  return (
    <Image
      className={className}
      src={`/brand/lockup-${tone}.avif`}
      alt={BRAND_NAME}
      width={LOCKUP_WIDTH}
      height={LOCKUP_HEIGHT}
      priority={priority}
      sizes="(min-width: 1024px) 232px, 176px"
    />
  )
}
