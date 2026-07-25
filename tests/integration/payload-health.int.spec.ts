import { afterAll, beforeAll, describe, expect, test } from 'vitest'

import { closeTestPayload, getTestPayload } from '../helpers/get-test-payload'
import { buildTestEmail, cleanupSeededUsers, seedUser } from '../helpers/seed-user'

describe('baseline Payload sobre PostgreSQL', () => {
  beforeAll(async () => {
    await cleanupSeededUsers()
  })

  afterAll(async () => {
    await cleanupSeededUsers()
    await closeTestPayload()
  })

  test('o banco de teste é descartável', () => {
    expect(process.env.DATABASE_URL).toMatch(/_test$/)
  })

  test('expõe exatamente as coleções de aplicação da fundação', async () => {
    const payload = await getTestPayload()

    // As coleções `payload-*` são internas do CMS (migrações, preferências,
    // travas de edição, key-value) e existem independentemente da modelagem
    // do produto. A asserção cobre apenas o que a fundação declara.
    const applicationCollections = Object.keys(payload.collections)
      .filter((slug) => !slug.startsWith('payload-'))
      .sort()

    expect(applicationCollections).toEqual(['media', 'users'])
  })

  test('cria, consulta pelo ID e remove um usuário pela Local API', async () => {
    const payload = await getTestPayload()
    const email = buildTestEmail('saude')

    const created = await seedUser({ email })
    expect(created.id).toBeDefined()
    expect(created.email).toBe(email)

    const found = await payload.findByID({ collection: 'users', id: created.id })
    expect(found.id).toBe(created.id)

    await payload.delete({ collection: 'users', id: created.id })

    const remaining = await payload.find({
      collection: 'users',
      where: { email: { equals: email } },
    })
    expect(remaining.totalDocs).toBe(0)
  })

  test('o e-mail é único na coleção de usuários', async () => {
    const email = buildTestEmail('duplicado')
    await seedUser({ email })

    await expect(seedUser({ email })).rejects.toThrow()
  })

  test('a migração da fundação está registrada como aplicada', async () => {
    const payload = await getTestPayload()

    const applied = await payload.db.drizzle.execute(
      'select name from payload_migrations order by name asc',
    )
    const names = (applied.rows as Array<{ name: string }>).map((row) => row.name)

    expect(names).toContain('20260725_000001_foundation')
  })
})
