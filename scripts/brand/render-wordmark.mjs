#!/usr/bin/env node
/**
 * Renderiza o wordmark "Designer Inox Brasil" uma única vez, em Sora.
 *
 * O raster gerado passa a ser a fonte canônica do lockup. Isso existe porque
 * o Sharp não interpreta WOFF2 nem rasteriza texto de forma previsível entre
 * plataformas: se cada build compusesse o lockup a partir da fonte, o mesmo
 * commit produziria glifos diferentes em Windows, Linux e macOS.
 *
 * A página é local, sem rede, com `@font-face` apontando explicitamente para
 * o arquivo versionado. `document.fonts.check` garante que a captura não
 * aconteça com fonte de fallback.
 */

import { createHash } from 'node:crypto'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { chromium } from '@playwright/test'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')

export const WORDMARK_TEXT = 'Designer Inox Brasil'
export const WORDMARK_FONT_SIZE = 128
export const WORDMARK_WEIGHT = 600

const fontPath = path.join(repoRoot, 'src', 'assets', 'fonts', 'sora-latin.woff2')
const outputDir = path.join(repoRoot, 'assets', 'brand', 'derived')
const outputPath = path.join(outputDir, 'wordmark-sora.png')

/**
 * Monta a página de renderização com a fonte embutida como data URI.
 * Sem requisição de rede: o navegador roda offline.
 *
 * @param {string} fontBase64
 * @returns {string}
 */
export function buildWordmarkHtml(fontBase64) {
  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<style>
  @font-face {
    font-family: 'Sora';
    src: url(data:font/woff2;base64,${fontBase64}) format('woff2');
    font-weight: 100 800;
    font-style: normal;
    font-display: block;
  }
  html, body { margin: 0; padding: 0; background: transparent; }
  #wordmark {
    display: inline-block;
    font-family: 'Sora';
    font-weight: ${WORDMARK_WEIGHT};
    font-size: ${WORDMARK_FONT_SIZE}px;
    line-height: 1.12;
    letter-spacing: -0.015em;
    /* Branco puro: o lockup recolore o raster pelo alpha, então a cor final
       vem do gerador, não daqui. */
    color: #FFFFFF;
    white-space: nowrap;
    padding: 8px 4px;
  }
</style>
</head>
<body><span id="wordmark">${WORDMARK_TEXT}</span></body>
</html>`
}

const fontBase64 = readFileSync(fontPath).toString('base64')
const browser = await chromium.launch()

try {
  const page = await browser.newPage({ viewport: { width: 2400, height: 400 } })
  await page.setContent(buildWordmarkHtml(fontBase64), { waitUntil: 'load' })
  await page.evaluate(() => document.fonts.ready)

  const fontLoaded = await page.evaluate(
    ([weight, size]) => document.fonts.check(`${weight} ${size}px Sora`),
    [WORDMARK_WEIGHT, 64],
  )

  if (!fontLoaded) {
    throw new Error('WORDMARK_FONT_NOT_LOADED: Sora não ficou disponível antes da captura')
  }

  const element = page.locator('#wordmark')
  const buffer = await element.screenshot({ omitBackground: true, type: 'png' })

  mkdirSync(outputDir, { recursive: true })
  writeFileSync(outputPath, buffer)

  const hash = createHash('sha256').update(buffer).digest('hex').toUpperCase()
  const box = await element.boundingBox()
  console.log(
    `wordmark-sora.png: ${Math.round(box.width)} × ${Math.round(box.height)}, sha256 ${hash}`,
  )
} finally {
  await browser.close()
}
