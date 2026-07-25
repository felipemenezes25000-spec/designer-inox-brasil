/**
 * Protocolo Lighthouse da seção 20 da especificação.
 *
 * `aggregationMethod: 'median'` é declarado explicitamente nas quatro
 * assertions. O padrão do Lighthouse CI é `optimistic`, que aprova quando a
 * MELHOR das execuções passa — o requisito é a mediana de três execuções.
 */
const NUMBER_OF_RUNS = 3

/** @type {Record<string, [string, {minScore: number, aggregationMethod: string}]>} */
const categoryAssertions = {
  'categories:performance': ['error', { minScore: 0.9, aggregationMethod: 'median' }],
  'categories:accessibility': ['error', { minScore: 0.95, aggregationMethod: 'median' }],
  'categories:best-practices': ['error', { minScore: 0.95, aggregationMethod: 'median' }],
  'categories:seo': ['error', { minScore: 0.95, aggregationMethod: 'median' }],
}

module.exports = {
  ci: {
    collect: {
      startServerCommand: 'npm run start',
      startServerReadyPattern: 'Ready in',
      startServerReadyTimeout: 180000,
      url: ['http://127.0.0.1:3000/'],
      numberOfRuns: NUMBER_OF_RUNS,
      // Sem `preset`: o perfil padrão do Lighthouse já é mobile com
      // throttling simulado, que é exatamente o protocolo da especificação.
      // Declarar `preset: 'desktop'` junto de `formFactor: 'mobile'` produz
      // uma medição incoerente.
      settings: {
        formFactor: 'mobile',
        throttlingMethod: 'simulate',
      },
    },
    assert: {
      assertions: categoryAssertions,
    },
    upload: {
      target: 'filesystem',
      outputDir: './.lighthouseci',
    },
  },
  // Exportado para que `tests/unit/quality/lighthouse-config.test.ts` possa
  // provar o comportamento da mediana sem executar o Lighthouse.
  categoryAssertions,
  numberOfRuns: NUMBER_OF_RUNS,
}
