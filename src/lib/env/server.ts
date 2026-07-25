/**
 * Validação do ambiente de servidor.
 *
 * Este módulo nunca imprime valores. Segredo e senha de conexão não podem
 * aparecer em log de build, saída de CI ou mensagem de erro — por isso as
 * mensagens citam apenas o NOME da variável e, no caso da URL, apenas o
 * protocolo e o nome do banco.
 */

export type NodeEnvironment = 'development' | 'test' | 'production'

export interface ServerEnv {
  DATABASE_URL: string
  PAYLOAD_SECRET: string
  NODE_ENV: NodeEnvironment
  PAYLOAD_TEST_SCHEMA_SYNC: boolean
}

const NODE_ENVIRONMENTS: readonly NodeEnvironment[] = ['development', 'test', 'production']

const POSTGRES_PROTOCOLS = new Set(['postgres:', 'postgresql:'])

/** Comprimento mínimo do segredo do Payload em produção. */
export const MINIMUM_PRODUCTION_SECRET_LENGTH = 32

/** Sufixo obrigatório do banco quando o schema sync automático está ligado. */
export const DISPOSABLE_DATABASE_SUFFIX = '_test'

/**
 * Extrai o nome do banco sem expor usuário, senha nem host.
 * Retorna `null` quando a URL não é analisável.
 */
export function describeDatabase(databaseUrl: string): string | null {
  try {
    const url = new URL(databaseUrl)
    return url.pathname.replace(/^\//, '') || null
  } catch {
    return null
  }
}

/**
 * Indica se a URL aponta para um banco descartável, isto é, cujo nome termina
 * em `_test`. Só nesses bancos o Payload pode sincronizar schema sem migração.
 */
export function isDisposableDatabase(databaseUrl: string): boolean {
  return describeDatabase(databaseUrl)?.endsWith(DISPOSABLE_DATABASE_SUFFIX) ?? false
}

function parseBoolean(value: string | undefined): boolean {
  return value === 'true' || value === '1'
}

/**
 * Decide se o adapter pode sincronizar schema automaticamente (`push`).
 *
 * Regra: ligado por padrão em desenvolvimento e em teste descartável; sempre
 * desligado quando `PAYLOAD_SCHEMA_SYNC=false`. Esse override existe porque
 * `payload migrate:create` só produz DDL correto comparando a configuração
 * com um banco NÃO sincronizado — com push ligado, o banco já estaria no
 * estado final e a migração sairia vazia.
 *
 * É a mesma função usada pelo `payload.config.ts` e pelo wrapper de CLI, para
 * que os dois nunca discordem sobre o estado efetivo do push.
 */
export function shouldPushSchema(source: NodeJS.ProcessEnv = process.env): boolean {
  if (source.PAYLOAD_SCHEMA_SYNC === 'false') return false

  const env = getServerEnv(source)
  return env.NODE_ENV === 'development' || env.PAYLOAD_TEST_SCHEMA_SYNC
}

/**
 * Lê e valida o ambiente de servidor.
 *
 * @param source mapa de variáveis; `process.env` por padrão. Receber a fonte
 *   por parâmetro é o que torna a função testável sem mutar o processo.
 * @throws Error com todas as variáveis ausentes em uma única mensagem.
 */
export function getServerEnv(source: NodeJS.ProcessEnv = process.env): ServerEnv {
  const missing: string[] = []
  if (!source.DATABASE_URL) missing.push('DATABASE_URL')
  if (!source.PAYLOAD_SECRET) missing.push('PAYLOAD_SECRET')

  if (missing.length > 0) {
    throw new Error(`Missing required server environment variables: ${missing.join(', ')}`)
  }

  const nodeEnv = (source.NODE_ENV ?? 'development') as NodeEnvironment
  if (!NODE_ENVIRONMENTS.includes(nodeEnv)) {
    throw new Error(
      `NODE_ENV inválido. Valores aceitos: ${NODE_ENVIRONMENTS.join(', ')}.`,
    )
  }

  const databaseUrl = source.DATABASE_URL as string
  let protocol: string
  try {
    protocol = new URL(databaseUrl).protocol
  } catch {
    throw new Error('DATABASE_URL não é uma URL válida.')
  }

  if (!POSTGRES_PROTOCOLS.has(protocol)) {
    throw new Error(
      `DATABASE_URL precisa usar PostgreSQL. Protocolo recebido: "${protocol}". ` +
        'SQLite e MongoDB não são suportados fora de testes isolados.',
    )
  }

  const secret = source.PAYLOAD_SECRET as string
  if (nodeEnv === 'production' && secret.length < MINIMUM_PRODUCTION_SECRET_LENGTH) {
    throw new Error(
      `PAYLOAD_SECRET precisa de ao menos ${MINIMUM_PRODUCTION_SECRET_LENGTH} caracteres em ` +
        `produção; recebeu ${secret.length}.`,
    )
  }

  const requestedSchemaSync = parseBoolean(source.PAYLOAD_TEST_SCHEMA_SYNC)

  // Fora de NODE_ENV=test a flag é simplesmente ignorada: ligar sincronização
  // de schema em desenvolvimento ou produção contornaria as migrações
  // versionadas, que são o contrato de evolução do banco.
  if (requestedSchemaSync && nodeEnv !== 'test') {
    return {
      DATABASE_URL: databaseUrl,
      PAYLOAD_SECRET: secret,
      NODE_ENV: nodeEnv,
      PAYLOAD_TEST_SCHEMA_SYNC: false,
    }
  }

  // Dentro de NODE_ENV=test a flag é um erro explícito quando o banco não é
  // descartável, porque apagaria o schema de um banco real.
  if (requestedSchemaSync && !isDisposableDatabase(databaseUrl)) {
    throw new Error('TEST_SCHEMA_SYNC_REQUIRES_DISPOSABLE_DATABASE')
  }

  return {
    DATABASE_URL: databaseUrl,
    PAYLOAD_SECRET: secret,
    NODE_ENV: nodeEnv,
    PAYLOAD_TEST_SCHEMA_SYNC: requestedSchemaSync,
  }
}
