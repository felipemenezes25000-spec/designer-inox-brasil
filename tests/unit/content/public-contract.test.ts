import { describe, expect, test, vi } from 'vitest'

import { getPublicContentRepository } from '@/modules/content/public/composition-root'
import { PUBLIC_CONTENT_METHODS } from '@/modules/content/public/repository'
import { WHATSAPP_CONTEXTS } from '@/modules/whatsapp/contexts'

describe('contrato de conteúdo público', () => {
  test('os nove contextos de WhatsApp são a fonte única de verdade', () => {
    expect([...WHATSAPP_CONTEXTS]).toEqual([
      'general',
      'kitchen',
      'equipment',
      'ventilation',
      'integrated-systems',
      'cnc',
      'renovation',
      'maintenance',
      'project',
    ])
  })

  test('o repositório expõe exatamente os métodos do contrato', () => {
    const repository = getPublicContentRepository()

    for (const method of PUBLIC_CONTENT_METHODS) {
      expect(
        typeof (repository as unknown as Record<string, unknown>)[method],
        `${method} precisa existir no repositório`,
      ).toBe('function')
    }

    const extra = Object.keys(repository).filter(
      (key) => !(PUBLIC_CONTENT_METHODS as readonly string[]).includes(key),
    )
    expect(extra, 'o repositório não pode expor superfície fora do contrato').toEqual([])
  })

  test('o composition root devolve sempre a mesma instância', () => {
    expect(getPublicContentRepository()).toBe(getPublicContentRepository())
  })

  test('importar o composition root não lê conteúdo', async () => {
    // Durante `next build` o módulo precisa ser analisável sem tocar em banco,
    // Payload ou storage. A guarda vive dentro de cada método, não no import.
    vi.stubEnv('NEXT_PHASE', 'phase-production-build')
    vi.stubEnv('CONTENT_ACCESS_SENTINEL', 'throw')

    const compositionRoot = await import('@/modules/content/public/composition-root')
    expect(() => compositionRoot.getPublicContentRepository()).not.toThrow()

    vi.unstubAllEnvs()
  })
})
