# Proveniência tipográfica — Designer Inox Brasil

**Data de download:** 25 de julho de 2026
**Distribuição:** Fontsource 5.3.0
**Licença:** SIL Open Font License 1.1 — permite uso comercial, incorporação e redistribuição com
o arquivo de licença; não exige atribuição visível no site.

## Arquivos versionados

| Papel | Arquivo | Origem exata | SHA-256 |
|---|---|---|---|
| Títulos e indicadores | `src/assets/fonts/sora-latin.woff2` | `https://cdn.jsdelivr.net/fontsource/fonts/sora:vf@5.3.0/latin-wght-normal.woff2` | `FA26406EEDA9A3C6EC3D9EA8813C3045D6DC755E30C716D5C094E8EF43BE5A7F` |
| Texto corrido e interface | `src/assets/fonts/inter-latin.woff2` | `https://cdn.jsdelivr.net/fontsource/fonts/inter:vf@5.3.0/latin-wght-normal.woff2` | `3100E775E8616CD2611BEECFA23A4263D7037586789B43F035236A2E6FBD4C62` |

Ambas são fontes variáveis com subconjunto latino. Sora cobre o eixo de peso `100 800`; Inter
cobre `100 900`.

## Por que fontes locais

- Nenhuma requisição a terceiros na renderização, o que remove um vetor de rastreamento e uma
  dependência externa do caminho crítico de LCP.
- O peso do arquivo entra no orçamento de performance de forma previsível.
- O hash versionado permite provar que o glifo publicado é o glifo aprovado.

`src/styles/fonts.ts` expõe `headingFont` e `bodyFont` via `next/font/local`, com `display: swap`,
`preload: true` e as variáveis CSS `--font-heading` e `--font-body`.

## Verificação automatizada

`tests/unit/brand/logo-assets.test.ts` recalcula o SHA-256 dos dois arquivos e compara com
`assets/brand/logo-manifest.json`. Um arquivo trocado, corrompido ou atualizado sem decisão
explícita reprova a suíte.
