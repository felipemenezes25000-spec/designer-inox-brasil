#!/usr/bin/env node
/**
 * Wrapper do CLI do Payload.
 *
 * Existe para que geração de tipos e migrações não dependam do carregamento
 * implícito de ambiente do Next/Payload. Sem ele, rodar `payload migrate` a
 * partir de um shell com `.env` de desenvolvimento carregado aplicaria
 * migrações no banco errado sem aviso.
 *
 * Uso:
 *   node scripts/run-payload-cli.mjs --env .env.test \
 *     --schema-sync false --database-suffix _test -- migrate
 *
 * Garantias:
 *   - carrega SOMENTE o arquivo indicado em `--env`, sem mesclar outro `.env`;
 *   - valida `getServerEnv()` antes de importar ou spawnar o binário;
 *   - aplica o override explícito de `--schema-sync`;
 *   - confere `--database-suffix` quando fornecido;
 *   - recusa `migrate`, `migrate:create` e `migrate:status` com schema sync ativo;
 *   - spawn sem shell, exit code preservado, nenhum valor impresso.
 */

import { spawn } from 'node:child_process'
import { existsSync } from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

import { config as loadEnvFile } from 'dotenv'

export const MIGRATION_COMMANDS = new Set([
  'migrate',
  'migrate:create',
  'migrate:status',
  'migrate:down',
  'migrate:refresh',
  'migrate:reset',
  'migrate:fresh',
])

/**
 * Separa as opções do wrapper dos argumentos repassados ao Payload.
 *
 * @param {readonly string[]} argv
 * @returns {{envFile: string | null, schemaSync: string | null, databaseSuffix: string | null, payloadArgs: string[]}}
 */
export function parseWrapperArgs(argv) {
  const separator = argv.indexOf('--')
  const ownArgs = separator === -1 ? argv : argv.slice(0, separator)
  const payloadArgs = separator === -1 ? [] : argv.slice(separator + 1)

  let envFile = null
  let schemaSync = null
  let databaseSuffix = null

  for (let index = 0; index < ownArgs.length; index += 1) {
    const flag = ownArgs[index]
    const value = ownArgs[index + 1]

    if (flag === '--env') {
      envFile = value ?? null
      index += 1
    } else if (flag === '--schema-sync') {
      schemaSync = value ?? null
      index += 1
    } else if (flag === '--database-suffix') {
      databaseSuffix = value ?? null
      index += 1
    } else {
      throw new Error(`UNKNOWN_WRAPPER_FLAG: ${flag}`)
    }
  }

  return { envFile, schemaSync, databaseSuffix, payloadArgs }
}

/**
 * Verifica se o comando pedido é uma operação de migração.
 *
 * @param {readonly string[]} payloadArgs
 * @returns {boolean}
 */
export function isMigrationCommand(payloadArgs) {
  return payloadArgs.some((arg) => MIGRATION_COMMANDS.has(arg))
}

/**
 * Aplica as regras do wrapper sobre um ambiente já carregado.
 *
 * Separada da E/S para ser testável sem tocar disco, rede ou processo.
 *
 * @param {{env: NodeJS.ProcessEnv, schemaSyncOverride: string|null, databaseSuffix: string|null, payloadArgs: readonly string[], validateEnv: (source: NodeJS.ProcessEnv) => {DATABASE_URL: string, PAYLOAD_TEST_SCHEMA_SYNC: boolean}, resolvePush: (source: NodeJS.ProcessEnv) => boolean}} input
 * @returns {NodeJS.ProcessEnv} ambiente final para o processo filho
 */
export function resolveChildEnv({
  env,
  schemaSyncOverride,
  databaseSuffix,
  payloadArgs,
  validateEnv,
  resolvePush,
}) {
  const candidate = { ...env }

  if (schemaSyncOverride !== null) {
    if (schemaSyncOverride !== 'true' && schemaSyncOverride !== 'false') {
      throw new Error('INVALID_SCHEMA_SYNC_OVERRIDE')
    }
    // `PAYLOAD_SCHEMA_SYNC` é a autoridade sobre o `push` do adapter e chega
    // ao processo filho; `PAYLOAD_TEST_SCHEMA_SYNC` acompanha para que a
    // validação de ambiente enxergue o mesmo estado.
    candidate.PAYLOAD_SCHEMA_SYNC = schemaSyncOverride
    if (schemaSyncOverride === 'false') {
      candidate.PAYLOAD_TEST_SCHEMA_SYNC = 'false'
    }
  }

  const validated = validateEnv(candidate)

  if (databaseSuffix) {
    const databaseName = new URL(validated.DATABASE_URL).pathname.replace(/^\//, '')
    if (!databaseName.endsWith(databaseSuffix)) {
      throw new Error(`DATABASE_SUFFIX_MISMATCH: esperado sufixo "${databaseSuffix}"`)
    }
  }

  // A recusa considera o `push` EFETIVO, não apenas a flag de teste: rodar
  // uma migração com sincronização automática ligada geraria DDL vazio ou
  // divergente do estado real do banco.
  if (resolvePush(candidate) && isMigrationCommand(payloadArgs)) {
    throw new Error('MIGRATION_REFUSED_WITH_SCHEMA_SYNC')
  }

  return candidate
}

/* c8 ignore start -- camada de E/S exercitada pelos testes de integração */

const isDirectExecution =
  process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)

if (isDirectExecution) {
  const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
  const { envFile, schemaSync, databaseSuffix, payloadArgs } = parseWrapperArgs(
    process.argv.slice(2),
  )

  if (!envFile) {
    console.error('MISSING_ENV_FLAG: use --env <arquivo>')
    process.exit(1)
  }

  const envPath = path.resolve(repoRoot, envFile)
  if (!existsSync(envPath)) {
    console.error(`ENV_FILE_NOT_FOUND: ${envFile}`)
    process.exit(1)
  }

  // `processEnv: {}` impede o dotenv de escrever em `process.env`. O arquivo
  // indicado é a única fonte; nada do shell é herdado silenciosamente.
  const parsedEnv = {}
  const loaded = loadEnvFile({ path: envPath, processEnv: parsedEnv })
  if (loaded.error) {
    console.error(`ENV_FILE_UNREADABLE: ${envFile}`)
    process.exit(1)
  }

  // Fonte única de verdade da validação: o mesmo módulo usado pelo runtime.
  const { register } = await import('tsx/esm/api')
  const unregister = register()
  const { getServerEnv, shouldPushSchema } = await import('../src/lib/env/server.ts')
  await unregister()

  let childEnv
  try {
    childEnv = resolveChildEnv({
      env: parsedEnv,
      schemaSyncOverride: schemaSync,
      databaseSuffix,
      payloadArgs,
      validateEnv: getServerEnv,
      resolvePush: shouldPushSchema,
    })
  } catch (error) {
    console.error(error instanceof Error ? error.message : 'ENV_VALIDATION_FAILED')
    process.exit(1)
  }

  const payloadBin = path.join(repoRoot, 'node_modules', 'payload', 'bin.js')
  if (!existsSync(payloadBin)) {
    console.error('PAYLOAD_BIN_NOT_FOUND')
    process.exit(1)
  }

  // `shell: false` é obrigatório: os argumentos vêm de scripts npm e não podem
  // ser reinterpretados por um interpretador de comandos.
  const child = spawn(process.execPath, [payloadBin, ...payloadArgs], {
    cwd: repoRoot,
    shell: false,
    stdio: 'inherit',
    env: {
      // PATH e afins continuam necessários para o processo filho existir;
      // as variáveis de aplicação vêm exclusivamente do arquivo indicado.
      ...process.env,
      ...childEnv,
      NODE_OPTIONS: '--no-deprecation',
    },
  })

  child.on('error', (error) => {
    console.error(`PAYLOAD_CLI_SPAWN_FAILED: ${error.message}`)
    process.exit(1)
  })

  child.on('close', (code, signal) => {
    if (signal) {
      process.exit(1)
    }
    process.exit(code ?? 1)
  })
}

/* c8 ignore stop */
