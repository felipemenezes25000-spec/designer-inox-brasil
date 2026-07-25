import { describe, expect, test } from 'vitest'

import {
  isMigrationCommand,
  parseWrapperArgs,
  resolveChildEnv,
} from '../../../scripts/run-payload-cli.mjs'
import { getServerEnv, shouldPushSchema } from '@/lib/env/server'

const DEV_DATABASE = 'postgres://designer_inox:local@127.0.0.1:5432/designer_inox'
const TEST_DATABASE = 'postgres://designer_inox:local@127.0.0.1:5433/designer_inox_test'
const SECRET = 'x'.repeat(32)

const devEnv: NodeJS.ProcessEnv = {
  NODE_ENV: 'development',
  DATABASE_URL: DEV_DATABASE,
  PAYLOAD_SECRET: SECRET,
}

const testEnv: NodeJS.ProcessEnv = {
  NODE_ENV: 'test',
  DATABASE_URL: TEST_DATABASE,
  PAYLOAD_SECRET: SECRET,
  PAYLOAD_TEST_SCHEMA_SYNC: 'true',
}

type ResolveInput = Omit<Parameters<typeof resolveChildEnv>[0], 'validateEnv' | 'resolvePush'>

const resolve = (input: ResolveInput) =>
  resolveChildEnv({ ...input, validateEnv: getServerEnv, resolvePush: shouldPushSchema })

describe('parseWrapperArgs', () => {
  test('separa opções do wrapper dos argumentos do Payload', () => {
    expect(
      parseWrapperArgs([
        '--env',
        '.env.test',
        '--schema-sync',
        'false',
        '--database-suffix',
        '_test',
        '--',
        'migrate',
        '--force',
      ]),
    ).toEqual({
      envFile: '.env.test',
      schemaSync: 'false',
      databaseSuffix: '_test',
      payloadArgs: ['migrate', '--force'],
    })
  })

  test('sem separador, nada é repassado ao Payload', () => {
    expect(parseWrapperArgs(['--env', '.env'])).toEqual({
      envFile: '.env',
      schemaSync: null,
      databaseSuffix: null,
      payloadArgs: [],
    })
  })

  test('rejeita opção desconhecida em vez de repassá-la silenciosamente', () => {
    expect(() => parseWrapperArgs(['--forca-bruta', 'x'])).toThrow('UNKNOWN_WRAPPER_FLAG')
  })
})

describe('isMigrationCommand', () => {
  test.each([
    [['migrate'], true],
    [['migrate:create', 'foundation'], true],
    [['migrate:status'], true],
    [['generate:types'], false],
    [['generate:importmap'], false],
  ])('%j -> %s', (args, expected) => {
    expect(isMigrationCommand(args as string[])).toBe(expected)
  })
})

describe('resolveChildEnv', () => {
  test('aceita geração de tipos em desenvolvimento', () => {
    const result = resolve({
      env: devEnv,
      schemaSyncOverride: null,
      databaseSuffix: null,
      payloadArgs: ['generate:types'],
    })

    expect(result.DATABASE_URL).toBe(DEV_DATABASE)
  })

  test('o override --schema-sync false desliga a flag do arquivo', () => {
    const result = resolve({
      env: testEnv,
      schemaSyncOverride: 'false',
      databaseSuffix: '_test',
      payloadArgs: ['migrate'],
    })

    expect(result.PAYLOAD_TEST_SCHEMA_SYNC).toBe('false')
    expect(result.PAYLOAD_SCHEMA_SYNC).toBe('false')
  })

  test('recusa migração enquanto o schema sync estiver ativo', () => {
    expect(() =>
      resolve({
        env: testEnv,
        schemaSyncOverride: null,
        databaseSuffix: '_test',
        payloadArgs: ['migrate'],
      }),
    ).toThrow('MIGRATION_REFUSED_WITH_SCHEMA_SYNC')
  })

  test('recusa migração em desenvolvimento, onde o push é ligado por padrão', () => {
    expect(() =>
      resolve({
        env: devEnv,
        schemaSyncOverride: null,
        databaseSuffix: null,
        payloadArgs: ['migrate:create', 'foundation'],
      }),
    ).toThrow('MIGRATION_REFUSED_WITH_SCHEMA_SYNC')
  })

  test('--schema-sync false libera migrate:create em desenvolvimento', () => {
    const result = resolve({
      env: devEnv,
      schemaSyncOverride: 'false',
      databaseSuffix: null,
      payloadArgs: ['migrate:create', 'foundation'],
    })

    expect(shouldPushSchema(result as NodeJS.ProcessEnv)).toBe(false)
  })

  test('recusa quando o banco não tem o sufixo exigido', () => {
    expect(() =>
      resolve({
        env: { ...devEnv, NODE_ENV: 'test' },
        schemaSyncOverride: 'false',
        databaseSuffix: '_test',
        payloadArgs: ['migrate'],
      }),
    ).toThrow('DATABASE_SUFFIX_MISMATCH')
  })

  test('recusa valor inválido de --schema-sync em vez de assumir false', () => {
    expect(() =>
      resolve({
        env: devEnv,
        schemaSyncOverride: 'talvez',
        databaseSuffix: null,
        payloadArgs: ['generate:types'],
      }),
    ).toThrow('INVALID_SCHEMA_SYNC_OVERRIDE')
  })

  test('propaga a validação de ambiente do runtime', () => {
    expect(() =>
      resolve({
        env: { NODE_ENV: 'development' } satisfies NodeJS.ProcessEnv,
        schemaSyncOverride: null,
        databaseSuffix: null,
        payloadArgs: ['generate:types'],
      }),
    ).toThrow('Missing required server environment variables: DATABASE_URL, PAYLOAD_SECRET')
  })

  test('nenhuma mensagem de erro expõe o segredo ou a senha do banco', () => {
    const senha = 'senha-do-banco-que-nao-pode-vazar'

    try {
      resolve({
        env: {
          NODE_ENV: 'test',
          DATABASE_URL: `postgres://designer_inox:${senha}@127.0.0.1:5432/designer_inox`,
          PAYLOAD_SECRET: SECRET,
          PAYLOAD_TEST_SCHEMA_SYNC: 'true',
        } satisfies NodeJS.ProcessEnv,
        schemaSyncOverride: null,
        databaseSuffix: null,
        payloadArgs: ['migrate'],
      })
      throw new Error('deveria ter lançado')
    } catch (error) {
      const message = (error as Error).message
      expect(message).not.toContain(senha)
      expect(message).not.toContain(SECRET)
    }
  })
})
