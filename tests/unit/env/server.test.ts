import { describe, expect, test } from 'vitest'

import { getServerEnv } from '@/lib/env/server'

const VALID_SECRET = 'a'.repeat(32)

describe('getServerEnv', () => {
  test('lista todas as variáveis ausentes de uma vez', () => {
    expect(() => getServerEnv({ NODE_ENV: 'test' })).toThrow(
      'Missing required server environment variables: DATABASE_URL, PAYLOAD_SECRET',
    )
  })

  test('retorna os quatro campos quando o ambiente é válido', () => {
    expect(
      getServerEnv({
        NODE_ENV: 'development',
        DATABASE_URL: 'postgres://designer_inox:senha@127.0.0.1:5432/designer_inox',
        PAYLOAD_SECRET: VALID_SECRET,
      }),
    ).toEqual({
      NODE_ENV: 'development',
      DATABASE_URL: 'postgres://designer_inox:senha@127.0.0.1:5432/designer_inox',
      PAYLOAD_SECRET: VALID_SECRET,
      PAYLOAD_TEST_SCHEMA_SYNC: false,
    })
  })

  test('PAYLOAD_TEST_SCHEMA_SYNC assume false fora de um banco descartável', () => {
    const env = getServerEnv({
      NODE_ENV: 'development',
      DATABASE_URL: 'postgres://designer_inox:senha@127.0.0.1:5432/designer_inox',
      PAYLOAD_SECRET: VALID_SECRET,
      PAYLOAD_TEST_SCHEMA_SYNC: 'true',
    })

    expect(env.PAYLOAD_TEST_SCHEMA_SYNC).toBe(false)
  })

  test('PAYLOAD_TEST_SCHEMA_SYNC só pode ser ligado em NODE_ENV=test com banco _test', () => {
    const env = getServerEnv({
      NODE_ENV: 'test',
      DATABASE_URL: 'postgres://designer_inox:senha@127.0.0.1:5433/designer_inox_test',
      PAYLOAD_SECRET: VALID_SECRET,
      PAYLOAD_TEST_SCHEMA_SYNC: 'true',
    })

    expect(env.PAYLOAD_TEST_SCHEMA_SYNC).toBe(true)
  })

  test('recusa schema sync em NODE_ENV=test apontando para banco não descartável', () => {
    expect(() =>
      getServerEnv({
        NODE_ENV: 'test',
        DATABASE_URL: 'postgres://designer_inox:senha@127.0.0.1:5432/designer_inox',
        PAYLOAD_SECRET: VALID_SECRET,
        PAYLOAD_TEST_SCHEMA_SYNC: 'true',
      }),
    ).toThrow('TEST_SCHEMA_SYNC_REQUIRES_DISPOSABLE_DATABASE')
  })

  test('em produção recusa segredo curto sem imprimir o valor', () => {
    const shortSecret = 'segredo-curto'

    try {
      getServerEnv({
        NODE_ENV: 'production',
        DATABASE_URL: 'postgres://usuario:senha@db.interno:5432/designer_inox',
        PAYLOAD_SECRET: shortSecret,
      })
      throw new Error('deveria ter lançado')
    } catch (error) {
      const message = (error as Error).message
      expect(message).toContain('PAYLOAD_SECRET')
      expect(message).not.toContain(shortSecret)
    }
  })

  test('recusa DATABASE_URL que não seja PostgreSQL', () => {
    expect(() =>
      getServerEnv({
        NODE_ENV: 'development',
        DATABASE_URL: 'mongodb://127.0.0.1:27017/designer_inox',
        PAYLOAD_SECRET: VALID_SECRET,
      }),
    ).toThrow('DATABASE_URL')
  })

  test('não vaza a senha da conexão na mensagem de erro', () => {
    const senha = 'senha-super-secreta-do-banco'

    try {
      getServerEnv({
        NODE_ENV: 'development',
        DATABASE_URL: `mysql://usuario:${senha}@127.0.0.1:3306/designer_inox`,
        PAYLOAD_SECRET: VALID_SECRET,
      })
      throw new Error('deveria ter lançado')
    } catch (error) {
      expect((error as Error).message).not.toContain(senha)
    }
  })

  test('recusa NODE_ENV desconhecido', () => {
    // O cast é necessário porque os tipos do Next estreitam `NODE_ENV` para a
    // união válida; o teste existe justamente para cobrir o valor inválido que
    // chega em runtime a partir de um `.env` mal configurado.
    const source = {
      NODE_ENV: 'staging',
      DATABASE_URL: 'postgres://designer_inox:senha@127.0.0.1:5432/designer_inox',
      PAYLOAD_SECRET: VALID_SECRET,
    } as unknown as NodeJS.ProcessEnv

    expect(() => getServerEnv(source)).toThrow('NODE_ENV')
  })
})
