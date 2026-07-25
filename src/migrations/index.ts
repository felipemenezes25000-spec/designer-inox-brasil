import * as migration_20260725_000001_foundation from './20260725_000001_foundation'

/**
 * Registro ordenado de migrações.
 *
 * A ordem deste array é o contrato de evolução do banco. Planos posteriores
 * ACRESCENTAM entradas (`20260725_000002_content_management`,
 * `20260725_000003_leads_privacy_security`); nenhuma migração já aplicada é
 * reescrita ou reordenada.
 */
export const migrations = [
  {
    up: migration_20260725_000001_foundation.up,
    down: migration_20260725_000001_foundation.down,
    name: '20260725_000001_foundation',
  },
]
