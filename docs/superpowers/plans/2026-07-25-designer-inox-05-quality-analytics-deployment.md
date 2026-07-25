# Designer Inox Quality, Analytics, and Deployment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrar consentimento e analytics sem PII, automatizar gates de qualidade, empacotar a aplicação e entregar publicação reproduzível com backup, observabilidade e runbooks.

**Architecture:** Analytics é um adaptador desligado por padrão e recebe apenas eventos tipados após consentimento. A aplicação é empacotada em contêiner, usa PostgreSQL e serviços externos por interfaces configuradas, e expõe health/readiness separados. A publicação depende de uma única rotina de verificação que reúne build, testes, acessibilidade, segurança, SEO e restauração.

**Tech Stack:** Next.js, TypeScript, Payload, GA4 via GTM Consent Mode básico, Vitest, Playwright, axe, Lighthouse CI, Docker, PostgreSQL, Cloudflare, scripts PowerShell e shell portáveis.

## Global Constraints

- Executar depois dos planos 01–04.
- Scripts de analytics e marketing não carregam antes da escolha correspondente.
- “Aceitar” e “Rejeitar” usam o mesmo tamanho, hierarquia e ordem de leitura.
- Site e formulário continuam funcionais sem consentimento de analytics.
- Eventos usam allowlist e nunca transportam PII, texto livre, protocolo, nome de arquivo ou URL com query string.
- Lighthouse em build de produção: três execuções por página; registrar a mediana.
- Metas: Performance acima de 90; Acessibilidade, Boas Práticas e SEO acima de 95.
- Metas de campo, após amostra de 28 dias: LCP ≤ 2,5 s, INP ≤ 200 ms, CLS ≤ 0,1 no percentil 75.
- Suporte: versões estáveis atual e anterior de Chrome, Edge, Firefox e Safari; dois Android e dois iOS principais no lançamento.
- Viewports: 320, 360, 390, 768, 1024, 1440 e 1920 CSS px.
- Segredos nunca entram no Git, imagem Docker, HTML ou logs.
- Publicação exige HTTPS, WAF, banco, storage, SMTP, Turnstile, políticas de retenção e restauração verificada.
- Todo código começa por teste falhando e cada tarefa termina em commit próprio.

## File Map

- `src/features/consent/*`: estado, cookie, banner e central de preferências.
- `src/features/analytics/*`: schema allowlist, adaptador e GTM consentido.
- `src/lib/env/server.ts`: contrato validado de variáveis compartilhado com os planos anteriores.
- `src/app/api/health/route.ts`: liveness sem dependências.
- `src/app/api/ready/route.ts`: readiness com dependências essenciais.
- `Dockerfile`, `compose.yaml`, `.dockerignore`: pacote e ambiente local.
- `scripts/*`: auditoria, backup, restauração e release gate.
- `lighthouserc.cjs`, `playwright.config.ts`: matriz de qualidade.
- `docs/operations/*`: implantação, incidentes, privacidade e restauração.

---

### Task 1: Estado de consentimento e cookie versionado

**Files:**
- Create: `src/features/consent/types.ts`
- Create: `src/features/consent/cookie.ts`
- Create: `src/features/consent/cookie.test.ts`
- Create: `src/features/consent/consent-provider.tsx`
- Create: `src/features/consent/consent-banner.tsx`
- Create: `src/features/consent/preferences-dialog.tsx`
- Create: `src/features/consent/consent-banner.test.tsx`
- Modify: `src/app/(frontend)/layout.tsx`
- Modify: `src/components/layout/SiteFooter.tsx`

**Interfaces:**
- Produces: `ConsentState`, `ConsentDecision`, `parseConsentCookie()`, `serializeConsentCookie()`, `useConsent()`.
- Consumes: componentes `Button` e `Dialog` do plano 01.

- [ ] **Step 1: Escrever testes falhando do cookie e do banner**

```ts
// src/features/consent/cookie.test.ts
import { describe, expect, it } from 'vitest'
import { parseConsentCookie, serializeConsentCookie } from './cookie'

it('não concede categoria quando cookie é ausente ou inválido', () => {
  expect(parseConsentCookie(undefined)).toEqual({ necessary: true, analytics: false, marketing: false, decided: false })
  expect(parseConsentCookie('corrupt')).toEqual({ necessary: true, analytics: false, marketing: false, decided: false })
})

it('mantém analytics e marketing independentes', () => {
  const value = serializeConsentCookie({ necessary: true, analytics: true, marketing: false, decided: true })
  expect(parseConsentCookie(value)).toMatchObject({ analytics: true, marketing: false })
})
```

```tsx
// src/features/consent/consent-banner.test.tsx
it('oferece aceitar e rejeitar com a mesma variante', async () => {
  render(<ConsentBanner />)
  expect(screen.getByRole('button', { name: 'Aceitar' }).getAttribute('data-variant')).toBe('primary')
  expect(screen.getByRole('button', { name: 'Rejeitar' }).getAttribute('data-variant')).toBe('primary')
})
```

- [ ] **Step 2: Executar testes e confirmar falhas**

Run: `npm run test:unit -- src/features/consent`

Expected: FAIL porque os módulos não existem.

- [ ] **Step 3: Implementar tipos e serialização estrita**

```ts
// src/features/consent/types.ts
export type ConsentState = {
  necessary: true
  analytics: boolean
  marketing: boolean
  decided: boolean
}

export type ConsentDecision =
  | { type: 'accept-all' }
  | { type: 'reject-all' }
  | { type: 'save'; analytics: boolean; marketing: boolean }

export const deniedConsent: ConsentState = {
  necessary: true,
  analytics: false,
  marketing: false,
  decided: false,
}
```

```ts
// src/features/consent/cookie.ts
import { deniedConsent, type ConsentState } from './types'

export const CONSENT_COOKIE = 'dib-consent-v1'

export const parseConsentCookie = (value?: string): ConsentState => {
  if (!value) return deniedConsent
  try {
    const parsed = JSON.parse(decodeURIComponent(value)) as Partial<ConsentState>
    if (parsed.necessary !== true || typeof parsed.analytics !== 'boolean' || typeof parsed.marketing !== 'boolean' || typeof parsed.decided !== 'boolean') return deniedConsent
    return { necessary: true, analytics: parsed.analytics, marketing: parsed.marketing, decided: parsed.decided }
  } catch {
    return deniedConsent
  }
}

export const serializeConsentCookie = (state: ConsentState) => encodeURIComponent(JSON.stringify(state))
```

- [ ] **Step 4: Implementar provider, banner e preferências acessíveis**

O provider inicia com `deniedConsent` no HTML estático e lê o cookie no cliente antes de liberar qualquer script; não usar `cookies()` no layout público cacheado. `Aceitar` define analytics e marketing como `true`; `Rejeitar` mantém ambas `false`; “Personalizar” abre `Dialog` com checkboxes independentes. Os botões `Aceitar` e `Rejeitar` têm mesma variante, dimensões e ordem de leitura. Salvar usa cookie `Secure` em HTTPS, `SameSite=Lax; Path=/; Max-Age=15552000` e dispara evento interno `consent:changed`. O banner só desaparece após decisão. `SiteFooter` sempre oferece o botão `Preferências de cookies`, que reabre o dialog.

Run: `npm run test:unit -- src/features/consent && npm run typecheck`

Expected: PASS; navegação por teclado entra e sai do dialog com foco restaurado.

- [ ] **Step 5: Commit**

```bash
git add src/features/consent 'src/app/(frontend)/layout.tsx' src/components/layout/SiteFooter.tsx
git commit -m "feat: add versioned consent preferences"
```

---

### Task 2: Analytics tipado e GTM consentido

**Files:**
- Modify: `src/modules/analytics/public-events.ts`
- Create: `src/features/analytics/event-schema.ts`
- Create: `src/features/analytics/event-schema.test.ts`
- Create: `src/features/analytics/client.ts`
- Create: `src/features/analytics/gtm.tsx`
- Create: `src/features/analytics/web-vitals.tsx`
- Create: `src/features/analytics/AnalyticsView.tsx`
- Create: `src/modules/analytics/catalog.ts`
- Create: `tests/unit/analytics/catalog.test.ts`
- Create: `src/features/analytics/network-payload.test.ts`
- Modify: `src/app/(frontend)/layout.tsx`
- Modify: `src/components/conversion/WhatsAppLink.tsx`
- Modify: `src/components/layout/SiteFooter.tsx`
- Modify: `src/components/solutions/SolutionPage.tsx`
- Modify: `src/components/segments/SegmentPage.tsx`
- Modify: `src/components/projects/ProjectPage.tsx`
- Modify: `src/components/content-hub/ArticlePage.tsx`
- Modify: `src/components/home/FinalContact.tsx`
- Modify: `src/features/leads/form/lead-form.tsx`
- Modify: `src/features/uploads/upload-manager.ts`

**Interfaces:**
- Consumes: `useConsent()`, `GTM_CONTAINER_ID` opcional, `PublicSiteEvent` e `publishPublicSiteEvent()` do Plano 2.
- Produces: union central ampliada `PublicSiteEvent`, `analyticsEventSchema`, `track()`, `AnalyticsProvider`, `GtmScript`, `WebVitalsReporter`.

- [ ] **Step 1: Escrever teste falhando da allowlist**

```ts
// src/features/analytics/event-schema.test.ts
import { expect, it } from 'vitest'
import { analyticsEventSchema } from './event-schema'

it('aceita evento comercial sem PII', () => {
  expect(analyticsEventSchema.parse({ name: 'whatsapp_click', context: 'maintenance', path: '/manutencao' })).toEqual({ name: 'whatsapp_click', context: 'maintenance', path: '/manutencao' })
})

it('remove campos desconhecidos e rejeita texto livre', () => {
  const result = analyticsEventSchema.safeParse({ name: 'form_complete', protocol: 'DIB-ABC123', description: 'texto livre' })
  expect(result.success).toBe(false)
})
```

- [ ] **Step 2: Executar teste e confirmar falha**

Run: `npm run test:unit -- src/features/analytics/event-schema.test.ts`

Expected: FAIL por módulo inexistente.

- [ ] **Step 3: Ampliar o bus central, validar e manter o cliente desligado por padrão**

```ts
// src/modules/analytics/public-events.ts
import type { WhatsAppContext } from '@/modules/whatsapp/contexts'
import type { AnalyticsRouteTemplate, CampaignId } from '@/modules/analytics/catalog'

export type PublicSiteEvent =
  | { name: 'whatsapp_click'; context: WhatsAppContext; path: AnalyticsRouteTemplate }
  | { name: 'phone_click' | 'instagram_click'; path: AnalyticsRouteTemplate }
  | { name: 'service_view'; service: Exclude<WhatsAppContext, 'general' | 'project'>; path: AnalyticsRouteTemplate }
  | { name: 'project_view'; path: '/projetos/[slug]' }
  | { name: 'form_start'; path: '/orcamento' }
  | { name: 'form_error'; code: 'validation' | 'network' | 'rate_limited' | 'verification'; path: '/orcamento' }
  | { name: 'form_complete'; source: 'direct' | 'organic' | 'referral' | 'campaign' | 'unknown'; campaignId?: CampaignId; path: '/orcamento' }
  | { name: 'attachment_add' | 'attachment_remove'; kind: 'image' | 'pdf'; path: '/orcamento' }
  | { name: 'contextual_cta_click'; context: WhatsAppContext; destination: 'whatsapp' | 'quote'; path: AnalyticsRouteTemplate }
  | { name: 'web_vital'; metric: 'LCP' | 'INP' | 'CLS'; value: number; rating: 'good' | 'needs-improvement' | 'poor'; path: AnalyticsRouteTemplate }

export function publishPublicSiteEvent(event: PublicSiteEvent): void
```

```ts
// src/features/analytics/event-schema.ts
import { z } from 'zod'
import { ANALYTICS_ROUTE_TEMPLATES, CAMPAIGN_IDS } from '@/modules/analytics/catalog'
import { WHATSAPP_CONTEXTS } from '@/modules/whatsapp/contexts'

const context = z.enum(WHATSAPP_CONTEXTS)
const path = z.enum(ANALYTICS_ROUTE_TEMPLATES)
const campaignId = z.custom<CampaignId>(
  (value) => typeof value === 'string' && CAMPAIGN_IDS.includes(value as never),
)

export const analyticsEventSchema = z.discriminatedUnion('name', [
  z.object({ name: z.literal('whatsapp_click'), context, path }).strict(),
  z.object({ name: z.enum(['phone_click', 'instagram_click']), path }).strict(),
  z.object({ name: z.literal('service_view'), service: context.exclude(['general', 'project']), path }).strict(),
  z.object({ name: z.literal('project_view'), path: z.literal('/projetos/[slug]') }).strict(),
  z.object({ name: z.literal('form_start'), path: z.literal('/orcamento') }).strict(),
  z.object({ name: z.literal('form_error'), code: z.enum(['validation', 'network', 'rate_limited', 'verification']), path: z.literal('/orcamento') }).strict(),
  z.object({ name: z.literal('form_complete'), source: z.enum(['direct', 'organic', 'referral', 'campaign', 'unknown']), campaignId: campaignId.optional(), path: z.literal('/orcamento') }).strict(),
  z.object({ name: z.enum(['attachment_add', 'attachment_remove']), kind: z.enum(['image', 'pdf']), path: z.literal('/orcamento') }).strict(),
  z.object({ name: z.literal('contextual_cta_click'), context, destination: z.enum(['whatsapp', 'quote']), path }).strict(),
  z.object({ name: z.literal('web_vital'), metric: z.enum(['LCP', 'INP', 'CLS']), value: z.number().finite().nonnegative(), rating: z.enum(['good', 'needs-improvement', 'poor']), path }).strict(),
])

export type AnalyticsEvent = z.infer<typeof analyticsEventSchema>
```

`ANALYTICS_ROUTE_TEMPLATES` é uma tupla fechada das rotas estáticas aprovadas mais `/segmentos/[slug]`, `/projetos/[slug]` e `/conteudos/[slug]`. `toAnalyticsRouteTemplate(pathname)` remove query/hash e converte detalhes dinâmicos para esses templates; rota desconhecida não gera evento. Assim, nenhum slug editorial, nome de cliente ou termo digitado entra no payload. `CAMPAIGN_IDS` começa como tupla vazia e só recebe IDs internos opacos por mudança versionada; `CampaignId` deriva dela. O schema usa membership, não regex livre, e um refinamento exige `campaignId` se e somente se `source === 'campaign'`. Uma tabela allowlisted separada mapeia tokens UTM exatos conhecidos para esses IDs; desconhecidos viram `source: 'unknown'` sem carregar o valor bruto.

`AnalyticsProvider` escuta o mesmo bus criado no Plano 2. `track()` retorna sem efeito quando consentimento de analytics for `false` ou GTM não estiver configurado. Quando ativo, valida com `analyticsEventSchema` e envia somente o objeto allowlisted para `dataLayer`. `AnalyticsView` publica uma única visualização por montagem nas páginas de serviço e projeto; `FinalContact` publica CTA para WhatsApp ou orçamento; `SiteFooter` publica telefone/Instagram; `WhatsAppLink` publica o clique; `lead-form` publica início/erro/conclusão; e `upload-manager` publica inclusão/remoção sem nome, tamanho ou identificador do arquivo. Testes montam cada produtor, exigem exatamente um evento no gesto correto e provam que paths dinâmicos, UTM livre, nome de arquivo, protocolo e texto do formulário não chegam à rede. `WebVitalsReporter` usa `useReportWebVitals`, publica LCP/INP/CLS e não chama esses valores de métricas de campo antes de uma janela móvel de 28 dias com amostra suficiente.

- [ ] **Step 4: Implementar GTM somente após consentimento**

`GtmScript` não deve renderizar `<Script>` no HTML inicial sem consentimento. Após mudança para permitido, injeta o container e envia o estado básico de consentimento. Revogação envia atualização `denied` e impede novos eventos; não tenta apagar dados já enviados.

Run: `npm run test:unit -- src/features/analytics && npm run typecheck`

Expected: PASS; teste de payload confirma ausência de `email`, `phone`, `description`, `protocol`, `fileName`, `search` e `hash`.

- [ ] **Step 5: Commit**

```bash
git add src/features/analytics src/modules/analytics tests/unit/analytics 'src/app/(frontend)/layout.tsx' src/components/conversion/WhatsAppLink.tsx src/components/layout/SiteFooter.tsx src/components/solutions/SolutionPage.tsx src/components/segments/SegmentPage.tsx src/components/projects/ProjectPage.tsx src/components/content-hub/ArticlePage.tsx src/components/home/FinalContact.tsx src/features/leads/form src/features/uploads/upload-manager.ts
git commit -m "feat: add consent-gated analytics allowlist"
```

---

### Task 3: Contrato de ambiente e endpoints operacionais

**Files:**
- Modify: `src/lib/env/server.ts`
- Modify: `tests/unit/env/server.test.ts`
- Create: `tests/contracts/env-callers.test.mjs`
- Modify: `src/payload.config.ts`
- Modify: `scripts/run-payload-cli.mjs`
- Modify: `.env.example`
- Modify: `.env.test.example`
- Create: `src/app/api/health/route.ts`
- Create: `src/app/api/ready/route.ts`
- Create: `src/features/operations/readiness.ts`
- Create: `src/features/operations/readiness.test.ts`
- Create: `src/modules/security/headers.ts`
- Create: `src/proxy.ts`
- Modify: `next.config.ts`
- Modify: `src/app/(frontend)/layout.tsx`
- Create: `src/modules/content/revalidation/cloudflare-cdn-purge.ts`
- Modify: `src/modules/content/revalidation/composition-root.ts`
- Create: `tests/unit/content/cloudflare-cdn-purge.test.ts`
- Create: `tests/unit/content/invalidation-composition-root.test.ts`
- Create: `tests/unit/security/headers.test.ts`

**Interfaces:**
- Produces: `getBuildEnv()`, `getRuntimeEnv()`, `getPayloadConfigInputs()`, `checkReadiness()`, `CloudflareCdnPurgeAdapter`, `GET /api/health`, `GET /api/ready`.
- Consumes: verificadores de PostgreSQL, storage e Payload.

- [ ] **Step 1: Escrever testes falhando de validação e readiness**

```ts
it('recusa produção sem segredos e serviços obrigatórios', () => {
  expect(() => getRuntimeEnv({ APP_RUNTIME_MODE: 'production', NODE_ENV: 'production', SITE_URL: 'https://designerinox.example' })).toThrow(/DATABASE_URL/)
})

it('readiness falha quando o banco está indisponível', async () => {
  const result = await checkReadiness({
    database: async () => false,
    privateStorage: async () => true,
    publicStorage: async () => true,
    activeAdmin: async () => true,
  })
  expect(result).toEqual({ ready: false, checks: { database: false, privateStorage: true, publicStorage: true, activeAdmin: true } })
})
```

- [ ] **Step 2: Executar testes e confirmar falhas**

Run: `npm run test:unit -- tests/unit/env/server.test.ts src/features/operations/readiness.test.ts`

Expected: FAIL por módulos inexistentes.

- [ ] **Step 3: Implementar env com schemas separados por modo**

```ts
// extensão de src/lib/env/server.ts
import { z } from 'zod'

const booleanString = z.enum(['true', 'false']).transform((value) => value === 'true')

const base = z.object({
  APP_RUNTIME_MODE: z.enum(['build', 'development', 'test', 'production']),
  NODE_ENV: z.enum(['development', 'test', 'production']),
  SITE_URL: z.string().url(),
  INDEX_PUBLIC_SITE: booleanString,
})

const runtime = base.extend({
  DATABASE_URL: z.string().min(1),
  PAYLOAD_SECRET: z.string().min(32),
  S3_INTERNAL_ENDPOINT: z.string().url(),
  S3_PUBLIC_UPLOAD_ENDPOINT: z.string().url(),
  S3_REGION: z.string().min(1),
  S3_BUCKET_PUBLIC: z.string().min(1),
  S3_BUCKET_PRIVATE: z.string().min(1),
  S3_BUCKET_TOMBSTONES: z.string().min(1),
  S3_ACCESS_KEY_ID: z.string().min(1),
  S3_SECRET_ACCESS_KEY: z.string().min(1),
  TOMBSTONE_S3_ACCESS_KEY_ID: z.string().min(1),
  TOMBSTONE_S3_SECRET_ACCESS_KEY: z.string().min(1),
  S3_FORCE_PATH_STYLE: booleanString,
  TURNSTILE_SITE_KEY: z.string().min(1),
  TURNSTILE_SECRET_KEY: z.string().min(1),
  SMTP_HOST: z.string().min(1),
  SMTP_PORT: z.coerce.number().int().min(1).max(65535),
  SMTP_FROM: z.string().email(),
  SMTP_TLS_MODE: z.enum(['implicit', 'starttls', 'insecure']),
  CLAMAV_HOST: z.string().min(1),
  CLOUDFLARE_ZONE_ID: z.string().min(1),
  CLOUDFLARE_API_TOKEN: z.string().min(1),
  INTERNAL_JOB_SECRET: z.string().min(32),
  RATE_LIMIT_HMAC_KEY: base64Bytes(32),
  UPLOAD_TOKEN_HMAC_KEY: base64Bytes(32),
  MFA_ENCRYPTION_KEY: base64Bytes(32),
  MFA_RECOVERY_PEPPER: base64Bytes(32),
  AUTH_RATE_LIMIT_HMAC_KEY: base64Bytes(32),
  ADMIN_SESSION_HMAC_KEY: base64Bytes(32),
  TOMBSTONE_LEDGER_CURRENT_SIGNING_KEY: base64Bytes(32),
  TOMBSTONE_LEDGER_KEY_VERSION: z.string().regex(/^v[1-9][0-9]*$/),
  TOMBSTONE_LEDGER_VERIFY_KEYS: versionedEd25519PublicKeyring(),
  GTM_CONTAINER_ID: z.string().regex(/^GTM-[A-Z0-9]+$/).optional(),
  SMTP_USER: z.string().min(1).optional(),
  SMTP_PASSWORD: z.string().min(1).optional(),
})

const build = base.extend({ APP_RUNTIME_MODE: z.literal('build'), NODE_ENV: z.literal('production') })
const development = runtime.extend({ APP_RUNTIME_MODE: z.literal('development'), NODE_ENV: z.literal('development') })
const test = runtime.extend({
  APP_RUNTIME_MODE: z.literal('test'),
  NODE_ENV: z.literal('test'),
  PAYLOAD_TEST_SCHEMA_SYNC: booleanString,
})
const production = runtime.extend({ APP_RUNTIME_MODE: z.literal('production'), NODE_ENV: z.literal('production') })

export const getBuildEnv = (input: Record<string, string | undefined> = process.env) => build.parse(input)

export const getRuntimeEnv = (input: Record<string, string | undefined> = process.env) => {
  const mode = z.enum(['development', 'test', 'production']).parse(input.APP_RUNTIME_MODE)
  const value = ({ development, test, production } as const)[mode].parse(input)
  if (value.APP_RUNTIME_MODE === 'production' && new URL(value.SITE_URL).protocol !== 'https:') throw new Error('SITE_URL_MUST_USE_HTTPS')
  return value
}

export const getPayloadConfigInputs = (input: Record<string, string | undefined> = process.env) => {
  if (input.APP_RUNTIME_MODE === 'build') {
    getBuildEnv(input)
    return {
      mode: 'build' as const,
      databaseUrl: 'postgresql://build.invalid/designer_inox_build',
      payloadSecret: 'BUILD_ONLY_SENTINEL_NEVER_VALID_AT_RUNTIME',
    }
  }
  const value = getRuntimeEnv(input)
  return { mode: value.APP_RUNTIME_MODE, databaseUrl: value.DATABASE_URL, payloadSecret: value.PAYLOAD_SECRET }
}
```

`base64Bytes(32)` decodifica Base64 canônico e exige exatamente 32 bytes reais. Um único `superRefine` normaliza cada segredo em bytes (Base64 quando tipado assim; UTF-8 nos demais) e exige distinção par a par entre `RATE_LIMIT_HMAC_KEY`, `UPLOAD_TOKEN_HMAC_KEY`, `AUTH_RATE_LIMIT_HMAC_KEY`, `ADMIN_SESSION_HMAC_KEY`, `MFA_ENCRYPTION_KEY`, `MFA_RECOVERY_PEPPER`, `TOMBSTONE_LEDGER_CURRENT_SIGNING_KEY`, `PAYLOAD_SECRET`, `INTERNAL_JOB_SECRET`, `TURNSTILE_SECRET_KEY`, `SMTP_PASSWORD` quando presente, credenciais S3, credencial do ledger e token Cloudflare. Também exige `SMTP_USER`/`SMTP_PASSWORD` juntos, buckets/credenciais distintos para tombstones e `SMTP_TLS_MODE` igual a `implicit` ou `starttls` em production; `insecure` só é aceito em development/test para Mailpit. Testes canary reutilizam deliberadamente cada par obrigatório, exigem falha apenas com nomes das variáveis, recusam SMTP plaintext/certificado inválido em production e provam que nenhum valor aparece na exceção.

O ledger usa assinatura Ed25519: `TOMBSTONE_LEDGER_CURRENT_SIGNING_KEY` é a seed privada da versão atual; `TOMBSTONE_LEDGER_VERIFY_KEYS` é um JSON estrito `version → publicKey Base64` e precisa conter `TOMBSTONE_LEDGER_KEY_VERSION` com a chave correspondente. Entradas persistem `keyVersion`; restore escolhe a pública histórica e rejeita versão desconhecida. Rotação adiciona `vN`/nova pública antes de trocar a seed atual, nunca reescreve entradas e proíbe remover uma pública enquanto qualquer tombstone, backup ou legal hold depender dela. Testes cobrem ledger misto v1/v2, assinatura errada, versão ausente e rotação concorrente. Os quatro schemas são explícitos: `build` aceita somente valores públicos necessários à compilação e nunca banco/segredos; `development`, `test` e `production` preservam no resultado todas as chaves dos adapters. `booleanString` devolve boolean real para `INDEX_PUBLIC_SITE`, `S3_FORCE_PATH_STYLE` e `PAYLOAD_TEST_SCHEMA_SYNC`; testes provam especificamente que a string `false` nunca é truthy. O script `build:isolated` define `APP_RUNTIME_MODE=build`; o servidor real define `production`, evitando inferir runtime apenas de `NODE_ENV=production` durante `next build`.

Nenhum módulo chama parser de env no top level de um adapter; cada operação de runtime usa `getRuntimeEnv()`, enquanto código puramente de build usa apenas `getBuildEnv()`. `getPayloadConfigInputs()` é o único bridge allowlisted: em build fornece URL/sentinel públicos e inertes, e testes bloqueiam qualquer conexão, autenticação, CLI ou início de servidor nesse modo; fora de build exige os segredos reais. A Task migra todos os callers existentes, inclusive `payload.config.ts`, `scripts/run-payload-cli.mjs`, composition roots, jobs, identidade, leads, storage, SMTP e Cloudflare. `tests/contracts/env-callers.test.mjs` enumera cada import encontrado por `rg`, exige a API correta por arquivo e falha se restar `getServerEnv`, acesso direto a `process.env` fora dos wrappers ou retorno union sem narrowing. Assim, importação e `next build` não exigem banco, S3, SMTP ou segredos, mas runtime/CLI nunca aceitam o sentinel. `S3_INTERNAL_ENDPOINT` é resolvível apenas pelos containers/servidor; `S3_PUBLIC_UPLOAD_ENDPOINT` é a origem usada para assinar o `Host` das URLs de PUT e deve ser resolvível pelo navegador. Em produção, o endpoint público exige HTTPS e hostname allowlisted; em desenvolvimento/teste pode ser o reverse proxy local. O código nunca reescreve uma URL depois de assinada. `S3_FORCE_PATH_STYLE` permite `true` no MinIO local e `false` em storage compatível com virtual-hosted style. Mídia pública usa sempre path same-origin `/published/media/...`; não existe `PUBLIC_MEDIA_BASE_URL` nem URL direta de bucket nos DTOs. `GTM_CONTAINER_ID` permanece opcional e só aceita `/^GTM-[A-Z0-9]+$/`; ausência mantém analytics desligado. `SMTP_USER`/`SMTP_PASSWORD` são opcionais juntos e nunca um sem o outro; SMTP de production exige TLS implícito ou STARTTLS obrigatório, verificação de certificado/hostname e TLS 1.2+. `.env.test.example` usa `SMTP_TLS_MODE=insecure` somente com Mailpit e valores sintéticos completos para banco, S3/MinIO, ClamAV, Turnstile, Cloudflare fake, MFA e todos os HMACs, além de `PAYLOAD_TEST_SCHEMA_SYNC=true`; o teste carrega esse arquivo e prova que as chaves de runtime não foram removidas pelo Zod. Testes de migration sobrescrevem a flag para `false`. Mensagens de erro listam apenas nomes de variáveis. Preview comum usa `INDEX_PUBLIC_SITE=false`. O preview candidato à liberação usa o mesmo digest atestado com `INDEX_PUBLIC_SITE=true`, mas permanece não descobrível e inacessível sem Cloudflare Access/allowlist; ele é destruído após o gate. A liberação pública também exige `true`.

- [ ] **Step 4: Implementar headers, health e readiness sem segredos**

`src/proxy.ts` gera nonce criptográfico por resposta, encaminha-o apenas em header interno e aplica CSP construída por `src/modules/security/headers.ts`: `default-src 'self'`, `object-src 'none'`, `base-uri 'self'`, `frame-ancestors 'none'`, `form-action 'self'`; `script-src` inclui o nonce, `strict-dynamic` e `https://challenges.cloudflare.com`; `frame-src` inclui exatamente `https://challenges.cloudflare.com`; `connect-src` contém uma allowlist fixa mínima de `'self'`, endpoints GA4/GTM configurados e `https://challenges.cloudflare.com` apenas se exigido pelo modo testado do widget. A CSP só concede capacidade de conexão: `GtmScript` e todos os eventos continuam ausentes até consentimento. Isso permite aceitar sem reload, sem tentar alterar um response header já recebido. `style-src`, `font-src` e `img-src` ficam mínimos e same-origin. Não usar `unsafe-eval` ou `unsafe-inline`; GTM e Turnstile recebem o nonce. Aplicar também `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` negando câmera/microfone/geolocalização, `Cross-Origin-Opener-Policy: same-origin` e `X-Frame-Options: DENY`. Em HTTPS de produção, adicionar HSTS por um ano com `includeSubDomains`; `preload` só após validação explícita do domínio. Testes E2E carregam o Turnstile em modo de teste, aceitam analytics sem reload, provam zero request antes/revogado e recusam qualquer host extra.

`/api/health` retorna `200 { "status": "ok" }`. `/api/ready` executa banco, leitura/escrita efêmera separada nos stores privado e público S3 e a existência de pelo menos um administrador ativo com timeout de dois segundos; retorna 200 somente quando os quatro passam e 503 caso contrário. Testes cobrem falha isolada de cada bucket e provam que administrador desativado não conta. Um endpoint interno autenticado de dependências expõe apenas booleanos para ClamAV, SMTP, frescor do scheduler e atraso das outboxes; falha desses serviços fecha o fluxo dependente e alerta, sem derrubar o site editorial. Nenhum endpoint retorna URL, contagem sensível, credencial, stack ou mensagem do driver. `CloudflareCdnPurgeAdapter.purge(paths)` converte paths same-origin em URLs absolutas HTTPS de `SITE_URL`, chama `POST https://api.cloudflare.com/client/v4/zones/{zone}/purge_cache` com `{ files }`, exige `success === true`, divide deterministically todos os URLs em lotes de no máximo 30 e rejeita a operação se qualquer lote falhar; nunca trunca 31/61 paths. Rejeita path com query, fragmento ou origem externa, e o token nunca entra em log. Modificar `src/modules/content/revalidation/composition-root.ts` para injetar esse adapter em produção; testes provam que o no-op permanece apenas em development/test e que produção não inicializa com ele.

Run: `npm run test:unit -- tests/unit/env/server.test.ts src/features/operations/readiness.test.ts tests/unit/content/cloudflare-cdn-purge.test.ts tests/unit/content/invalidation-composition-root.test.ts tests/unit/security/headers.test.ts && npm run typecheck`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src scripts/run-payload-cli.mjs tests/unit/env/server.test.ts tests/contracts/env-callers.test.mjs .env.example .env.test.example tests/unit/content/cloudflare-cdn-purge.test.ts tests/unit/content/invalidation-composition-root.test.ts tests/unit/security/headers.test.ts
git commit -m "feat: validate runtime environment and readiness"
```

---

### Task 4: Contêiner e ambiente local reproduzível

**Files:**
- Create: `Dockerfile`
- Create: `.dockerignore`
- Modify: `compose.yaml`
- Modify: `compose.pdf-inspector.yaml`
- Verify: `docker/pdf-inspector.Dockerfile`
- Verify: `docker/qpdf.lock`
- Create: `docker/clamav/clamd.conf`
- Create: `docker/minio/bootstrap.sh`
- Create: `scripts/wait-for-ready.mjs`
- Create: `scripts/job-scheduler.mjs`
- Create: `scripts/job-scheduler.test.ts`
- Create: `scripts/run-integration-tests.mjs`
- Create: `scripts/run-integration-tests.test.ts`
- Create: `src/modules/storage/payload-s3.ts`
- Create: `src/modules/storage/published-media-store.ts`
- Create: `src/modules/storage/s3-published-asset-promotion.ts`
- Create: `src/modules/storage/publication-storage-composition-root.ts`
- Create: `src/app/published/media/[...key]/route.ts`
- Create: `tests/integration/storage/public-media-route.test.ts`
- Create: `tests/integration/storage/published-asset-promotion.test.ts`
- Create: `tests/e2e/private-upload-cors.spec.ts`
- Create: `tests/e2e/legacy-illustrative-paths.spec.ts`
- Create: `scripts/migrate-payload-media-to-s3.mjs`
- Create: `scripts/migrate-payload-media-to-s3.test.ts`
- Test: `tests/integration/storage/payload-s3.test.ts`
- Modify: `src/payload.config.ts`
- Modify: `src/collections/Media.ts`
- Modify: `src/collections/ClientAuthorizations.ts`
- Modify: `src/modules/content/revalidation/payload-hooks.ts`
- Modify: `next.config.ts`
- Modify: `package.json`
- Modify: `package-lock.json`

**Interfaces:**
- Consumes: build standalone do Next.js, migrations Payload, seed idempotente do Plano 3, buckets S3 e workflow de mídia.
- Produces: adapters S3 privados, publicação controlada de mídia, bucket Object Lock dedicado ao ledger de tombstones, targets `runner`, `migrate` e `scheduler`; preserva `db`/`db-test` e adiciona serviços locais `minio`, `minio-init`, `clamav`, `mailpit`, `migrate`, `admin-bootstrap`, `web` e `jobs`.

- [ ] **Step 1: Escrever teste falhando do contrato Docker**

```ts
// scripts/docker-contract.test.ts
import { readFileSync } from 'node:fs'
import { expect, it } from 'vitest'

it('usa usuário não-root e healthcheck', () => {
  const dockerfile = readFileSync('Dockerfile', 'utf8')
  const compose = readFileSync('compose.yaml', 'utf8')
  expect(dockerfile).toMatch(/USER nextjs/)
  expect(compose).toMatch(/healthcheck:/)
  expect(compose).toMatch(/jobs:/)
  expect(dockerfile).toMatch(/AS scheduler/)
  expect(dockerfile).not.toMatch(/ARG\s+(DATABASE_URL|PAYLOAD_SECRET|S3_|SMTP_|TURNSTILE_)/)
})
```

- [ ] **Step 2: Executar teste e confirmar falha**

Run: `npm run test:unit -- scripts/docker-contract.test.ts`

Expected: FAIL porque os arquivos não existem.

- [ ] **Step 3: Instalar e testar o adapter S3 do Payload sem lifecycle antecipado**

Adicionar a dependência oficial na mesma versão do CMS:

```powershell
npm install --package-lock-only --ignore-scripts --save-exact '@payloadcms/storage-s3@3.86.0'
npm run security:audit
npm ci --ignore-scripts
npm run security:audit
npm run security:signatures
npm rebuild sharp esbuild
```

`payload-s3.ts` configura `media` e `client-authorizations` no bucket privado, com prefixes distintos `cms/media/original/` e `cms/client-authorizations/`, access control do Payload ativo e nenhuma URL S3 direta em DTO público. `S3PublishedAssetPromotion` implementa exatamente o `PublishedAssetPromotionPort` do Plano 3 para `kind: 'media' | 'captions'`: media vai a `published/media/<sha256>/<nome-sanitizado>` e WebVTT a `published/media/captions/<sha256>.vtt`; `prepare`, `compensate` e `retire` são idempotentes, verificam hash/Content-Type e nunca aceitam chave fornecida pelo cliente. `publication-storage-composition-root.ts` injeta esse adapter no publication worker e no scheduler; no-op é proibido em produção. Testes cobrem sucesso, retry, colisão/hash divergente, compensação antes de ativação, retire após ocultação e falha parcial nos dois kinds.

`PublishedMediaStore` e o adapter devolvem somente paths same-origin `/published/media/...`. `src/app/published/media/[...key]/route.ts` implementa `GET`/`HEAD`, aceita apenas chave canônica sob esse prefix, bloqueia traversal/double decode, lê exclusivamente o bucket público e responde apenas tipos allowlisted de imagem, MP4 e `text/vtt; charset=utf-8`, com `X-Content-Type-Options: nosniff`, tamanho, ETag e cache imutável pelo hash; não lista objetos nem aceita bucket/prefix do request. Para vídeo, suporta exatamente um byte range validado, retorna `206` com `Accept-Ranges`/`Content-Range` ou `416` em range inválido, e limita bytes lidos no upstream. Integração testa GET/HEAD/ranges, WebVTT/captions e CORS same-origin; E2E testa play/seek e track `pt-BR` em Chromium e WebKit atrás do cache CDN. `legacy-illustrative-paths.spec.ts` exige 404 permanente para `/media/illustrative/kitchen.jpg`, `welding.jpg` e `plasma.jpg` antes/depois de publish, archive, delete e restore; só o path governado pode existir. Cloudflare armazena e purga essas mesmas URLs de `SITE_URL`, portanto não há `remotePatterns`, segunda origem ou purge incompleto. Archive, delete, revogação ou substituição entram na saga/outbox e removem a cópia pública de forma idempotente. Documento de autorização, original e mídia draft nunca entram no bucket/prefix público.

`scripts/migrate-payload-media-to-s3.mjs` tem `--dry-run`, compara SHA-256, envia originais locais ao bucket privado e cria cópia pública apenas para mídia efetivamente publicada. É idempotente, não apaga a origem antes de verificar objeto, hash e registro, e falha se detectar chave fora dos prefixes allowlisted. O teste MinIO prova: draft não é acessível sem assinatura; mídia publicada é acessível pelo prefix público; archive remove; autorização continua privada; segunda migração não duplica.

Adicionar scripts `"storage:migrate": "node scripts/migrate-payload-media-to-s3.mjs"` e `"deploy:bootstrap": "npm run migrate && npm run seed:initial -- --if-needed && npm run storage:migrate"`. A ordem é obrigatória: numa instalação sem marker, o seed interno restrito do Plano 3 cria registros/originais e grava `BootstrapState` atomicamente; em deploys seguintes ele encerra no-op mesmo após edições/conteúdo editorial legítimo. Em seguida, a migração idempotente promove/verifica somente o que requer storage antes do web. Testes cobrem instalação vazia, segundo deploy após criar projeto/artigo e editar seed sem qualquer mutação, e banco parcial sem marker falhando; `web` nunca sobe entre seed e a verificação de storage.

- [ ] **Step 4: Implementar Dockerfile multi-stage**

O Dockerfile usa `node:24.14.0-bookworm-slim`. Depois de copiar somente manifests, executa `npm audit --package-lock-only --audit-level=high`, `npm ci --ignore-scripts`, novo audit, `npm audit signatures` e apenas então `npm rebuild sharp esbuild`. O target `builder` executa `npm run build:isolated` com ambiente deliberadamente sem credenciais; o teste de contrato falha se houver `ARG`/`ENV` para segredos ou se o build tentar conteúdo, banco ou storage. O target `runner` copia somente saída standalone, assets públicos legítimos e arquivos necessários ao servidor; nunca copia `assets/content/illustrative`, módulos/binários de seed ou qualquer `public/media/illustrative`, cria usuário `nextjs` sem shell e executa `node server.js`. O target `migrate` conserva `node_modules`, config Payload, collections, globals, migrations, módulos de seed/storage, manifestos e `assets/content/illustrative` necessários a `deploy:bootstrap`. O target mínimo `scheduler` copia `scripts/job-scheduler.mjs`, usa o mesmo usuário non-root e chama o endpoint interno sem embutir segredo na imagem. Nenhum target copia `.env`, `.git`, testes, anexos do usuário ou outros documentos locais. Um teste inspeciona as camadas do runner e falha diante dos três nomes/hash de origem.

- [ ] **Step 5: Implementar compose e verificar boot**

`compose.yaml` preserva os bancos `db`/`db-test`, define volumes nomeados, healthchecks e rede privada. MinIO cria `designer-inox-public`, `designer-inox-private` e `designer-inox-tombstones`; este último nasce com versioning + Object Lock/retention, credencial exclusiva sem acesso aos outros buckets, zero policy pública e não é montado pelo processo web. `minio-init` configura CORS do privado com origins exatas de `SITE_URL` e previews explicitamente enumerados, somente `PUT`, `HEAD` e os headers realmente assinados, sem `*` em produção e expondo apenas ETag/headers necessários. O cliente interno usa `S3_INTERNAL_ENDPOINT=http://minio:9000`; o presigner usa `S3_PUBLIC_UPLOAD_ENDPOINT`, servido por hostname/reverse proxy que o navegador alcança sem alterar host/path assinados. O E2E executa preflight e PUT com a URL realmente retornada pelo container, depois prova que uma origem maliciosa, método e header fora da lista são negados. Integração prova assinatura/hash-chain/key version do ledger, imutabilidade, `replicatedAt` e negação cruzada das credenciais.

O runtime e todos os gates usam também `compose.pdf-inspector.yaml` do Plano 4. O serviço `pdf-inspector` constrói `docker/pdf-inspector.Dockerfile`, verifica `docker/qpdf.lock`, assinatura e SHA-256 do qpdf 12.3.2, publica somente Unix socket compartilhado e mantém `network_mode: none`, filesystem read-only, UID sem privilégio, `cap_drop: ALL`, `no-new-privileges`, tmpfs `noexec,nosuid,nodev`, limites CPU/memória/PIDs/arquivo e healthcheck local. A aplicação monta apenas o socket; o sidecar nunca monta buckets nem rede. Build/scan registram digest/SBOM do sidecar, e testes inspecionam o container efetivo para provar os controles. Falha ou ausência fecha somente PDF, conforme o Plano 4.

Como o host de desenvolvimento é Windows e não pode abrir o Unix socket do volume Docker, o overlay também define `integration-tests`: imagem Node pinada, rede privada dos serviços, mesmo socket volume, source read-only, tmpfs para resultados e `profiles: [test]`, portanto nunca inicia em `up` padrão/runtime. `scripts/run-integration-tests.mjs` torna-se a implementação final de `npm run test:int`, preserva filtros após `--`, cria um Compose project isolado quando chamado sozinho ou usa somente `INTEGRATION_COMPOSE_PROJECT` explicitamente recebido pelo CI/release, e executa Vitest com `docker compose run --rm integration-tests`, alvo explícito que habilita o profile; nunca tenta acessar o socket pelo host. O teste do runner cobre argumentos, exit code, cleanup, herança exata desse nome e recusa project name/origem não allowlisted; `COMPOSE_PROJECT_NAME` não é um segundo contrato da aplicação. `pdf-inspector-tests` também usa `profiles: [test]`, como exige o Plano 4.

PostgreSQL publica porta apenas em `127.0.0.1`; MinIO console, ClamAV e Mailpit ficam restritos ao ambiente de desenvolvimento. O serviço `migrate` usa o target próprio, executa `npm run deploy:bootstrap` depois de `minio-init` e termina com status 0. Em instalação nova, `admin-bootstrap` roda `npm run admin:bootstrap` em rede privada, recebe `BOOTSTRAP_ADMIN_EMAIL/PASSWORD` somente por secret runtime e encerra; essas variáveis não são repassadas a `web`, `jobs` ou imagem. `web` depende de DB/MinIO saudáveis, bootstrap de conteúdo/mídia verificado e admin concluídos, sem tentar executar CLI Payload no runner standalone. Depois de `web` saudável, `jobs` usa o target `scheduler` e faz `POST /api/internal/jobs` a cada 60 segundos com `INTERNAL_JOB_SECRET` lido apenas do ambiente. O endpoint também executa `processPublicationBatch()` do Plano 3 com lock, lease e lote próprios, além de scan, outbox, abandono e retenção; crash deixa a operação retomável. O scheduler usa timeout, backoff limitado e nunca imprime header ou segredo; cursores/locks tornam cada worker idempotente. Readiness operacional inclui frescor e lag do publication worker. Em produção gerenciada, um scheduler da plataforma chama o mesmo endpoint a cada minuto; o runbook proíbe subir simultaneamente o scheduler externo e o serviço `jobs`.

Adicionar `"jobs:scheduler": "node scripts/job-scheduler.mjs"` e substituir a implementação final de `"test:int"` por `"node scripts/run-integration-tests.mjs"`; o comando interno do container chama diretamente `vitest run --config ./vitest.integration.config.mts`, evitando recursão. `scripts/job-scheduler.test.ts` simula sucesso, timeout e 401 usando `fetch` injetável; nenhuma mensagem contém o segredo.

Run: `docker compose -f compose.yaml -f compose.pdf-inspector.yaml config --profiles && docker compose -f compose.yaml -f compose.pdf-inspector.yaml build && docker compose -f compose.yaml -f compose.pdf-inspector.yaml up -d --wait && docker compose -f compose.yaml -f compose.pdf-inspector.yaml ps --format json && node scripts/wait-for-ready.mjs && npm run test:int -- tests/integration/storage tests/integration/uploads/qpdf-inspector.int.test.ts && npm run test:e2e -- tests/e2e/private-upload-cors.spec.ts tests/e2e/legacy-illustrative-paths.spec.ts`. O teste do config/ps exige que `integration-tests` e `pdf-inspector-tests` estejam no profile `test` e ausentes do boot padrão. `npm run test:int` os aciona apenas como alvos one-shot; em `finally`, logs passam pelo sanitizer e o project exato é removido com volumes.

Expected: configuração válida, todos os targets constroem sem segredos de build, bootstrap/seed terminam, `/api/ready` retorna 200 e os contratos de storage passam.

- [ ] **Step 6: Commit**

```bash
git add Dockerfile .dockerignore compose.yaml compose.pdf-inspector.yaml docker scripts/wait-for-ready.mjs scripts/job-scheduler.mjs scripts/job-scheduler.test.ts scripts/run-integration-tests.mjs scripts/run-integration-tests.test.ts scripts/migrate-payload-media-to-s3.mjs scripts/migrate-payload-media-to-s3.test.ts src/modules/storage src/app/published src/payload.config.ts src/collections/Media.ts src/collections/ClientAuthorizations.ts src/modules/content/revalidation/payload-hooks.ts tests/integration/storage tests/integration/uploads tests/e2e/private-upload-cors.spec.ts tests/e2e/legacy-illustrative-paths.spec.ts next.config.ts package.json package-lock.json
git commit -m "build: add reproducible container environment"
```

---

### Task 5: Matriz Playwright, axe e Lighthouse CI

**Files:**
- Modify: `playwright.config.ts`
- Modify: `tests/e2e/accessibility.e2e.spec.ts`
- Create: `tests/e2e/browser-matrix.spec.ts`
- Create: `tests/e2e/security-headers.spec.ts`
- Modify: `lighthouserc.cjs`
- Create: `scripts/lighthouse-median.mjs`
- Create: `scripts/lighthouse-median.test.ts`
- Create: `scripts/resolve-playwright-chromium.mjs`
- Create: `scripts/resolve-playwright-chromium.test.ts`
- Modify: `package.json`
- Modify: `.github/workflows/quality.yml`

**Interfaces:**
- Consumes: rotas públicas do plano 02 e formulário do plano 04.
- Produces: scripts `test:a11y`, `test:browsers`, `lighthouse`, `quality:ci`.

- [ ] **Step 1: Escrever E2E falhando de acessibilidade**

```ts
// ampliação de tests/e2e/accessibility.e2e.spec.ts
import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

for (const path of ['/', '/solucoes-em-inox', '/manutencao', '/orcamento']) {
  test(`${path} não tem violações WCAG A/AA`, async ({ page }) => {
    await page.goto(path)
    const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze()
    expect(result.violations).toEqual([])
  })
}
```

- [ ] **Step 2: Executar e registrar as falhas reais**

Run: `npm run test:a11y`

Expected: FAIL até a configuração e correções de acessibilidade estarem completas; salvar apenas relatório sem dados pessoais.

- [ ] **Step 3: Configurar matriz mínima**

Playwright terá projetos Desktop Chromium, Desktop Firefox, Desktop WebKit, canais estáveis locais Chrome/Edge quando disponíveis, Mobile Chrome 390×844, Mobile Safari 390×844 e Small Mobile 320×568. No CI e no release gate, `webServer.command` usa `npm run start` sobre o build já produzido; desenvolvimento local pode manter `npm run dev`, e `PLAYWRIGHT_BASE_URL` permite testar um preview protegido sem iniciar servidor local. `browser-matrix.spec.ts` importa `SUPPORTED_VIEWPORTS` do Plano 1 e executa 320, 360, 390, 768, 1024, 1440 e 1920, verificando skip link, menu, foco, zoom a 200%, ausência de overflow horizontal, CTA acessível e formulário gated/ativo. `security-headers.spec.ts` verifica CSP/nonce, HSTS no preview HTTPS, bloqueio de frame e que GTM não é solicitado antes do consentimento.

- [ ] **Step 4: Configurar Lighthouse e mediana**

```js
// lighthouserc.cjs
const base = process.env.LHCI_BASE_URL ?? 'http://127.0.0.1:3000'
const urls = ['/', '/cozinhas-industriais', '/manutencao', '/orcamento'].map((path) => new URL(path, base).href)
if (process.env.LHCI_PROJECT_PATH) urls.push(new URL(process.env.LHCI_PROJECT_PATH, base).href)

module.exports = {
  ci: {
    collect: {
      numberOfRuns: 3,
      url: urls,
      ...(process.env.CHROME_PATH ? { chromePath: process.env.CHROME_PATH } : {}),
      ...(process.env.LHCI_BASE_URL ? {} : { startServerCommand: 'npm run start' }),
      startServerReadyPattern: 'Ready',
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9, aggregationMethod: 'median' }],
        'categories:accessibility': ['error', { minScore: 0.95, aggregationMethod: 'median' }],
        'categories:best-practices': ['error', { minScore: 0.95, aggregationMethod: 'median' }],
        'categories:seo': ['error', { minScore: 0.95, aggregationMethod: 'median' }],
      },
    },
  },
}
```

No ambiente de teste, semear um projeto sintético com autorização válida/mídia própria e um conjunto jurídico sintético completo que abra `LeadPrivacyReadiness`, definir `LHCI_PROJECT_PATH` e apagar todas as fixtures após o gate. O estado medido de `/orcamento` pelo Lighthouse é explicitamente o formulário habilitado e indexável; o estado gated/noindex continua coberto por Playwright e testes técnicos de SEO, não por uma exceção silenciosa de score. No release, `verify-preview-artifact` e um precheck exigem que o preview candidato atestado esteja protegido por Cloudflare Access/allowlist, tenha `INDEX_PUBLIC_SITE=true` e o gate jurídico aberto antes de apontar LHCI para ele; acesso anônimo continua negado e o ambiente é destruído após a coleta. Caso contrário, a liberação pública é bloqueada, como determina a especificação.

`resolve-playwright-chromium.mjs` importa o `chromium` da versão pinada de `@playwright/test`, resolve `chromium.executablePath()`, exige arquivo executável real sob o cache Playwright esperado e imprime somente o path. O CI e o release exportam esse valor como `CHROME_PATH`; `lighthouserc.cjs` o passa explicitamente em `collect.chromePath`, sem depender de descoberta de Chrome do sistema. O script `lighthouse` será `lhci autorun --config=lighthouserc.cjs && node scripts/lighthouse-median.mjs .lighthouseci`, e falhará se não houver exatamente três resultados válidos por URL. O script recalcula e registra a mediana das quatro categorias, repetindo os mesmos thresholds como defesa contra mudança de configuração. Testes cobrem browser ausente/path fora do cache e `lighthouse-median.test.ts` usa fixtures determinísticas: dois passes + um outlier falho devem passar; dois falhos + um passe devem falhar; duas ou quatro execuções também falham.

Atualizar os scripts sem criar aliases concorrentes:

```json
{
  "test:a11y": "playwright test tests/e2e/accessibility.e2e.spec.ts tests/e2e/public-a11y.spec.ts",
  "test:responsive": "playwright test tests/e2e/shell-responsive.e2e.spec.ts tests/e2e/public-responsive.spec.ts",
  "test:browsers": "playwright test tests/e2e/browser-matrix.spec.ts",
  "lighthouse": "lhci autorun --config=lighthouserc.cjs && node scripts/lighthouse-median.mjs .lighthouseci",
  "quality:ci": "npm run lint && npm run typecheck && npm run test:contracts && npm run test:unit && npm run test:int && npm run build:isolated && npm run test:a11y && npm run test:responsive && npm run test:browsers && npm run test:e2e && npm run lighthouse"
}
```

Run: `npm run build:isolated && npm run test:a11y && npm run test:responsive && npm run test:browsers && npm run lighthouse`

Expected: todos os thresholds passam; o script registra a mediana das três execuções.

`.github/workflows/quality.yml` não chama `quality:ci` em ambiente vazio. Ele cria um Compose project aleatório, usa `compose.yaml + compose.pdf-inspector.yaml`, sobe/aguarda `db-test`, MinIO/init, ClamAV, Mailpit e pdf-inspector, aplica migration/fixtures sintéticas, exporta `CHROME_PATH=$(node scripts/resolve-playwright-chromium.mjs)` após a instalação dos browsers pinados e então executa o script. Um bloco `always()` captura somente logs sanitizados e faz `down --volumes --remove-orphans` no mesmo project; falha do sanitizer ou cleanup também falha o job. Artefatos de relatório têm retenção curta e nunca incluem DB, uploads, tokens ou logs brutos.

- [ ] **Step 5: Commit**

```bash
git add playwright.config.ts tests/e2e lighthouserc.cjs scripts/lighthouse-median.mjs scripts/lighthouse-median.test.ts scripts/resolve-playwright-chromium.mjs scripts/resolve-playwright-chromium.test.ts package.json package-lock.json .github/workflows/quality.yml
git commit -m "test: enforce browser accessibility and lighthouse gates"
```

---

### Task 6: Backup, restauração e runbooks

**Files:**
- Create: `scripts/backup-database.ps1`
- Create: `scripts/restore-database.ps1`
- Create: `scripts/backup-storage.ps1`
- Create: `scripts/restore-storage.ps1`
- Create: `scripts/verify-private-storage.ps1`
- Create: `scripts/prune-expired-backups.ps1`
- Create: `scripts/test-backup-contract.ps1`
- Create: `scripts/test-restore-drill.ps1`
- Create: `docs/operations/deployment.md`
- Create: `docs/operations/backup-restore.md`
- Create: `docs/operations/incident-response.md`
- Create: `docs/operations/privacy-operations.md`
- Create: `docs/operations/content-release.md`
- Create: `docs/operations/edge-security.md`

**Interfaces:**
- Consumes: credenciais somente por ambiente e ferramentas oficiais PostgreSQL/S3.
- Produces: backup diário, teste de restauração, runbooks e checklist de publicação.

- [ ] **Step 1: Escrever teste de contrato dos scripts**

```powershell
# scripts/test-backup-contract.ps1
$backup = Get-Content -Raw -LiteralPath 'scripts/backup-database.ps1'
if ($backup -notmatch 'pg_dump') { throw 'backup must use pg_dump' }
if ($backup -match 'PASSWORD\s*=\s*["''][^$]') { throw 'hard-coded password found' }
$restore = Get-Content -Raw -LiteralPath 'scripts/restore-database.ps1'
if ($restore -notmatch 'pg_restore') { throw 'restore must use pg_restore' }
```

- [ ] **Step 2: Executar e confirmar falha**

Run: `pwsh -File scripts/test-backup-contract.ps1`

Expected: FAIL porque scripts de backup ainda não existem.

- [ ] **Step 3: Implementar backup sem segredos embutidos**

`backup-database.ps1` exige `DATABASE_URL` e destino explícito, usa `pg_dump --format=custom`, calcula SHA-256 e escreve manifesto com data, versão, tamanho, classe de retenção e `expiresAt`. `backup-storage.ps1` usa AWS CLI v2 com endpoint/region configurados para copiar somente os buckets público/privado a destino versionado e criptografado; o manifesto guarda quantidade, bytes e hashes por objeto sem URLs assinadas. O bucket de tombstones não entra nessa rotação: sua replicação Object Lock separada, assinatura/hash-chain e manifestos são verificados pelo comando canônico do Plano 4. `prune-expired-backups.ps1` exige inventory/versioning, remove somente artefatos cujo manifesto válido venceu e produz recibo auditável sem PII; nunca recebe credencial do ledger. Backups incompletos, sem manifesto ou sob legal hold nunca são apagados automaticamente.

`restore-database.ps1` e `restore-storage.ps1` aceitam apenas alvos de homologação explicitamente nomeados e inicialmente isolados da rede pública. Eles validam checksum/contagens, restauram, executam migrations e então chamam o comando canônico `npm run privacy:tombstones:reapply` do Plano 4 antes de qualquer `web` ficar acessível. O ledger assinado, encadeado por hash e acompanhado de manifesto fica protegido separadamente do snapshot restaurado pelo prazo definido no contrato de retenção. O comando valida assinatura/cadeia, reaplica eliminação/anonymização e remoção de objetos, prova que um lead já eliminado não ressuscitou e só então libera smoke queries. O Plano 5 não redefine schema, identificador ou criptografia do ledger. Todos os scripts recusam destino vazio, raiz ampla ou identificador de produção. `deployment.md` define a agenda de um minuto para `/api/internal/jobs`, alerta por ausência de execução/lock preso/fila atrasada e a regra de instância única descrita na Task 4.

- [ ] **Step 4: Documentar e executar ensaio de restauração**

O runbook deve conter responsáveis, pré-condições, RPO de 24 horas, RTO de oito horas, rotação/expiração, legal hold, validação do bucket privado, reaplicação de tombstones, revogação de credenciais, comunicação de incidente e teste trimestral. `edge-security.md` exige Authenticated Origin Pulls/mTLS entre Cloudflare e a origem (fallback documentado: allowlist oficial automatizada de IPs Cloudflare), firewall bloqueando acesso direto e regra de que `CF-Connecting-IP` só é confiado depois dessa autenticação de transporte. Documenta WAF/rate limits para upload session, complete e lead submit, limite de corpo/método, exceções versionadas e rollback. Execute backup de homologação, restaure em alvos temporários explícitos, reaplique o ledger e registre somente evidência agregada.

Run: `pwsh -File scripts/test-backup-contract.ps1`, seguido de `pwsh -File scripts/test-restore-drill.ps1 -ComposeProject <projeto-isolado>` no ambiente descartável.

`test-restore-drill.ps1` cria lead/objetos sintéticos, elimina um deles e replica o tombstone; gera backup real de DB e buckets público/privado, restaura em nomes temporários allowlisted, roda migrations + `privacy:tombstones:reapply` e prova contagens/hashes, privacidade do bucket, WebVTT/mídia e ausência do lead/objeto eliminado. Produz somente relatório agregado assinado pelo digest do backup e remove os alvos temporários em `finally`.

Expected: ambos PASS e restore drill válido; teste meramente textual do script não substitui a restauração.

- [ ] **Step 5: Commit**

```bash
git add scripts/backup-database.ps1 scripts/restore-database.ps1 scripts/backup-storage.ps1 scripts/restore-storage.ps1 scripts/verify-private-storage.ps1 scripts/prune-expired-backups.ps1 scripts/test-backup-contract.ps1 scripts/test-restore-drill.ps1 docs/operations
git commit -m "docs: add deployment backup and incident runbooks"
```

---

### Task 7: Gate único de release e entrega final

**Files:**
- Create: `scripts/release-gate.ps1`
- Create: `scripts/access-preview-headers.mjs`
- Create: `scripts/access-preview-headers.test.ts`
- Reuse: `scripts/resolve-playwright-chromium.mjs`
- Create: `scripts/verify-no-secrets.ps1`
- Create: `scripts/verify-analytics-payloads.mjs`
- Create: `scripts/verify-production-binding.mjs`
- Create: `scripts/verify-preview-artifact.mjs`
- Create: `scripts/scan-release-images.ps1`
- Create: `scripts/verify-prohibited-scope.mjs`
- Create: `scripts/verify-edge-security.mjs`
- Create: `scripts/sanitize-release-logs.mjs`
- Create: `scripts/write-automated-release-evidence.mjs`
- Create: `scripts/release-approve.mjs`
- Create: `scripts/release-evidence.test.ts`
- Create: `tests/contracts/release-clean-agent.test.mjs`
- Create: `docker/security-tools.lock`
- Create: `docs/operations/release-checklist.md`
- Create: `docs/operations/automated-release-evidence.schema.json`
- Create: `docs/operations/release-evidence.schema.json`
- Modify: `package.json`
- Modify: `playwright.config.ts`
- Modify: `lighthouserc.cjs`

**Interfaces:**
- Consumes: todos os scripts e testes dos cinco planos.
- Produces: `npm run release:gate`, `npm run release:approve`, evidência automatizada assinada pelo digest do artefato e evidência manual separada.

- [ ] **Step 1: Criar o gate que para no primeiro erro**

```powershell
# scripts/release-gate.ps1
$ErrorActionPreference = 'Stop'
function Invoke-Native([scriptblock]$Command) {
  & $Command
  if ($LASTEXITCODE -ne 0) { throw "Native command failed with exit code $LASTEXITCODE" }
}
$project = "designer-inox-release-$([guid]::NewGuid().ToString('N').Substring(0, 12))"
$servicesStarted = $false
$gatePassed = $false
$cleanupPassed = $false
$accessHeadersPath = $null

try {
  Invoke-Native { npm run security:audit }
  Invoke-Native { npm ci --ignore-scripts }
  Invoke-Native { npm run security:audit }
  Invoke-Native { npm run security:signatures }
  Invoke-Native { npm run security:qpdf }
  Invoke-Native { pwsh -File scripts/verify-no-secrets.ps1 }
  Invoke-Native { npm rebuild sharp esbuild }
  Invoke-Native { npx --no-install playwright install --with-deps chromium firefox webkit }
  $env:CHROME_PATH = (node scripts/resolve-playwright-chromium.mjs).Trim()
  if ($LASTEXITCODE -ne 0 -or -not (Test-Path -LiteralPath $env:CHROME_PATH -PathType Leaf)) { throw 'Pinned Playwright Chromium unavailable' }

  Invoke-Native { docker compose -f compose.yaml -f compose.pdf-inspector.yaml -p $project config --quiet }
  Invoke-Native { docker compose -f compose.yaml -f compose.pdf-inspector.yaml -p $project build pdf-inspector }
  Invoke-Native { docker compose -f compose.yaml -f compose.pdf-inspector.yaml -p $project up -d --wait db-test minio minio-init clamav mailpit pdf-inspector }
  $servicesStarted = $true
  $env:INTEGRATION_COMPOSE_PROJECT = $project
  Invoke-Native { node scripts/wait-for-ready.mjs --project $project --dependencies-only }

  Invoke-Native { npm run lint }
  Invoke-Native { npm run typecheck }
  Invoke-Native { npm run migrate:test }
  Invoke-Native { npm run test:contracts }
  Invoke-Native { npm run test:unit }
  Invoke-Native { npm run test:int }
  Invoke-Native { npm run build:isolated }
  Invoke-Native { docker build --target runner --tag designer-inox:release . }
  Invoke-Native { docker build --target migrate --tag designer-inox:migrate-release . }
  Invoke-Native { docker build --target scheduler --tag designer-inox:scheduler-release . }
  Invoke-Native { pwsh -File scripts/scan-release-images.ps1 -ComposeProject $project }
  Invoke-Native { pwsh -File scripts/test-backup-contract.ps1 }
  Invoke-Native { pwsh -File scripts/test-restore-drill.ps1 -ComposeProject $project }
  Invoke-Native { node scripts/verify-production-binding.mjs }
  Invoke-Native { node scripts/verify-preview-artifact.mjs }
  $accessHeadersPath = (node scripts/access-preview-headers.mjs create --project $project).Trim()
  if ($LASTEXITCODE -ne 0) { throw 'Could not create protected preview header file' }
  $env:PLAYWRIGHT_BASE_URL = $env:EDGE_PREVIEW_URL
  $env:LHCI_BASE_URL = $env:EDGE_PREVIEW_URL
  $env:PLAYWRIGHT_EXTRA_HEADERS_FILE = $accessHeadersPath
  $env:LHCI_EXTRA_HEADERS_FILE = $accessHeadersPath
  Invoke-Native { npm run test:a11y }
  Invoke-Native { npm run test:responsive }
  Invoke-Native { npm run test:browsers }
  Invoke-Native { npm run test:e2e }
  Invoke-Native { npm run lighthouse }
  Invoke-Native { node scripts/verify-analytics-payloads.mjs }
  Invoke-Native { node scripts/verify-prohibited-scope.mjs }
  Invoke-Native { node scripts/verify-edge-security.mjs }
  $gatePassed = $true
}
finally {
  $logsRead = $true
  $logsSanitized = $true
  if ($servicesStarted) {
    $rawLogs = docker compose -f compose.yaml -f compose.pdf-inspector.yaml -p $project logs --no-color 2>&1
    $logsRead = ($LASTEXITCODE -eq 0)
    $rawLogs | node scripts/sanitize-release-logs.mjs
    $logsSanitized = ($LASTEXITCODE -eq 0)
    $rawLogs = $null
  }
  docker compose -f compose.yaml -f compose.pdf-inspector.yaml -p $project down --volumes --remove-orphans
  $downPassed = ($LASTEXITCODE -eq 0)
  if ($accessHeadersPath) { node scripts/access-preview-headers.mjs remove --path $accessHeadersPath }
  $headersRemoved = (-not $accessHeadersPath) -or ($LASTEXITCODE -eq 0)
  Remove-Item Env:PLAYWRIGHT_EXTRA_HEADERS_FILE, Env:LHCI_EXTRA_HEADERS_FILE, Env:CHROME_PATH -ErrorAction SilentlyContinue
  $cleanupPassed = $logsRead -and $logsSanitized -and $downPassed -and $headersRemoved
}

if (-not ($gatePassed -and $cleanupPassed)) { throw 'Release gate or isolated cleanup failed' }
Invoke-Native { node scripts/write-automated-release-evidence.mjs }
Write-Output 'AUTOMATED_GATE_OK'
```

- [ ] **Step 2: Implementar varredura de segredo e payload**

`verify-no-secrets.ps1` inspeciona arquivos rastreados por padrões de chave privada, token, senha e arquivos `.env`, com allowlist somente para nomes de variáveis em exemplos. `verify-analytics-payloads.mjs` executa os produtores e cenários E2E, intercepta GTM e falha se encontrar chaves ou valores de PII proibidos, slug dinâmico, UTM livre ou query/hash.

`security:qpdf` valida lock, checksum, assinatura e SBOM do binário antes de construir o sidecar. `scan-release-images.ps1` usa o scanner Trivy fixado por digest e assinatura em `docker/security-tools.lock`, exige banco de vulnerabilidades fresco, gera CycloneDX + relatório JSON para `runner`, `migrate`, `scheduler` e `pdf-inspector` e falha em qualquer vulnerabilidade high/critical, erro de scan, imagem sem digest ou suppressão não registrada. Exceção temporária exige ID, justificativa, owner e expiração no lock; expirada falha. Relatórios são sanitizados, hasheados na evidência e não publicados em repositório público.

`verify-production-binding.mjs` importa os composition roots com `APP_RUNTIME_MODE=production`: exige `PayloadPublicContentRepository`, `CloudflareCdnPurgeAdapter`, storage Payload no bucket privado, `S3PublishedAssetPromotion` ligado ao publication worker/scheduler e rota same-origin para mídia/WebVTT no bucket público; prova que o repositório local lança `LOCAL_PUBLIC_CONTENT_FORBIDDEN_IN_PRODUCTION`, que nenhum DTO contém URL S3, que o runner não contém `assets/content/illustrative`/binários-fonte, que os três `/media/illustrative/*.jpg` retornam 404 e que o modo de promoção pública exige `INDEX_PUBLIC_SITE=true`. Ele não lê `release-evidence.json`, que ainda não existe nesta etapa.

`verify-preview-artifact.mjs` valida uma attestation de deployment assinada pelo CI/plataforma e vinculada a `EDGE_PREVIEW_URL`. Ela deve conter `GIT_SHA`, lockfile hash, `INDEX_PUBLIC_SITE=true` e digests imutáveis de `runner`, `migrate`, `scheduler` e `pdf-inspector`; o script compara todos aos artefatos recém-construídos, verifica assinatura/issuer/audience/expiração, faz request sem credencial e exige bloqueio do Cloudflare Access, depois usa `CF_ACCESS_CLIENT_ID`/`CF_ACCESS_CLIENT_SECRET` efêmeros e secret-only para consultar o endpoint interno autenticado que confirma o hash da mesma attestation. O service token é restrito ao preview, expira em no máximo uma hora e é revogado pelo pipeline após o gate. URL, token, headers e corpo não entram em log.

`access-preview-headers.mjs` lê esses dois secrets sem imprimi-los, cria JSON temporário owner-only/mode `0600` com exatamente `CF-Access-Client-Id` e `CF-Access-Client-Secret`, recusa path/symlink/permissão inseguros e o remove de forma idempotente no `finally`. `playwright.config.ts` e `lighthouserc.cjs` leem exclusivamente os paths `PLAYWRIGHT_EXTRA_HEADERS_FILE`/`LHCI_EXTRA_HEADERS_FILE`, validam as duas chaves allowlisted e aplicam os headers a todas as navegações; os configs nunca recebem o JSON pela linha de comando. Só depois do binding o gate define base URLs e arquivos de headers para o preview; browser, Lighthouse, analytics, escopo proibido e edge nunca testam o `npm start` local durante release. Testes canary inspecionam stdout/stderr/evidência/logs e falham diante de qualquer fragmento dos tokens. Divergência ou 401/403 autenticado exige novo deploy/token e reinício integral do gate.

O release gate roda em agente Debian limpo e, após o install determinístico do lockfile, executa `npx --no-install playwright install --with-deps chromium firefox webkit`; `--no-install` garante a versão pinada em `package-lock.json`. Em seguida resolve o Chromium pinado, valida o arquivo e exporta `CHROME_PATH`, que o LHCI recebe como `collect.chromePath`. `tests/contracts/release-clean-agent.test.mjs` prova a ordem e que nenhum E2E/Lighthouse roda antes dos três engines/dependências e do `CHROME_PATH` válido estarem presentes. Cache de browsers é apenas otimização e nunca pré-condição oculta.

`verify-prohibited-scope.mjs` percorre o catálogo público e todas as URLs publicadas condicionais no preview, normaliza Unicode NFKD/case/espaços e inspeciona texto visível, atributos, metadata, Open Graph, JSON-LD, sitemap, robots e campos/opções do formulário. Falha diante de qualquer oferta de proteção contra incêndio e exige 404 para `/protecao-contra-incendio` e variações normalizadas; termos presentes apenas nas fixtures negativas não são tratados como saída do produto. O validator editorial do Plano 3 continua sendo a primeira barreira.

`verify-edge-security.mjs` requer `EDGE_PREVIEW_URL` e um endpoint de origem fornecido por secret de CI, sem imprimi-los. Confirma HTTPS, HSTS, WAF/rate limit das três rotas mutáveis, bloqueio de método/corpo fora do contrato, origem direta negada e spoof de `CF-Connecting-IP`/headers Cloudflare negado. A origem aceita somente Authenticated Origin Pulls/mTLS; a alternativa de allowlist de IP oficial precisa ser testada e registrada. O teste usa payload sintético sem criar lead.

`write-automated-release-evidence.mjs` só roda depois de todos os comandos e grava `automated-release-evidence.json` validado pelo schema: versão, commit, digests das quatro imagens (`runner`, `migrate`, `scheduler`, `pdf-inspector`), lockfile hash, hash/issuer da attestation do preview, timestamps, resultados de cada gate, restore/tombstone test e hash dos relatórios, sem segredo, URL interna ou PII. Falha ou cleanup incompleto não produz evidência verde. O projeto Compose aleatório isola rede/volumes; `finally` sanitiza logs e remove exatamente esse projeto mesmo em falha.

Adicionar ao `package.json`:

```json
{
  "scripts": {
    "release:gate": "pwsh -File scripts/release-gate.ps1",
    "release:approve": "node scripts/release-approve.mjs"
  }
}
```

- [ ] **Step 3: Executar o gate completo**

Run: `pwsh -File scripts/release-gate.ps1`

Expected: `AUTOMATED_GATE_OK`, `automated-release-evidence.json` válido e exit code 0. Nenhuma publicação/indexação é alterada por esse comando.

- [ ] **Step 4: Executar smoke test no preview protegido**

No mesmo preview e exatamente sobre o digest automatizado, validar home, serviço, manutenção, projeto condicional, orçamento gated/ativo, admin, saga de publicação/ocultação e purge, envio idempotente, quarentena/download autorizado, e-mail, preferências, rejeição/aceite de analytics e 404. O checklist exige Chrome, Edge, Firefox e Safari estáveis atual/anterior por device lab, Android e iPhone representativos das duas versões principais suportadas, roteiro completo só por teclado, logo em 16/32/180 px e fundos claro/escuro/alto contraste, restore isolado com tombstones, CORS de upload e origem/WAF.

Antes de liberar indexação, executar teste moderado do hero com pelo menos cinco participantes B2B: após oito segundos, pelo menos quatro identificam “soluções industriais completas em aço inox” e citam construção/fabricação ou instalação/manutenção. Registrar apenas total, acertos agregados e IDs sintéticos. `release-evidence.json` inclui `schemaVersion`, digest/commit iguais à evidência automática, hash dessa evidência, ambiente, timestamps e resultados estruturados obrigatórios para smoke, browsers/versões, dispositivos, teclado, logo, hero, restore/tombstones, edge/WAF, privacidade/legal e aprovação editorial. Não guarda respostas individuais, nomes de participantes, clientes ou credenciais. O schema usa `additionalProperties: false`, enums `pass|fail` e mínimos objetivos; qualquer `fail`, campo ausente ou digest divergente bloqueia.

- [ ] **Step 5: Aprovar exatamente o artefato verificado**

Run: `npm run release:approve`

`release-approve.mjs` valida os dois schemas, hashes, assinatura/identidade do CI, mesma versão/digest, janela temporal definida no runbook, restauração e evidência manual completas, além do manifesto de promoção que mudará `INDEX_PUBLIC_SITE` para `true`. Ele não executa deploy por conta própria. Somente após imprimir `RELEASE_APPROVED` o pipeline protegido pode promover aquele digest imutável; qualquer rebuild exige novo gate e novo aceite.

Expected: `RELEASE_APPROVED` e exit code 0.

- [ ] **Step 6: Commit**

```bash
git add scripts/release-gate.ps1 scripts/access-preview-headers.mjs scripts/access-preview-headers.test.ts scripts/verify-no-secrets.ps1 scripts/verify-analytics-payloads.mjs scripts/verify-production-binding.mjs scripts/verify-preview-artifact.mjs scripts/scan-release-images.ps1 scripts/verify-prohibited-scope.mjs scripts/verify-edge-security.mjs scripts/sanitize-release-logs.mjs scripts/write-automated-release-evidence.mjs scripts/release-approve.mjs scripts/release-evidence.test.ts tests/contracts/release-clean-agent.test.mjs playwright.config.ts lighthouserc.cjs docker/security-tools.lock docs/operations/release-checklist.md docs/operations/automated-release-evidence.schema.json docs/operations/release-evidence.schema.json package.json package-lock.json
git commit -m "chore: add production release gate"
```
