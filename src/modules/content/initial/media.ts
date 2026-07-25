import kitchenImage from '@assets/content/illustrative/kitchen.jpg'
import plasmaImage from '@assets/content/illustrative/plasma.jpg'
import weldingImage from '@assets/content/illustrative/welding.jpg'

import manifest from '@/../docs/content/media-provenance.json'
import type { PublicMedia } from '@/modules/content/public/types'

/**
 * Mídia ilustrativa licenciada.
 *
 * Imports estáticos: o bundler emite caminhos com hash em `/_next/static/media`,
 * o que evita expor filesystem, host externo ou uma rota `/media/*` que
 * pareceria conteúdo próprio da empresa.
 *
 * Toda imagem externa carrega `caption: 'Imagem ilustrativa'` e proveniência
 * completa. Elas nunca entram em projetos e nunca são apresentadas como
 * equipe, fábrica, cliente ou trabalho da Designer Inox Brasil.
 */

type ImportedImage = string | { src: string }

/**
 * O Next resolve import de imagem para `{ src, width, height }`; o Vite, usado
 * pela suíte unitária, resolve para uma string. Normalizar aqui é o que faz o
 * mesmo módulo valer nos dois ambientes sem mock.
 */
const srcOf = (image: ImportedImage): string =>
  typeof image === 'string' ? image : image.src

/**
 * Dimensões vêm do manifesto, não do objeto do bundler.
 *
 * O manifesto registra o que o Sharp mediu no arquivo baixado e conferido por
 * hash — é a fonte auditável. Depender do bundler faria a dimensão variar com
 * a ferramenta de build.
 */
const dimensionsOf = (file: string): { width: number; height: number } => {
  const entry = manifest.media.find((item) => item.file === file)
  if (!entry) throw new Error(`MEDIA_NOT_IN_MANIFEST: ${file}`)
  return { width: entry.width, height: entry.height }
}

const LICENSE_NAME = 'Pexels License'
const LICENSE_URL = 'https://www.pexels.com/license/'
const LICENSE_CHECKED_AT = '2026-07-25'

const illustrative = (
  id: string,
  file: string,
  image: ImportedImage,
  alt: string,
  credit: string,
  sourceUrl: string,
): PublicMedia => ({
  id,
  src: srcOf(image),
  ...dimensionsOf(file),
  alt,
  kind: 'illustrative',
  caption: 'Imagem ilustrativa',
  credit,
  sourceUrl,
  licenseName: LICENSE_NAME,
  licenseUrl: LICENSE_URL,
  licenseCheckedAt: LICENSE_CHECKED_AT,
})

export const MEDIA_KITCHEN = illustrative(
  'illustrative-kitchen',
  'kitchen.jpg',
  kitchenImage,
  'Cozinha profissional com bancadas e equipamentos em aço inoxidável',
  'Bruno Makori',
  'https://www.pexels.com/photo/commercial-kitchen-with-stainless-steel-equipment-28704740/',
)

export const MEDIA_WELDING = illustrative(
  'illustrative-welding',
  'welding.jpg',
  weldingImage,
  'Profissional executando soldagem em estrutura metálica industrial',
  'JL Photographie',
  'https://www.pexels.com/photo/welder-at-work-5650006/',
)

export const MEDIA_PLASMA = illustrative(
  'illustrative-plasma',
  'plasma.jpg',
  plasmaImage,
  'Corte de chapa metálica por plasma em ambiente fabril',
  'Ana Victoria Valverde',
  'https://www.pexels.com/photo/plasma-cutting-in-factory-17180807/',
)

export const initialMedia: readonly PublicMedia[] = [MEDIA_KITCHEN, MEDIA_WELDING, MEDIA_PLASMA]
