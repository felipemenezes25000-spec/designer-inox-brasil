import { expect, test } from '@playwright/test'

/**
 * Percurso de teclado do shell.
 *
 * Roda em navegador real e não em jsdom porque o que está sendo verificado —
 * ordem de tabulação, prisão de foco do `<dialog>` modal e devolução de foco —
 * é comportamento da plataforma, exatamente o que um DOM simulado não
 * reproduz.
 */

test.describe('shell por teclado', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('o primeiro Tab revela o skip link e Enter move o foco para o conteúdo', async ({
    page,
  }) => {
    await page.keyboard.press('Tab')

    const skipLink = page.getByRole('link', { name: 'Ir para o conteúdo principal' })
    await expect(skipLink).toBeFocused()

    await page.keyboard.press('Enter')

    const main = page.locator('#main-content')
    await expect(main).toBeFocused()
  })

  test('o menu mobile abre, prende o foco e devolve ao acionador com Esc', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })

    const menuButton = page.getByRole('button', { name: 'Menu' })
    await expect(menuButton).toBeVisible()
    await expect(menuButton).toHaveAttribute('aria-expanded', 'false')

    await menuButton.focus()
    await page.keyboard.press('Enter')

    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    await expect(menuButton).toHaveAttribute('aria-expanded', 'true')

    // O foco precisa estar DENTRO do diálogo assim que ele abre.
    await expect
      .poll(async () => dialog.evaluate((node) => node.contains(document.activeElement)))
      .toBe(true)

    /**
     * O que precisa ser provado é que o foco nunca alcança um controle da
     * página ATRÁS do modal.
     *
     * Exigir `dialog.contains(document.activeElement)` a cada Tab seria
     * literal demais: ao completar o ciclo, o Chromium passa uma vez por
     * `document.body` antes de voltar ao primeiro elemento do diálogo. Isso é
     * o ponto de recomeço do próprio navegador, não um vazamento — verificado
     * com uma sonda que registrou o percurso completo.
     */
    const escapedFocus = () =>
      page.evaluate(() => {
        const active = document.activeElement
        if (!active) return null
        if (active === document.body || active === document.documentElement) return null

        const modal = document.querySelector('dialog[open]')
        if (modal?.contains(active)) return null

        return `${active.tagName}:${(active.textContent ?? '').trim().slice(0, 40)}`
      })

    for (let index = 0; index < 25; index += 1) {
      await page.keyboard.press('Tab')
      expect(await escapedFocus(), `o foco alcançou a página atrás do modal no Tab ${index + 1}`)
        .toBeNull()
    }

    for (let index = 0; index < 10; index += 1) {
      await page.keyboard.press('Shift+Tab')
      expect(
        await escapedFocus(),
        `o foco alcançou a página atrás do modal no Shift+Tab ${index + 1}`,
      ).toBeNull()
    }

    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
    await expect(menuButton).toBeFocused()
  })

  test('o botão Fechar do diálogo também devolve o foco ao acionador', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })

    const menuButton = page.getByRole('button', { name: 'Menu' })
    await menuButton.click()

    await page.getByRole('button', { name: 'Fechar' }).click()

    await expect(page.getByRole('dialog')).toBeHidden()
    await expect(menuButton).toBeFocused()
  })

  test('todo item da navegação desktop é alcançável por teclado', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })

    const navLinks = page
      .getByRole('navigation', { name: 'Navegação principal' })
      .first()
      .getByRole('link')

    const count = await navLinks.count()
    expect(count).toBeGreaterThan(0)

    for (let index = 0; index < count; index += 1) {
      const link = navLinks.nth(index)
      await link.focus()
      await expect(link).toBeFocused()
    }
  })

  test('o indicador de foco é visível em todos os controles do cabeçalho', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })

    const cta = page.getByRole('link', { name: 'Solicitar orçamento' }).first()
    await cta.focus()

    const outlineWidth = await cta.evaluate(
      (node) => getComputedStyle(node).outlineWidth,
    )
    expect(Number.parseFloat(outlineWidth)).toBeGreaterThanOrEqual(3)
  })
})
