import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'
import nextTypescript from 'eslint-config-next/typescript'

/**
 * `eslint-config-next` 16 já publica flat configs.
 * Usamos os arrays diretamente em vez de `FlatCompat`, porque a camada de
 * compatibilidade do `@eslint/eslintrc` falha ao validar o plugin React
 * (estrutura circular) no ESLint 9.39.
 */
const eslintConfig = [
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'coverage/**',
      'playwright-report/**',
      'test-results/**',
      'blob-report/**',
      'src/payload-types.ts',
      'src/payload-generated-schema.ts',
      'src/app/(payload)/admin/importMap.js',
      'public/**',
      'assets/**',
    ],
  },
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    rules: {
      '@typescript-eslint/ban-ts-comment': 'warn',
      '@typescript-eslint/no-empty-object-type': 'warn',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          vars: 'all',
          args: 'after-used',
          ignoreRestSiblings: false,
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^(_|ignore)',
        },
      ],
    },
  },
  {
    files: ['scripts/**/*.mjs', 'tests/contracts/**/*.mjs'],
    rules: {
      'no-console': 'off',
    },
  },
  {
    // Migrações são geradas pelo `payload migrate:create` com uma assinatura
    // fixa (`{ db, payload, req }`). Nem toda migração usa os três, e renomear
    // parâmetros de arquivo gerado quebraria a próxima regeneração.
    files: ['src/migrations/**/*.ts'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
]

export default eslintConfig
