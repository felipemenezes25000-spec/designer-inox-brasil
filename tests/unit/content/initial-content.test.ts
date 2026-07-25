import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import path from 'node:path'

import { describe, expect, test } from 'vitest'

import {
  initialArticles,
  initialClients,
  initialFooter,
  initialLegalDocuments,
  initialMedia,
  initialNavigation,
  initialPages,
  initialProjects,
  initialRedirects,
  initialSegments,
  initialServices,
  initialSiteSettings,
  initialTestimonials,
} from '@/modules/content/initial'
import { SERVICE_ROUTES } from '@/modules/site/routing/public-routes'

const everything = JSON.stringify({
  initialPages,
  initialServices,
  initialSegments,
  initialMedia,
  initialSiteSettings,
  initialNavigation,
  initialFooter,
})

describe('volume e forma do conteúdo inicial', () => {
  test('sete soluções e três segmentos', () => {
    expect(initialServices).toHaveLength(7)
    expect(initialSegments).toHaveLength(3)
  })

  test('coleções sem material aprovado permanecem vazias', () => {
    expect(initialProjects).toEqual([])
    expect(initialClients).toEqual([])
    expect(initialTestimonials).toEqual([])
    expect(initialArticles).toEqual([])
    expect(initialLegalDocuments).toEqual([])
    expect(initialRedirects).toEqual([])
  })

  test('cada serviço tem uma rota correspondente no catálogo', () => {
    const routeSlugs = Object.values(SERVICE_ROUTES).map((route) => route.slice(1))
    expect(initialServices.map((service) => service.slug).sort()).toEqual(routeSlugs.sort())
  })
})

describe('exclusões de escopo', () => {
  test('nenhuma menção a proteção contra incêndio ou atendimento doméstico', () => {
    expect(everything).not.toMatch(/incêndio|incendio|sprinkler/i)
    expect(everything).not.toMatch(/atendimento doméstico|residencial/i)
  })

  test('nenhuma alegação regulatória, certificação ou garantia absoluta', () => {
    expect(everything).not.toMatch(/\bCREA\b|\bART\b|\bNR-?\d+\b|certificad|acreditad/i)
    expect(everything).not.toMatch(/garantia absoluta|100% garantid|melhor do brasil/i)
  })

  test('nenhuma métrica, prazo ou preço não comprovado', () => {
    expect(everything).not.toMatch(/\banos de (mercado|experiência)\b/i)
    expect(everything).not.toMatch(/\+\s?\d+\s+(clientes|obras|projetos)/i)
    expect(everything).not.toMatch(/visita gratuita|orçamento em \d+ ?h/i)
  })

  test('dados empresariais não confirmados permanecem nulos', () => {
    expect(initialSiteSettings.email).toBeNull()
    expect(initialSiteSettings.address).toBeNull()
    expect(initialSiteSettings.geo).toBeNull()
    expect(initialSiteSettings.areaServed).toEqual([])
    expect(initialSiteSettings.businessHours).toEqual([])
    expect(initialSiteSettings.socialLinks).toEqual([])
    expect(everything).not.toMatch(/\bCNPJ\b|\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}/)
  })

  test('o rodapé não publica links legais antes da aprovação', () => {
    expect(initialFooter.legal).toEqual([])
    expect(initialFooter.social).toEqual([])
  })
})

describe('mídia ilustrativa', () => {
  test('toda imagem externa carrega legenda e proveniência completas', () => {
    const illustrative = initialMedia.filter((item) => item.kind === 'illustrative')
    expect(illustrative.length).toBe(3)

    for (const media of illustrative) {
      expect(media.caption).toBe('Imagem ilustrativa')
      expect(media.credit).toBeTruthy()
      expect(media.sourceUrl).toMatch(/^https:\/\/www\.pexels\.com\/photo\//)
      expect(media.licenseName).toBe('Pexels License')
      expect(media.licenseUrl).toBe('https://www.pexels.com/license/')
      expect(media.licenseCheckedAt).toBe('2026-07-25')
      expect(media.alt.length).toBeGreaterThan(20)
      expect(media.src).toBeTruthy()
      expect(media.width).toBeGreaterThan(0)
      expect(media.height).toBeGreaterThan(0)
    }
  })

  test('nenhuma imagem ilustrativa é usada como prova de trabalho próprio', () => {
    // Projetos é a única superfície que representa trabalho executado, e está
    // vazia. Nenhuma mídia ilustrativa pode ter `kind: 'company'`.
    expect(initialMedia.some((media) => media.kind === 'company')).toBe(false)
    expect(initialProjects).toEqual([])
  })

  test('o manifesto bate byte a byte com os arquivos versionados', () => {
    const manifest = JSON.parse(
      readFileSync(path.join(process.cwd(), 'docs', 'content', 'media-provenance.json'), 'utf8'),
    )

    expect(manifest.media).toHaveLength(3)

    for (const entry of manifest.media) {
      const file = readFileSync(
        path.join(process.cwd(), 'assets', 'content', 'illustrative', entry.file),
      )
      expect(createHash('sha256').update(file).digest('hex').toUpperCase()).toBe(entry.sha256)
      expect(file.byteLength).toBe(entry.bytes)
    }
  })
})

describe('SEO do conteúdo inicial', () => {
  const seoEntries = [
    ...initialPages.map((page) => ({ slug: page.slug, seo: page.seo })),
    ...initialServices.map((service) => ({ slug: service.slug, seo: service.seo })),
    ...initialSegments.map((segment) => ({ slug: segment.slug, seo: segment.seo })),
  ]

  test('todo title e description são exclusivos', () => {
    const titles = seoEntries.map((entry) => entry.seo.title)
    const descriptions = seoEntries.map((entry) => entry.seo.description)

    expect(new Set(titles).size).toBe(titles.length)
    expect(new Set(descriptions).size).toBe(descriptions.length)
  })

  test('as meta descriptions das soluções têm entre 120 e 160 caracteres', () => {
    for (const service of initialServices) {
      const length = service.seo.description.length
      expect(length, `${service.slug}: ${length} caracteres`).toBeGreaterThanOrEqual(120)
      expect(length, `${service.slug}: ${length} caracteres`).toBeLessThanOrEqual(160)
    }
  })

  test('os títulos das soluções seguem o padrão H1 | marca', () => {
    for (const service of initialServices) {
      expect(service.seo.title).toBe(`${service.title} | Designer Inox Brasil`)
    }
  })

  test('apenas a 404 é marcada como noIndex', () => {
    const noIndexed = initialPages.filter((page) => page.seo.noIndex)
    expect(noIndexed.map((page) => page.kind)).toEqual(['notFound'])
  })
})

describe('estrutura das páginas', () => {
  test('nenhuma página semeia bloco de clientes, depoimentos ou artigos', () => {
    for (const page of initialPages) {
      const kinds = page.blocks.map((block) => block.type)
      expect(kinds).not.toContain('clients')
      expect(kinds).not.toContain('testimonials')
      expect(kinds).not.toContain('latestArticles')
    }
  })

  test('todo serviço referenciado por um bloco existe', () => {
    const known = new Set(initialServices.map((service) => service.slug))

    for (const page of initialPages) {
      for (const block of page.blocks) {
        if (block.type !== 'services') continue
        for (const slug of block.serviceSlugs) expect(known.has(slug)).toBe(true)
      }
    }
  })

  test('todo serviço relacionado aponta para um serviço existente e não para si mesmo', () => {
    const known = new Set(initialServices.map((service) => service.slug))

    for (const service of initialServices) {
      for (const related of service.relatedServiceSlugs) {
        expect(known.has(related)).toBe(true)
        expect(related).not.toBe(service.slug)
      }
    }
  })

  test('o mega menu cobre exatamente as sete soluções sem repetição', () => {
    const slugs = initialNavigation.solutionGroups.flatMap((group) => group.serviceSlugs)

    expect(new Set(slugs).size).toBe(slugs.length)
    expect(slugs.sort()).toEqual(initialServices.map((service) => service.slug).sort())
    expect(initialNavigation.solutionGroups.map((group) => group.label)).toEqual([
      'Construir',
      'Fabricar',
      'Integrar',
      'Transformar',
      'Manter',
    ])
  })

  test('cada solução e cada segmento tem exatamente duas FAQs próprias', () => {
    for (const service of initialServices) expect(service.faqs).toHaveLength(2)
    for (const segment of initialSegments) expect(segment.faqs).toHaveLength(2)
  })
})
