#!/usr/bin/env node
/**
 * Gera os derivados responsivos das fotos ilustrativas.
 *
 * As fontes vivem em assets/content/illustrative e são imutáveis: o manifesto
 * docs/content/media-provenance.json registra o sha256 de cada uma. Este script
 * confere o hash antes de derivar qualquer coisa. Se um arquivo divergir, ele
 * para — um derivado publicado nunca deve vir de uma fonte trocada em silêncio.
 *
 * Cada foto vira um recorte 3:2 em três larguras, nos formatos AVIF e WebP,
 * mais um JPEG de fallback. O recorte fixo existe para o CSS poder reservar
 * espaço com aspect-ratio e não causar layout shift.
 */

import { createHash } from 'node:crypto'
import { mkdir, readFile, writeFile, readdir } from 'node:fs/promises'
import path from 'node:path'

import sharp from 'sharp'

const root = process.cwd()
const sourceDir = path.join(root, 'assets', 'content', 'illustrative')
const outDir = path.join(root, 'assets', 'img', 'photos')
const manifestPath = path.join(root, 'docs', 'content', 'media-provenance.json')

const WIDTHS = [640, 1280, 1920]
const RATIO = 3 / 2
const FALLBACK_WIDTH = 1280

const sha256 = buffer => createHash('sha256').update(buffer).digest('hex').toUpperCase()

async function main() {
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'))
  await mkdir(outDir, { recursive: true })

  const present = new Set((await readdir(sourceDir)).filter(f => f.endsWith('.jpg')))
  const errors = []
  let written = 0

  for (const entry of manifest.media) {
    if (!present.has(entry.file)) {
      errors.push(`${entry.file}: declarado no manifesto mas ausente em ${path.relative(root, sourceDir)}`)
      continue
    }

    const buffer = await readFile(path.join(sourceDir, entry.file))
    const digest = sha256(buffer)
    if (digest !== entry.sha256) {
      errors.push(`${entry.file}: sha256 divergente do manifesto (${digest} != ${entry.sha256})`)
      continue
    }

    const slug = entry.file.replace(/\.jpg$/, '')

    for (const width of WIDTHS) {
      const height = Math.round(width / RATIO)
      const pipeline = () =>
        sharp(buffer).resize(width, height, { fit: 'cover', position: 'attention' })

      await pipeline().avif({ quality: 55, effort: 6 }).toFile(path.join(outDir, `${slug}-${width}.avif`))
      await pipeline().webp({ quality: 76 }).toFile(path.join(outDir, `${slug}-${width}.webp`))
      written += 2

      if (width === FALLBACK_WIDTH) {
        await pipeline()
          .jpeg({ quality: 80, progressive: true, mozjpeg: true })
          .toFile(path.join(outDir, `${slug}-${width}.jpg`))
        written += 1
      }
    }

    // Placeholder inline: 20px de largura vira um data URI minúsculo usado como
    // background enquanto a foto real carrega, evitando um buraco branco.
    const tiny = await sharp(buffer).resize(20, Math.round(20 / RATIO), { fit: 'cover' }).webp({ quality: 40 }).toBuffer()
    entry.placeholder = `data:image/webp;base64,${tiny.toString('base64')}`
  }

  if (errors.length) {
    console.error(errors.join('\n'))
    process.exitCode = 1
    return
  }

  const placeholders = Object.fromEntries(manifest.media.map(m => [m.file.replace(/\.jpg$/, ''), m.placeholder]))
  await writeFile(
    path.join(root, 'src', 'content', 'placeholders.json'),
    `${JSON.stringify(placeholders, null, 2)}\n`,
  )

  await buildOpenGraph()

  console.log(`Derivados gerados: ${written} arquivos para ${manifest.media.length} fotos.`)
}

/**
 * Imagem de compartilhamento (1200×630).
 *
 * O texto vem do lockup PNG da marca, não de <text> em SVG: o renderizador do
 * Sharp usa fontes do sistema, e Sora não está instalada em máquina nenhuma
 * garantidamente. Compor o raster já pronto mantém a tipografia correta e
 * torna o resultado idêntico em qualquer máquina que rode o script.
 */
async function buildOpenGraph() {
  const W = 1200
  const H = 630

  const base = await sharp(path.join(sourceDir, 'industrial-kitchen.jpg'))
    .resize(W, H, { fit: 'cover', position: 'attention' })
    .modulate({ saturation: 0.45, brightness: 0.42 })
    .blur(1.5)
    .toBuffer()

  const overlay = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
<defs>
<linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
<stop offset="0" stop-color="#05080a" stop-opacity=".93"/>
<stop offset=".55" stop-color="#05080a" stop-opacity=".7"/>
<stop offset="1" stop-color="#0b2b33" stop-opacity=".72"/>
</linearGradient>
<pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
<path d="M60 0H0v60" fill="none" stroke="#7fd3e6" stroke-opacity=".1"/>
</pattern>
</defs>
<rect width="${W}" height="${H}" fill="url(#g)"/>
<rect width="${W}" height="${H}" fill="url(#grid)"/>
<rect x="0" y="${H - 12}" width="${W}" height="12" fill="#4fc3dc"/>
<rect x="72" y="292" width="70" height="3" fill="#4fc3dc"/>
</svg>`)

  const lockup = await sharp(path.join(root, 'assets', 'brand', 'lockup-negative.png'))
    .resize({ width: 620 })
    .toBuffer()

  const strip = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1056" height="132">
<style>
.t{font-family:"Segoe UI",Arial,Helvetica,sans-serif;font-weight:600;fill:#e9f1f4}
.s{font-family:"Segoe UI",Arial,Helvetica,sans-serif;font-weight:400;fill:#8fb9c6;letter-spacing:2.5px}
</style>
<text class="t" x="0" y="46" font-size="41">Projeto · Fabricação · Sistemas · Manutenção</text>
<text class="s" x="0" y="100" font-size="23">AÇO INOX PARA OPERAÇÕES PROFISSIONAIS · BRASÍLIA / DF</text>
</svg>`)

  await sharp(base)
    .composite([
      { input: overlay, top: 0, left: 0 },
      { input: lockup, top: 96, left: 72 },
      { input: strip, top: 330, left: 72 },
    ])
    .jpeg({ quality: 88, progressive: true, mozjpeg: true })
    .toFile(path.join(root, 'assets', 'img', 'og-default.jpg'))
}

await main()
