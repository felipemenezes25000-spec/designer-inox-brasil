import { render, type RenderResult } from '@testing-library/react'
import type { ReactElement } from 'react'

/**
 * Ponto único de montagem para testes de componente.
 *
 * Hoje o shell não exige provider algum — ele recebe navegação já hidratada
 * por propriedades síncronas. Manter o wrapper mesmo assim evita reescrever
 * toda a suíte quando um provider (tema, consentimento, i18n) for introduzido.
 */
export function renderWithProviders(ui: ReactElement): RenderResult {
  return render(ui)
}

export * from '@testing-library/react'
export { default as userEvent } from '@testing-library/user-event'
