import { readFileSync } from 'node:fs'
import path from 'node:path'

import { describe, expect, test } from 'vitest'

import {
  colors,
  contrastMinimums,
  contrastRatio,
  focusRing,
  layout,
  minimumTouchTarget,
  motion,
  radii,
  spacing,
  whatsappInk,
} from '@/styles/tokens'

const tokensCss = readFileSync(
  path.join(process.cwd(), 'src', 'styles', 'tokens.css'),
  'utf8',
)

const APPROVED_PALETTE = [
  '#06090D',
  '#0D1218',
  '#151C24',
  '#7E8994',
  '#BFC8D0',
  '#E7EDF2',
  '#F8FAFC',
  '#74D9FF',
  '#168DC3',
  '#0B5F87',
  '#25D366',
] as const

describe('paleta', () => {
  test('o TypeScript expõe exatamente a paleta aprovada', () => {
    expect(Object.values(colors).sort()).toEqual([...APPROVED_PALETTE].sort())
  })

  test.each(APPROVED_PALETTE)('o CSS declara %s', (hex) => {
    expect(tokensCss.toLowerCase()).toContain(hex.toLowerCase())
  })

  test('o CSS não introduz cor fora da paleta aprovada', () => {
    const declared = [...tokensCss.matchAll(/#[0-9a-f]{6}\b/gi)].map((match) =>
      match[0].toUpperCase(),
    )
    const unexpected = [...new Set(declared)].filter(
      (hex) => !APPROVED_PALETTE.includes(hex as (typeof APPROVED_PALETTE)[number]),
    )

    expect(unexpected).toEqual([])
  })

  test('dourado, ferrugem e neon não aparecem', () => {
    for (const forbidden of ['#FFD700', '#B7410E', '#39FF14', '#FF00FF']) {
      expect(tokensCss.toUpperCase()).not.toContain(forbidden)
    }
  })
})

describe('contraste WCAG 2.2 AA', () => {
  test('branco técnico sobre preto industrial atende texto normal', () => {
    expect(contrastRatio(colors.whiteTechnical, colors.blackIndustrial)).toBeGreaterThanOrEqual(
      contrastMinimums.normalText,
    )
  })

  test('preto industrial sobre azul gelo atende texto normal', () => {
    expect(contrastRatio(colors.blackIndustrial, colors.blueIce)).toBeGreaterThanOrEqual(
      contrastMinimums.normalText,
    )
  })

  test('grafite profundo sobre verde WhatsApp atende texto normal', () => {
    expect(contrastRatio(colors.graphiteDeep, colors.whatsapp)).toBeGreaterThanOrEqual(
      contrastMinimums.normalText,
    )
  })

  test('branco sobre verde WhatsApp seria reprovado — por isso a tinta é grafite', () => {
    expect(contrastRatio(colors.whiteTechnical, colors.whatsapp)).toBeLessThan(
      contrastMinimums.normalText,
    )
    expect(whatsappInk).toBe(colors.graphiteDeep)
  })

  test('texto principal e secundário sobre a superfície padrão atendem AA', () => {
    expect(contrastRatio(colors.whiteTechnical, colors.graphiteDeep)).toBeGreaterThanOrEqual(4.5)
    expect(contrastRatio(colors.silverLight, colors.graphiteDeep)).toBeGreaterThanOrEqual(4.5)
    expect(contrastRatio(colors.silver, colors.graphiteSecondary)).toBeGreaterThanOrEqual(4.5)
  })

  test('texto sobre superfície clara atende AA', () => {
    expect(contrastRatio(colors.graphiteDeep, colors.whiteTechnical)).toBeGreaterThanOrEqual(4.5)
    expect(contrastRatio(colors.steelGray, colors.whiteTechnical)).toBeGreaterThanOrEqual(3)
  })

  test('o anel de foco atende o mínimo de elemento não textual sobre as superfícies', () => {
    for (const surface of [colors.graphiteDeep, colors.graphiteSecondary, colors.blackIndustrial]) {
      expect(contrastRatio(focusRing.color, surface)).toBeGreaterThanOrEqual(
        contrastMinimums.nonText,
      )
    }
  })

  test('a ação primária mantém contraste de texto', () => {
    expect(contrastRatio(colors.whiteTechnical, colors.blueIndustrial)).toBeGreaterThanOrEqual(3)
    expect(contrastRatio(colors.whiteTechnical, colors.blueDeep)).toBeGreaterThanOrEqual(4.5)
  })
})

describe('escalas', () => {
  test('o espaçamento segue a escala contratada', () => {
    expect(Object.values(spacing)).toEqual([4, 8, 12, 16, 24, 32, 48, 64, 96])
  })

  test('os raios seguem a escala contratada', () => {
    expect(Object.values(radii)).toEqual([4, 8, 12, 999])
  })

  test('o movimento usa as três durações contratadas', () => {
    expect(Object.values(motion)).toEqual([120, 180, 240])
  })

  test('o layout fixa largura de conteúdo, cabeçalhos e piso de viewport', () => {
    expect(layout.contentMaxWidth).toBe(1200)
    expect(layout.headerHeightDesktop).toBe(72)
    expect(layout.headerHeightMobile).toBe(64)
    expect(layout.minimumViewport).toBe(320)
    expect(layout.desktopBreakpoint).toBe(1024)
  })

  test('o alvo mínimo de toque é 44 px', () => {
    expect(minimumTouchTarget).toBe(44)
    expect(tokensCss).toContain('--touch-target-min: 44px')
  })

  test('o anel de foco tem 3 px com deslocamento de 3 px em azul gelo', () => {
    expect(focusRing).toEqual({ width: 3, offset: 3, color: '#74D9FF' })
  })
})

describe('espelhamento entre TypeScript e CSS', () => {
  const cssNumber = (name: string) => {
    const match = new RegExp(`${name}:\\s*(-?\\d+(?:\\.\\d+)?)px`).exec(tokensCss)
    return match ? Number(match[1]) : null
  }

  test.each([
    ['--space-3xs', spacing['3xs']],
    ['--space-2xs', spacing['2xs']],
    ['--space-xs', spacing.xs],
    ['--space-sm', spacing.sm],
    ['--space-md', spacing.md],
    ['--space-lg', spacing.lg],
    ['--space-xl', spacing.xl],
    ['--space-2xl', spacing['2xl']],
    ['--space-3xl', spacing['3xl']],
    ['--radius-sm', radii.sm],
    ['--radius-md', radii.md],
    ['--radius-lg', radii.lg],
    ['--radius-pill', radii.pill],
    ['--content-max-width', layout.contentMaxWidth],
    ['--header-height-desktop', layout.headerHeightDesktop],
    ['--header-height-mobile', layout.headerHeightMobile],
    ['--focus-ring-width', focusRing.width],
    ['--focus-ring-offset', focusRing.offset],
  ])('%s bate com o valor do TypeScript', (name, expected) => {
    expect(cssNumber(name)).toBe(expected)
  })

  test.each([
    ['--motion-fast', motion.fast],
    ['--motion-base', motion.base],
    ['--motion-slow', motion.slow],
  ])('%s bate com o valor do TypeScript', (name, expected) => {
    const match = new RegExp(`${name}:\\s*(\\d+)ms`).exec(tokensCss)
    expect(match ? Number(match[1]) : null).toBe(expected)
  })
})

describe('movimento reduzido', () => {
  test('prefers-reduced-motion zera o deslocamento e reduz a duração para 1ms', () => {
    const block = /@media\s*\(prefers-reduced-motion:\s*reduce\)\s*\{([\s\S]*?)\n\}/.exec(
      tokensCss,
    )

    expect(block, 'o bloco de movimento reduzido precisa existir').not.toBeNull()

    const rules = block![1]
    expect(rules).toContain('--motion-fast: 1ms')
    expect(rules).toContain('--motion-base: 1ms')
    expect(rules).toContain('--motion-slow: 1ms')
    expect(rules).toContain('--motion-shift: 0px')
  })
})
