import { expect, test } from 'vitest'

import { renderWithProviders } from '../helpers/render'
import { SUPPORTED_VIEWPORTS } from '../fixtures/viewports'

test('renderWithProviders renderiza um elemento React consultável por papel', () => {
  const result = renderWithProviders(<button>Salvar</button>)

  expect(result.getByRole('button', { name: 'Salvar' })).not.toBeNull()
})

test('SUPPORTED_VIEWPORTS cobre a matriz contratada de larguras', () => {
  expect(SUPPORTED_VIEWPORTS.map((viewport) => viewport.width)).toEqual([
    320, 360, 390, 768, 1024, 1440, 1920,
  ])

  for (const viewport of SUPPORTED_VIEWPORTS) {
    expect(viewport.name).toBe(String(viewport.width))
    expect(viewport.height).toBeGreaterThan(0)
  }
})
