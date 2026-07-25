import { createHash } from 'node:crypto'
import { readFileSync, statSync } from 'node:fs'
import path from 'node:path'

import sharp from 'sharp'
import { describe, expect, test } from 'vitest'

const repoRoot = process.cwd()

type ManifestEntry = { path: string; sha256: string; width?: number; height?: number }
type Manifest = {
  master: ManifestEntry
  symbol: ManifestEntry
  wordmark: ManifestEntry
  fonts: ManifestEntry[]
}

const manifest: Manifest = JSON.parse(
  readFileSync(path.join(repoRoot, 'assets', 'brand', 'logo-manifest.json'), 'utf8'),
)

const resolve = (relative: string) => path.join(repoRoot, relative)
const hashOf = (relative: string) =>
  createHash('sha256').update(readFileSync(resolve(relative))).digest('hex').toUpperCase()

const SYMBOL_VARIANTS = ['symbol-positive', 'symbol-negative'] as const
const LOCKUP_VARIANTS = ['lockup-positive', 'lockup-negative'] as const
const FORMATS = ['png', 'webp', 'avif'] as const

describe('master e entradas aprovadas', () => {
  test('a cópia do master bate com o hash aprovado', () => {
    expect(hashOf(manifest.master.path)).toBe(manifest.master.sha256)
  })

  test('a cópia do master preserva as dimensões originais', async () => {
    const meta = await sharp(resolve(manifest.master.path)).metadata()
    expect(meta.width).toBe(manifest.master.width)
    expect(meta.height).toBe(manifest.master.height)
  })

  test('o símbolo isolado bate com o hash aprovado e tem alpha', async () => {
    expect(hashOf(manifest.symbol.path)).toBe(manifest.symbol.sha256)

    const meta = await sharp(resolve(manifest.symbol.path)).metadata()
    expect(meta.hasAlpha).toBe(true)
    expect(meta.width).toBe(manifest.symbol.width)
    expect(meta.height).toBe(manifest.symbol.height)
  })

  test('o recorte do símbolo não toca as bordas do próprio canvas', async () => {
    const { data, info } = await sharp(resolve(manifest.symbol.path))
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true })

    // Após o `trim`, ao menos um pixel opaco encosta em cada borda — é o que
    // prova que não sobrou moldura de fundo em volta do conteúdo alfa.
    const alphaAt = (x: number, y: number) => data[(y * info.width + x) * info.channels + 3]

    const anyInColumn = (x: number) =>
      Array.from({ length: info.height }, (_, y) => alphaAt(x, y)).some((a) => a > 8)
    const anyInRow = (y: number) =>
      Array.from({ length: info.width }, (_, x) => alphaAt(x, y)).some((a) => a > 8)

    expect(anyInColumn(0)).toBe(true)
    expect(anyInColumn(info.width - 1)).toBe(true)
    expect(anyInRow(0)).toBe(true)
    expect(anyInRow(info.height - 1)).toBe(true)
  })

  test('o wordmark bate com o hash aprovado', () => {
    expect(hashOf(manifest.wordmark.path)).toBe(manifest.wordmark.sha256)
  })

  test('a fonte Sora variável usada pelo lockup está versionada e íntegra', () => {
    const sora = manifest.fonts.find((font) => font.path.includes('sora'))
    expect(sora, 'o manifesto precisa registrar a Sora').toBeDefined()
    expect(hashOf(sora!.path)).toBe(sora!.sha256)
    expect(statSync(resolve(sora!.path)).size).toBeGreaterThan(0)
  })

  test('a fonte Inter variável está versionada e íntegra', () => {
    const inter = manifest.fonts.find((font) => font.path.includes('inter'))
    expect(inter).toBeDefined()
    expect(hashOf(inter!.path)).toBe(inter!.sha256)
  })
})

describe('derivados publicados', () => {
  test.each(SYMBOL_VARIANTS)('%s existe nos três formatos', async (variant) => {
    for (const format of FORMATS) {
      const file = resolve(`public/brand/${variant}.${format}`)
      expect(statSync(file).size).toBeGreaterThan(0)
    }
  })

  test.each(SYMBOL_VARIANTS)('%s usa canvas quadrado com alpha', async (variant) => {
    const meta = await sharp(resolve(`public/brand/${variant}.png`)).metadata()
    expect(meta.width).toBe(512)
    expect(meta.height).toBe(512)
    expect(meta.width).toBe(meta.height)
    expect(meta.hasAlpha).toBe(true)
  })

  test.each(LOCKUP_VARIANTS)('%s tem 1200 × 320 nos três formatos', async (variant) => {
    for (const format of FORMATS) {
      const file = resolve(`public/brand/${variant}.${format}`)
      expect(statSync(file).size).toBeGreaterThan(0)

      const meta = await sharp(file).metadata()
      expect(meta.width).toBe(1200)
      expect(meta.height).toBe(320)
    }
  })

  test.each([16, 32, 180])('o ícone de %i px é quadrado e não vazio', async (size) => {
    const file = resolve(`public/brand/icon-${size}.png`)
    expect(statSync(file).size).toBeGreaterThan(0)

    const meta = await sharp(file).metadata()
    expect(meta.width).toBe(size)
    expect(meta.height).toBe(size)
  })

  test.each([16, 32, 180])('o ícone de %i px é opaco', async (size) => {
    const { data, info } = await sharp(resolve(`public/brand/icon-${size}.png`))
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true })

    // O iOS compõe o ícone de toque sobre branco e a moldura da aba do
    // navegador muda com o tema do sistema: transparência produziria borda
    // suja em ambos os casos.
    let minAlpha = 255
    for (let index = 3; index < data.length; index += info.channels) {
      if (data[index] < minAlpha) minAlpha = data[index]
    }
    expect(minAlpha).toBe(255)
  })

  test.each([16, 32])(
    'o ícone de %i px usa a silhueta simplificada, não a arte tridimensional',
    async (size) => {
      const { data, info } = await sharp(resolve(`public/brand/icon-${size}.png`))
        .raw()
        .toBuffer({ resolveWithObject: true })

      // A silhueta tem apenas duas famílias tonais (prata clara e grafite).
      // A arte original espalha luminância por toda a faixa intermediária,
      // que é justamente o que a torna ilegível neste tamanho.
      let intermediate = 0
      let total = 0
      for (let index = 0; index < data.length; index += info.channels) {
        const luminance =
          0.2126 * data[index] + 0.7152 * data[index + 1] + 0.0722 * data[index + 2]
        total += 1
        if (luminance > 70 && luminance < 190) intermediate += 1
      }

      expect(intermediate / total).toBeLessThan(0.35)
    },
  )

  test('os ícones de rota do App Router foram publicados', async () => {
    const icon = await sharp(resolve('src/app/(frontend)/icon.png')).metadata()
    expect(icon.width).toBe(32)

    const appleIcon = await sharp(resolve('src/app/(frontend)/apple-icon.png')).metadata()
    expect(appleIcon.width).toBe(180)
  })

  test('a variante positiva é a silhueta em grafite, não a arte prateada', async () => {
    const { dominant } = await sharp(resolve('public/brand/symbol-positive.png'))
      .flatten({ background: '#FFFFFF' })
      .stats()

    // #0D1218 é quase preto; a arte original é predominantemente prata clara.
    const luminance = 0.2126 * dominant.r + 0.7152 * dominant.g + 0.0722 * dominant.b
    expect(luminance).toBeLessThan(120)
  })
})
