import { expect, test } from '@playwright/test'

import { expectNoA11yViolations } from '../helpers/a11y'
import { MINIMUM_TOUCH_TARGET, SUPPORTED_VIEWPORTS } from '../fixtures/viewports'

/** Páginas representativas de cada template público. */
const REPRESENTATIVE_PAGES = [
  { path: '/', name: 'home' },
  { path: '/cozinhas-industriais', name: 'solução' },
  { path: '/segmentos/restaurantes-e-cozinhas-profissionais', name: 'segmento' },
  { path: '/orcamento', name: 'orçamento' },
  { path: '/empresa', name: 'empresa' },
] as const

test.describe('acessibilidade', () => {
  for (const page of REPRESENTATIVE_PAGES) {
    test(`${page.name} não tem violações de axe`, async ({ page: browserPage }) => {
      await browserPage.goto(page.path)
      await expectNoA11yViolations(browserPage)
    })
  }

  test('cada página tem exatamente um H1', async ({ page }) => {
    for (const target of REPRESENTATIVE_PAGES) {
      await page.goto(target.path)
      await expect(page.locator('h1'), `${target.path} precisa de um H1 único`).toHaveCount(1)
    }
  })

  test('o documento declara pt-BR', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR')
  })
})

test.describe('conversão', () => {
  test('o WhatsApp usa o número confirmado e não carrega dado pessoal', async ({ page }) => {
    await page.goto('/cozinhas-industriais')

    const links = page.locator('a[href^="https://wa.me/"]')
    await expect(links.first()).toBeVisible()

    for (const href of await links.evaluateAll((nodes) =>
      nodes.map((node) => (node as HTMLAnchorElement).href),
    )) {
      expect(href).toContain('wa.me/5561996831052')
      expect(href).not.toMatch(/[?&](name|email|phone|nome|telefone|protocolo)=/i)

      // Só o parâmetro `text` é permitido na URL.
      const params = [...new URL(href).searchParams.keys()]
      expect(params).toEqual(['text'])
    }
  })

  test('o botão flutuante não cobre o rodapé', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')
    await page.locator('footer').scrollIntoViewIfNeeded()

    const floating = page.locator('a[aria-label="Falar no WhatsApp"]').last()
    const box = await floating.boundingBox()

    expect(box).not.toBeNull()
    expect(box!.width).toBeGreaterThanOrEqual(MINIMUM_TOUCH_TARGET)
    expect(box!.height).toBeGreaterThanOrEqual(MINIMUM_TOUCH_TARGET)
  })
})

test.describe('publicação condicional', () => {
  test('Projetos não aparece no menu enquanto não houver projeto aprovado', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByRole('navigation').getByRole('link', { name: 'Projetos' })).toHaveCount(0)
    await expect(page.getByRole('link', { name: 'Conhecer nossas soluções' })).toBeVisible()
  })

  test('/projetos responde 404 sem conteúdo aprovado', async ({ page }) => {
    const response = await page.goto('/projetos')
    expect(response?.status()).toBe(404)
  })

  test('o rodapé não exibe links legais antes da aprovação', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('link', { name: /política de privacidade/i })).toHaveCount(0)
  })
})

test.describe('responsividade', () => {
  for (const viewport of SUPPORTED_VIEWPORTS) {
    test(`sem rolagem horizontal em ${viewport.name} px`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height })
      await page.goto('/cozinhas-industriais')

      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
      expect(scrollWidth).toBeLessThanOrEqual(viewport.width)
    })
  }
})

test.describe('SEO técnico', () => {
  test('robots bloqueia indexação enquanto o conteúdo não está publicado', async ({ request }) => {
    const response = await request.get('/robots.txt')

    expect(response.status()).toBe(200)
    expect(await response.text()).toContain('Disallow: /')
  })

  test('o sitemap lista as rotas publicadas e omite as condicionais', async ({ request }) => {
    const body = await (await request.get('/sitemap.xml')).text()

    expect(body).toContain('/cozinhas-industriais')
    expect(body).toContain('/segmentos/restaurantes-e-cozinhas-profissionais')
    // Sem projeto, artigo ou documento legal aprovado, nenhuma dessas URLs
    // pode ser anunciada — ela responderia 404 ao rastreador.
    expect(body).not.toContain('/projetos')
    expect(body).not.toContain('/conteudos/')
    expect(body).not.toContain('/politica-de-privacidade')
  })

  test('cada página declara canonical e descrição exclusivos', async ({ page }) => {
    const seen = new Set<string>()

    for (const target of REPRESENTATIVE_PAGES) {
      await page.goto(target.path)

      const description = await page
        .locator('meta[name="description"]')
        .getAttribute('content')
      expect(description, `${target.path} precisa de meta description`).toBeTruthy()
      expect(seen.has(description!), `${target.path} repete a descrição`).toBe(false)
      seen.add(description!)

      const canonical = await page.locator('link[rel="canonical"]').getAttribute('href')
      expect(canonical, `${target.path} precisa de canonical`).toContain(target.path)
    }
  })

  test('nenhuma página pública menciona proteção contra incêndio', async ({ page }) => {
    for (const target of REPRESENTATIVE_PAGES) {
      await page.goto(target.path)
      const text = await page.locator('body').innerText()
      expect(text).not.toMatch(/inc[êe]ndio/i)
    }
  })
})
