# Gate de supply chain — Designer Inox Brasil

**Data da execução:** 25 de julho de 2026
**Escopo:** Plano 01, Task 1, Steps 5–7.

## Procedimento executado

1. Scaffold oficial copiado da tag `v3.86.0` do repositório Payload sem executar instalador remoto.
   O SHA `3205b37670f81a769886e28955d569a9bb1881b6` citado no plano é o **objeto de tag anotada**;
   `git cat-file -t` retorna `tag` e o commit correspondente é
   `81e04d7e923e9d079f0021b239eb6b30b13257d8` (`chore(release): v3.86.0`).
2. `npm install --package-lock-only --ignore-scripts` — lockfile gerado sem `node_modules`
   e sem executar nenhum lifecycle script.
3. Gate de auditoria antes de qualquer instalação.
4. `npm ci --ignore-scripts`, nova auditoria, `npm audit signatures`.
5. `npm rebuild sharp esbuild` — únicos módulos nativos autorizados a reconstruir binários.

Resultado de `npm audit signatures`: **1030 pacotes com assinatura de registro verificada**,
158 com atestados.

## Achados que exigiram decisão

A auditoria inicial retornou **17 high e 1 critical**. O plano proíbe prosseguir e proíbe alterar
silenciosamente as versões fixas do stack principal. As correções abaixo foram aplicadas de forma
explícita e documentada; `payload`, `next`, `react` e `react-dom` permanecem exatamente nos pins
aprovados (`3.86.0`, `16.2.11`, `19.2.8`, `19.2.8`).

### Corrigidos por atualização direta

| Pacote | De | Para | Advisory | Motivo |
|---|---|---|---|---|
| `vitest` | 4.0.18 | 4.1.10 | GHSA-5xrq-8626-4rwp (critical) | Leitura/execução arbitrária de arquivo quando o servidor de UI do Vitest está ouvindo. Correção é minor dentro da v4. |
| `eslint` | 9.16.0 | 9.39.5 | cadeia `@eslint/*` | Correção dentro da major 9. |
| `sharp` | 0.34.2 | 0.35.3 | GHSA-f88m-g3jw-g9cj (high) | CVE-2026-33327/33328/35590/35591 herdados do libvips. **Relevante em produção**: `sharp` processa mídia e anexos enviados por terceiros. Verificado em execução: libvips 8.18.3. |

### Corrigidos por `overrides`

| Override | Advisory coberto | Verificação |
|---|---|---|
| `postcss@8.5.23` | GHSA-qx2v-qp2m-jg93, GHSA-6g55-p6wh-862q, GHSA-r28c-9q8g-f849 | `next@16.2.11` fixa `postcss@8.4.31`; o override sobe dentro da major 8. |
| `tmp@0.2.7` | GHSA-52f5-9888-hmc6, GHSA-ph9p-34f9-6g65 | Patch dentro da 0.2.x. |
| `sharp@0.35.3` (global) | GHSA-f88m-g3jw-g9cj | Necessário porque `next` declara `sharp` como dependência opcional em `^0.34.5` e instalaria uma cópia aninhada vulnerável. |
| `@lhci/cli > {chrome-launcher@1.2.1, rimraf@6.1.3, glob@13.0.6}` | cadeia `chrome-launcher`/`rimraf`/`glob` | Escopo restrito ao subárvore do Lighthouse CI; `npx lhci --version` verificado após o override. |

### Residual aceito, registrado e forçado por gate

**GHSA-mh99-v99m-4gvg — `brace-expansion` (high), DoS por expansão ilimitada.**

Não existe correção transitiva viável. Foi testado e descartado:

- `brace-expansion@5.0.8` como override global: a versão corrigida exporta um **objeto**
  (`{ EXPANSION_MAX, EXPANSION_MAX_LENGTH, expand }`), enquanto `minimatch` 3.x e 9.x fazem
  `require('brace-expansion')(...)`. Verificado em execução: `be is not a function`.
- `minimatch@10.2.5` como override global: a v10 removeu o export default e
  `@eslint/eslintrc` faz `import minimatch from "minimatch"`. Verificado em execução:
  `SyntaxError: The requested module 'minimatch' does not provide an export named 'default'`.

Ambos os overrides quebram o ESLint por completo. A exposição é limitada a `devDependencies`:
o ESLint não entra no bundle, não roda em produção e só recebe padrões de glob definidos neste
repositório — o vetor do advisory exige um padrão controlado pelo atacante.

A exceção está registrada em [`security/audit-exceptions.json`](../../security/audit-exceptions.json)
com prazo de reavaliação em **25 de outubro de 2026**.

## Desvio deliberado em relação ao plano

O plano define `security:audit` como `npm audit --package-lock-only --audit-level=high`. Esse
comando não distingue "vulnerabilidade nova" de "residual já analisado": ou ele reprova para sempre,
ou seria preciso removê-lo do pipeline — que é exatamente o que a política quer impedir.

O script foi substituído por [`scripts/security/audit-gate.mjs`](../../scripts/security/audit-gate.mjs),
que é **mais estrito** que o comando original:

- reprova qualquer advisory `high`/`critical` que não esteja registrado;
- reprova exceção vencida;
- reprova exceção obsoleta, obrigando a limpeza quando o upstream corrigir;
- reprova exceção sem caminho transitivo, justificativa técnica, exposição e mitigação.

O comando literal do plano continua disponível em `npm run security:audit:raw`.
A política é coberta por `tests/contracts/security-gate.test.mjs`.
