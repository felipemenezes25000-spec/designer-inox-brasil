import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

/**
 * Suíte de integração.
 *
 * Roda contra um PostgreSQL descartável real. `fileParallelism: false` é
 * obrigatório: os arquivos compartilham o mesmo banco e o mesmo schema, e
 * execução concorrente produziria corrida entre criação e limpeza de dados.
 *
 * As variáveis vêm exclusivamente de `.env.test`, carregado por
 * `vitest.integration.setup.ts`. Filtros passados após `npm run test:int --`
 * continuam selecionando subconjuntos de `tests/integration`.
 */
export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    name: 'integration',
    environment: 'node',
    globals: true,
    fileParallelism: false,
    setupFiles: ['./vitest.integration.setup.ts'],
    include: ['tests/integration/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['tests/unit/**', 'tests/e2e/**', 'node_modules/**'],
    testTimeout: 60_000,
    hookTimeout: 120_000,
  },
})
