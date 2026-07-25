import AxeBuilder from '@axe-core/playwright'
import { expect, type Page } from '@playwright/test'

/**
 * Auditoria automatizada de acessibilidade.
 *
 * A meta do produto é WCAG 2.2 AA, então as tags analisadas são explícitas em
 * vez do conjunto padrão do axe. A asserção exige lista vazia: nenhuma
 * violação é tolerada, e o relatório é serializado no erro para que a falha
 * aponte a regra e o seletor sem exigir nova execução.
 */
export async function expectNoA11yViolations(page: Page): Promise<void> {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze()

  const summary = results.violations.map((violation) => ({
    id: violation.id,
    impact: violation.impact,
    help: violation.help,
    nodes: violation.nodes.map((node) => node.target.join(' ')),
  }))

  expect(summary, JSON.stringify(summary, null, 2)).toEqual([])
}
