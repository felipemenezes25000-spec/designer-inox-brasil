import { describe, expect, test } from 'vitest'

import {
  CONTENT_TAGS,
  PUBLIC_CONTENT_MAX_AGE_SECONDS,
  pathsAffectedBy,
  tagsAffectedBy,
} from '@/modules/content/public/cache-tags'

describe('invalidação por tag', () => {
  test('publicar um serviço atinge a página, a listagem e a navegação', () => {
    const tags = tagsAffectedBy({ entity: 'service', slug: 'manutencao' })

    expect(tags).toContain('content:service:manutencao')
    expect(tags).toContain(CONTENT_TAGS.services)
    expect(tags).toContain(CONTENT_TAGS.navigation)
  })

  test('publicar um projeto invalida a navegação e a home', () => {
    // O primeiro projeto aprovado faz "Projetos" aparecer no menu e troca o
    // CTA secundário do hero. Sem invalidar a navegação, o menu ficaria
    // desatualizado até a expiração natural.
    const tags = tagsAffectedBy({ entity: 'project', slug: 'exemplo' })

    expect(tags).toContain(CONTENT_TAGS.navigation)
    expect(tags).toContain(CONTENT_TAGS.pages)
    expect(pathsAffectedBy({ entity: 'project', slug: 'exemplo' })).toContain('/')
  })

  test('publicar documento legal invalida o rodapé', () => {
    const tags = tagsAffectedBy({ entity: 'legal' })
    expect(tags).toContain(CONTENT_TAGS.footer)
  })

  test('uma alteração nunca invalida o site inteiro', () => {
    const everyTag = Object.values(CONTENT_TAGS)
    const tags = tagsAffectedBy({ entity: 'segment', slug: 'x' })

    expect(tags.length).toBeLessThan(everyTag.length)
  })

  test('o sitemap é revalidado sempre que uma rota entra ou sai', () => {
    for (const change of [
      { entity: 'service', slug: 'a' },
      { entity: 'segment', slug: 'b' },
      { entity: 'project', slug: 'c' },
      { entity: 'article', slug: 'd' },
      { entity: 'legal' },
    ] as const) {
      expect(pathsAffectedBy(change)).toContain('/sitemap.xml')
    }
  })

  test('o teto de expiração respeita os 60 segundos da especificação', () => {
    expect(PUBLIC_CONTENT_MAX_AGE_SECONDS).toBeLessThanOrEqual(60)
  })

  test('toda tag é prefixada, evitando colisão com tags de outros módulos', () => {
    for (const tag of Object.values(CONTENT_TAGS)) {
      expect(tag.startsWith('content:')).toBe(true)
    }
  })
})
