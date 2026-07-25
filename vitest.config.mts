import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

/**
 * Suíte unitária.
 *
 * Dois projetos em vez de um ambiente único: componentes React precisam de
 * `jsdom`, enquanto validação de ambiente, scripts e geração de ativos rodam
 * em Node puro. O Vitest 4 removeu `environmentMatchGlobs`, então a separação
 * por projeto é a forma suportada de manter os dois ambientes na mesma suíte.
 *
 * Integração e E2E ficam fora daqui: `vitest.integration.config.mts` e
 * `playwright.config.ts`.
 */
export default defineConfig({
  test: {
    projects: [
      {
        plugins: [tsconfigPaths(), react()],
        test: {
          name: 'dom',
          environment: 'jsdom',
          globals: true,
          setupFiles: ['./vitest.setup.ts'],
          include: ['tests/unit/**/*.{test,spec}.tsx', 'src/**/*.{test,spec}.tsx'],
          exclude: ['tests/integration/**', 'tests/e2e/**', 'node_modules/**'],
        },
      },
      {
        plugins: [tsconfigPaths()],
        test: {
          name: 'node',
          environment: 'node',
          globals: true,
          setupFiles: ['./vitest.setup.ts'],
          include: [
            'tests/unit/**/*.{test,spec}.ts',
            'src/**/*.{test,spec}.ts',
            'scripts/**/*.test.ts',
          ],
          exclude: ['tests/integration/**', 'tests/e2e/**', 'node_modules/**'],
        },
      },
    ],
  },
})
