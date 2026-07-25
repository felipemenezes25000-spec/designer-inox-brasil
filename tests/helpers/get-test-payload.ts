import { getPayload, type Payload } from 'payload'

import config from '@/payload.config'
import { isDisposableDatabase } from '@/lib/env/server'

let cached: Payload | null = null

/**
 * Instância única de Payload para a suíte de integração.
 *
 * O cache existe porque cada `getPayload` abre um pool de conexões; um pool
 * por arquivo de teste esgotaria os slots do PostgreSQL. A suíte roda com
 * `fileParallelism: false`, então compartilhar a instância é seguro.
 *
 * A guarda de banco descartável é repetida aqui de propósito: este helper é o
 * único caminho pelo qual um teste alcança o banco.
 */
export async function getTestPayload(): Promise<Payload> {
  if (cached) return cached

  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl || !isDisposableDatabase(databaseUrl)) {
    throw new Error('INTEGRATION_REQUIRES_DISPOSABLE_DATABASE')
  }

  cached = await getPayload({ config })
  return cached
}

/** Fecha o pool para que o processo de teste não fique pendurado. */
export async function closeTestPayload(): Promise<void> {
  if (!cached) return
  await cached.db.destroy?.()
  cached = null
}
