import { defineConfig, devices } from '@playwright/test'

/**
 * Matriz mínima de suporte da seção 20 da especificação.
 *
 * `127.0.0.1` em vez de `localhost` é deliberado: em Windows e Node 24 o
 * `localhost` resolve para IPv6 primeiro, e o servidor de desenvolvimento do
 * Next escuta em IPv4, o que produziria `ECONNREFUSED` intermitente.
 */
const BASE_URL = 'http://127.0.0.1:3000'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  /**
   * Teto de 4 workers.
   *
   * O padrão do Playwright é metade dos núcleos — 8 nesta máquina — e nesse
   * nível os navegadores competem com o servidor Next pelo mesmo CPU: as
   * navegações passam a estourar o timeout de forma não determinística.
   * Medido: 8 workers reprovaram 18 de 26 casos; 4 workers aprovaram 26 de 26
   * em 1,3 min. O gargalo é CPU local, não o produto.
   */
  workers: process.env.CI ? 1 : 4,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : [['list'], ['html', { open: 'never' }]],
  timeout: 60_000,
  expect: { timeout: 10_000 },
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'off',
    locale: 'pt-BR',
    timezoneId: 'America/Sao_Paulo',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'mobile-chromium', use: { ...devices['Pixel 7'] } },
    { name: 'mobile-webkit', use: { ...devices['iPhone 14'] } },
  ],
  webServer: {
    /**
     * Build de produção, não `next dev`.
     *
     * O servidor de desenvolvimento compila sob demanda e serializa a
     * compilação: com a suíte em paralelo, as primeiras navegações estouram o
     * timeout de forma não determinística — verificado, 24 de 26 casos
     * falharam por `page.goto` excedido, e todos passavam isoladamente.
     *
     * Além de estável, o build de produção é o artefato que o usuário
     * realmente recebe e o mesmo que o Lighthouse mede.
     */
    command: 'npm run build && npm run start',
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 300_000,
    stdout: 'ignore',
    stderr: 'pipe',
    env: {
      // `npm run start` roda em NODE_ENV=production, onde o repositório local
      // recusa servir por contrato. O opt-in explícito libera o conteúdo
      // semeado e continua proibindo indexação.
      CONTENT_SOURCE: 'seed',
      INDEX_PUBLIC_SITE: 'false',
    },
  },
})
