import { expect, test } from '@playwright/test'

import { expectNoA11yViolations } from '../helpers/a11y'

test.describe('acessibilidade da página de fundação', () => {
  test('a estrutura do documento é semântica e única', async ({ page }) => {
    await page.goto('/')

    await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR')

    // Um único H1 por página: hierarquia semântica é requisito da §15.
    await expect(page.locator('h1')).toHaveCount(1)
    await expect(page.locator('h1')).toContainText(
      'Soluções industriais completas em aço inox',
    )

    await expect(page.locator('header')).toHaveCount(1)
    await expect(page.locator('main#main-content')).toHaveCount(1)
    await expect(page.locator('footer')).toHaveCount(1)

    await expect(page.getByRole('link', { name: 'Designer Inox Brasil, página inicial' }))
      .toBeVisible()
  })

  test('não há violações axe no desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/')
    await expectNoA11yViolations(page)
  })

  test('não há violações axe no mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')
    await expectNoA11yViolations(page)
  })

  test('não há violações axe com o menu mobile aberto', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')

    await page.getByRole('button', { name: 'Menu' }).click()
    await expect(page.getByRole('dialog')).toBeVisible()

    await expectNoA11yViolations(page)
  })

  test('a página não menciona proteção contra incêndio', async ({ page }) => {
    await page.goto('/')
    const markup = (await page.content()).toLowerCase()

    for (const forbidden of ['incêndio', 'incendio', 'sprinkler']) {
      expect(markup).not.toContain(forbidden)
    }
  })

  test('a página não publica dado empresarial não confirmado', async ({ page }) => {
    await page.goto('/')
    const text = (await page.locator('body').innerText()).toLowerCase()

    for (const forbidden of ['cnpj', 'crea', 'art ', 'instagram', 'anos de mercado']) {
      expect(text, `"${forbidden}" não pode aparecer antes de confirmação`).not.toContain(forbidden)
    }
  })
})
