#!/usr/bin/env node
/**
 * Baixa as três imagens ilustrativas aprovadas.
 *
 * Allowlist fechada: o script recusa qualquer URL fora da lista deste arquivo.
 * Isso importa porque o alvo do download vira binário versionado e servido ao
 * público — aceitar URL por argumento transformaria o script em um vetor de
 * introdução de conteúdo não revisado.
 *
 * Cada resposta é limitada a 20 MB, precisa declarar MIME JPEG, precisa ter os
 * magic bytes de JPEG e precisa ter dimensões reais lidas pelo Sharp. O
 * manifesto registra hash, bytes, dimensões, autor, licença e data de
 * verificação; uma execução futura falha se o hash divergir, obrigando revisão
 * explícita em vez de troca silenciosa da imagem.
 */

import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import sharp from 'sharp'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const outputDir = path.join(repoRoot, 'assets', 'content', 'illustrative')
const manifestPath = path.join(repoRoot, 'docs', 'content', 'media-provenance.json')

const MAX_BYTES = 20 * 1024 * 1024
const JPEG_MAGIC = Buffer.from([0xff, 0xd8, 0xff])

export const APPROVED_MEDIA = [
  {
    file: 'kitchen.jpg',
    alt: 'Cozinha profissional com bancadas e equipamentos em aço inoxidável',
    credit: 'Bruno Makori',
    sourceUrl: 'https://www.pexels.com/photo/commercial-kitchen-with-stainless-steel-equipment-28704740/',
    downloadUrl:
      'https://images.pexels.com/photos/28704740/pexels-photo-28704740.jpeg?auto=compress&cs=tinysrgb&w=2000',
  },
  {
    file: 'welding.jpg',
    alt: 'Profissional executando soldagem em estrutura metálica industrial',
    credit: 'JL Photographie',
    sourceUrl: 'https://www.pexels.com/photo/welder-at-work-5650006/',
    downloadUrl:
      'https://images.pexels.com/photos/5650006/pexels-photo-5650006.jpeg?auto=compress&cs=tinysrgb&w=2000',
  },
  {
    file: 'plasma.jpg',
    alt: 'Corte de chapa metálica por plasma em ambiente fabril',
    credit: 'Ana Victoria Valverde',
    sourceUrl: 'https://www.pexels.com/photo/plasma-cutting-in-factory-17180807/',
    downloadUrl:
      'https://images.pexels.com/photos/17180807/pexels-photo-17180807.jpeg?auto=compress&cs=tinysrgb&w=2000',
  },
]

export const LICENSE_NAME = 'Pexels License'
export const LICENSE_URL = 'https://www.pexels.com/license/'
export const LICENSE_CHECKED_AT = '2026-07-25'

const sha256 = (buffer) => createHash('sha256').update(buffer).digest('hex').toUpperCase()

/**
 * Valida um download antes de gravá-lo.
 * @returns {Promise<{bytes: number, width: number, height: number, sha256: string}>}
 */
export async function validateDownload(buffer, contentType) {
  if (buffer.byteLength === 0) throw new Error('EMPTY_RESPONSE')
  if (buffer.byteLength > MAX_BYTES) throw new Error('RESPONSE_TOO_LARGE')
  if (!String(contentType ?? '').startsWith('image/jpeg')) throw new Error('UNEXPECTED_MIME')
  if (!buffer.subarray(0, 3).equals(JPEG_MAGIC)) throw new Error('NOT_A_JPEG')

  const metadata = await sharp(buffer).metadata()
  if (!metadata.width || !metadata.height) throw new Error('UNREADABLE_DIMENSIONS')

  return {
    bytes: buffer.byteLength,
    width: metadata.width,
    height: metadata.height,
    sha256: sha256(buffer),
  }
}

const previous = existsSync(manifestPath)
  ? JSON.parse(readFileSync(manifestPath, 'utf8'))
  : { media: [] }

mkdirSync(outputDir, { recursive: true })
mkdirSync(path.dirname(manifestPath), { recursive: true })

const entries = []

for (const item of APPROVED_MEDIA) {
  const response = await fetch(item.downloadUrl, { redirect: 'follow' })
  if (!response.ok) throw new Error(`DOWNLOAD_FAILED: ${item.file} (${response.status})`)

  const buffer = Buffer.from(await response.arrayBuffer())
  const measured = await validateDownload(buffer, response.headers.get('content-type'))

  const known = previous.media?.find((entry) => entry.file === item.file)
  if (known && known.sha256 !== measured.sha256) {
    throw new Error(
      `MEDIA_HASH_CHANGED: ${item.file} mudou na origem. Revise a imagem e a licença ` +
        'antes de atualizar o manifesto.',
    )
  }

  writeFileSync(path.join(outputDir, item.file), buffer)

  entries.push({
    file: item.file,
    alt: item.alt,
    credit: item.credit,
    sourceUrl: item.sourceUrl,
    downloadUrl: item.downloadUrl,
    licenseName: LICENSE_NAME,
    licenseUrl: LICENSE_URL,
    licenseCheckedAt: LICENSE_CHECKED_AT,
    ...measured,
  })

  console.log(`${item.file}: ${measured.width}×${measured.height}, ${measured.bytes} bytes`)
}

writeFileSync(
  manifestPath,
  `${JSON.stringify(
    {
      $comment:
        'Proveniência das imagens ilustrativas. Toda imagem externa exibe a legenda ' +
        '"Imagem ilustrativa", nunca aparece em projetos e nunca é apresentada como ' +
        'trabalho, equipe, fábrica ou cliente da Designer Inox Brasil.',
      media: entries,
    },
    null,
    2,
  )}\n`,
)

console.log(`Manifesto atualizado com ${entries.length} imagens.`)
