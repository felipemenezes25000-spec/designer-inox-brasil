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

type PictureProps = {
  base: string
  alt: string
  width: number
  height: number
  priority: boolean
  className?: string
  sizes: string
}

/**
 * `<picture>` puro, deliberadamente fora do `next/image`.
 *
 * Os ativos da marca já saem de `scripts/brand/generate-logo-assets.mjs` em
 * AVIF, WebP e PNG, em tamanho fixo e conhecido. Passá-los pelo otimizador
 * faria o servidor **decodificar AVIF e reencodar AVIF** a cada variante —
 * encoding AVIF é das operações mais caras em CPU, e sob carga paralela isso
 * saturou o servidor a ponto de as navegações estourarem o timeout.
 *
 * Servindo o arquivo estático diretamente: zero custo de servidor, cache
 * imutável da CDN e o melhor LCP possível para o elemento do cabeçalho.
 *
 * `width` e `height` continuam declarados para reservar espaço e evitar
 * deslocamento cumulativo de layout.
 */
function BrandPicture({
  base,
  alt,
  width,
  height,
  priority,
  className,
  sizes,
}: PictureProps): ReactElement {
  return (
    <picture>
      <source srcSet={`${base}.avif`} type="image/avif" sizes={sizes} />
      <source srcSet={`${base}.webp`} type="image/webp" sizes={sizes} />
      <img
        className={className}
        src={`${base}.png`}
        alt={alt}
        width={width}
        height={height}
        decoding={priority ? 'sync' : 'async'}
        loading={priority ? 'eager' : 'lazy'}
        // `fetchPriority` sobe o lockup do cabeçalho na fila de rede: ele é o
        // candidato a LCP em telas pequenas.
        fetchPriority={priority ? 'high' : 'auto'}
      />
    </picture>
  )
}

/** Símbolo isolado (engrenagem e floco), sem o nome da empresa. */
export function BrandMark({ tone, priority = false, className }: BrandProps): ReactElement {
  return (
    <BrandPicture
      base={`/brand/symbol-${tone}`}
      alt={BRAND_NAME}
      width={SYMBOL_SIZE}
      height={SYMBOL_SIZE}
      priority={priority}
      className={className}
      sizes="(min-width: 1024px) 48px, 40px"
    />
  )
}

/** Logo oficial com fundo original, exibida como badge contido. */
export function OfficialLogo({
  priority = false,
  className,
}: {
  priority?: boolean
  className?: string
}): ReactElement {
  return (
    <img
      className={className}
      src="/brand/logo-official.png"
      alt={BRAND_NAME}
      width={900}
      height={1350}
      decoding={priority ? 'sync' : 'async'}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
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
    <BrandPicture
      base={`/brand/lockup-${tone}`}
      alt={BRAND_NAME}
      width={LOCKUP_WIDTH}
      height={LOCKUP_HEIGHT}
      priority={priority}
      className={className}
      sizes="(min-width: 1024px) 232px, 176px"
    />
  )
}
