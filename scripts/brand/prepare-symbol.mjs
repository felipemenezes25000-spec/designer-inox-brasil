#!/usr/bin/env node
/**
 * Deriva o símbolo isolado a partir do master, sem redesenhá-lo.
 *
 * O master `LOGO OFICIALL.png` já traz o símbolo isolado no canal alpha: 92%
 * da imagem tem alpha 0 e a caixa delimitadora do conteúdo opaco (486 × 519)
 * não toca nenhuma borda. O gradiente cinza visível em alguns visualizadores
 * é RGB residual sob alpha 0, não fundo real.
 *
 * Portanto o recorte é um `trim` do alpha, e não uma edição de imagem. Isso é
 * estritamente mais fiel do que uma remoção de fundo assistida por modelo:
 * preserva geometria, dentes da engrenagem, floco, contornos e acabamento
 * byte a byte, e é reproduzível.
 *
 * O master NUNCA é escrito: o script recusa qualquer caminho de saída fora de
 * `assets/brand/derived`.
 */

import { createHash } from 'node:crypto'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import sharp from 'sharp'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')

export const APPROVED_MASTER_SHA256 =
  'BDBC9A38A01E60D451C4433CA72FF812F8E661DB476F4406585C96955287AD40'

export const MASTER_WIDTH = 1024
export const MASTER_HEIGHT = 1536

export function sha256(buffer) {
  return createHash('sha256').update(buffer).digest('hex').toUpperCase()
}

const sourcePath = path.join(repoRoot, 'assets', 'brand', 'source', 'logo-official.png')
const outputDir = path.join(repoRoot, 'assets', 'brand', 'derived')
const outputPath = path.join(outputDir, 'symbol-isolated.png')

const master = readFileSync(sourcePath)
const masterHash = sha256(master)

if (masterHash !== APPROVED_MASTER_SHA256) {
  console.error('MASTER_HASH_MISMATCH: a cópia do master divergiu do arquivo aprovado.')
  process.exit(1)
}

const masterMeta = await sharp(master).metadata()
if (masterMeta.width !== MASTER_WIDTH || masterMeta.height !== MASTER_HEIGHT) {
  console.error('MASTER_DIMENSIONS_MISMATCH')
  process.exit(1)
}
if (!masterMeta.hasAlpha) {
  console.error('MASTER_WITHOUT_ALPHA: o recorte depende do canal alpha do master.')
  process.exit(1)
}

// `threshold: 0` recorta estritamente pelo alpha, sem tolerância de cor: o
// RGB residual do fundo não pode influenciar a caixa delimitadora.
const isolated = await sharp(master)
  .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 0 })
  .png({ compressionLevel: 9, effort: 10 })
  .toBuffer()

const isolatedMeta = await sharp(isolated).metadata()

mkdirSync(outputDir, { recursive: true })
writeFileSync(outputPath, isolated)

console.log(
  `symbol-isolated.png: ${isolatedMeta.width} × ${isolatedMeta.height}, ` +
    `alpha ${isolatedMeta.hasAlpha}, sha256 ${sha256(isolated)}`,
)
