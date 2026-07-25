# Designer Inox — Plano 1: Fundação Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Entregar a fundação executável e testada da Designer Inox: scaffold oficial Payload/Next com PostgreSQL, lockfile auditado, identidade derivada do master, design tokens, componentes-base e shell responsivo acessível.

**Architecture:** Monólito modular em Next.js App Router, com Payload no mesmo processo e PostgreSQL como banco relacional. O shell recebe navegação já hidratada por propriedades síncronas e não conhece Payload; isso mantém CMS, apresentação e futuras consultas públicas desacoplados.

**Tech Stack:** Payload CMS 3.86.0, Next.js 16.2.11, React/React DOM 19.2.8, TypeScript, PostgreSQL, Node.js 24.14.0, npm 11.9.0, Vitest, Testing Library, Playwright, axe-core, Lighthouse CI e Sharp.

## Global Constraints

- Node.js `24.14.0`; `package.json` usa `engines.node: ">=24.14.0 <25"`, `.nvmrc` e `.node-version` fixam `24.14.0`.
- `packageManager: "npm@11.9.0"`; somente npm e `package-lock.json`.
- Payload e todos os pacotes `@payloadcms/*` em `3.86.0`.
- Next.js e `eslint-config-next` em `16.2.11`.
- React e React DOM em `19.2.8`.
- Scaffold oficial `blank` copiado do commit Payload `3205b37670f81a769886e28955d569a9bb1881b6` (tag `v3.86.0`), sem executar um instalador remoto.
- O master `D:\LOGO OFICIALL.png` permanece byte a byte intacto.
- Sonatype está indisponível por falta de autenticação; nenhum lifecycle de dependência da aplicação roda antes de `npm audit --package-lock-only --audit-level=high` retornar zero vulnerabilidades altas ou críticas.
- WCAG 2.2 AA; alvos interativos mínimos de `44 × 44 CSS px`; layout sem quebra a partir de 320 px.
- Sora em títulos e Inter em texto/interface.
- Verde `#25D366` somente para WhatsApp.
- Nenhuma alegação, cliente, certificação, métrica ou dado empresarial ausente é inventado.
- O scaffold cria apenas `Users` e `Media`; RBAC, TOTP e auditoria pertencem ao plano de gestão e entram por migração incremental.

---

## File Map

### Scaffold e configuração

- Create: `package.json`
- Create: `package-lock.json`
- Create: `.npmrc`
- Create: `.nvmrc`
- Create: `.node-version`
- Create: `.env.example`
- Create: `.env.test.example`
- Modify: `.gitignore`
- Create: `compose.yaml`
- Create: `next.config.ts`
- Create: `tsconfig.json`
- Create: `eslint.config.mjs`
- Create: `.prettierrc.json`
- Create: `vitest.config.mts`
- Create: `vitest.integration.config.mts`
- Create: `vitest.setup.ts`
- Create: `playwright.config.ts`
- Create: `lighthouserc.cjs`
- Create: `.github/workflows/quality.yml`

### Payload

- Create: `src/payload.config.ts`
- Create: `src/payload-types.ts`
- Create: `src/collections/Users.ts`
- Create: `src/collections/Media.ts`
- Create: `src/lib/env/server.ts`
- Create: `src/migrations/20260725_000001_foundation.ts`
- Create: `src/migrations/index.ts`
- Create: `scripts/run-payload-cli.mjs`
- Preserve official Payload route files under `src/app/(payload)/`.

### Marca e estilos

- Create: `assets/brand/source/logo-official.png`
- Create: `assets/brand/derived/symbol-isolated.png`
- Create: `assets/brand/logo-manifest.json`
- Create: `scripts/brand/generate-logo-assets.mjs`
- Create: `docs/brand/logo-provenance.md`
- Create: `docs/brand/logo-validation.md`
- Create: `docs/brand/font-provenance.md`
- Create: `public/brand/symbol-positive.{png,webp,avif}`
- Create: `public/brand/symbol-negative.{png,webp,avif}`
- Create: `public/brand/lockup-positive.{png,webp,avif}`
- Create: `public/brand/lockup-negative.{png,webp,avif}`
- Create: `public/brand/icon-16.png`
- Create: `public/brand/icon-32.png`
- Create: `public/brand/icon-180.png`
- Create: `src/app/(frontend)/icon.png`
- Create: `src/app/(frontend)/apple-icon.png`
- Create: `src/assets/fonts/sora-latin.woff2`
- Create: `src/assets/fonts/inter-latin.woff2`
- Create: `src/styles/fonts.ts`
- Create: `src/styles/tokens.css`
- Create: `src/styles/tokens.ts`
- Create: `src/styles/reset.css`
- Create: `src/styles/globals.css`
- Create: `src/styles/utilities.css`

### Componentes e shell

- Create: `src/components/ui/Button.tsx`
- Create: `src/components/ui/Button.module.css`
- Create: `src/components/ui/Container.tsx`
- Create: `src/components/ui/Container.module.css`
- Create: `src/components/ui/Brand.tsx`
- Create: `src/components/ui/FoldLine.tsx`
- Create: `src/components/ui/SkipLink.tsx`
- Create: `src/components/ui/Field.tsx`
- Create: `src/components/ui/FilePicker.tsx`
- Create: `src/components/ui/Dialog.tsx`
- Create: `src/components/ui/CopyButton.tsx`
- Create: `src/components/layout/navigation.ts`
- Create: `src/components/layout/SiteShell.tsx`
- Create: `src/components/layout/SiteHeader.tsx`
- Create: `src/components/layout/MobileNavigation.tsx`
- Create: `src/components/layout/SiteFooter.tsx`
- Create: `src/components/layout/SiteShell.module.css`
- Create: `src/config/foundation-navigation.ts`
- Modify: `src/app/(frontend)/layout.tsx`
- Modify: `src/app/(frontend)/page.tsx`

### Testes

- Create: `tests/contracts/scaffold.test.mjs`
- Create: `tests/helpers/get-test-payload.ts`
- Create: `tests/helpers/seed-user.ts`
- Create: `tests/helpers/login.ts`
- Create: `tests/helpers/render.tsx`
- Create: `tests/helpers/a11y.ts`
- Create: `tests/fixtures/viewports.ts`
- Create: `tests/unit/env/server.test.ts`
- Create: `tests/unit/scripts/run-payload-cli.test.ts`
- Create: `tests/unit/brand/logo-assets.test.ts`
- Create: `tests/unit/styles/tokens.test.ts`
- Create: `tests/unit/components/Button.test.tsx`
- Create: `tests/unit/components/Brand.test.tsx`
- Create: `tests/unit/components/Field.test.tsx`
- Create: `tests/unit/components/FilePicker.test.tsx`
- Create: `tests/unit/components/Dialog.test.tsx`
- Create: `tests/unit/components/CopyButton.test.tsx`
- Create: `tests/unit/layout/SiteShell.test.tsx`
- Create: `tests/integration/payload-health.int.spec.ts`
- Create: `tests/e2e/shell-keyboard.e2e.spec.ts`
- Create: `tests/e2e/shell-responsive.e2e.spec.ts`
- Create: `tests/e2e/accessibility.e2e.spec.ts`

---

### Task 1: Scaffold oficial, pins e gate de supply chain

**Interfaces**

- Consumes: repositório contendo apenas a especificação e Git.
- Produces: aplicação oficial Payload/Next, `package-lock.json` auditado e scripts estáveis usados pelos demais planos.

- [ ] **Step 1: Copiar o scaffold oficial sem executar dependências**

```powershell
$templateDir = Join-Path (Get-Location) '.payload-template'
git clone --filter=blob:none --no-checkout https://github.com/payloadcms/payload.git $templateDir
if ($LASTEXITCODE -ne 0) { throw 'Falha ao clonar o template Payload' }
git -C $templateDir sparse-checkout init --cone
git -C $templateDir sparse-checkout set templates/blank
git -C $templateDir checkout 3205b37670f81a769886e28955d569a9bb1881b6
if ($LASTEXITCODE -ne 0) { throw 'Falha ao fixar o commit oficial do Payload' }
Get-ChildItem -LiteralPath (Join-Path $templateDir 'templates/blank') -Force |
  Copy-Item -Destination (Get-Location) -Recurse -Force
$resolvedTemplate = (Resolve-Path -LiteralPath $templateDir).Path
$resolvedRoot = (Resolve-Path -LiteralPath '.').Path
if (-not $resolvedTemplate.StartsWith("$resolvedRoot\")) { throw 'Diretório temporário fora do workspace' }
Remove-Item -LiteralPath $resolvedTemplate -Recurse -Force
```

Expected: `git rev-parse HEAD` dentro do clone retorna o SHA fixado; `docs/` e `.git/` permanecem intactos; nenhum `node_modules` ou lockfile é criado. Substituir o adapter Mongo oficial por `@payloadcms/db-postgres` na Step 3; preservar os route handlers oficiais sob `src/app/(payload)/`.

- [ ] **Step 2: Escrever o contrato inicialmente falho**

`tests/contracts/scaffold.test.mjs` deve ler `package.json` e afirmar:

```js
assert.equal(pkg.packageManager, 'npm@11.9.0')
assert.equal(pkg.engines.node, '>=24.14.0 <25')
assert.equal(pkg.dependencies.payload, '3.86.0')
assert.equal(pkg.dependencies['@payloadcms/next'], '3.86.0')
assert.equal(pkg.dependencies['@payloadcms/db-postgres'], '3.86.0')
assert.equal(pkg.dependencies.next, '16.2.11')
assert.equal(pkg.dependencies.react, '19.2.8')
assert.equal(pkg.dependencies['react-dom'], '19.2.8')
assert.doesNotMatch(JSON.stringify(pkg.scripts), /\bpnpm\b|\byarn\b/)
```

Run: `node --test tests/contracts/scaffold.test.mjs`
Expected: FAIL nos pins originais `16.2.6`/`19.2.6`, scripts pnpm e ausência de `packageManager`.

- [ ] **Step 3: Fixar manifest e scripts**

Manter os pacotes oficiais do template, todos sem intervalos:

```text
payload/@payloadcms/* 3.86.0
next/eslint-config-next 16.2.11
react/react-dom 19.2.8
cross-env 7.0.3
dotenv 16.4.7
graphql 16.8.1
sharp 0.34.2
@playwright/test 1.58.2
@testing-library/react 16.3.0
@testing-library/dom 10.4.1
@testing-library/user-event 14.6.1
@testing-library/jest-dom 6.9.1
@axe-core/playwright 4.12.1
@lhci/cli 0.15.1
zod 4.4.3
vitest 4.0.18
jsdom 28.0.0
typescript 5.7.3
tsx 4.22.4
```

Scripts públicos:

```json
{
  "lint": "eslint .",
  "typecheck": "tsc --noEmit",
  "test:contracts": "node --test tests/contracts/*.test.mjs",
  "test:unit": "vitest run --config ./vitest.config.mts",
  "test:int": "cross-env NODE_ENV=test DOTENV_CONFIG_PATH=.env.test vitest run --config ./vitest.integration.config.mts",
  "test:e2e": "cross-env NODE_OPTIONS=--no-deprecation playwright test --config=playwright.config.ts",
  "test:a11y": "playwright test tests/e2e/accessibility.e2e.spec.ts",
  "test:responsive": "playwright test tests/e2e/shell-responsive.e2e.spec.ts",
  "security:audit": "npm audit --package-lock-only --audit-level=high",
  "security:signatures": "npm audit signatures",
  "brand:generate": "node scripts/brand/generate-logo-assets.mjs",
  "generate:types": "node scripts/run-payload-cli.mjs --env .env -- generate:types",
  "generate:importmap": "node scripts/run-payload-cli.mjs --env .env -- generate:importmap",
  "payload": "node scripts/run-payload-cli.mjs --env .env --",
  "migrate": "node scripts/run-payload-cli.mjs --env .env --schema-sync false -- migrate",
  "migrate:create": "node scripts/run-payload-cli.mjs --env .env --schema-sync false -- migrate:create",
  "migrate:status": "node scripts/run-payload-cli.mjs --env .env --schema-sync false -- migrate:status",
  "migrate:test": "node scripts/run-payload-cli.mjs --env .env.test --schema-sync false --database-suffix _test -- migrate",
  "lighthouse": "lhci autorun --config=lighthouserc.cjs",
  "verify": "npm run lint && npm run typecheck && npm run test:contracts && npm run test:unit && npm run test:int && npm run build && npm run test:e2e && npm run lighthouse"
}
```

- [ ] **Step 4: Confirmar contrato**

Run: `node --test tests/contracts/scaffold.test.mjs`
Expected: PASS.

- [ ] **Step 5: Criar lockfile sem executar lifecycle scripts**

Run: `npm install --package-lock-only --ignore-scripts`
Expected: `package-lock.json` criado e `node_modules` ausente.

- [ ] **Step 6: Executar o gate compensatório**

Run: `npm run security:audit`
Expected: exit code `0`, zero vulnerabilidades `high` e `critical`. Se falhar, interromper antes de `npm ci` e registrar pacote, caminho transitivo e advisory; versões fixas do stack principal não são alteradas silenciosamente.

- [ ] **Step 7: Instalar exatamente o lock aprovado**

Run: `npm ci --ignore-scripts`, seguido de novo `npm run security:audit` e `npm run security:signatures`; só então executar `npm rebuild sharp esbuild`.
Expected: instalação concluída sem mudar `package.json` ou `package-lock.json`; os únicos lifecycle scripts liberados após o gate são os módulos nativos enumerados em `.npmrc` e no lockfile.

- [ ] **Step 8: Commit**

```bash
git add package.json package-lock.json .npmrc .nvmrc .node-version tests/contracts/scaffold.test.mjs src
git commit -m "chore: scaffold Payload foundation with audited npm lock"
```

---

### Task 2: Harness de testes e pipeline de qualidade

**Interfaces**

- Produces:
  - `renderWithProviders(ui: ReactElement): RenderResult`
  - `expectNoA11yViolations(page: Page): Promise<void>`
  - `SUPPORTED_VIEWPORTS: readonly ViewportCase[]`
  - scripts `test:contracts`, `test:unit`, `test:int`, `test:e2e`, `test:a11y`, `test:responsive`, `lighthouse`.

- [ ] **Step 1: Escrever teste falho do helper React**

```tsx
const result = renderWithProviders(<button>Salvar</button>)
expect(result.getByRole('button', { name: 'Salvar' })).not.toBeNull()
```

Run: `npm run test:unit -- tests/unit/test-harness.test.tsx`
Expected: FAIL, módulo `tests/helpers/render` inexistente.

- [ ] **Step 2: Implementar os helpers**

`renderWithProviders` chama `render(ui)` e devolve `RenderResult`.
`expectNoA11yViolations` executa `new AxeBuilder({ page }).analyze()` e exige `violations` igual a `[]`.

`vitest.config.mts` inclui `tests/unit/**/*.{test,spec}.{ts,tsx}`, `src/**/*.{test,spec}.{ts,tsx}` e `scripts/**/*.test.ts`, exclui `tests/integration/**` e `tests/e2e/**`, usa `jsdom` para `*.tsx` e carrega `vitest.setup.ts`. O setup importa `@testing-library/jest-dom/vitest`, limpa o DOM após cada teste e restaura mocks. `vitest.integration.config.mts` inclui somente `tests/integration/**/*.{test,spec}.{ts,tsx}`, usa ambiente Node, carrega `.env.test`, desativa paralelismo de arquivos para proteger o banco compartilhado do worker e exclui E2E; filtros passados depois de `npm run test:int --` continuam selecionando subconjuntos desse diretório.

`SUPPORTED_VIEWPORTS`:

```ts
export const SUPPORTED_VIEWPORTS = [
  { name: '320', width: 320, height: 800 },
  { name: '360', width: 360, height: 800 },
  { name: '390', width: 390, height: 844 },
  { name: '768', width: 768, height: 1024 },
  { name: '1024', width: 1024, height: 768 },
  { name: '1440', width: 1440, height: 900 },
  { name: '1920', width: 1920, height: 1080 },
] as const
```

- [ ] **Step 3: Configurar Playwright**

`baseURL: http://127.0.0.1:3000`, `webServer.command: npm run dev`, projetos Chromium, Firefox e WebKit; mobile Chromium e mobile WebKit; trace somente na primeira repetição.

- [ ] **Step 4: Configurar CI**

`quality.yml` deve executar, nesta ordem:

```text
checkout
setup-node com cache npm
npm run security:audit
npm ci --ignore-scripts
npm run security:audit
npm run security:signatures
npm rebuild sharp esbuild
cp .env.example .env
cp .env.test.example .env.test
docker compose up -d db-test
npm run migrate:test
npm run generate:types
npm run lint
npm run typecheck
npm run test:contracts
npm run test:unit
npm run test:int
npm run build
npx playwright install --with-deps chromium firefox webkit
npm run test:e2e
npm run lighthouse
```

- [ ] **Step 5: Verificar**

Run: `npm run test:unit`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add vitest.config.mts vitest.integration.config.mts vitest.setup.ts playwright.config.ts lighthouserc.cjs .github tests/helpers tests/fixtures
git commit -m "test: establish unit integration e2e and quality harness"
```

---

### Task 3: PostgreSQL e Payload mínimo migrável

**Interfaces**

- Produces:
  - `getServerEnv(source?: NodeJS.ProcessEnv): ServerEnv`
  - `getTestPayload(): Promise<Payload>`
  - `seedUser(overrides?: Partial<SeedUserInput>): Promise<User>`
  - `cleanupSeededUsers(): Promise<void>`
  - coleções `users` e `media`.
- Consumed later: Plano 3 modifica `Users.ts` e cria migração incremental para RBAC/TOTP/auditoria; não reescreve a baseline.

- [ ] **Step 1: Testar validação de ambiente**

Casos:

```ts
expect(() => getServerEnv({ NODE_ENV: 'test' })).toThrow(
  'Missing required server environment variables: DATABASE_URL, PAYLOAD_SECRET',
)
```

e um ambiente válido retorna os quatro campos, com `PAYLOAD_TEST_SCHEMA_SYNC` default `false` fora do teste descartável.

Run: `npm run test:unit -- tests/unit/env/server.test.ts`
Expected: FAIL, módulo inexistente.

- [ ] **Step 2: Implementar contrato**

```ts
export type NodeEnvironment = 'development' | 'test' | 'production'

export interface ServerEnv {
  DATABASE_URL: string
  PAYLOAD_SECRET: string
  NODE_ENV: NodeEnvironment
  PAYLOAD_TEST_SCHEMA_SYNC: boolean
}

export function getServerEnv(
  source: NodeJS.ProcessEnv = process.env,
): ServerEnv
```

Em produção, `PAYLOAD_SECRET` com menos de 32 caracteres deve falhar sem imprimir seu valor.

- [ ] **Step 3: Configurar Postgres**

`src/payload.config.ts` usa:

```ts
const testSchemaSync = env.NODE_ENV === 'test' && env.PAYLOAD_TEST_SCHEMA_SYNC
if (testSchemaSync && !new URL(env.DATABASE_URL).pathname.endsWith('_test')) {
  throw new Error('TEST_SCHEMA_SYNC_REQUIRES_DISPOSABLE_DATABASE')
}

postgresAdapter({
  migrationDir: path.resolve(dirname, 'migrations'),
  pool: { connectionString: env.DATABASE_URL },
  push: env.NODE_ENV === 'development' || testSchemaSync,
})
```

Registra somente `Users` e `Media`; preserva `lexicalEditor`, Sharp, import map e geração de `payload-types.ts`.

- [ ] **Step 4: Configurar bancos isolados**

`compose.yaml` expõe `db` em `5432` e `db-test` em `5433`. `.env.example` e `.env.test.example` contêm apenas credenciais locais descartáveis e placeholders de segredo. `.env.test.example` define `PAYLOAD_TEST_SCHEMA_SYNC=true`; o helper de integração recria somente o schema do banco cujo nome termina em `_test`. Testes de migration forçam a flag para `false` e usam exclusivamente as migrations versionadas. `.gitignore` inclui literalmente `.env`, `.env.*` com exceção dos dois `*.example` e os testes de contrato falham se arquivos locais forem rastreados.

`scripts/run-payload-cli.mjs` carrega somente o arquivo indicado com `dotenv`, sem merge silencioso de outro `.env`; valida `getServerEnv()` antes de importar/spawnar o binário Payload, aplica o override explícito `--schema-sync`, confere `--database-suffix` quando fornecido e recusa migration/create/status com schema sync ativo. Ele repassa argumentos após `--`, usa spawn sem shell, preserva exit code e nunca imprime valores. Assim, CLI de tipos/migration não depende do carregamento implícito de env do Next/Payload.

- [ ] **Step 5: Gerar tipos e baseline**

```powershell
Copy-Item .env.example .env
Copy-Item .env.test.example .env.test
docker compose up -d db db-test
npm run generate:types
npm run migrate:create -- foundation
```

Renomear a migração gerada para `src/migrations/20260725_000001_foundation.ts` e atualizar `src/migrations/index.ts`.

Expected: o wrapper comprova que `.env` aponta ao banco local `designer_inox`, `PAYLOAD_TEST_SCHEMA_SYNC=false` durante geração da migration e segredo sintético válido; migração contém DDL real para tabelas Payload, `users` e `media`; `src/payload-types.ts` exporta `User` e `Media`. `.env`/`.env.test` permanecem locais e não entram no commit.

- [ ] **Step 6: Testar integração**

O teste cria um usuário com e-mail reservado a testes, consulta por Local API, compara o ID e remove o registro.

Run: `npm run migrate:test`, depois `npm run test:int -- tests/integration/payload-health.int.spec.ts`.
Expected: PASS contra `designer_inox_test`.

- [ ] **Step 7: Commit**

```bash
git add compose.yaml .gitignore .env.example .env.test.example scripts/run-payload-cli.mjs src/payload.config.ts src/collections src/lib/env src/migrations src/payload-types.ts tests/unit/scripts/run-payload-cli.test.ts tests/integration tests/helpers/get-test-payload.ts tests/helpers/seed-user.ts
git commit -m "feat: add PostgreSQL Payload baseline"
```

---

### Task 4: Master da marca e derivados reprodutíveis

**Interfaces**

- Consumes: `D:\LOGO OFICIALL.png`, 1024 × 1536, SHA-256 `BDBC9A38A01E60D451C4433CA72FF812F8E661DB476F4406585C96955287AD40`.
- Produces: variantes positivas/negativas, lockups e ícones pelos caminhos definidos no File Map.
- Não produz SVG nesta fase: o master é raster e a condição de preservação vetorial ainda não pode ser comprovada.

- [ ] **Step 1: Copiar o master sem alterá-lo**

```powershell
New-Item -ItemType Directory -Force assets/brand/source
Copy-Item -LiteralPath 'D:\LOGO OFICIALL.png' -Destination 'assets/brand/source/logo-official.png'
```

Run: `Get-FileHash` em origem e cópia.
Expected: ambos iguais ao hash aprovado.

- [ ] **Step 2: Escrever testes de ativos inicialmente falhos**

Verificar:

- hash da cópia;
- presença da fonte Sora variável usada pelo lockup;
- símbolo em canvas quadrado transparente;
- lockup em `1200 × 320`;
- ícones em 16, 32 e 180 px;
- presença de PNG, WebP e AVIF;
- canal alpha nos símbolos;
- todos os arquivos maiores que zero.

Run: `npm run test:unit -- tests/unit/brand/logo-assets.test.ts`
Expected: FAIL por arquivos ausentes.

Baixar antes de gerar o lockup a fonte exata e versionada:

```powershell
Invoke-WebRequest 'https://cdn.jsdelivr.net/fontsource/fonts/sora:vf@5.3.0/latin-wght-normal.woff2' -OutFile 'src/assets/fonts/sora-latin.woff2'
Get-FileHash 'src/assets/fonts/sora-latin.woff2' -Algorithm SHA256
```

O gerador recebe esse caminho explicitamente; ausência ou hash divergente do manifesto de fonte faz o teste falhar.

- [ ] **Step 3: Produzir e aprovar o recorte transparente sem alterar o master**

Antes de qualquer edição, carregar a skill `imagegen`. Usar `D:\LOGO OFICIALL.png` como imagem de referência e pedir somente a remoção integral do fundo e do halo externo, mantendo geometria, proporções, dentes da engrenagem, floco, contornos, acabamento prata/azul e orientação exatamente como no símbolo original; saída PNG transparente, sem texto e sem acrescentar elementos. Salvar o resultado em `assets/brand/derived/symbol-isolated.png` e inspecioná-lo com `view_image` em fundo claro e escuro. O teste deve recusar uma imagem sem alpha, com bounding box tocando a borda ou com aspecto diferente do master. Se a geometria não for fiel, repetir a edição antes de continuar; nunca usar geração livre para redesenhar a marca.

Criar também `scripts/brand/render-wordmark.mjs`: Playwright abre um HTML local sem rede, declara `@font-face` apontando explicitamente para `src/assets/fonts/sora-latin.woff2`, espera `document.fonts.ready`, verifica `document.fonts.check('600 64px Sora')` e captura em fundo transparente somente “Designer Inox Brasil”. Salvar `assets/brand/derived/wordmark-sora.png`, inspecionar e registrar seu SHA-256 no manifesto aprovado. Esse raster passa a ser a fonte canônica do wordmark; builds posteriores não rerenderizam glifos por plataforma.

- [ ] **Step 4: Implementar gerador determinístico**

`generate-logo-assets.mjs`:

- lê somente `assets/brand/derived/symbol-isolated.png`, aplica `trim({ background: 'transparent' })` e preserva 32 px de margem em torno do conteúdo alfa;
- centraliza o símbolo num canvas `512 × 512`;
- usa o original em prata/azul como variante negativa;
- usa o mesmo alpha, preenchido com `#0D1218`, como variante positiva;
- cria lockup horizontal compondo o símbolo à esquerda com o raster aprovado `wordmark-sora.png`; Sharp nunca tenta interpretar WOFF2 ou renderizar texto;
- exporta PNG lossless, WebP lossless e AVIF quality 70;
- verifica os hashes aprovados de símbolo e wordmark antes de compor e nunca grava no caminho `D:\LOGO OFICIALL.png`.

- [ ] **Step 5: Gerar e validar**

Run: `npm run brand:generate`
Expected: todos os derivados listados.

Run: `npm run test:unit -- tests/unit/brand/logo-assets.test.ts`
Expected: PASS.

Completar `logo-validation.md` com resultado em 16, 32 e 180 px, cabeçalho mobile/desktop, fundo claro/escuro e alto contraste. O commit só ocorre com todas as linhas marcadas `Aprovado`.

- [ ] **Step 6: Commit**

```bash
git add assets/brand scripts/brand public/brand src/assets/fonts/sora-latin.woff2 src/app/\(frontend\)/icon.png src/app/\(frontend\)/apple-icon.png docs/brand tests/unit/brand
git commit -m "feat: add approved responsive brand assets"
```

---

### Task 5: Tipografia e tokens “Linha de Dobra”

**Interfaces**

- Produces: `headingFont`, `bodyFont`, tokens CSS e tokens TypeScript.
- Consumed by: UI base, shell e todos os planos públicos.

- [ ] **Step 1: Escrever contrato falho de tokens**

O teste lê CSS e TS e exige a mesma paleta, além de contraste mínimo:

```text
#06090D #0D1218 #151C24 #7E8994 #BFC8D0
#E7EDF2 #F8FAFC #74D9FF #168DC3 #0B5F87 #25D366
```

Combinações mínimas:

- `#F8FAFC` sobre `#06090D`: 4,5:1 ou mais;
- `#06090D` sobre `#74D9FF`: 4,5:1 ou mais;
- `#0D1218` sobre `#25D366`: 4,5:1 ou mais.

Run: `npm run test:unit -- tests/unit/styles/tokens.test.ts`
Expected: FAIL.

- [ ] **Step 2: Implementar tokens**

Além da paleta, definir:

```text
spacing: 4, 8, 12, 16, 24, 32, 48, 64, 96
radii: 4, 8, 12, 999
content max: 1200px
header: 72px desktop, 64px mobile
motion: 120ms, 180ms, 240ms
focus ring: 3px #74D9FF com offset 3px
```

`prefers-reduced-motion: reduce` remove deslocamento e reduz duração para `1ms`.

- [ ] **Step 3: Configurar fontes locais**

Preservar a Sora já baixada e usada na Task 4, baixar somente a Inter variável latina fixada do Fontsource 5.3.0 e calcular SHA-256 das duas:

```powershell
Invoke-WebRequest 'https://cdn.jsdelivr.net/fontsource/fonts/inter:vf@5.3.0/latin-wght-normal.woff2' -OutFile 'src/assets/fonts/inter-latin.woff2'
Get-FileHash 'src/assets/fonts/sora-latin.woff2','src/assets/fonts/inter-latin.woff2' -Algorithm SHA256
```

`fonts.ts` exporta `headingFont` e `bodyFont` com `next/font/local`, `display: swap`, `preload: true`, intervalos Sora `100 800` e Inter `100 900`, e variáveis `--font-heading` e `--font-body`. `docs/brand/font-provenance.md` registra URLs exatas, hashes calculados, data `2026-07-25`, Fontsource 5.3.0 e a SIL Open Font License 1.1; o teste falha se o hash do arquivo divergir do manifesto versionado.

- [ ] **Step 4: Verificar**

Run: `npm run test:unit -- tests/unit/styles/tokens.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/assets/fonts src/styles tests/unit/styles docs/brand
git commit -m "feat: establish Designer Inox design tokens"
```

---

### Task 6: Primitivos de interface

**Interfaces**

```ts
export type ButtonVariant = 'primary' | 'secondary' | 'text' | 'whatsapp'
export type ButtonSize = 'sm' | 'md' | 'lg'

export function Button(
  props: ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant
    size?: ButtonSize
  },
): ReactElement

export function ButtonLink(
  props: AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string
    variant?: ButtonVariant
    size?: ButtonSize
  },
): ReactElement

export function Container(props: { children: ReactNode; className?: string }): ReactElement
export function BrandMark(props: { tone: 'positive' | 'negative'; priority?: boolean }): ReactElement
export function BrandLockup(props: { tone: 'positive' | 'negative'; priority?: boolean }): ReactElement
export function FoldLine(props: { className?: string }): ReactElement
export function SkipLink(props: { targetId: string }): ReactElement

export function Field(props: {
  id: string
  label: string
  hint?: string
  error?: string
  required?: boolean
  children: ReactElement<{ id?: string; 'aria-describedby'?: string; 'aria-invalid'?: boolean }>
}): ReactElement

export function FilePicker(props: {
  id: string
  label: string
  accept: '.jpg,.jpeg,.png,.webp,.pdf'
  maxFiles: 10
  disabled?: boolean
  onSelect(files: readonly File[]): void
}): ReactElement

export function Dialog(props: {
  open: boolean
  title: string
  onClose(): void
  children: ReactNode
  initialFocusRef?: RefObject<HTMLElement | null>
}): ReactElement

export function CopyButton(props: {
  value: string
  label: string
  copiedLabel?: string
}): ReactElement
```

- [ ] **Step 1: Escrever testes falhos**

Cobrir elemento semântico correto, `disabled`, `aria-disabled`, variante WhatsApp, texto alternativo da marca, skip link, associação `label`/hint/erro, limites básicos do seletor de arquivos, fechamento de dialog por botão e `Esc`, devolução de foco e anúncio “Copiado” após Clipboard API bem-sucedida. O teste de `FilePicker` verifica somente seleção/semântica; política de MIME, tamanho e total pertence ao Plano 4.

- [ ] **Step 2: Implementar componentes mínimos**

Regras:

- nenhuma biblioteca de componentes;
- área mínima de 44 px;
- foco nunca removido;
- `whatsapp` é a única variante verde;
- `FoldLine` é decorativo e usa `aria-hidden`;
- marca tem dimensões reservadas para evitar CLS.
- `Field` concatena IDs de hint e erro em `aria-describedby` e usa `aria-invalid=true` somente com erro;
- `FilePicker` não faz upload nem persiste arquivos e limpa o valor do `<input>` após entregar uma seleção;
- `Dialog` encapsula `<dialog>.showModal()`, mantém o foco pelo comportamento modal nativo, fecha com `Esc` e restaura o elemento acionador;
- `CopyButton` usa `navigator.clipboard.writeText`, mantém alvo de 44 px e anuncia sucesso em região `aria-live=polite` sem expor o valor copiado.

- [ ] **Step 3: Rodar testes**

Run: `npm run test:unit -- tests/unit/components`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add src/components/ui tests/unit/components
git commit -m "feat: add accessible interface primitives"
```

---

### Task 7: Shell responsivo acessível

**Interfaces**

```ts
export type NavigationLink = {
  kind: 'link'
  label: string
  href: string
  external?: boolean
}

export type NavigationGroup = {
  kind: 'group'
  label: string
  href?: string
  items: readonly NavigationLink[]
}

export type SiteNavigation = {
  primary: readonly (NavigationLink | NavigationGroup)[]
  cta: NavigationLink
}

export type FooterNavigation = {
  primary: readonly NavigationLink[]
  legal: readonly NavigationLink[]
  social: readonly NavigationLink[]
}

export type SiteShellProps = {
  children: ReactNode
  navigation: SiteNavigation
  footer: FooterNavigation
}
```

`SiteShell` recebe valores síncronos já hidratados. Ele não chama Payload, não aceita `Promise` e não decide se Projetos ou Blog existem.

- [ ] **Step 1: Escrever teste unitário falho**

Renderizar fixture sem projetos e afirmar:

- logo liga para `/`;
- existe skip link para `#main-content`;
- `main` possui esse ID;
- nav e footer têm nomes acessíveis;
- CTA está presente;
- “Projetos” não aparece quando não fornecido.

- [ ] **Step 2: Implementar shell**

Desktop em `min-width: 1024px`; mobile abaixo disso. O menu mobile usa `dialog.showModal()`, fecha por botão e `Esc`, prende foco via modal nativo e devolve foco ao acionador.

O fallback de fundação contém apenas rotas confirmadas e não inclui Projetos, Blog, clientes ou depoimentos.

- [ ] **Step 3: Testar teclado em navegador real**

Fluxo:

```text
Tab -> skip link -> Enter -> foco em main
abrir menu -> foco no primeiro controle do diálogo
Tab/Shift+Tab não escapam do diálogo
Esc -> diálogo fecha -> foco retorna ao botão
```

Run: `npm run test:e2e -- tests/e2e/shell-keyboard.e2e.spec.ts`
Expected: PASS nos três engines desktop.

- [ ] **Step 4: Testar responsividade**

Para cada largura contratada, afirmar:

```ts
expect(await page.evaluate(() => document.documentElement.scrollWidth))
  .toBeLessThanOrEqual(viewport.width)
```

No mobile, CTA e botão de menu têm pelo menos 44 × 44; no desktop, a navegação fica visível e o menu mobile oculto.

Run: `npm run test:responsive`
Expected: 7 casos PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/layout src/config/foundation-navigation.ts tests/unit/layout tests/e2e/shell-keyboard.e2e.spec.ts tests/e2e/shell-responsive.e2e.spec.ts
git commit -m "feat: add responsive accessible site shell"
```

---

### Task 8: Layout integrado e quality gate final

**Interfaces**

- Consumes: shell, tokens, fontes e marca.
- Produces: página de fundação representativa para smoke test, acessibilidade e Lighthouse.

- [ ] **Step 1: Escrever o E2E falho**

Verificar `lang="pt-BR"`, um único H1, marca, header, main, footer e ausência de violações axe.

- [ ] **Step 2: Integrar layout**

`layout.tsx` aplica fontes, CSS global, metadados mínimos verdadeiros e `SiteShell`. A página provisória usa apenas:

- “Designer Inox Brasil”;
- “Soluções industriais completas em aço inox, do espaço vazio à operação pronta.”;
- o subtítulo aprovado;
- CTA fornecido pela navegação.

Não publica clientes, números, certificações, endereço ou projetos.

- [ ] **Step 3: Configurar Lighthouse**

`lighthouserc.cjs` coleta três vezes `/` e exige:

```text
performance >= 0.90, aggregationMethod = median
accessibility >= 0.95, aggregationMethod = median
best-practices >= 0.95, aggregationMethod = median
seo >= 0.95, aggregationMethod = median
```

Definir `aggregationMethod: 'median'` explicitamente nas quatro assertions; o padrão `optimistic` do Lighthouse CI não satisfaz o requisito. Um teste de configuração alimenta três resultados sintéticos e prova que dois passes mais um outlier falho passam, enquanto dois resultados falhos mais um passe falham.

- [ ] **Step 4: Executar verificação integral**

```powershell
npm run lint
npm run typecheck
npm run test:unit
npm run test:int
npm run build
npm run test:e2e
npm run lighthouse
git diff --exit-code package-lock.json
```

Expected: todos exit code `0`; nenhuma alteração espontânea no lockfile.

- [ ] **Step 5: Commit**

```bash
git add src/app/\(frontend\) lighthouserc.cjs tests/e2e/accessibility.e2e.spec.ts .github/workflows/quality.yml
git commit -m "feat: complete tested Designer Inox foundation"
```

## Boundary With Later Plans

- Plano 2 consome tokens, `Button`, `ButtonLink`, `Container`, `BrandMark`, `BrandLockup`, `SiteShell`, `SiteNavigation`, `FooterNavigation` e helpers de teste. Ele fornece dados de navegação já hidratados.
- Plano 3 modifica `Users.ts` e `payload.config.ts`, cria RBAC/TOTP/auditoria e adiciona migrações posteriores à `20260725_000001_foundation.ts`.
- Nenhum plano posterior recria o shell ou renomeia seus contratos sem migração coordenada.

A compatibilidade está respaldada pelos requisitos oficiais: Payload 3.86 aceita Node 20.9+ e Next 16.2.6+, portanto Next 16.2.11 está dentro da faixa suportada. O scaffold precisa de `--branch v3.86.0`, pois o gerador aponta por padrão para o branch móvel `3.x`. [Instalação do Payload](https://payloadcms.com/docs/getting-started/installation), [create-payload-app 3.86.0](https://www.npmjs.com/package/create-payload-app), [migrações Payload](https://payloadcms.com/docs/database/migrations).
