import type { User } from '@/payload-types'

import { getTestPayload } from './get-test-payload'

/**
 * Domínio reservado a testes.
 *
 * Todo usuário semeado usa este domínio, e a limpeza remove exatamente os
 * registros que o casam. Assim a suíte nunca apaga um usuário real por
 * engano, mesmo que apontasse para o banco errado.
 */
export const TEST_EMAIL_DOMAIN = 'teste.designerinox.invalid'

export type SeedUserInput = {
  email: string
  password: string
}

let sequence = 0

export function buildTestEmail(prefix = 'usuario'): string {
  sequence += 1
  return `${prefix}-${sequence}-${process.pid}@${TEST_EMAIL_DOMAIN}`
}

export async function seedUser(overrides: Partial<SeedUserInput> = {}): Promise<User> {
  const payload = await getTestPayload()

  return payload.create({
    collection: 'users',
    data: {
      email: overrides.email ?? buildTestEmail(),
      password: overrides.password ?? 'Senha-De-Teste-123',
    },
  })
}

/** Remove todos os usuários semeados por esta suíte. */
export async function cleanupSeededUsers(): Promise<void> {
  const payload = await getTestPayload()

  await payload.delete({
    collection: 'users',
    where: { email: { like: `@${TEST_EMAIL_DOMAIN}` } },
  })
}
