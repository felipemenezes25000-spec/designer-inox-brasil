#!/usr/bin/env node
/**
 * Gerador determinístico dos derivados da marca.
 *
 * Entradas: apenas `symbol-isolated.png` e `wordmark-sora.png`, ambos com
 * hash conferido contra `assets/brand/logo-manifest.json`. O Sharp nunca
 * tenta interpretar WOFF2 nem rasterizar texto.
 *
 * O master `assets/brand/source/logo-official.png` e o arquivo original em
 * `D:\LOGO OFICIALL.png` jamais são escritos: as saídas são restritas a
 * `public/brand` e a dois ícones de rota do App Router.
 */

import { createHash } from 'node:crypto'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import sharp from 'sharp'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')

/* ------------------------------------------------------------------ tokens */

/** Grafite profundo. Preenchimento da variante positiva (fundos claros). */
export const POSITIVE_INK = '#0D1218'
/** Prata claro. Cor do wordmark na variante negativa (fundos escuros). */
export const NEGATIVE_INK = '#E7EDF2'

export const SYMBOL_CANVAS = 512
export const SYMBOL_MARGIN = 32

export const LOCKUP_WIDTH = 1200
export const LOCKUP_HEIGHT = 320
export const LOCKUP_PADDING = 32
export const LOCKUP_GAP = 40
export const LOCKUP_SYMBOL_HEIGHT = 224

export const ICON_SIZES = [16, 32, 180]

/* ------------------------------------------------------------------- utils */

const sha256 = (buffer) => createHash('sha256').update(buffer).digest('hex').toUpperCase()

const manifest = JSON.parse(
  readFileSync(path.join(repoRoot, 'assets', 'brand', 'logo-manifest.json'), 'utf8'),
)

/**
 * Lê uma entrada do manifesto conferindo o hash aprovado.
 * @param {{path: string, sha256: string}} entry
 * @returns {Buffer}
 */
function readApproved(entry) {
  const buffer = readFileSync(path.join(repoRoot, entry.path))
  const actual = sha256(buffer)
  if (actual !== entry.sha256) {
    throw new Error(
      `BRAND_INPUT_HASH_MISMATCH: ${entry.path} está fora do estado aprovado. ` +
        'Rode o script que o produz e atualize o manifesto de forma deliberada.',
    )
  }
  return buffer
}

/**
 * Recolore um raster preservando seu alpha.
 *
 * `dest-in` mantém o retângulo sólido somente onde a arte tem alpha, o que
 * transforma o raster em silhueta na cor pedida sem tocar a geometria.
 *
 * @param {Buffer} art
 * @param {string} color
 * @returns {Promise<Buffer>}
 */
async function tintByAlpha(art, color) {
  const { width, height } = await sharp(art).metadata()
  return sharp({ create: { width, height, channels: 4, background: color } })
    .composite([{ input: art, blend: 'dest-in' }])
    .png()
    .toBuffer()
}

/** Grava PNG lossless, WebP lossless e AVIF quality 70 do mesmo raster. */
async function writeAllFormats(buffer, outputBase) {
  mkdirSync(path.dirname(outputBase), { recursive: true })

  const written = []
  const png = await sharp(buffer).png({ compressionLevel: 9, effort: 10 }).toBuffer()
  writeFileSync(`${outputBase}.png`, png)
  written.push(`${outputBase}.png`)

  const webp = await sharp(buffer).webp({ lossless: true, effort: 6 }).toBuffer()
  writeFileSync(`${outputBase}.webp`, webp)
  written.push(`${outputBase}.webp`)

  const avif = await sharp(buffer).avif({ quality: 70, effort: 6 }).toBuffer()
  writeFileSync(`${outputBase}.avif`, avif)
  written.push(`${outputBase}.avif`)

  return written
}

/* ---------------------------------------------------------------- pipeline */

const symbolArt = readApproved(manifest.symbol)
const wordmarkArt = readApproved(manifest.wordmark)

for (const font of manifest.fonts) {
  readApproved(font)
}

/**
 * Centraliza o símbolo em um canvas quadrado transparente, preservando a
 * margem contratada em torno do conteúdo alfa.
 */
async function buildSymbolCanvas(art) {
  const available = SYMBOL_CANVAS - SYMBOL_MARGIN * 2
  const resized = await sharp(art)
    .resize({ width: available, height: available, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer()

  return sharp({
    create: {
      width: SYMBOL_CANVAS,
      height: SYMBOL_CANVAS,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([{ input: resized, gravity: 'center' }])
    .png()
    .toBuffer()
}

/** Compõe o lockup horizontal: símbolo à esquerda, wordmark à direita. */
async function buildLockup(symbol, wordmark) {
  const symbolMeta = await sharp(symbol).metadata()
  const symbolWidth = Math.round(
    (symbolMeta.width / symbolMeta.height) * LOCKUP_SYMBOL_HEIGHT,
  )
  const symbolResized = await sharp(symbol)
    .resize({ width: symbolWidth, height: LOCKUP_SYMBOL_HEIGHT, fit: 'fill' })
    .toBuffer()

  const wordmarkAvailable = LOCKUP_WIDTH - LOCKUP_PADDING * 2 - symbolWidth - LOCKUP_GAP
  const wordmarkMeta = await sharp(wordmark).metadata()
  const wordmarkHeight = Math.round(
    (wordmarkMeta.height / wordmarkMeta.width) * wordmarkAvailable,
  )
  const wordmarkResized = await sharp(wordmark)
    .resize({ width: wordmarkAvailable, height: wordmarkHeight, fit: 'fill' })
    .toBuffer()

  return sharp({
    create: {
      width: LOCKUP_WIDTH,
      height: LOCKUP_HEIGHT,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([
      {
        input: symbolResized,
        left: LOCKUP_PADDING,
        top: Math.round((LOCKUP_HEIGHT - LOCKUP_SYMBOL_HEIGHT) / 2),
      },
      {
        input: wordmarkResized,
        left: LOCKUP_PADDING + symbolWidth + LOCKUP_GAP,
        top: Math.round((LOCKUP_HEIGHT - wordmarkHeight) / 2),
      },
    ])
    .png()
    .toBuffer()
}

const publicBrand = path.join(repoRoot, 'public', 'brand')
const frontendDir = path.join(repoRoot, 'src', 'app', '(frontend)')
const generated = []

// Variante negativa: arte original em prata/azul, para fundos escuros.
const symbolNegative = await buildSymbolCanvas(symbolArt)
// Variante positiva: mesma silhueta preenchida em grafite, para fundos claros.
const symbolPositive = await buildSymbolCanvas(await tintByAlpha(symbolArt, POSITIVE_INK))

generated.push(...(await writeAllFormats(symbolNegative, path.join(publicBrand, 'symbol-negative'))))
generated.push(...(await writeAllFormats(symbolPositive, path.join(publicBrand, 'symbol-positive'))))

const lockupNegative = await buildLockup(symbolArt, await tintByAlpha(wordmarkArt, NEGATIVE_INK))
const lockupPositive = await buildLockup(
  await tintByAlpha(symbolArt, POSITIVE_INK),
  await tintByAlpha(wordmarkArt, POSITIVE_INK),
)

generated.push(...(await writeAllFormats(lockupNegative, path.join(publicBrand, 'lockup-negative'))))
generated.push(...(await writeAllFormats(lockupPositive, path.join(publicBrand, 'lockup-positive'))))

/**
 * Ícone simplificado para tamanhos reduzidos, autorizado pela especificação
 * §6.4.
 *
 * Abaixo de ~48 px a arte tridimensional em prata colapsa: o degradê ocupa a
 * mesma faixa tonal dos vãos entre os dentes da engrenagem e do miolo do
 * floco, e o downsample transforma tudo em ruído. Verificado lado a lado a
 * 16 e 32 px.
 *
 * A simplificação usada NÃO redesenha a marca: é a mesma silhueta alfa do
 * master, preenchida em prata clara sobre grafite opaco. Só o acabamento
 * muda; a geometria é idêntica.
 */
export const SMALL_ICON_THRESHOLD = 48

for (const size of ICON_SIZES) {
  const simplified = size < SMALL_ICON_THRESHOLD
  // Ícone de toque da Apple e favicons pequenos são sempre opacos: o iOS
  // compõe sobre branco e a moldura da aba do navegador varia com o tema.
  const inner = Math.round(size * (simplified ? 0.84 : 0.78))
  const source = simplified ? await tintByAlpha(symbolArt, NEGATIVE_INK) : symbolArt

  const resized = await sharp(source)
    .resize({ width: inner, height: inner, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer()

  const icon = await sharp({
    create: { width: size, height: size, channels: 4, background: POSITIVE_INK },
  })
    .composite([{ input: resized, gravity: 'center' }])
    .png({ compressionLevel: 9, effort: 10 })
    .toBuffer()

  const iconPath = path.join(publicBrand, `icon-${size}.png`)
  mkdirSync(path.dirname(iconPath), { recursive: true })
  writeFileSync(iconPath, icon)
  generated.push(iconPath)

  // O App Router serve `icon.png` e `apple-icon.png` a partir da rota.
  if (size === 32) {
    writeFileSync(path.join(frontendDir, 'icon.png'), icon)
    generated.push(path.join(frontendDir, 'icon.png'))
  }
  if (size === 180) {
    writeFileSync(path.join(frontendDir, 'apple-icon.png'), icon)
    generated.push(path.join(frontendDir, 'apple-icon.png'))
  }
}

for (const file of generated) {
  console.log(path.relative(repoRoot, file).replace(/\\/g, '/'))
}
console.log(`${generated.length} derivados gerados.`)
