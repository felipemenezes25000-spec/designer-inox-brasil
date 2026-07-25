import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { Media } from './collections/Media'
import { Users } from './collections/Users'
import { getServerEnv, isDisposableDatabase, shouldPushSchema } from './lib/env/server'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const env = getServerEnv()

/**
 * Sincronização automática de schema (`push`) é destrutiva e contorna as
 * migrações versionadas. Ela só é aceita em dois casos:
 *   - desenvolvimento local, onde o banco é descartável por definição;
 *   - NODE_ENV=test com a flag explícita e banco terminado em `_test`.
 *
 * A checagem é repetida aqui, e não apenas em `getServerEnv`, porque este
 * arquivo é o último ponto antes de o adapter tocar o banco.
 */
const testSchemaSync = env.NODE_ENV === 'test' && env.PAYLOAD_TEST_SCHEMA_SYNC

if (testSchemaSync && !isDisposableDatabase(env.DATABASE_URL)) {
  throw new Error('TEST_SCHEMA_SYNC_REQUIRES_DISPOSABLE_DATABASE')
}

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: ' — Designer Inox Brasil',
    },
  },
  collections: [Users, Media],
  editor: lexicalEditor(),
  secret: env.PAYLOAD_SECRET,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    migrationDir: path.resolve(dirname, 'migrations'),
    pool: { connectionString: env.DATABASE_URL },
    push: shouldPushSchema(),
  }),
  sharp,
  plugins: [],
})
