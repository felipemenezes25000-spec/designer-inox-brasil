import { expect, test } from '@playwright/test'

import {
  DESKTOP_BREAKPOINT,
  MINIMUM_TOUCH_TARGET,
  SUPPORTED_VIEWPORTS,
} from '../fixtures/viewports'

/**
 * Responsividade na matriz contratada da especificação §20.
 *
 * O teste roda apenas no projeto Chromium: o que ele mede é layout puro
 * (rolagem horizontal, presença de elemento por media query, área de alvo),
 * que não varia por motor. Comportamento específico de motor é coberto pelo
 * percurso de teclado, esse sim executado nos três engines.
 */

test.describe('shell responsivo', () => {
  test.skip(({ browserName }) => browserName !== 'chromium', 'layout puro: um motor basta')

  for (const viewport of SUPPORTED_VIEWPORTS) {
    test(`${viewport.name} px não produz rolagem horizontal`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height })
      await page.goto('/')

      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
      expect(scrollWidth).toBeLessThanOrEqual(viewport.width)
    })
  }

  for (const viewport of SUPPORTED_VIEWPORTS.filter((v) => v.width < DESKTOP_BREAKPOINT)) {
    test(`${viewport.name} px mostra o menu mobile com alvo de toque suficiente`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height })
      await page.goto('/')

      const menuButton = page.getByRole('button', { name: 'Menu' })
      await expect(menuButton).toBeVisible()

      const box = await menuButton.boundingBox()
      expect(box!.width).toBeGreaterThanOrEqual(MINIMUM_TOUCH_TARGET)
      expect(box!.height).toBeGreaterThanOrEqual(MINIMUM_TOUCH_TARGET)

      // A navegação desktop fica oculta abaixo do limiar.
      await expect(page.getByRole('navigation', { name: 'Navegação principal' }).first())
        .toBeHidden()
    })
  }

  for (const viewport of SUPPORTED_VIEWPORTS.filter((v) => v.width >= DESKTOP_BREAKPOINT)) {
    test(`${viewport.name} px mostra a navegação desktop e oculta o menu mobile`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height })
      await page.goto('/')

      await expect(page.getByRole('navigation', { name: 'Navegação principal' }).first())
        .toBeVisible()
      await expect(page.getByRole('button', { name: 'Menu' })).toBeHidden()

      const cta = page.getByRole('link', { name: 'Solicitar orçamento' }).first()
      await expect(cta).toBeVisible()

      const box = await cta.boundingBox()
      expect(box!.height).toBeGreaterThanOrEqual(MINIMUM_TOUCH_TARGET)
    })
  }

  test('o layout resiste a zoom de 200% na largura mínima', async ({ page }) => {
    // Zoom de texto é simulado reduzindo a viewport pela metade: é o efeito
    // equivalente sobre o layout e é o que a WCAG 1.4.4 exige suportar.
    await page.setViewportSize({ width: 320, height: 512 })
    await page.goto('/')

    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
    expect(scrollWidth).toBeLessThanOrEqual(320)
  })
})
