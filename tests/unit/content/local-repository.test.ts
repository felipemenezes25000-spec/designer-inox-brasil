import { afterEach, describe, expect, test, vi } from 'vitest'

import {
  BUILD_CONTENT_ACCESS_FORBIDDEN,
  INDEXED_SEED_PREVIEW_FORBIDDEN,
  LOCAL_CONTENT_FORBIDDEN_IN_PRODUCTION,
  createLocalPublicContentRepository,
} from '@/modules/content/public/local-repository'
import { PUBLIC_CONTENT_METHODS } from '@/modules/content/public/repository'

const repository = createLocalPublicContentRepository()

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('leituras', () => {
  test('resolve serviço e segmento por slug', async () => {
    expect((await repository.getServiceBySlug('manutencao'))?.slug).toBe('manutencao')
    expect(
      (await repository.getSegmentBySlug('hotelaria-e-alimentacao-coletiva'))?.slug,
    ).toBe('hotelaria-e-alimentacao-coletiva')
  })

  test('devolve null para slug inexistente em vez de lançar', async () => {
    expect(await repository.getServiceBySlug('protecao-contra-incendio')).toBeNull()
    expect(await repository.getSegmentBySlug('inexistente')).toBeNull()
    expect(await repository.getProjectBySlug('qualquer')).toBeNull()
    expect(await repository.getLegalDocument('privacy')).toBeNull()
  })

  test('escopos de FAQ retornam os conjuntos corretos', async () => {
    expect((await repository.listFaqs({ kind: 'global' })).length).toBe(6)
    expect(
      (await repository.listFaqs({ kind: 'service', slug: 'cozinhas-industriais' })).length,
    ).toBe(2)
    expect(
      (await repository.listFaqs({ kind: 'segment', slug: 'producao-e-varejo-de-alimentos' }))
        .length,
    ).toBe(2)
    expect((await repository.listFaqs({ kind: 'service', slug: 'inexistente' })).length).toBe(0)
  })
})

describe('guardas de ambiente', () => {
  test('todo método falha fechado em produção sem fonte declarada', async () => {
    vi.stubEnv('NODE_ENV', 'production')

    for (const method of PUBLIC_CONTENT_METHODS) {
      const call = (repository as unknown as Record<string, () => Promise<unknown>>)[method]
      await expect(
        call.call(repository, { kind: 'global' } as never),
        `${method} deveria recusar em produção`,
      ).rejects.toThrow(LOCAL_CONTENT_FORBIDDEN_IN_PRODUCTION)
    }
  })

  test('a sentinela de build bloqueia leitura mesmo fora de produção', async () => {
    vi.stubEnv('CONTENT_ACCESS_SENTINEL', 'throw')

    await expect(repository.listServices()).rejects.toThrow(BUILD_CONTENT_ACCESS_FORBIDDEN)
  })

  test('CONTENT_SOURCE=seed libera o preview em produção', async () => {
    vi.stubEnv('NODE_ENV', 'production')
    vi.stubEnv('CONTENT_SOURCE', 'seed')

    expect((await repository.listServices()).length).toBe(7)
  })

  test('o preview semeado é recusado quando o site está indexável', async () => {
    vi.stubEnv('NODE_ENV', 'production')
    vi.stubEnv('CONTENT_SOURCE', 'seed')
    vi.stubEnv('INDEX_PUBLIC_SITE', 'true')

    // Conteúdo semeado não passou pelo workflow editorial: pode ser
    // pré-visualizado, nunca indexado.
    await expect(repository.listServices()).rejects.toThrow(INDEXED_SEED_PREVIEW_FORBIDDEN)
  })
})
