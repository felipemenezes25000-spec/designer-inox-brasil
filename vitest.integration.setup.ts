import { config as loadEnvFile } from 'dotenv'

/**
 * Carrega exclusivamente o arquivo apontado por `DOTENV_CONFIG_PATH`
 * (`.env.test`, definido no script `test:int`). Nenhum outro `.env` é
 * mesclado: a suíte de integração nunca deve alcançar o banco de
 * desenvolvimento por herança silenciosa de variável.
 */
const envPath = process.env.DOTENV_CONFIG_PATH ?? '.env.test'

loadEnvFile({ path: envPath, override: true })

if (!process.env.DATABASE_URL) {
  throw new Error(`INTEGRATION_ENV_NOT_LOADED: ${envPath} não definiu DATABASE_URL`)
}

if (!process.env.DATABASE_URL.endsWith('_test')) {
  throw new Error('INTEGRATION_REQUIRES_DISPOSABLE_DATABASE')
}
