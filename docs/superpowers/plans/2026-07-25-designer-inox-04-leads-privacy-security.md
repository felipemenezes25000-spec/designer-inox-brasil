# Designer Inox Leads, Privacy, and Security Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Entregar captação de leads com gate de privacidade, formulário progressivo, idempotência, anexos privados em quarentena, notificações por outbox e acesso comercial auditado.

**Architecture:** O navegador valida UX, mas a API repete toda validação. Anexos são enviados por URL assinada a um bucket privado e só podem ser associados depois da conferência e varredura. A criação de lead, eventos, recibo de privacidade e outbox ocorre na mesma transação PostgreSQL; e-mail é efeito posterior.

**Tech Stack:** Next.js Route Handlers, TypeScript, Zod, Payload Local API, PostgreSQL transactions, S3-compatible private storage, Cloudflare Turnstile, ClamAV worker, Vitest, Testing Library, Playwright.

## Global Constraints

- Executar depois dos planos 01 e 03; consumir identidade, auditoria, settings e documentos legais gerados por eles, e criar aqui todas as collections operacionais de leads.
- WhatsApp oficial: `+55 61 99683-1052`; link base `https://wa.me/5561996831052`.
- O formulário inteiro fica fechado em produção até controlador, aviso, canal do titular, finalidade/base revisadas, responsáveis e retenção estarem configurados.
- Campos obrigatórios: serviço, cidade, UF, descrição, nome, WhatsApp e ciência da política.
- Consentimento de marketing é separado, opcional e começa desmarcado.
- Máximo de dez arquivos, 15 MB por arquivo e 50 MB por envio; somente JPEG, PNG, WebP e PDF.
- Vídeo, ZIP, executável, documento ativo e CAD não entram no formulário.
- Nenhum anexo tem URL pública permanente; falha de varredura mantém quarentena.
- A mesma chave de idempotência por 24 horas retorna o mesmo protocolo.
- O protocolo não é incluído automaticamente na URL do WhatsApp.
- Nenhum dado pessoal, descrição, protocolo ou nome de arquivo vai para analytics.
- Nenhum dado pessoal, token, IP bruto, protocolo, nome de arquivo, destinatário de e-mail ou conteúdo de campo livre vai para logs; logs operacionais usam somente IDs opacos, códigos de erro allowlisted, contadores e timestamps.
- `privacyLifecycleStatus` tem uma única enum em toda a fase: `active | retention_pending | anonymized`; `disposalReason` é `null | retention_expired | data_subject_request`. Estado comercial e lifecycle de privacidade nunca são misturados.
- Todo código começa por teste falhando e cada tarefa termina em commit próprio.

## File Map

- `src/features/leads/types.ts`: contratos do domínio de leads.
- `src/features/leads/schema.ts`: validação e normalização do envio.
- `src/features/leads/conditional-fields.ts`: perguntas condicionais por serviço.
- `src/features/privacy/lead-gate.ts`: decisão determinística de abertura do formulário.
- `src/features/leads/form/*`: máquina e componentes do formulário progressivo.
- `src/features/uploads/*`: política, armazenamento privado e ciclo de quarentena.
- `src/features/leads/submit-lead.ts`: transação idempotente.
- `src/features/security/*`: origem confiável, Turnstile e limite de requisição.
- `src/features/notifications/*`: outbox e e-mail transacional.
- `src/collections/{Leads,LeadEvents,UploadSessions,LeadAttachments,PrivacyReceipts,OutboxEvents,FileAccessEvents,DataSubjectRequests,RequestRateLimits,PrivacyTombstones,WorkerRunStates}.ts`: dados operacionais privados e estado operacional sem PII.
- `src/migrations/20260725_000003_leads_privacy_security.ts`: schema operacional incremental.
- `src/app/api/lead-submissions/route.ts`: endpoint público de lead.
- `src/app/api/upload-sessions/route.ts`: criação de uploads assinados.
- `src/app/api/lead-attachments/[id]/download/route.ts`: download privado, autenticado, com MFA e auditoria anterior à URL.
- `src/app/api/admin/leads/[id]/status/route.ts`: única entrada HTTP para transição comercial auditada.
- `src/app/(frontend)/orcamento/page.tsx`: gate e formulário público.
- `tests/e2e/lead-form.spec.ts`: fluxo completo no navegador.

---

### Task 1: Contratos e validação do lead

**Files:**
- Create: `src/features/leads/types.ts`
- Create: `src/features/leads/schema.ts`
- Create: `src/features/leads/conditional-fields.ts`
- Create: `src/features/leads/service-definition.ts`
- Create: `src/features/privacy/retention-constants.ts`
- Create: `src/features/leads/schema.test.ts`
- Create: `src/test/factories/lead.ts`

**Interfaces:**
- Produces: `serviceValues`, `ServiceValue`, `LeadSubmissionRequest`, `ValidatedLeadSubmission`, `leadSubmissionRequestSchema`, `validatedLeadSubmissionSchema`, `serviceDefinitions`, `validLeadInput()` e `validValidatedLead()`.
- Consumes: nenhum módulo de negócio.

- [ ] **Step 1: Escrever o teste falhando de normalização e limites**

```ts
// src/features/leads/schema.test.ts
import { describe, expect, it } from 'vitest'
import { validLeadInput } from '@/test/factories/lead'
import { leadSubmissionRequestSchema } from './schema'

describe('leadSubmissionRequestSchema', () => {
  it('normaliza UF e WhatsApp e aceita o conjunto mínimo', () => {
    const parsed = leadSubmissionRequestSchema.parse(
      validLeadInput({ state: 'df', whatsapp: '(61) 99683-1052' }),
    )
    expect(parsed.state).toBe('DF')
    expect(parsed.whatsapp).toBe('5561996831052')
  })

  it('rejeita mais de dez anexos e marketing implícito', () => {
    const input = validLeadInput({
      attachments: Array.from({ length: 11 }, () => ({ sessionId: crypto.randomUUID(), associationToken: 'x'.repeat(43) })),
      marketingConsent: undefined,
    })
    const result = leadSubmissionRequestSchema.safeParse(input)
    expect(result.success).toBe(false)
  })
})
```

- [ ] **Step 2: Executar o teste e confirmar a falha**

Run: `npm run test:unit -- src/features/leads/schema.test.ts`

Expected: FAIL porque `./schema` e a factory ainda não existem.

- [ ] **Step 3: Implementar tipos, schema e factory mínima**

```ts
// src/features/leads/types.ts
export const serviceValues = [
  'complete-build',
  'industrial-kitchen',
  'custom-equipment',
  'ventilation-exhaust',
  'integrated-systems',
  'technical-project-cnc',
  'renovation',
  'maintenance',
] as const

export type ServiceValue = (typeof serviceValues)[number]

export const brazilianStates = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS',
  'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC',
  'SP', 'SE', 'TO',
] as const
export type BrazilianState = (typeof brazilianStates)[number]

export type LeadAttribution = {
  source: 'direct' | 'organic' | 'referral' | 'campaign' | 'unknown'
  landingPath: `/${string}`
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  utmContent?: string
  utmTerm?: string
}

export type LeadSubmissionRequest = {
  idempotencyKey: string
  service: ServiceValue
  city: string
  state: BrazilianState
  description: string
  name: string
  whatsapp: string
  company?: string
  email?: string
  attachments: { sessionId: string; associationToken: string }[]
  privacyAcknowledged: true
  marketingConsent: boolean
  conditional: Record<string, string | number | boolean>
  turnstileToken: string
  attribution: LeadAttribution
}

export type LeadSubmissionInput = Omit<LeadSubmissionRequest, 'state' | 'whatsapp'> & {
  state: string
  whatsapp: string
}

export type ValidatedLeadSubmission = Omit<LeadSubmissionRequest, 'turnstileToken'> & {
  privacyDocumentId: string
  privacyDocumentVersion: string
  privacyDocumentHash: string
  retentionPolicyDays: number
  retentionUntil: string
}
```

```ts
// src/features/privacy/retention-constants.ts
export const LEAD_RETENTION_DAYS_MIN = 1
export const LEAD_RETENTION_DAYS_MAX = 3650
```

```ts
// src/features/leads/schema.ts
import { z } from 'zod'
import { LEAD_RETENTION_DAYS_MAX, LEAD_RETENTION_DAYS_MIN } from '@/features/privacy/retention-constants'
import { conditionalFields } from './conditional-fields'
import { brazilianStates, serviceValues, type ServiceValue } from './types'

const normalizePhone = (value: string) => {
  const digits = value.replace(/\D/g, '')
  if (digits.length === 10 || digits.length === 11) return `55${digits}`
  if ((digits.length === 12 || digits.length === 13) && digits.startsWith('55')) return digits
  return 'invalid'
}

const attributionValue = z.string().trim().min(1).max(100).regex(/^[\p{L}\p{N}._~-]+$/u)

const persistedShape = {
  idempotencyKey: z.string().uuid(),
  service: z.enum(serviceValues),
  city: z.string().trim().min(2).max(80),
  state: z.string().trim().transform((value) => value.toUpperCase()).pipe(z.enum(brazilianStates)),
  description: z.string().trim().min(20).max(4000),
  name: z.string().trim().min(2).max(120),
  whatsapp: z.string().transform(normalizePhone).pipe(z.string().regex(/^55\d{10,11}$/)),
  company: z.string().trim().max(160).optional().or(z.literal('')),
  email: z.string().trim().email().max(254).optional().or(z.literal('')),
  attachments: z.array(z.object({
    sessionId: z.string().uuid(),
    associationToken: z.string().min(32).max(128),
  }).strict()).max(10).default([]),
  privacyAcknowledged: z.literal(true),
  marketingConsent: z.boolean().default(false),
  conditional: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).default({}),
  attribution: z.object({
    source: z.enum(['direct', 'organic', 'referral', 'campaign', 'unknown']),
    landingPath: z.string().regex(/^\/[^?#]{0,300}$/),
    utmSource: attributionValue.optional(),
    utmMedium: attributionValue.optional(),
    utmCampaign: attributionValue.optional(),
    utmContent: attributionValue.optional(),
    utmTerm: attributionValue.optional(),
  }).strict(),
} as const

const validateConditionalFields = (
  input: { service: ServiceValue; conditional: Record<string, unknown> },
  ctx: z.RefinementCtx,
) => {
  const definitions = conditionalFields[input.service]
  const allowed = new Map(definitions.map((field) => [field.name, field]))
  for (const key of Object.keys(input.conditional)) {
    const field = allowed.get(key)
    if (!field) {
      ctx.addIssue({ code: 'custom', path: ['conditional', key], message: 'Campo não permitido para o serviço selecionado' })
      continue
    }
    const value = input.conditional[key]
    const valid =
      (field.kind === 'text' && typeof value === 'string' && value.trim().length >= 1 && value.trim().length <= 500) ||
      (field.kind === 'number' && typeof value === 'number' && Number.isFinite(value) && value > 0 && value <= 100_000) ||
      (field.kind === 'boolean' && typeof value === 'boolean') ||
      (field.kind === 'select' && typeof value === 'string' && field.options?.includes(value))
    if (!valid) ctx.addIssue({ code: 'custom', path: ['conditional', key], message: 'Valor inválido para o campo condicional' })
  }
}

export const leadSubmissionRequestSchema = z.object({
  ...persistedShape,
  turnstileToken: z.string().min(1).max(2048),
}).strict().superRefine(validateConditionalFields)

export const validatedLeadSubmissionSchema = z.object({
  ...persistedShape,
  privacyDocumentId: z.string().min(1).max(120),
  privacyDocumentVersion: z.string().min(1).max(40),
  privacyDocumentHash: z.string().regex(/^[a-f0-9]{64}$/),
  retentionPolicyDays: z.number().int().min(LEAD_RETENTION_DAYS_MIN).max(LEAD_RETENTION_DAYS_MAX),
  retentionUntil: z.string().datetime(),
}).strict().superRefine(validateConditionalFields)
```

```ts
// src/test/factories/lead.ts
import type { LeadSubmissionInput, ValidatedLeadSubmission } from '@/features/leads/types'

export const validLeadInput = (
  override: Partial<LeadSubmissionInput> = {},
): LeadSubmissionInput => ({
  idempotencyKey: crypto.randomUUID(),
  service: 'industrial-kitchen',
  city: 'Brasília',
  state: 'DF',
  description: 'Construção de cozinha industrial em espaço comercial novo.',
  name: 'Contato de Teste',
  whatsapp: '5561999999999',
  attachments: [],
  privacyAcknowledged: true,
  marketingConsent: false,
  conditional: {},
  turnstileToken: 'test-turnstile-token',
  attribution: { source: 'direct', landingPath: '/orcamento' },
  ...override,
})

export const validValidatedLead = (
  override: Partial<ValidatedLeadSubmission> = {},
): ValidatedLeadSubmission => {
  const { turnstileToken: _discard, ...request } = validLeadInput()
  return {
    ...request,
    privacyDocumentId: 'privacy-test-id',
    privacyDocumentVersion: '2026-07-25',
    privacyDocumentHash: 'a'.repeat(64),
    retentionPolicyDays: 730,
    retentionUntil: '2028-07-24T12:00:00.000Z',
    ...override,
  }
}
```

- [ ] **Step 4: Implementar e testar a matriz de perguntas condicionais**

```ts
// src/features/leads/conditional-fields.ts
import type { ServiceValue } from './types'

export type ConditionalField = {
  name: string
  label: string
  kind: 'text' | 'number' | 'boolean' | 'select'
  options?: readonly string[]
}

export const conditionalFields: Record<ServiceValue, readonly ConditionalField[]> = {
  'complete-build': [
    { name: 'newOrRenovation', label: 'É construção nova ou reforma?', kind: 'select', options: ['Construção nova', 'Reforma'] },
    { name: 'isOperating', label: 'O local já está funcionando?', kind: 'boolean' },
    { name: 'establishmentType', label: 'Tipo de estabelecimento', kind: 'text' },
    { name: 'approximateArea', label: 'Área aproximada em m²', kind: 'number' },
  ],
  'industrial-kitchen': [
    { name: 'newOrRenovation', label: 'É construção nova ou reforma?', kind: 'select', options: ['Construção nova', 'Reforma'] },
    { name: 'isOperating', label: 'O local já está funcionando?', kind: 'boolean' },
    { name: 'establishmentType', label: 'Tipo de estabelecimento', kind: 'text' },
    { name: 'approximateArea', label: 'Área aproximada em m²', kind: 'number' },
  ],
  'custom-equipment': [
    { name: 'desiredItem', label: 'Item desejado', kind: 'text' },
    { name: 'quantity', label: 'Quantidade', kind: 'number' },
    { name: 'hasMeasurements', label: 'Possui medidas?', kind: 'boolean' },
    { name: 'hasDrawing', label: 'Possui desenho ou planta?', kind: 'boolean' },
  ],
  'ventilation-exhaust': [
    { name: 'environmentType', label: 'Tipo de ambiente', kind: 'text' },
    { name: 'hasHood', label: 'Já existe coifa no local?', kind: 'boolean' },
    { name: 'isOperating', label: 'A operação está funcionando?', kind: 'boolean' },
    { name: 'observedProblem', label: 'Problema observado', kind: 'text' },
  ],
  'integrated-systems': [
    { name: 'system', label: 'Sistema envolvido', kind: 'select', options: ['Refrigeração', 'Aquecimento', 'Automação'] },
    { name: 'relatedEquipment', label: 'Equipamento relacionado', kind: 'text' },
    { name: 'quantity', label: 'Quantidade', kind: 'number' },
    { name: 'expectedBehavior', label: 'Comportamento esperado', kind: 'text' },
  ],
  'technical-project-cnc': [
    { name: 'desiredItem', label: 'Peça ou item desejado', kind: 'text' },
    { name: 'quantity', label: 'Quantidade de peças', kind: 'number' },
    { name: 'hasMeasurements', label: 'Possui medidas?', kind: 'boolean' },
    { name: 'hasDrawing', label: 'Possui desenho ou planta?', kind: 'boolean' },
  ],
  renovation: [
    { name: 'existingStructure', label: 'Estrutura existente', kind: 'text' },
    { name: 'objective', label: 'Objetivo da alteração', kind: 'text' },
    { name: 'mustRemainOperating', label: 'A operação precisa continuar ativa?', kind: 'boolean' },
  ],
  maintenance: [
    { name: 'equipmentCount', label: 'Quantidade aproximada de equipamentos', kind: 'number' },
    { name: 'observedFailure', label: 'Falha observada', kind: 'text' },
    { name: 'urgency', label: 'Nível de urgência', kind: 'select', options: ['Planejada', 'Alta', 'Operação parada'] },
  ],
}
```

```ts
// src/features/leads/service-definition.ts
import type { WhatsAppContext } from '@/modules/whatsapp/contexts'
import type { ServiceValue } from './types'

export const serviceDefinitions: Record<ServiceValue, {
  label: string
  publicSlug: string
  whatsappContext: WhatsAppContext
}> = {
  'complete-build': { label: 'Construção completa', publicSlug: 'cozinhas-industriais', whatsappContext: 'kitchen' },
  'industrial-kitchen': { label: 'Cozinha industrial', publicSlug: 'cozinhas-industriais', whatsappContext: 'kitchen' },
  'custom-equipment': { label: 'Equipamento sob medida', publicSlug: 'equipamentos-em-inox', whatsappContext: 'equipment' },
  'ventilation-exhaust': { label: 'Ventilação e exaustão', publicSlug: 'coifas-ventilacao-e-exaustao', whatsappContext: 'ventilation' },
  'integrated-systems': { label: 'Sistemas integrados', publicSlug: 'sistemas-integrados-em-inox', whatsappContext: 'integrated-systems' },
  'technical-project-cnc': { label: 'Projeto técnico e CNC', publicSlug: 'projeto-tecnico-e-fabricacao-cnc', whatsappContext: 'cnc' },
  renovation: { label: 'Reforma e modernização', publicSlug: 'reformas-e-modernizacoes', whatsappContext: 'renovation' },
  maintenance: { label: 'Manutenção', publicSlug: 'manutencao', whatsappContext: 'maintenance' },
}
```

Run: `npm run test:unit -- src/features/leads/schema.test.ts`

Além das chaves, testar por serviço: select fora da allowlist, texto vazio/acima de 500, número negativo/zero/`NaN`/acima de 100.000, tipo boolean incorreto e chave cruzada. Testar telefone nacional de 10/11 dígitos nos DDDs 55 e 61, além de E.164 de 12/13 dígitos; somente os nacionais recebem prefixo `55`. Testar `df`/`SP` válidos e `ZZ` inválido contra a enum fechada das 27 UFs.

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/features/leads src/features/privacy/retention-constants.ts src/test/factories/lead.ts
git commit -m "feat: define lead submission contract"
```

---

### Task 2: Gate de privacidade para o formulário inteiro

**Files:**
- Create: `src/features/privacy/lead-gate.ts`
- Create: `src/features/privacy/lead-gate.test.ts`
- Create: `src/features/privacy/get-lead-privacy-readiness.ts`
- Modify: `src/globals/SiteSettings.ts`

**Interfaces:**
- Consumes: grupo privado de privacidade do global `site-settings` e documento publicado `legal-documents` do plano 03.
- Produces: `LeadGateInput`, `LeadGateResult`, `LeadPrivacyReadiness`, `evaluateLeadGate()`, `getLeadPrivacyReadiness()`, `assertLeadCollectionEnabled()`; o DTO é somente servidor e nunca amplia `PublicSiteSettings` com IDs internos.

- [ ] **Step 1: Escrever o teste falhando do gate fail-closed**

```ts
// src/features/privacy/lead-gate.test.ts
import { describe, expect, it } from 'vitest'
import { evaluateLeadGate } from './lead-gate'

const complete = {
  controllerName: 'Designer Inox Brasil',
  privacyContact: 'privacidade@example.com',
  purposeAndBasisReviewedAt: '2026-07-25T12:00:00.000Z',
  leadRetentionDays: 730,
  privacyDocumentId: 'privacy-doc-id',
  privacyDocumentVersion: '2026-07-25',
  privacyDocumentHash: 'a'.repeat(64),
  privacyDocumentPublished: true,
  authorizedUserIds: ['user-commercial-1'],
  activeAuthorizedUserIds: ['user-commercial-1'],
}

describe('evaluateLeadGate', () => {
  it('fecha quando qualquer requisito está ausente', () => {
    expect(evaluateLeadGate({ ...complete, privacyContact: '' })).toEqual({
      open: false,
      missing: ['privacyContact'],
    })
  })

  it('abre somente com todos os requisitos', () => {
    expect(evaluateLeadGate(complete)).toEqual({ open: true, missing: [] })
  })
})
```

- [ ] **Step 2: Executar o teste e confirmar a falha**

Run: `npm run test:unit -- src/features/privacy/lead-gate.test.ts`

Expected: FAIL porque `evaluateLeadGate` não existe.

- [ ] **Step 3: Implementar o gate determinístico**

```ts
// src/features/privacy/lead-gate.ts
import { LEAD_RETENTION_DAYS_MAX, LEAD_RETENTION_DAYS_MIN } from './retention-constants'

export type LeadGateInput = {
  controllerName?: string
  privacyContact?: string
  purposeAndBasisReviewedAt?: string
  leadRetentionDays?: number
  privacyDocumentId?: string
  privacyDocumentVersion?: string
  privacyDocumentHash?: string
  privacyDocumentPublished: boolean
  authorizedUserIds: string[]
  activeAuthorizedUserIds: string[]
}

const required = [
  'controllerName',
  'privacyContact',
  'purposeAndBasisReviewedAt',
  'leadRetentionDays',
  'privacyDocumentId',
  'privacyDocumentVersion',
  'privacyDocumentHash',
] as const

export type LeadGateResult =
  | { open: true; missing: [] }
  | { open: false; missing: string[] }

export const evaluateLeadGate = (input: LeadGateInput, now = new Date()): LeadGateResult => {
  const missing: string[] = required.filter((key) => !input[key])
  const reviewedAt = Date.parse(input.purposeAndBasisReviewedAt ?? '')
  if (!Number.isFinite(reviewedAt) || reviewedAt > now.getTime()) missing.push('purposeAndBasisReviewedAt')
  if (!Number.isInteger(input.leadRetentionDays) || (input.leadRetentionDays ?? 0) < LEAD_RETENTION_DAYS_MIN || (input.leadRetentionDays ?? 0) > LEAD_RETENTION_DAYS_MAX) missing.push('leadRetentionDays')
  if (!input.privacyDocumentPublished) missing.push('privacyDocumentPublished')
  if (!/^[a-f0-9]{64}$/.test(input.privacyDocumentHash ?? '')) missing.push('privacyDocumentHash')
  if (input.authorizedUserIds.length === 0 || input.activeAuthorizedUserIds.length === 0) missing.push('authorizedUserIds')
  return { open: missing.length === 0, missing: [...new Set(missing)] }
}
```

- [ ] **Step 4: Implementar a leitura interna sem expor pendências**

```ts
export type LeadPrivacyReadiness = LeadGateInput

export async function getLeadPrivacyReadiness(): Promise<LeadPrivacyReadiness>
export async function assertLeadCollectionEnabled(): Promise<LeadPrivacyReadiness>
```

`getLeadPrivacyReadiness()` é estritamente read-only: consulta apenas `site-settings`, o documento de privacidade com `_status='published'`, `workflow.state='published'` e `deletedAt=null`, e resolve `authorizedUserIds` contra usuários ativos com papel `commercial` ou `admin` e e-mail de autenticação válido. IDs inexistentes, usuários desativados, sem destinatário entregável ou com papel inadequado não entram em `activeAuthorizedUserIds`. `LEAD_RETENTION_DAYS_MIN=1` e `LEAD_RETENTION_DAYS_MAX=3650` são importados por schema CMS, readiness e schema interno, sem limites duplicados. `assertLeadCollectionEnabled()` chama essa leitura, executa `evaluateLeadGate()` e lança `LEAD_COLLECTION_DISABLED` quando fechado. Retorna dados internos somente no servidor, nunca os serializa para o cliente e falha fechado quando Payload, banco ou consulta falhar. Não escreve alerta, auditoria, rate limit ou qualquer outro registro no caminho de uma requisição pública bloqueada; o monitor de readiness da Task 10 alerta fora desse request. Testar `0`, negativo, `NaN`, `3650` (abre), `3651` (fecha), data inválida/futura, documento sem ID/versão/hash e usuário inexistente/inativo/sem e-mail. A integração da página ocorre na Task 3, depois de `LeadForm` existir.

Run: `npm run test:unit -- src/features/privacy/lead-gate.test.ts && npm run typecheck`

Expected: PASS e zero erros de tipo.

- [ ] **Step 5: Commit**

```bash
git add src/features/privacy src/globals/SiteSettings.ts
git commit -m "feat: gate lead collection on privacy readiness"
```

---

### Task 3: Formulário progressivo acessível

**Files:**
- Create: `src/features/leads/form/lead-form.tsx`
- Create: `src/features/leads/form/lead-form-reducer.ts`
- Create: `src/features/leads/form/lead-form-reducer.test.ts`
- Create: `src/features/leads/form/step-project.tsx`
- Create: `src/features/leads/form/step-contact.tsx`
- Create: `src/features/leads/form/conditional-fields.tsx`
- Create: `src/features/leads/form/lead-form.test.tsx`
- Create: `src/features/leads/form/lead-success.tsx`
- Modify: `src/app/(frontend)/orcamento/page.tsx`
- Modify: `src/app/sitemap.ts`
- Modify: `src/app/robots.ts`
- Modify: `next.config.ts`

**Interfaces:**
- Consumes: `leadSubmissionRequestSchema`, `conditionalFields`, `Button`, `Field`, `FilePicker`, `QuoteGate`, `getLeadPrivacyReadiness()` e `evaluateLeadGate()`.
- Produces: `LeadForm`, `LeadFormState`, `leadFormReducer`.

- [ ] **Step 1: Escrever teste falhando da máquina de duas etapas**

```ts
// src/features/leads/form/lead-form-reducer.test.ts
import { describe, expect, it } from 'vitest'
import { initialLeadFormState, leadFormReducer } from './lead-form-reducer'

describe('leadFormReducer', () => {
  it('não avança quando faltam os campos da etapa de projeto', () => {
    const state = leadFormReducer(initialLeadFormState(), { type: 'NEXT' })
    expect(state.step).toBe('project')
    expect(state.errors).toHaveProperty('service')
  })

  it('volta sem apagar os dados preenchidos', () => {
    let state = initialLeadFormState()
    state = leadFormReducer(state, { type: 'PATCH', value: { service: 'maintenance', city: 'Brasília', state: 'DF', description: 'Manutenção planejada em equipamentos industriais.' } })
    state = leadFormReducer(state, { type: 'NEXT' })
    state = leadFormReducer(state, { type: 'BACK' })
    expect(state.data.service).toBe('maintenance')
  })
})
```

- [ ] **Step 2: Executar o teste e confirmar a falha**

Run: `npm run test:unit -- src/features/leads/form/lead-form-reducer.test.ts`

Expected: FAIL por módulo inexistente.

- [ ] **Step 3: Implementar o reducer com passos explícitos**

```ts
// src/features/leads/form/lead-form-reducer.ts
import type { LeadSubmissionInput } from '../types'

export type LeadFormState = {
  step: 'project' | 'contact' | 'success'
  data: Partial<LeadSubmissionInput>
  errors: Record<string, string>
  submitting: boolean
  protocol?: string
}

export const initialLeadFormState = (): LeadFormState => ({
  step: 'project', data: {}, errors: {}, submitting: false,
})

type Action =
  | { type: 'PATCH'; value: Partial<LeadSubmissionInput> }
  | { type: 'NEXT' }
  | { type: 'BACK' }
  | { type: 'SUBMITTING' }
  | { type: 'SUCCESS'; protocol: string }
  | { type: 'ERROR'; errors: Record<string, string> }

export const leadFormReducer = (state: LeadFormState, action: Action): LeadFormState => {
  if (action.type === 'PATCH') return { ...state, data: { ...state.data, ...action.value } }
  if (action.type === 'BACK') return { ...state, step: 'project', errors: {} }
  if (action.type === 'NEXT') {
    const errors = Object.fromEntries(
      ['service', 'city', 'state', 'description']
        .filter((key) => !state.data[key as keyof LeadSubmissionInput])
        .map((key) => [key, 'Campo obrigatório']),
    )
    return Object.keys(errors).length ? { ...state, errors } : { ...state, step: 'contact', errors: {} }
  }
  if (action.type === 'SUBMITTING') return { ...state, submitting: true, errors: {} }
  if (action.type === 'SUCCESS') return { ...state, submitting: false, step: 'success', protocol: action.protocol }
  return { ...state, submitting: false, errors: action.errors }
}
```

- [ ] **Step 4: Implementar UI sem perder foco ou dados**

```tsx
// estrutura de src/features/leads/form/lead-form.tsx
'use client'

export function LeadForm() {
  const [state, dispatch] = useReducer(leadFormReducer, undefined, initialLeadFormState)
  const headingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => headingRef.current?.focus(), [state.step])

  if (state.step === 'success') {
    return <LeadSuccess protocol={state.protocol!} />
  }

  return (
    <form noValidate aria-labelledby="lead-form-title">
      <h2 id="lead-form-title" ref={headingRef} tabIndex={-1}>
        {state.step === 'project' ? 'Conte sobre o projeto' : 'Como podemos falar com você?'}
      </h2>
      {state.step === 'project' ? <StepProject state={state} dispatch={dispatch} /> : <StepContact state={state} dispatch={dispatch} />}
    </form>
  )
}
```

`LeadSuccess` mostra o protocolo, oferece `CopyButton`, link para Home e `WhatsAppLink context="general"`; o href do WhatsApp não recebe protocolo nem qualquer outro valor do lead. Arquivos de vídeo, ZIP, executáveis e CAD exibem a orientação literal `Envie esse material pelo WhatsApp` em vez de entrar no picker.

Integrar a rota somente agora:

```tsx
const readiness = await getLeadPrivacyReadiness()
return evaluateLeadGate(readiness).open ? <LeadForm /> : <QuoteGate />
```

A página não recebe nem imprime `missing`, IDs de responsáveis ou hash legal.

`/orcamento` chama `await connection()` antes da readiness, nunca usa cache editorial e recebe `Cache-Control: private, no-store, max-age=0` por configuração de headers. Um teste alterna o gate entre duas requisições consecutivas sem revalidation e vê `QuoteGate` → `LeadForm` imediatamente. Fechado, metadata usa `noindex` e a URL fica fora do sitemap; aberto, metadata/sitemap são habilitados sem alterar o CTA permanente `Enviar formulário detalhado`, que sempre aponta para `/orcamento` e funciona também quando a página mostra o fallback por WhatsApp.

Run: `npm run test:unit -- src/features/leads/form && npm run typecheck`

Expected: PASS; a etapa muda, o foco vai ao título e voltar preserva os dados.

- [ ] **Step 5: Commit**

```bash
git add src/features/leads/form 'src/app/(frontend)/orcamento/page.tsx' src/app/sitemap.ts src/app/robots.ts next.config.ts
git commit -m "feat: add accessible progressive lead form"
```

---

### Task 4: Collections operacionais, acesso e migração

**Files:**
- Create: `src/collections/Leads.ts`
- Create: `src/collections/LeadEvents.ts`
- Create: `src/collections/UploadSessions.ts`
- Create: `src/collections/LeadAttachments.ts`
- Create: `src/collections/PrivacyReceipts.ts`
- Create: `src/collections/OutboxEvents.ts`
- Create: `src/collections/FileAccessEvents.ts`
- Create: `src/collections/DataSubjectRequests.ts`
- Create: `src/collections/RequestRateLimits.ts`
- Create: `src/collections/PrivacyTombstones.ts`
- Create: `src/collections/WorkerRunStates.ts`
- Create: `src/modules/leads/collection-access.ts`
- Create: `src/modules/leads/status.ts`
- Create: `src/modules/leads/status.test.ts`
- Verify; modify only if the contract test detects drift: `src/modules/audit/events.ts`
- Modify: `src/modules/audit/write-audit-event.ts`
- Modify: `src/payload.config.ts`
- Modify: `src/payload-types.ts` — somente por `npm run generate:types`
- Create: `src/migrations/20260725_000003_leads_privacy_security.ts`
- Modify: `src/migrations/index.ts`
- Test: `tests/unit/leads/collection-contracts.test.ts`
- Test: `tests/unit/leads/audit-contract.test.ts`
- Test: `tests/integration/leads/operational-access.test.ts`
- Test: `tests/integration/migrations/leads-privacy-security.test.ts`

**Interfaces:**
- Consumes: `Role`, `hasVerifiedMfa()`, `AuditEventName`, `writeAuditEvent()` e `writeSystemAuditEvent()` do Plano 3.
- Produces: slugs `leads`, `lead-events`, `upload-sessions`, `lead-attachments`, `privacy-receipts`, `outbox-events`, `file-access-events`, `data-subject-requests`, `request-rate-limits`, `privacy-tombstones`, `worker-run-states` e tipos Payload gerados. O tipo de evento continua tendo uma única fonte em `src/modules/audit/events.ts`; esta fase não cria union paralela.

- [ ] **Step 1: Escrever contratos falhando de schema e acesso**

O teste importa todas as configs e exige os campos abaixo, `timestamps: true`, nenhum upload público, nenhuma URL pública e os índices únicos indicados:

```ts
export const operationalFields = {
  leads: ['protocol', 'idempotencyKey', 'service', 'city', 'state', 'description', 'name', 'whatsapp', 'company', 'email', 'conditional', 'attribution', 'status', 'statusVersion', 'privacyLifecycleStatus', 'disposalReason', 'assignedTo', 'releasedToCommercial', 'commercialNotes', 'retentionPolicyDays', 'retentionUntil'],
  leadEvents: ['lead', 'type', 'actor', 'fromStatus', 'toStatus', 'reason', 'note'],
  uploadSessions: ['storageKey', 'originalName', 'declaredMime', 'expectedBytes', 'detectedMime', 'sha256', 'status', 'uploadTokenHash', 'uploadTokenUsedAt', 'associationTokenHash', 'associationTokenUsedAt', 'idempotencyKey', 'expiresAt', 'associatedLead'],
  leadAttachments: ['lead', 'uploadSession', 'storageKey', 'originalName', 'detectedMime', 'bytes', 'sha256', 'status', 'retentionUntil'],
  privacyReceipts: ['lead', 'legalDocument', 'legalVersion', 'legalHash', 'acknowledgedAt', 'marketingConsent', 'retentionUntil'],
  outboxEvents: ['type', 'aggregateId', 'payload', 'status', 'attempts', 'nextAttemptAt', 'leaseOwner', 'leaseExpiresAt', 'deduplicationKey', 'lastErrorCode'],
  fileAccessEvents: ['attachment', 'lead', 'actor', 'purpose', 'occurredAt'],
  dataSubjectRequests: ['requestType', 'requesterContact', 'identityStatus', 'status', 'assignedTo', 'subjectLeads', 'targetsReviewedAt', 'targetsReviewedBy', 'dueAt', 'resolvedAt', 'resolutionNote', 'exportStorageKey', 'exportSha256', 'exportExpiresAt'],
  requestRateLimits: ['action', 'keyKind', 'keyHash', 'windowStartedAt', 'count', 'expiresAt'],
  privacyTombstones: ['subjectCollection', 'subjectId', 'reason', 'effectiveAt', 'sourceAuditEventId', 'ledgerVersion', 'ledgerSequence', 'ledgerObjectKey', 'ledgerDigest', 'keyVersion', 'replicatedAt'],
  workerRunStates: ['workerName', 'status', 'lastStartedAt', 'lastSucceededAt', 'lastFailedAt', 'lastErrorCode', 'leaseOwner', 'leaseExpiresAt', 'oldestPendingAt', 'pendingCount', 'checkpointSequence', 'checkpointDigest'],
} as const
```

`storageKey` e `deduplicationKey` são únicos. `protocol` e `idempotencyKey` são nullable e usam índices unique parciais separados somente quando não nulos, permitindo apagar ambos na anonimização sem quebrar unicidade. Validators exigem os dois em lifecycle `active`. `payload` da outbox contém apenas IDs, protocolo, serviço e cidade/UF; nunca PII livre ou anexo. `request-rate-limits` nunca armazena IP bruto; `keyKind` é `ip | session`, action/keyKind aceitam somente os pares definidos na Task 7 e há unique composto `(action, keyKind, keyHash, windowStartedAt)`, para que políticas de endpoints/sessão não compartilhem contador. `privacy-tombstones` é immutable-after-create/internal-only, nasce completa somente depois da replicação externa confirmada, não contém protocolo, contato, hash de arquivo nem outro dado do titular, tem unique composto `(subjectCollection, subjectId, reason)` e unique em `ledgerSequence`; somente o worker de expiração do ledger pode removê-la após a prova da matriz da Task 10. `worker-run-states.workerName` é unique e enum fechada `publication | attachment-scan | lead-outbox | abandoned-upload | operational-cleanup | retention-mark | retention-finalize | dsr-export-cleanup | privacy-ledger-replication`; `status` é `idle | running | succeeded | failed`, `lastErrorCode` aceita somente código enumerado, e nenhuma coluna aceita payload, mensagem de exception, ID de lead, token ou PII. Cada worker mantém uma única row corrente, não histórico crescente; a row `privacy-ledger-replication` usa `checkpointSequence/checkpointDigest` como head monotônico do ledger.

Consumir e verificar o catálogo **já canônico do Plano 3** em `src/modules/audit/events.ts`. `tests/unit/leads/audit-contract.test.ts` importa `AUDIT_EVENT_NAMES`, `AUDIT_SYSTEM_ACTORS` e `AuditEventName` centrais e exige exatamente os literais usados nesta fase: `lead.created`, `lead.pii_read`, `lead.status_changed`, `lead.disposal_requested`, `lead.attachment_download_authorized`, `lead.attachment_scan_clean`, `lead.attachment_scan_rejected`, `lead.notification_sent`, `lead.notification_failed`, `upload.security_rejected`, `privacy.upload_expired`, `privacy.retention_marked`, `privacy.lead_anonymized`, `privacy.request_created`, `privacy.request_identity_verified`, `privacy.export_created`, `privacy.request_resolved`, `privacy.marketing_revoked` e `privacy.tombstone_reapplied`; exige também `lead-intake`, `upload-inspector`, `scan-worker`, `outbox-worker`, `retention-worker` e `privacy-worker`. Não criar `LeadAuditEventName`, array ou union paralela. Somente se esse teste provar literal/ator ausente, corrigir a fonte central, nunca uma cópia local. Estender `writeSystemAuditEvent()` central com terceiro argumento opcional `{ transactionID }`, aceito somente junto de contexto interno, para que intake/workers escrevam no mesmo transaction ID das mudanças; chamadas existentes continuam compatíveis. Metadata de cada evento é uma allowlist por evento e rejeita chaves/valores livres, PII, protocolo, filename, token, IP e destinatário.

`status.ts` exporta `LEAD_STATUS_VALUES = ['new', 'under_review', 'contacted', 'visit_scheduled', 'proposal_sent', 'negotiation', 'approved', 'not_approved', 'completed'] as const`, rótulos em português e uma matriz fechada de transições. `statusVersion` começa em `0` e sustenta compare-and-swap/lock da Task 9. Toda mudança cria `lead-event` e `lead.status_changed` na mesma transação; update direto do select é bloqueado inclusive para admin. `privacyLifecycleStatus` é independente e tem somente `active | retention_pending | anonymized`; `disposalReason` tem somente `null | retention_expired | data_subject_request`, e retenção nunca inventa estado comercial. Campos pessoais e identificadores são nullable no schema físico, mas um validator exige os obrigatórios enquanto lifecycle=`active`; somente serviço interno de privacidade pode gravar o tombstone anonimizado.

- [ ] **Step 2: Verificar falha**

Run: `npm run test:unit -- tests/unit/leads/collection-contracts.test.ts`

Expected: FAIL por collections ausentes.

- [ ] **Step 3: Implementar collections e matriz de acesso**

- `admin`: lê e administra a operação pelos comandos dedicados; não ganha hard delete de lead/anexo, e descarte motivado usa a Task 10.
- `commercial`: lê somente leads atribuídos ou explicitamente liberados; atualiza `commercialNotes` pela política dedicada e muda `status` somente pelo serviço transacional da Task 9; não altera PII, responsável, idempotência, retenção ou exclusão.
- `editor` e `reader`: não leem PII, anexos, recibos, outbox, rate limit ou solicitações do titular.
- `lead-events`, `privacy-receipts` e `file-access-events`: append-only; nenhuma função pública atualiza ou exclui.
- `upload-sessions`, `lead-attachments`, `outbox-events`, `request-rate-limits`, `privacy-tombstones` e `worker-run-states`: acesso somente por serviços internos com `req.context.internalOperation === true`.
- `data-subject-requests`: somente admin ativo com MFA lê/revisa targets/decide; commercial, editor e reader nunca veem requester contact, targets ou exports.
- hard delete direto de lead/anexo é sempre bloqueado; solicitação administrativa motivada usa o lifecycle da Task 10 e emite `lead.disposal_requested`.
- download existe apenas pelo endpoint autenticado da Task 9, cria `file-access-event` e `lead.attachment_download_authorized` antes de emitir URL assinada e só ocorre com anexo `clean`.

Run: `npm run test:int -- tests/integration/leads/operational-access.test.ts`

Expected: matriz inteira PASS; toda tentativa proibida retorna 403 e não altera dados.

- [ ] **Step 4: Registrar, gerar tipos e criar migração incremental**

Registrar as onze collections em `payload.config.ts`. A migration `20260725_000003_leads_privacy_security.ts` é a dona canônica do schema inicial, incluindo `privacy_tombstones.ledger_sequence/ledger_object_key/ledger_digest/key_version/replicated_at`, unique de sequence e demais índices de tombstone, `data_subject_requests.subject_leads/targets_reviewed_at/targets_reviewed_by/export_storage_key/export_sha256/export_expires_at` (inclusive join/index da relação hasMany), unique composto de `request_rate_limits` e `worker_run_states` com unique em `worker_name` mais checkpoints de head; não deixar esses campos para migration informal do Plano 5. Executar:

```powershell
npm run generate:types
npm run migrate:create -- leads_privacy_security
npm run migrate:test
npm run migrate:status
```

Renomear somente a migration gerada para `20260725_000003_leads_privacy_security.ts`, atualizar `src/migrations/index.ts` e não editar as migrations `000001`/`000002`. O teste parte de banco vazio, aplica `up`, verifica tabelas/índices, executa `down` dessa migration e aplica `up` novamente.

- [ ] **Step 5: Commit**

```bash
git add src/collections src/modules/leads src/modules/audit/events.ts src/modules/audit/write-audit-event.ts src/payload.config.ts src/payload-types.ts src/migrations tests/unit/leads tests/integration/leads tests/integration/migrations
git commit -m "feat(leads): add private operational data model"
```

---

### Task 5: Política e sessões de upload privado

**Files:**
- Create: `src/features/uploads/policy.ts`
- Create: `src/features/uploads/policy.test.ts`
- Create: `src/features/uploads/private-upload-store.ts`
- Create: `src/features/uploads/s3-private-upload-store.ts`
- Create: `src/features/uploads/qpdf-safety-inspector.ts`
- Create: `src/features/uploads/qpdf-safety-inspector.test.ts`
- Create: `src/features/uploads/token-hmac.ts`
- Create: `src/features/uploads/token-hmac.test.ts`
- Create: `scripts/pdf-inspector-server.mjs`
- Create: `scripts/verify-qpdf-supply-chain.mjs`
- Create: `docker/pdf-inspector.Dockerfile`
- Create: `docker/qpdf.lock`
- Create: `compose.pdf-inspector.yaml`
- Test: `tests/integration/uploads/qpdf-inspector.int.test.ts`
- Test fixtures: `tests/fixtures/uploads/pdf/*`
- Create: `src/features/uploads/create-upload-session.ts`
- Create: `src/features/uploads/complete-upload.ts`
- Create: `src/features/uploads/upload-api-client.ts`
- Create: `src/features/uploads/upload-manager.ts`
- Create: `src/features/uploads/upload-manager.test.ts`
- Create: `src/app/api/upload-sessions/route.ts`
- Create: `src/app/api/upload-sessions/[id]/complete/route.ts`
- Modify: `src/features/leads/form/lead-form.tsx`
- Modify: `src/features/leads/form/lead-form-reducer.ts`
- Modify: `src/features/leads/form/step-contact.tsx`
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `.env.example`
- Modify: `.env.test.example`

**Interfaces:**
- Consumes: collections `upload-sessions` e `lead-attachments` da Task 4, `getLeadPrivacyReadiness()`, `UPLOAD_TOKEN_HMAC_KEY` e bucket privado S3-compatible; usuário anônimo recebe URL de upload, ID opaco e dois tokens independentes exibidos uma única vez: um para concluir o upload e outro para associá-lo ao lead.
- Produces: `UploadCandidate`, `UploadPolicyResult`, `validateUploadCandidate()`, `validateUploadBatch()`, `PrivateUploadStore`, `S3PrivateUploadStore`, `PdfSafetyInspector`, `QpdfSafetyInspector`, `createUploadSession()`, `completeUpload()`.

- [ ] **Step 1: Escrever teste falhando da allowlist e limites**

```ts
// src/features/uploads/policy.test.ts
import { describe, expect, it } from 'vitest'
import { validateUploadCandidate } from './policy'

describe('validateUploadCandidate', () => {
  it('aceita imagem dentro do limite', () => {
    expect(validateUploadCandidate({ name: 'coifa.webp', size: 2_000_000, declaredMime: 'image/webp' })).toEqual({ ok: true })
  })

  it('rejeita extensão ativa mesmo com MIME falso', () => {
    expect(validateUploadCandidate({ name: 'planta.svg', size: 1000, declaredMime: 'image/png' })).toEqual({ ok: false, code: 'extension' })
  })

  it('rejeita lote acima de dez arquivos ou 50 MB', () => {
    expect(validateUploadBatch(Array.from({ length: 10 }, (_, index) => ({ name: `${index}.pdf`, size: 5_000_001, declaredMime: 'application/pdf' })))).toEqual({ ok: false, code: 'total-size' })
  })
})
```

- [ ] **Step 2: Executar o teste e confirmar a falha**

Run: `npm run test:unit -- src/features/uploads/policy.test.ts`

Expected: FAIL por módulo inexistente.

- [ ] **Step 3: Implementar política fail-closed**

```ts
// src/features/uploads/policy.ts
const allowed = new Map([
  ['.jpg', 'image/jpeg'], ['.jpeg', 'image/jpeg'], ['.png', 'image/png'],
  ['.webp', 'image/webp'], ['.pdf', 'application/pdf'],
])

export const MAX_FILE_BYTES = 15_000_000
export const MAX_TOTAL_BYTES = 50_000_000
export const MAX_FILES = 10

export type UploadCandidate = { name: string; size: number; declaredMime: string }

export const validateUploadCandidate = (candidate: UploadCandidate) => {
  const extension = candidate.name.slice(candidate.name.lastIndexOf('.')).toLowerCase()
  if (!allowed.has(extension)) return { ok: false as const, code: 'extension' as const }
  if (allowed.get(extension) !== candidate.declaredMime) return { ok: false as const, code: 'mime' as const }
  if (candidate.size <= 0 || candidate.size > MAX_FILE_BYTES) return { ok: false as const, code: 'size' as const }
  return { ok: true as const }
}

export const validateUploadBatch = (files: readonly UploadCandidate[]) => {
  if (files.length > MAX_FILES) return { ok: false as const, code: 'file-count' as const }
  if (files.reduce((sum, file) => sum + file.size, 0) > MAX_TOTAL_BYTES) return { ok: false as const, code: 'total-size' as const }
  for (const file of files) {
    const result = validateUploadCandidate(file)
    if (!result.ok) return result
  }
  return { ok: true as const }
}
```

- [ ] **Step 4: Implementar contrato de storage e ciclo de quarentena**

```ts
// src/features/uploads/private-upload-store.ts
export interface PrivateUploadStore {
  createUploadUrl(input: { key: string; mime: string; bytes: number; expiresInSeconds: number }): Promise<{ url: string; headers: Record<string, string> }>
  inspect(key: string, maxBytes: number): Promise<{ bytes: number; detectedMime: string; sha256: string; content: Uint8Array }>
  createDownloadUrl(input: { key: string; expiresInSeconds: number; downloadName: string }): Promise<string>
  delete(key: string): Promise<void>
}
```

Adicionar as dependências exatas sem executar lifecycle antes dos gates:

```powershell
npm install --package-lock-only --ignore-scripts --save-exact '@aws-sdk/client-s3@3.1092.0' '@aws-sdk/s3-request-presigner@3.1092.0'
npm run security:audit
npm ci --ignore-scripts
npm run security:audit
npm run security:signatures
npm rebuild sharp esbuild
```

`S3PrivateUploadStore` usa `S3Client`, `PutObjectCommand`, `HeadObjectCommand`, `GetObjectCommand`, `DeleteObjectCommand` e `getSignedUrl`; força `ServerSideEncryption: 'AES256'`, bucket privado, path-style apenas no MinIO local e URLs com no máximo 900 segundos. `inspect(key, maxBytes)` faz uma única leitura e aborta em `maxBytes + 1`, calcula SHA-256, valida magic bytes JPEG/PNG/WebP/PDF, devolve somente o buffer bounded e nunca confia no `ContentType` do objeto. O PDF enviado ao sidecar é exatamente esse retorno, sem segunda leitura ilimitada; o chamador zera/libera o buffer após inspeção.

Para PDF, não implementar parser caseiro nem busca de substring. `QpdfSafetyInspector` envia por Unix socket um request opaco e no máximo 15 MB ao sidecar local, que usa **qpdf 12.3.2** pinado em `docker/qpdf.lock`; o artefato oficial Linux x86_64 tem SHA-256 `44f2c53bf784c0143128d80d2b9946e9793962c5bb403b75c0024cb4d8e346b9`. O lock registra URL imutável, versão, SHA-256, fingerprint da chave oficial e digest da imagem final. `npm run security:qpdf` executa `scripts/verify-qpdf-supply-chain.mjs`, verifica checksum e assinatura oficial da release contra o fingerprint pinado, gera/valida SBOM e falha antes do build em qualquer drift; a imagem é escaneada novamente no Plano 5 antes de release. Nenhum download ocorre no runtime. O sidecar executa `qpdf --check` e depois JSON v2 completo com todos os objetos; qpdf resolve xref/object streams e nomes escapados. Qualquer warning/exit não zero/JSON incompleto/timeout é rejeição. A travessia recursiva do JSON canônico rejeita `/Encrypt`, qualquer dicionário/action (`/A`, `/AA`, `/OpenAction`, `/Type /Action` ou `/S` de action), `/JS`, `/JavaScript`, `/Launch`, `/EmbeddedFile`, `/Filespec` e `/Collection`, inclusive em objetos não referenciados; documento criptografado/protegido por senha sempre falha, sem tentar decriptar.

`docker/pdf-inspector.Dockerfile` roda o servidor como UID/GID sem privilégio, filesystem read-only, `cap_drop: ALL`, `no-new-privileges`, sem shell/compilador e com qpdf/Node runtime pinados por digest. `compose.pdf-inspector.yaml` define o sidecar `pdf-inspector` com `network_mode: none`, volume somente para Unix socket, tmpfs `noexec,nosuid,nodev` de 32 MB, `mem_limit: 128m`, `cpus: 0.50`, `pids_limit: 32`, limite de arquivo de 16 MB e timeout duro de 10 segundos por inspeção; entrada é escrita em diretório temporário `0700` e destruída ao final. Define também `pdf-inspector-tests`, uma imagem Node/Linux de teste também sem rede que monta o mesmo volume do socket, depende do healthcheck do sidecar, executa Vitest integration dentro do container e possui `profiles: [test]`, portanto nunca inicia em `up` padrão/runtime. O host Windows nunca tenta abrir Unix socket do Docker; chama apenas `docker compose run --rm pdf-inspector-tests`, alvo explícito que habilita o serviço do profile. O teste de Compose prova via config/ps que o runner one-shot não nasce no boot padrão. O app nunca monta o bucket no sidecar. O Plano 5 deve incluir esse compose no CI, runtime e release scan e provar que o sidecar não tem rede/escrita fora do tmpfs. Falha/ausência do socket fecha uploads PDF, não imagens. Falha estrutural marca a sessão `rejected`, emite `upload.security_rejected`, remove o objeto e invalida o association token. Fixtures cobrem cada estrutura proibida, nomes hex-escapados, object stream comprimido, xref stream, PDF poliglota/truncado e PDF passivo válido. MIME, extensão, magic bytes, qpdf estrutural e depois ClamAV são controles cumulativos.

`UPLOAD_TOKEN_HMAC_KEY` é segredo runtime obrigatório de pelo menos 32 bytes de entropia, distinto de `RATE_LIMIT_HMAC_KEY`, `PAYLOAD_SECRET`, segredos Turnstile/SMTP/job e quaisquer chaves de assinatura; igualdade entre segredos faz o startup falhar. `token-hmac.ts` usa HMAC-SHA256 e compara em tempo constante, com domínios diferentes (`upload-complete:v1:` e `lead-association:v1:`) para impedir troca entre os dois tokens. A chave e os tokens nunca entram em build args, banco em claro, analytics ou logs. Acrescentar somente o nome/documentação segura a `.env.example`; o schema de ambientes do Plano 5 valida presença, entropia e distinção.

`createUploadSession()` começa chamando `assertLeadCollectionEnabled()` antes de qualquer escrita, rate limit durável ou chamada S3. Sob advisory lock derivado da `idempotencyKey`, valida o lote da requisição junto com todas as sessões ainda válidas daquela tentativa: no máximo dez itens e soma declarada de no máximo 50.000.000 bytes, inclusive sob duas requisições concorrentes. Para cada arquivo gera chave `quarantine/<uuid>` e dois tokens aleatórios independentes de 32 bytes, guardando apenas HMACs com domínio. A sessão expira em 15 minutos e salva nome sanitizado, tamanho, MIME e estado `pending`; a resposta de lote contém uma entrada `{ sessionId, uploadToken, associationToken, uploadUrl, requiredHeaders }` por arquivo. `completeUpload()` começa pelo mesmo gate, exige o `uploadToken` daquela sessão, verifica HMAC em tempo constante, ownership pela `idempotencyKey`, expiração, tamanho, MIME/magic, PDF estrutural e SHA-256; em sucesso marca o token como usado e muda para `quarantined`, nunca para `clean`. Retry após perda da resposta com o mesmo `sessionId + uploadToken` retorna idempotentemente o mesmo resultado se a sessão já estiver `quarantined` e nada mais mudou; não reinspeciona, não reescreve e não revive sessão expirada/rejeitada. Token de outra sessão, outro domínio, outro envio, estado incompatível ou payload alterado falha. O `associationToken` permanece válido exclusivamente para a transação da Task 6 e é consumido uma vez; somente o worker ClamAV muda o anexo para `clean` ou `rejected`.

Os endpoints de criação e conclusão executam o gate de privacidade no servidor antes de qualquer rate-limit durável, criação/update de collection ou `PutObject`/`HeadObject`/`GetObject`/`DeleteObject`; a rota de submissão repete o mesmo contrato na Task 6. POST direto com gate fechado retorna `503 { code: 'LEAD_COLLECTION_DISABLED' }`, não chama Turnstile/storage e deixa zero registros em todas as onze collections operacionais e na auditoria.

`upload-api-client.ts` envia a descrição completa de até dez arquivos em uma única criação de lote (um token Turnstile `upload_session`, injetado até a Task 7), faz cada `PUT` assinado com os headers exatos, chama complete com `sessionId`, `idempotencyKey` e seu `uploadToken`, e descarta esse token apenas após resposta conclusiva ou replay idempotente. `upload-manager.ts` mantém em memória somente `{ sessionId, associationToken }` após completar, além de estado/progresso; oferece cancelamento, retry do mesmo estágio, remoção antes do submit e abort via `AbortController`. Nunca persiste URL assinada/token em storage ou log. Remover arquivo descarta o token de associação e o objeto vira abandono elegível; não há como associá-lo depois. O reducer/UI bloqueia envio enquanto houver upload pendente/rejeitado e anuncia progresso/erro em live region. Testes cobrem interrupção e retomada, remoção, cancelamento, duas criações concorrentes tentando ultrapassar dez/50 MB, bytes declarados versus inspecionados, ownership cruzado, troca/replay dos dois tokens, resposta perdida após complete e descarte do token de associação ao remover arquivo.

Run: `npm run security:qpdf && npm run test:unit -- src/features/uploads && docker compose -f compose.pdf-inspector.yaml run --rm pdf-inspector-tests`

Expected: PASS dentro do container Linux com engine qpdf real nas fixtures e nenhuma URL de download pública no retorno dos endpoints. Em `finally`, sempre executar `docker compose -f compose.pdf-inspector.yaml down --volumes --remove-orphans` e coletar logs sanitizados se o teste falhar.

- [ ] **Step 5: Commit**

```bash
git add src/features/uploads src/features/leads/form src/app/api/upload-sessions scripts/pdf-inspector-server.mjs scripts/verify-qpdf-supply-chain.mjs docker compose.pdf-inspector.yaml tests/integration/uploads tests/fixtures/uploads/pdf package.json package-lock.json .env.example .env.test.example
git commit -m "feat: add quarantined private upload sessions"
```

---

### Task 6: Submissão idempotente e outbox transacional

**Files:**
- Create: `src/features/leads/lead-repository.ts`
- Create: `src/features/leads/protocol.ts`
- Create: `src/features/leads/protocol.test.ts`
- Create: `src/features/leads/submit-lead.ts`
- Create: `src/features/leads/submit-lead.test.ts`
- Create: `src/features/leads/lead-verification-port.ts`
- Create: `src/features/leads/lead-verification-port.test.ts`
- Create: `src/features/leads/form/lead-api-client.ts`
- Create: `src/features/leads/form/lead-api-client.test.ts`
- Create: `src/app/api/lead-submissions/route.ts`
- Test: `tests/integration/leads/lead-submission.int.test.ts`
- Modify: `src/features/leads/form/lead-form.tsx`
- Modify: `src/features/leads/form/lead-form-reducer.ts`

**Interfaces:**
- Consumes: `LeadSubmissionRequest`, `ValidatedLeadSubmission`, Payload, `assertLeadCollectionEnabled()`, collections operacionais da Task 4 e anexos `quarantined | clean` pertencentes ao mesmo idempotency key.
- Produces: `SubmitLeadDependencies`, `SubmitLeadResult`, `submitLead()`, `LeadVerificationPort` e o default fail-closed `denyUnconfiguredLeadVerification`.

```ts
// src/features/leads/lead-verification-port.ts
export type LeadVerificationAction = 'lead_submit' | 'upload_session'

export interface LeadVerificationPort {
  verify(input: {
    token: string
    remoteIp?: string
    expectedAction: LeadVerificationAction
  }): Promise<void>
}

export const denyUnconfiguredLeadVerification: LeadVerificationPort
```

O port existe nesta task para que o Route Handler tenha uma fronteira compilável sem depender do adapter da Task 7. O binding exportado por `route.ts` usa `denyUnconfiguredLeadVerification`, que sempre lança `VERIFICATION_NOT_CONFIGURED` e é mapeado externamente para `VERIFICATION_FAILED`; portanto nenhum request real é aceito antes do wiring de segurança. Testes de unidade provam o deny-by-default. O handler é criado por factory e a integração desta task injeta apenas um fake determinístico que aceita o token de fixture; não existe bypass selecionável por env, header ou payload.

- [ ] **Step 1: Escrever teste falhando de repetição e atomicidade**

```ts
// src/features/leads/submit-lead.test.ts
import { describe, expect, it, vi } from 'vitest'
import { validValidatedLead } from '@/test/factories/lead'
import { submitLead } from './submit-lead'

it('retorna o protocolo existente para a mesma chave', async () => {
  const repository = {
    findByIdempotencyKey: vi.fn().mockResolvedValue({ protocol: 'DIB-7K4M-9P2Q-X8RC-5TNV-C6JW' }),
    createAtomically: vi.fn(),
    isIdempotencyConflict: vi.fn().mockReturnValue(false),
    isProtocolConflict: vi.fn().mockReturnValue(false),
  }
  const result = await submitLead(validValidatedLead(), { repository, now: () => new Date('2026-07-25T12:00:00Z') })
  expect(result).toEqual({ protocol: 'DIB-7K4M-9P2Q-X8RC-5TNV-C6JW', duplicate: true })
  expect(repository.createAtomically).not.toHaveBeenCalled()
})
```

- [ ] **Step 2: Executar o teste e confirmar a falha**

Run: `npm run test:unit -- src/features/leads/submit-lead.test.ts`

Expected: FAIL porque `submitLead` não existe.

- [ ] **Step 3: Implementar serviço e protocolo opaco**

```ts
// src/features/leads/submit-lead.ts
import { validatedLeadSubmissionSchema } from './schema'
import { createCrockfordProtocol } from './protocol'
import type { ValidatedLeadSubmission } from './types'

export type SubmitLeadResult = { protocol: string; duplicate: boolean }

export type LeadRepository = {
  findByIdempotencyKey(key: string): Promise<{ protocol: string } | null>
  createAtomically(input: ValidatedLeadSubmission, protocol: string): Promise<void>
  isIdempotencyConflict(error: unknown): boolean
  isProtocolConflict(error: unknown): boolean
}

const protocol = () => createCrockfordProtocol((bytes) => crypto.getRandomValues(new Uint8Array(bytes)))

export async function submitLead(
  input: ValidatedLeadSubmission,
  deps: { repository: LeadRepository; now: () => Date },
): Promise<SubmitLeadResult> {
  const parsed = validatedLeadSubmissionSchema.parse(input)
  const existing = await deps.repository.findByIdempotencyKey(parsed.idempotencyKey)
  if (existing) return { protocol: existing.protocol, duplicate: true }
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const generated = protocol()
    try {
      await deps.repository.createAtomically(parsed, generated)
      return { protocol: generated, duplicate: false }
    } catch (error) {
      if (deps.repository.isIdempotencyConflict(error)) {
        const winner = await deps.repository.findByIdempotencyKey(parsed.idempotencyKey)
        if (!winner) throw error
        return { protocol: winner.protocol, duplicate: true }
      }
      if (!deps.repository.isProtocolConflict(error) || attempt === 4) throw error
    }
  }
  throw new Error('PROTOCOL_GENERATION_EXHAUSTED')
}
```

- [ ] **Step 4: Implementar repositório Payload em transação explícita**

O route handler valida `LeadSubmissionRequest`, chama `assertLeadCollectionEnabled()` e então `LeadVerificationPort.verify({ expectedAction: 'lead_submit' })` antes de criar `ValidatedLeadSubmission` com ID, versão e hash do documento legal mais `retentionPolicyDays` e `retentionUntil` calculado em UTC a partir do mesmo relógio injetado (`now + days × 86.400.000 ms`); o token de verificação é descartado e nunca chega ao repositório. Nesta task, o export real permanece fechado pelo binding default; somente o teste da factory injeta fake. Mudança posterior de settings não altera esse snapshot nem os prazos de lead/anexos/recibo. Testar virada de mês, ano bissexto e timezone/DST.

`protocol.ts` produz exatamente 20 símbolos independentes do alfabeto Crockford, formatados em cinco grupos de quatro: `DIB-7K4M-9P2Q-X8RC-5TNV-C6JW`. O contrato é `^DIB(?:-[0-9A-HJKMNP-TV-Z]{4}){5}$`, com 100 bits de entropia; a função usa o callback CSPRNG injetado e rejection sampling por símbolo, nunca codifica um buffer para depois truncar caracteres. Node 24 expõe Web Crypto no runtime servidor; teste de contrato roda também no target do Route Handler e falha se houver fallback em `Math.random`. Testar regex, alfabeto sem `I/L/O/U`, cinco grupos, 100 bits, consumo sem truncamento e distribuição determinística com CSPRNG fake.

`lead-api-client.ts` gera uma UUID por tentativa lógica, guarda apenas `{ key, createdAt }` em `sessionStorage` por no máximo 24 horas e envia JSON estrito a `/api/lead-submissions`. Timeout, perda de resposta e retry reutilizam a mesma chave; sucesso a remove; uma tentativa deliberadamente nova ou chave local com mais de 24 horas recebe UUID nova. `LeadForm` bloqueia duplo clique, preserva valores/anexos em erro recuperável, mapeia apenas os códigos públicos estáveis e, em sucesso, despacha `SUCCESS`, move foco para `LeadSuccess` e nunca inclui protocolo/PII em URL. Testes usam relógio/fetch injetáveis e cobrem 23h59, 24h01, timeout, duplo clique e resposta duplicada.

O Route Handler faz apenas checks read-only de método/content type/origem/tamanho, chama `assertLeadCollectionEnabled()` antes de rate limit durável ou qualquer mutação, valida o JSON estrito como `LeadSubmissionRequest`, chama o `LeadVerificationPort` injetado e constrói `ValidatedLeadSubmission` exclusivamente no servidor. ID, versão e hash vêm do documento legal retornado pela mesma readiness; `retentionPolicyDays` vem do setting validado `1..3650`; `retentionUntil` é calculado em UTC pelo mesmo relógio injetado (`now + days × 86.400.000 ms`). Esses campos não existem no request público, e envio malicioso deles é rejeitado pelo `.strict()`. O token de verificação é descartado e nunca chega ao repositório. O snapshot é gravado no lead, anexos e recibo na mesma transação; mudança posterior de settings/documento não o altera. Testar override malicioso, relógio servidor, virada de mês, ano bissexto e timezone/DST.

`createAtomically()` executa `payload.db.beginTransaction()`, passa `req: { transactionID, context: { internalOperation: true } }` a cada Local API, e dentro da mesma transação: primeiro procura o vencedor pela `idempotencyKey`; bloqueia todas as sessões referenciadas; valida HMAC com domínio dos `associationToken`; exige a mesma idempotency key/ownership; rejeita sessão expirada, associada, removida ou de outro envio; rejeita ID/token duplicado no array; soma `bytes` inspecionados no servidor e limita a 50.000.000; aceita somente `quarantined | clean`; consome cada association token uma vez; cria `lead` em status `new`, `statusVersion=0` e lifecycle `active`, `lead-attachment`, `lead-event`, `privacy-receipt` com documento/versão/hash/snapshot de retenção, `outbox-event` e `lead.created`; então chama `commitTransaction(transactionID)`. Download permanece bloqueado até `clean`. Qualquer erro chama `rollbackTransaction(transactionID)` e é relançado. `protocol` e `idempotencyKey` têm índices unique parciais separados `WHERE ... IS NOT NULL`. Idempotência é reconhecida enquanto o lead ativo existe, embora o cliente gere chave nova depois de 24 horas; replay vencedor retorna antes de revalidar tokens já consumidos. Colisão de protocolo usa retry limitado separado e nunca é confundida com idempotência. A Task 10 nulifica ambos durante anonimização.

Adicionar teste com duas chamadas simultâneas usando a mesma chave: ambas resolvem, existe um único lead, cada attachment pertence exatamente a ele, cada association token foi consumido uma vez e ambas retornam o mesmo protocolo. Testar troca de token/sessão/idempotency key, attachment repetido, replay em 23h59 e 24h01 (servidor ainda retorna o vencedor), 50.000.000 exatos versus 50.000.001 bytes inspecionados, regex/100 bits do protocolo e retry específico de colisão. O export real com `denyUnconfiguredLeadVerification` retorna `VERIFICATION_FAILED` e faz zero chamadas ao repositório. POST direto com gate fechado retorna `LEAD_COLLECTION_DISABLED`, nem sequer chama o port e deixa todas as onze collections operacionais, storage e auditoria intocados.

Run: `npm run test:unit -- src/features/leads/submit-lead.test.ts && npm run test:int -- lead-submission`

Expected: PASS; uma falha injetada na outbox deixa zero registros parciais.

- [ ] **Step 5: Commit**

```bash
git add src/features/leads src/app/api/lead-submissions/route.ts tests/integration/leads/lead-submission.int.test.ts
git commit -m "feat: persist leads with idempotent transaction"
```

---

### Task 7: Origem confiável, Turnstile e limite de submissão

**Files:**
- Create: `src/features/security/trusted-origin.ts`
- Create: `src/features/security/trusted-origin.test.ts`
- Create: `src/features/security/turnstile.ts`
- Create: `src/features/security/turnstile.test.ts`
- Create: `src/features/security/lead-verification-composition-root.ts`
- Create: `src/features/security/lead-rate-limit.ts`
- Create: `src/features/security/TurnstileWidget.tsx`
- Create: `src/features/security/turnstile-client.ts`
- Create: `src/features/security/turnstile-client.test.tsx`
- Modify: `src/app/api/lead-submissions/route.ts`
- Modify: `src/app/api/upload-sessions/route.ts`
- Modify: `src/app/api/upload-sessions/[id]/complete/route.ts`
- Modify: `src/features/leads/form/lead-form.tsx`
- Modify: `src/features/uploads/upload-manager.ts`
- Modify: `src/lib/env/server.ts`
- Modify: `.env.example`
- Modify: `.env.test.example`
- Modify: `tests/unit/env/server.test.ts`
- Test: `tests/integration/leads/lead-security.int.test.ts`

**Interfaces:**
- Consumes: `LeadVerificationPort` da Task 6, `SITE_URL`, `TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`, `RATE_LIMIT_HMAC_KEY` e request IP normalizado pela camada Cloudflare.
- Produces: `assertTrustedOrigin()`, `verifyTurnstile()`, o binding real `getLeadVerificationPort()`, `consumeLeadRateLimit(action, keys)` e `LEAD_RATE_LIMIT_POLICIES`.

- [ ] **Step 1: Escrever testes falhando de origem e Turnstile**

```ts
// src/features/security/trusted-origin.test.ts
import { expect, it } from 'vitest'
import { assertTrustedOrigin } from './trusted-origin'

it('rejeita POST de outra origem', () => {
  expect(() => assertTrustedOrigin('http://localhost:3000', 'http://127.0.0.1:3000')).toThrow('UNTRUSTED_ORIGIN')
})
```

```ts
// src/features/security/turnstile.test.ts
it('falha fechado quando o provedor não confirma o token', async () => {
  const fetcher = vi.fn().mockResolvedValue({ json: async () => ({ success: false }) })
  await expect(verifyTurnstile({ token: 'bad', remoteIp: '203.0.113.8', secret: 'secret', expectedHostname: 'designerinox.example', expectedAction: 'lead_submit', fetcher })).rejects.toThrow('TURNSTILE_REJECTED')
})
```

- [ ] **Step 2: Executar testes e confirmar falhas**

Run: `npm run test:unit -- src/features/security`

Expected: FAIL por módulos inexistentes.

- [ ] **Step 3: Implementar os guards sem registrar token ou IP bruto**

Estender agora — não no Plano 5 — o contrato de `src/lib/env/server.ts`: `TURNSTILE_SITE_KEY` e `TURNSTILE_SECRET_KEY` são obrigatórias em `test`/`production`, e `RATE_LIMIT_HMAC_KEY` é Base64 canônico de exatamente 32 bytes. A chave de rate limit deve ser distinta byte a byte de `UPLOAD_TOKEN_HMAC_KEY`, `AUTH_RATE_LIMIT_HMAC_KEY`, `ADMIN_SESSION_HMAC_KEY`, chaves MFA e `PAYLOAD_SECRET`; ausência, Base64 inválido ou reuso impede startup sem imprimir valores. `.env.example` documenta apenas nomes/placeholders e `.env.test.example` contém chaves sintéticas distintas/valores oficiais de teste do Turnstile. `tests/unit/env/server.test.ts` carrega o example de teste e cobre ausência, tamanho, igualdade e mensagens sem segredo. O Plano 5 apenas consolida e amplia esse schema, preservando tipos e sem redefinir a semântica.

```ts
// src/features/security/trusted-origin.ts
export const assertTrustedOrigin = (origin: string | null, siteUrl: string) => {
  if (!origin || new URL(origin).origin !== new URL(siteUrl).origin) throw new Error('UNTRUSTED_ORIGIN')
}
```

A origem canônica local é exatamente `http://127.0.0.1:3000`; `http://localhost:3000`, outros ports/schemes e ausência de `Origin` não são equivalentes. Em produção, somente a origin exata de `SITE_URL` é aceita; não existe allowlist automática de loopback/preview. Testar aceitação da origin local exata em development/teste e rejeição de `localhost`, subdomínio, downgrade HTTP e porta diferente.

```ts
// assinatura de src/features/security/turnstile.ts
export async function verifyTurnstile(input: {
  token: string
  remoteIp?: string
  secret: string
  expectedHostname: string
  expectedAction: 'lead_submit' | 'upload_session'
  fetcher?: typeof fetch
}): Promise<void>
```

`verifyTurnstile()` envia `secret`, `response`, `remoteip` e uma chave de idempotência a `https://challenges.cloudflare.com/turnstile/v0/siteverify`, exige `success === true`, `hostname` igual ao host de `SITE_URL` e `action === expectedAction`, e nunca inclui token nos logs. A rota de lead passa literalmente `lead_submit`; somente a criação do lote passa `upload_session`; complete não chama Turnstile. Testes trocam as actions nas duas direções e exigem rejeição. `consumeLeadRateLimit()` faz upsert transacional em `request-rate-limits`, guarda somente HMAC-SHA256 com `RATE_LIMIT_HMAC_KEY` e usa domínios separados `rate-limit:lead-submit:ip:v1`, `rate-limit:upload-session:ip:v1`, `rate-limit:upload-complete:ip:v1` e `rate-limit:upload-complete:session:v1`. A chave é distinta de `UPLOAD_TOKEN_HMAC_KEY`, e hash IP nunca é reutilizado entre actions.

`lead-verification-composition-root.ts` devolve um objeto que implementa `LeadVerificationPort`; seu método `verify(input)` resolve `getServerEnv()` somente dentro da request, nunca no import/build, e delega a `verifyTurnstile({ ...input, secret, expectedHostname, fetcher })`. O adapter não possui fallback permissivo. A Task 7 substitui o binding deny-by-default do export `POST` por `getLeadVerificationPort()`; teste de composição prova que produção/test sem env válido falha fechado e que nenhum fake pode ser selecionado por configuração externa.

`LEAD_RATE_LIMIT_POLICIES` é fechado: `lead_submit` permite 5 requests/IP/15 min; `upload_session` permite 5 **lotes**/IP/15 min; `upload_complete` permite 30 requests/IP/15 min e, adicionalmente, 5 requests por `sessionId`/15 min. A conclusão consome os dois buckets atomicamente antes de verificar o HMAC do token, impedindo brute force por sessão; sucesso/replay idempotente também conta. Assim, um lote legítimo de dez arquivos usa um desafio de criação e dez completes sem atingir limite, enquanto abuso/replay indefinido é bloqueado. Cloudflare replica limites por action no edge sem reduzir o limite interno de complete. Todo upsert é mutação durável e, portanto, nunca roda antes do gate de privacidade.

`TurnstileWidget` recebe a site key pública do servidor somente em runtime com o gate aberto; o script é segurança necessária, não analytics. `turnstile-client.ts` solicita token separado e single-use por action: um `upload_session` cobre a criação do lote e um novo `lead_submit` cobre a submissão final. Expiração, callback de erro, replay ou mudança de action limpam o token, reabilitam tentativa acessível e nunca registram o valor. E2E cobre expiração/replay e comprova que um token de upload não valida lead.

- [ ] **Step 4: Aplicar a ordem explícita de guards nos endpoints**

Nos três endpoints, os únicos guards anteriores ao gate são read-only e sem efeitos: método/content type → origem → limite de `Content-Length`/leitura bounded. A ordem de submissão de lead e criação de upload é: esses checks → `assertLeadCollectionEnabled()` → parse/schema estrito → `consumeLeadRateLimit()` com action `lead_submit` ou `upload_session` e `{ ip }` → Turnstile com a action correspondente → serviço. Na conclusão do upload: checks read-only → `assertLeadCollectionEnabled()` → parse/schema → consumo atômico dos buckets `upload_complete` IP+session → ownership/HMAC do `uploadToken` → serviço; não solicitar segundo Turnstile. Os serviços chamam o gate novamente como defesa em profundidade imediatamente antes de sua primeira mutação. A submissão recebe apenas `associationToken`, nunca `uploadToken`. Respostas públicas usam códigos estáveis (`INVALID_REQUEST`, `LEAD_COLLECTION_DISABLED`, `RATE_LIMITED`, `VERIFICATION_FAILED`) e nunca retornam stack trace.

O teste de integração parametriza as três rotas com gate fechado e request que seria válido: todas retornam `LEAD_COLLECTION_DISABLED`; `consumeLeadRateLimit`, Turnstile e cada método de `PrivateUploadStore` têm zero chamadas; contagens antes/depois de **todas as onze collections operacionais** são idênticas, com destaque para zero rows em `request-rate-limits`, `upload-sessions`, `lead-attachments`, `leads`, `lead-events`, `privacy-receipts`, `outbox-events`, `file-access-events`, `data-subject-requests`, `privacy-tombstones`, `worker-run-states` e também `audit-events`. Repetir em concorrência e com o banco indisponível: falha fechado sem fallback que escreva rate limit. Um teste de ordem injeta spies e falha se qualquer efeito ocorrer antes de `assertLeadCollectionEnabled()` resolver aberto. Com gate aberto, E2E cria lote válido de dez arquivos, completa os dez e submete o lead; testes separados atingem exatamente cada fronteira, provam isolamento dos quatro domínios/rows, consumo atômico IP+session e bloqueio de brute force/replay sem impedir o fluxo legítimo.

Run: `npm run test:unit -- src/features/security tests/unit/env/server.test.ts && npm run test:int -- lead-security`

Expected: PASS; requisição bloqueada produz zero mutações, inclusive zero rows de rate limit e zero chamadas externas.

- [ ] **Step 5: Commit**

```bash
git add src/features/security src/features/leads/form src/features/uploads/upload-manager.ts src/app/api/lead-submissions/route.ts src/app/api/upload-sessions/route.ts 'src/app/api/upload-sessions/[id]/complete/route.ts' src/lib/env/server.ts .env.example .env.test.example tests/unit/env/server.test.ts tests/integration/leads/lead-security.int.test.ts
git commit -m "feat: protect public lead endpoints"
```

---

### Task 8: Workers de antivírus e e-mail

**Files:**
- Create: `src/features/uploads/scan-worker.ts`
- Create: `src/features/uploads/scan-worker.test.ts`
- Create: `src/features/uploads/clamav-client.ts`
- Create: `src/features/notifications/email-client.ts`
- Create: `src/features/notifications/payload-email-client.ts`
- Create: `src/features/notifications/lead-email.ts`
- Create: `src/features/notifications/lead-notification-recipients.ts`
- Create: `src/features/notifications/lead-notification-recipients.test.ts`
- Create: `src/features/notifications/message-id.ts`
- Create: `src/features/notifications/message-id.test.ts`
- Create: `src/features/notifications/reconcile-delivery.ts`
- Create: `src/features/notifications/reconcile-delivery.test.ts`
- Create: `src/features/notifications/outbox-worker.ts`
- Create: `src/features/notifications/outbox-worker.test.ts`
- Create: `src/app/api/internal/jobs/route.ts`
- Test: `tests/integration/jobs/internal-jobs.int.test.ts`
- Create: `docs/runbooks/notification-delivery.md`
- Create: `scripts/reconcile-notification-delivery.ts`
- Modify: `src/payload.config.ts`
- Modify: `src/lib/env/server.ts`
- Modify: `.env.example`
- Modify: `.env.test.example`
- Test: `tests/unit/env/smtp.test.ts`
- Modify: `package.json`
- Modify: `package-lock.json`

**Interfaces:**
- Consumes: anexos `quarantined`, outbox `pending`, `PrivateUploadStore`, `CLAMAV_HOST`, SMTP, IDs autorizados do grupo privado de `site-settings` e usuários ativos; `processPublicationBatch()` e `PublicationWorkerDependencies` da saga editorial do Plano 3.
- Produces: `scanPendingAttachments()`, `processOutboxBatch()`, `resolveLeadNotificationRecipients()`, `EmailClient` e orquestração autenticada dos workers sem acoplá-los ao gate de leads.

- [ ] **Step 1: Escrever testes falhando de fail-closed e retry**

```ts
it('mantém o anexo em quarentena quando o scanner falha', async () => {
  const result = await scanOne({ id: 'a1', status: 'quarantined' }, { scanner: { scan: vi.fn().mockRejectedValue(new Error('offline')) } })
  expect(result.status).toBe('quarantined')
})

it('agenda retry exponencial e preserva o mesmo Message-ID', async () => {
  const result = await processOutboxEvent(pendingEvent(), { email: { send: vi.fn().mockRejectedValue(new Error('smtp')) }, now: fixedNow })
  expect(result).toMatchObject({ status: 'pending', attempts: 1, nextAttemptAt: '2026-07-25T12:01:00.000Z' })
})
```

- [ ] **Step 2: Executar os testes e confirmar falhas**

Run: `npm run test:unit -- src/features/uploads/scan-worker.test.ts src/features/notifications/outbox-worker.test.ts`

Expected: FAIL por funções inexistentes.

- [ ] **Step 3: Implementar estados e retries determinísticos**

`ClamAvClient` usa `node:net`, protocolo `INSTREAM`, chunks máximos de 1 MiB em network byte order, socket e scan timeout de 30 segundos, limite de 15 MB e resposta aceita somente `OK` ou `FOUND`; resposta desconhecida é erro técnico. O scanner aceita somente `clean` ou `infected`; erro técnico preserva `quarantined`. Resultado `infected` muda upload session e lead attachment para `rejected`, remove o objeto após registrar hash e motivo, emite `lead.attachment_scan_rejected` e impede download. Resultado limpo atualiza ambos para `clean` e emite `lead.attachment_scan_clean`. A outbox usa backoff de 1, 5, 30 e 120 minutos, máximo de cinco tentativas e estado final `failed` com `lead.notification_failed` e alerta operacional estruturado sem PII; sucesso emite `lead.notification_sent`. Eventos system usam os atores centrais `scan-worker`/`outbox-worker`.

- [ ] **Step 4: Implementar e-mail sem anexos e job autenticado**

```ts
// src/features/notifications/email-client.ts
export interface EmailClient {
  send(input: { to: string[]; subject: string; html: string; text: string; headers: Record<string, string> }): Promise<{ messageId: string }>
}
```

`resolveLeadNotificationRecipients()` relê os IDs autorizados no grupo privado de `site-settings` em cada tentativa da outbox, busca os usuários por ID e retorna e-mails normalizados/deduplicados somente de contas `active=true` com papel `commercial` ou `admin`. Não usa lista livre no evento, env ou request, não envia a usuário removido/desativado e nunca persiste/loga os endereços resolvidos. Lista vazia é falha retryable `NO_ACTIVE_NOTIFICATION_RECIPIENT`, não envio silencioso; ao esgotar tentativas, monitoramento recebe apenas event ID e error code. Testes desativam/trocam papel entre criação e processamento e comprovam que somente o conjunto atual recebe.

O e-mail interno contém protocolo, serviço, cidade/UF e link autenticado para o painel; não contém anexos nem descrição completa. Esses valores existem somente no envelope/body em memória: Nodemailer opera com `logger=false`/`debug=false`, exceptions são mapeadas a error codes e o logger estruturado allowlista somente `outboxEventId`, `attempt`, `errorCode`, `durationMs` e provider `messageId`. Um teste instala logger capturador, percorre sucesso e todas as falhas e busca canaries de nome, telefone, e-mail, cidade, protocolo, filename, token e destinatário em cada log serializado: ocorrência faz o teste falhar.

O endpoint interno de jobs exige segredo em header com comparação constante e executa, nesta fase, publicação, scan e outbox em lotes limitados. `processPublicationBatch()` recebe `PublicationWorkerDependencies` reais do composition root do Plano 3 e tem advisory lock, lease/heartbeat e budget próprios, independentes dos locks de scan/outbox; falha de um worker não impede os demais e a resposta/log expõe apenas contagens/códigos. Antes/depois de cada lote, fazer upsert transacional da row canônica em `worker-run-states`, com CAS de lease e `lastStartedAt`, `lastSucceededAt`, `lastFailedAt`, `oldestPendingAt` e `pendingCount`; readiness multi-réplica do Plano 5 lê essas rows, não memória de processo. Integração dispara dois schedulers concorrentes e crash depois do claim: nenhuma publication operation é ativada duas vezes, lease fresca não é roubada, lease vencida é retomada, estado do worker converge e backlog/lag volta a zero. O gate de privacidade fechado não desliga publicação nem cleanup.

Adicionar o adapter oficial da mesma versão do Payload, passando pelos gates antes de carregar código:

```powershell
npm install --package-lock-only --ignore-scripts --save-exact '@payloadcms/email-nodemailer@3.86.0'
npm run security:audit
npm ci --ignore-scripts
npm run security:audit
npm run security:signatures
npm rebuild sharp esbuild
```

Configurar `nodemailerAdapter` em `payload.config.ts` com `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM` e `SMTP_TLS_MODE`. Em production, o parser aceita somente `implicit` ou `starttls`: `implicit` configura `secure=true`; `starttls` configura `secure=false` e `requireTLS=true`; ambos usam `tls.rejectUnauthorized=true`, `tls.minVersion='TLSv1.2'` e SNI/hostname verificado. `insecure` configura `secure=false`/`ignoreTLS=true` e é permitido exclusivamente em development/test para o Mailpit sem credenciais reais; production recusa startup. Testes sobem SMTP fake que omite STARTTLS e outro com certificado inválido e provam falha fechada, sem transmitir autenticação/body; validam também os dois modos TLS. `PayloadEmailClient` delega a `payload.sendEmail`. A entrega SMTP é explicitamente **at-least-once**, não exactly-once: `deduplicationKey` unique impede duas rows/claims concorrentes, mas não elimina a janela em que o servidor SMTP aceita a mensagem e o processo cai antes de commitar `sent`. `message-id.ts` deriva um RFC `Message-ID` determinístico de SHA-256 da dedup key e host canônico (sem protocolo/PII) e o reutiliza em todo retry. Teste injeta crash no failpoint exato ACK SMTP → commit, expira lease e prova que o retry pode enviar novamente, sempre com o mesmo Message-ID; o teste nunca afirma envio único.

`docs/runbooks/notification-delivery.md` documenta reconciliação de estado ambíguo pelo Message-ID nos logs/API do provedor sem registrar destinatário/body. `reconcileNotificationDelivery()` e `npm run notifications:reconcile -- --event-id <id>` existem somente para adapter de evidência que consulta o provedor pelo Message-ID determinístico; com aceitação comprovada, transacionam `sent` e `lead.notification_sent` como `incident-automation`. Se o provedor não oferece essa prova, o comando recusa e o runbook libera retry sabendo que duplicata é possível. Nunca marcar `sent` apenas porque houve timeout ou por input livre do operador. Nenhum `LEAD_NOTIFICATION_TO` existe: destinatários vêm exclusivamente de usuários autorizados ativos.

Run: `npm run test:unit -- src/features/uploads/scan-worker.test.ts src/features/notifications/outbox-worker.test.ts tests/unit/env/smtp.test.ts && npm run test:int -- tests/integration/jobs/internal-jobs.int.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/features/uploads src/features/notifications src/app/api/internal/jobs/route.ts src/payload.config.ts src/lib/env/server.ts scripts/reconcile-notification-delivery.ts .env.example .env.test.example package.json package-lock.json tests/unit/env/smtp.test.ts tests/integration/jobs/internal-jobs.int.test.ts docs/runbooks/notification-delivery.md
git commit -m "feat: process quarantined uploads and lead outbox"
```

---

### Task 9: Acesso comercial, confirmação e E2E

**Files:**
- Create: `src/features/leads/access.ts`
- Create: `src/features/leads/access.test.ts`
- Create: `src/features/leads/change-lead-status.ts`
- Create: `src/features/leads/change-lead-status.test.ts`
- Create: `src/features/leads/read-lead-detail.ts`
- Create: `src/features/leads/read-lead-detail.test.ts`
- Create: `src/features/leads/authorize-attachment-download.ts`
- Create: `src/features/leads/authorize-attachment-download.test.ts`
- Create: `src/app/api/admin/leads/[id]/status/route.ts`
- Create: `src/app/api/admin/leads/[id]/detail/route.ts`
- Create: `src/app/api/lead-attachments/[id]/download/route.ts`
- Create: `src/components/admin/leads/LeadPrivateDetail.tsx`
- Create: `src/components/admin/leads/ChangeLeadStatus.tsx`
- Create: `src/components/admin/leads/LeadStatusHistory.tsx`
- Modify: `src/features/leads/form/lead-success.tsx`
- Create: `tests/e2e/lead-form.spec.ts`
- Create: `tests/e2e/lead-access.spec.ts`
- Create: `tests/e2e/admin/lead-status.spec.ts`
- Test: `tests/integration/leads/lead-commands.int.test.ts`
- Modify: `src/collections/Leads.ts`
- Modify: `src/collections/LeadEvents.ts`
- Modify: `src/collections/LeadAttachments.ts`
- Modify: `src/payload.config.ts`
- Modify generated: `src/app/(payload)/admin/importMap.js`

**Interfaces:**
- Consumes: papéis `admin`, `editor`, `commercial`, `reader`; `hasVerifiedMfa()`, `writeAuditEvent()` e `AuditEventName` centrais; `PrivateUploadStore`; protocolo retornado pela Task 6; `WhatsAppLink` de `src/components/conversion/WhatsAppLink.tsx`.
- Produces: políticas de listagem redigida por responsável, `readLeadPrivateDetail()`, `changeLeadStatus()`, `authorizeAttachmentDownload()`, `LeadSuccess` e cobertura concorrente/E2E.

- [ ] **Step 1: Escrever testes falhando da matriz de autorização**

```ts
it('comercial lê apenas lead atribuído ou liberado', () => {
  expect(canReadLead(user('commercial', 'u1'))).toEqual({ or: [{ assignedTo: { equals: 'u1' } }, { releasedToCommercial: { equals: true } }] })
})

it('editor nunca lê PII ou anexo', () => {
  expect(canReadLead(user('editor', 'u2'))).toBe(false)
  expect(canDownloadAttachment(user('editor', 'u2'), cleanAttachment())).toBe(false)
})
```

- [ ] **Step 2: Executar os testes e confirmar a falha**

Run: `npm run test:unit -- src/features/leads/access.test.ts`

Expected: FAIL por políticas inexistentes.

- [ ] **Step 3: Implementar acesso e endpoint real de download**

As policies retornam constraints de Payload, nunca filtram depois da consulta. `commercial` lista somente lead atribuído a si ou `releasedToCommercial=true`; `admin` lista todos; editor/reader nunca leem lead, PII ou anexo. REST/GraphQL/Local API nativos e a view default da collection nunca retornam campos PII, protocolo, descrição, notas, attribution ou anexos, nem para admin: field access entrega apenas DTO redigido de fila (ID opaco, serviço, status/versão e timestamps). PII, atribuição, idempotência, retenção, lifecycle e exclusão são imutáveis por update normal. Hard delete nunca é endpoint CRUD; usa o fluxo motivado da Task 10.

Detalhe PII existe somente por `POST /api/admin/leads/[id]/detail`, nunca GET. A rota exige usuário ativo, MFA, trusted origin, body bounded e JSON estrito `{ purpose }`, reutilizando a enum fechada `commercial_review | technical_review | customer_follow_up | privacy_request | incident_response`; aplica os mesmos headers no-store/no-referrer do download. `readLeadPrivateDetail()` abre transação, exige admin ou commercial que possa ler o lead, lifecycle `active`, lê via capability interna, grava `lead.pii_read` com ator/alvo/purpose sem valores e commita **antes** de devolver o DTO PII mantido apenas em memória. Falha de audit/commit retorna erro sem corpo PII. `LeadPrivateDetail` obriga selecionar purpose antes de carregar, posta somente nessa rota, limpa estado no unmount/logout e não usa cache, URL, local/session storage ou query client. Testes provam que REST/GraphQL/view default não vazam canaries mesmo para admin, GET/sem purpose/sem MFA/editor/não atribuído falham, audit precede response e a UI limpa o detalhe.

Criar `POST /api/lead-attachments/[id]/download`; não existe GET nem URL gerada por hook/admin collection. A rota exige sessão de usuário ativo, `hasVerifiedMfa(req)`, origin exata de `SITE_URL`, JSON estrito `{ purpose }`, sendo `purpose` uma enum fechada `commercial_review | technical_review | customer_follow_up | privacy_request | incident_response`, e aplica `Cache-Control: private, no-store, max-age=0`, `Pragma: no-cache` e `Referrer-Policy: no-referrer`. Dentro de transação, `authorizeAttachmentDownload()` bloqueia anexo e lead, exige `privacyLifecycleStatus='active'`, `attachment.status='clean'`, papel `admin` ou `commercial` que efetivamente possa ler aquele lead, e cria **antes da URL** um `file-access-event` append-only e `lead.attachment_download_authorized` pelo `writeAuditEvent()` central. Somente após commit o adapter chama `createDownloadUrl({ key: storageKey, expiresInSeconds, downloadName })`, com `expiresInSeconds <= 900` e `downloadName` genérico derivado apenas do MIME, nunca `originalName`. Falha de assinatura não apaga a autorização auditada e retorna código genérico; storage key, stack e URL nunca entram em log. Resposta contém somente `{ url, expiresAt }`, sem PII, e nenhum proxy/cache pode armazená-la.

Testes unitários e de integração negam usuário sem MFA, editor/reader, comercial não atribuído/não liberado, lead em retenção, anexo `quarantined | rejected`, purpose ausente/livre e método GET. Spies provam ordem `file-access-event` + audit commit → signed URL, TTL de 900 segundos no máximo, headers no-store e ausência de originalName/PII nos logs/resposta.

- [ ] **Step 4: Implementar o comando transacional `changeLeadStatus` e UI admin**

```ts
export async function changeLeadStatus(input: {
  req: PayloadRequest
  leadId: string
  toStatus: LeadStatus
  expectedVersion: number
  reason: LeadStatusReason
  note: string
}): Promise<{ status: LeadStatus; statusVersion: number }>
```

`LeadStatusReason` é enum fechada e validada por transição (`initial_review | customer_contact | site_visit | proposal | negotiation | customer_decision | execution | correction`); `note` é obrigatória, trim, 3..1000 caracteres e permanece apenas no `lead-event` privado, nunca no audit/log. `changeLeadStatus()` exige usuário ativo com MFA, papel `admin` ou `commercial` autorizado a ler o lead, e lifecycle `active`. Em uma transação, carrega a row `FOR UPDATE`, compara `expectedVersion`, valida a aresta na matriz de `status.ts`, seta `req.context.internalOperation=true` somente para as escritas internas, atualiza `status` e incrementa `statusVersion`, cria `lead-event` com `fromStatus`, `toStatus`, reason/note/ator e cria `lead.status_changed` com somente from/to/reason na metadata central; então commita. Hooks bloqueiam qualquer update de `status/statusVersion` fora desse comando, inclusive Local API/admin. Versão stale retorna `409 STALE_LEAD_VERSION`; aresta inválida retorna `409 INVALID_STATUS_TRANSITION`; autorização retorna 403 sem revelar existência.

`POST /api/admin/leads/[id]/status` faz autenticação ativa, MFA, trusted origin, body bounded/schema estrito e chama apenas esse comando; resposta é no-store. `ChangeLeadStatus` recebe status/versão atuais, reason e note acessíveis, posta nessa rota, trata 409 recarregando o estado e nunca chama update da collection. `LeadStatusHistory` renderiza `lead-events` append-only em ordem, sem permitir edição. Registrar `LeadPrivateDetail`, `ChangeLeadStatus` e `LeadStatusHistory` como componentes admin de `Leads`, rodar `npm run generate:importmap`, e manter o import map somente gerado.

O teste concorrente dispara duas transições com a mesma `expectedVersion`: exatamente uma commita, a outra recebe 409, `statusVersion` incrementa uma vez e existem exatamente um `lead-event` e um audit event correspondentes. Injetar falha em update/event/audit prova rollback de tudo. E2E autentica comercial atribuído com MFA, muda status pela UI, recarrega e confere histórico; em seguida prova negação para editor, comercial não atribuído e sessão sem MFA.

- [ ] **Step 5: Implementar confirmação e E2E completo**

```tsx
// src/features/leads/form/lead-success.tsx
export function LeadSuccess({ protocol }: { protocol: string }) {
  return (
    <section aria-labelledby="lead-success-title" tabIndex={-1}>
      <h2 id="lead-success-title">Solicitação recebida</h2>
      <p>Protocolo: <strong>{protocol}</strong></p>
      <CopyButton value={protocol} label="Copiar protocolo" />
      <WhatsAppLink context="general">Continuar no WhatsApp</WhatsAppLink>
    </section>
  )
}
```

O teste Playwright deve: abrir o formulário com gate ativo; falhar campos vazios; avançar; anexar JPEG de fixture; aceitar privacidade; manter marketing desmarcado; simular timeout e repetir a mesma chave; receber o mesmo protocolo; verificar que a URL do WhatsApp não contém protocolo, nome ou telefone; autenticar como editor e confirmar negação de lead/download; autenticar como comercial atribuído com MFA, comprovar que a view default está redigida, selecionar purpose no `LeadPrivateDetail`, confirmar audit anterior ao detalhe e baixar anexo `clean`; negar download de fixture `quarantined`; exigir purpose; limpar o detalhe no logout; e validar headers no-store/TTL.

Run: `npm run test:int -- tests/integration/leads/lead-commands.int.test.ts && npm run test:e2e -- tests/e2e/lead-form.spec.ts tests/e2e/lead-access.spec.ts tests/e2e/admin/lead-status.spec.ts`

Expected: PASS nos projetos desktop Chromium, mobile Chromium e WebKit.

- [ ] **Step 6: Executar o gate completo e commit**

```bash
npm run lint
npm run typecheck
npm run generate:importmap
npm run test:unit
npm run test:int
npm run test:e2e -- tests/e2e/lead-form.spec.ts tests/e2e/lead-access.spec.ts tests/e2e/admin/lead-status.spec.ts
git add src tests/integration/leads/lead-commands.int.test.ts tests/e2e
git commit -m "feat: complete secure lead intake workflow"
```

Expected: todos os comandos terminam com exit code 0.

---

### Task 10: Retenção, uploads abandonados e solicitações do titular

**Files:**
- Create: `src/features/privacy/privacy-field-inventory.ts`
- Create: `src/features/privacy/privacy-field-inventory.test.ts`
- Create: `src/features/privacy/retention-worker.ts`
- Create: `src/features/privacy/retention-worker.test.ts`
- Create: `src/features/privacy/data-subject-service.ts`
- Create: `src/features/privacy/data-subject-service.test.ts`
- Create: `src/features/privacy/tombstone-store.ts`
- Create: `src/features/privacy/s3-tombstone-store.ts`
- Create: `src/features/privacy/tombstone-replication-worker.ts`
- Create: `src/features/privacy/tombstone-replication-worker.test.ts`
- Create: `src/features/privacy/reapply-privacy-tombstones.ts`
- Create: `src/features/privacy/reapply-privacy-tombstones.test.ts`
- Create: `src/features/privacy/operational-cleanup-worker.ts`
- Create: `src/features/privacy/operational-cleanup-worker.test.ts`
- Create: `src/features/uploads/abandoned-upload-worker.ts`
- Create: `src/features/uploads/abandoned-upload-worker.test.ts`
- Create: `scripts/reapply-privacy-tombstones.ts`
- Modify: `src/app/api/internal/jobs/route.ts`
- Modify: `src/collections/DataSubjectRequests.ts`
- Modify: `src/collections/Leads.ts`
- Modify: `src/collections/LeadEvents.ts`
- Modify: `src/collections/UploadSessions.ts`
- Modify: `src/collections/LeadAttachments.ts`
- Modify: `src/collections/PrivacyReceipts.ts`
- Modify: `src/collections/OutboxEvents.ts`
- Modify: `src/collections/FileAccessEvents.ts`
- Modify: `src/collections/RequestRateLimits.ts`
- Modify: `src/collections/PrivacyTombstones.ts`
- Modify: `src/collections/WorkerRunStates.ts`
- Modify: `package.json`
- Test: `tests/integration/privacy/retention.int.test.ts`
- Test: `tests/integration/privacy/tombstone-restore.int.test.ts`
- Modify test: `tests/integration/jobs/internal-jobs.int.test.ts`
- Test: `tests/e2e/admin/data-subject-requests.spec.ts`

**Interfaces:**
- Consumes: snapshots `retentionPolicyDays`/`retentionUntil` já gravados em cada lead/attachment/receipt, storage privado, ledger de tombstones separado, collections operacionais e auditoria central.
- Produces: `RetentionWorkerDependencies`, `deleteAbandonedUploads()`, `cleanupOperationalData()`, `markExpiredLeads()`, `finalizeExpiredLead()`, `processDataSubjectRequest()`, `processTombstoneReplicationBatch()`, `reapplyPrivacyTombstones()` e comando `npm run privacy:tombstones:reapply`.

- [ ] **Step 1: Escrever testes falhando de prazo, lifecycle e inventário completo**

```ts
it('remove upload expirado nunca associado', async () => {
  const result = await deleteAbandonedUploads({ now: new Date('2026-07-25T12:00:00Z'), batchSize: 100 }, deps)
  expect(result).toEqual({ deleted: 1, failed: 0 })
  expect(deps.store.delete).toHaveBeenCalledWith('quarantine/expired')
})

it('não elimina lead antes do retentionUntil', async () => {
  expect(await markExpiredLeads(new Date('2026-07-25T12:00:00Z'), deps)).toEqual([])
})

it('continua limpando snapshots vencidos mesmo com setting atual inválido', async () => {
  const depsWithoutCurrentSettings: RetentionWorkerDependencies = retentionDeps({ leads: [expiredActiveLead] })
  await markExpiredLeads(new Date('2028-07-25T12:00:00Z'), depsWithoutCurrentSettings)
  expect(depsWithoutCurrentSettings.markRetentionPending).toHaveBeenCalledWith(expiredActiveLead.id)
})
```

`privacy-field-inventory.ts` classifica **todo campo persistido** das onze collections como pessoal/pseudônimo/operacional e define sua ação/TTL. O teste compara esse inventário às configs Payload: adicionar/renomear campo sem classificação falha. Ele exige cobertura nominal de nome, WhatsApp, e-mail, empresa, cidade, UF, descrição, condicionais, attribution/UTMs/path, notas comerciais, protocolo, idempotency key, responsável/liberação, filenames, storage keys, hashes, MIME/bytes, tokens/HMACs, recibos/consentimento, notes/actors dos eventos, payload/outcome da outbox, acessos de arquivo, contato/nota/export do titular, HMAC de IP e todos os timestamps/leases/códigos de worker. Campos operacionais preservados precisam de justificativa no próprio inventário, não de default implícito.

O teste de integração cria lead `active` antes e depois do prazo, outro `retention_pending`, outro `anonymized`, anexos clean/quarantined, recibo e eventos. `markExpiredLeads()` seleciona somente `privacyLifecycleStatus='active' AND retentionUntil <= now`; `finalizeExpiredLead()` continua os `retention_pending`; `anonymized` é no-op. Setting atual `0`, `3651`, ausente ou banco de settings indisponível fecha nova coleta e alerta pelo monitor, mas **não interrompe** a limpeza de snapshots vencidos. Lead ativo legado sem snapshot válido gera alerta de integridade e é isolado, sem bloquear os demais.

- [ ] **Step 2: Implementar limpeza idempotente de uploads**

`deleteAbandonedUploads()` seleciona sessões `pending | quarantined` não associadas, com `expiresAt <= now`, em lotes de 100 e `FOR UPDATE SKIP LOCKED`. Exclui o objeto privado, marca a sessão `expired`, invalida ambos os token hashes e emite `privacy.upload_expired` somente com ID opaco. `NoSuchKey` conta como sucesso idempotente; indisponibilidade do storage preserva o registro e agenda nova tentativa. Nunca remove attachment associado. Uma segunda fase remove a row expirada em no máximo 24 horas. Sessão `rejected` tem objeto removido imediatamente e row/tokens apagados no mesmo limite.

- [ ] **Step 3: Implementar retenção em duas fases com matriz executável**

`markExpiredLeads(now)` **não recebe nem consulta `leadRetentionDays` atual**. Em lotes/lock, usa apenas lifecycle `active` e `retentionUntil` confiável armazenado; marca `retention_pending`, grava `disposalReason`, `privacy.retention_marked` e intents/outbox deduplicadas de tipo `privacy_tombstone_replicate` mais remoção de objetos. O payload da intent tem somente subject collection/ID opaco, reason/effectiveAt e dedup key, nunca PII.

`processTombstoneReplicationBatch()` sempre reclama primeiro a intent pendente mais antiga (lease com owner/expiry), adquire advisory lock global do ledger e bloqueia `FOR UPDATE` a row-head `worker-run-states/privacy-ledger-replication`. A partir de `checkpointSequence/checkpointDigest`, calcula `sequence = head + 1`, JSON canônico, SHA-256 e object key determinística `ledger/v1/<sequence>-<digest>.json`; assina o digest/entry com Ed25519 usando a key version atual e faz put condicional sem overwrite. Após ACK, uma transação cria a row `privacy-tombstones` completa, faz CAS do head antigo para sequence/digest novo e conclui a outbox. CAS/unique conflict faz rollback/retry, nunca fork. Crash entre ACK e DB deixa a mesma intent mais antiga; após lease vencer, o recovery encontra a object key idêntica, verifica bytes/digest/assinatura e conclui DB sem novo append. Intent mais nova não ultrapassa a mais antiga reclamada/expirada. O lead só pode finalizar quando a row tem `replicatedAt`; falha externa mantém `retention_pending` e alerta sem PII.

Depois que cada objeto retorna `NoSuchKey`, `finalizeExpiredLead()` roda em uma transação: apaga children pessoais, limpa o lead conforme a matriz, muda lifecycle para `anonymized`, mantém `disposalReason`, emite `privacy.lead_anonymized` e commita. Falha parcial nunca marca finalizado. A matriz é obrigatória:

| Conjunto | Prazo/gatilho | Ação irreversível | Resíduo permitido |
|---|---|---|---|
| Lead ativo | `retentionUntil` snapshot | Nulificar `protocol`, `idempotencyKey`, nome, WhatsApp, e-mail, empresa, cidade, UF, descrição, condicionais, attribution completa, notas, responsável, snapshot `retentionPolicyDays`/`retentionUntil` e qualquer flag de liberação; lifecycle `anonymized` | ID interno sem mapa, serviço/status, timestamps técnicos e motivo de descarte |
| Attachment associado/quarentena | Mesmo `retentionUntil` do lead | Excluir objeto primeiro e depois row inteira, incluindo filename, storage key, hash, MIME e bytes | Tombstone sem hash/filename |
| Upload session associada | Finalização do lead | Excluir row, tokens/HMACs, metadata e chave | Nenhum |
| Lead events, receipt e file access | Finalização do lead | Excluir notes, actor/target links e recibo/consentimento completos; audit central sem PII permanece | Audit event allowlisted sem conteúdo |
| Outbox ligada ao lead | Início da retenção | Cancelar pendentes, impedir novo envio e apagar/redigir protocolo/cidade/IDs de payload; remover row terminal conforme TTL abaixo | Contadores agregados sem aggregate ID |
| Upload nunca associado | `expiresAt` (15 min) | Excluir objeto; apagar row em até 24 h | Audit opaco |
| Outbox geral | Imediatamente ao ficar `sent`/`failed` | Redigir payload; remover `sent` em 30 dias e `failed` em 90 dias | Métrica agregada |
| Request rate limit | `expiresAt` da janela | Excluir row/HMAC de IP no próximo job, lag máximo monitorado de 1 h | Nenhum |
| Export DSR | `exportExpiresAt = createdAt + 24 h` | Excluir objeto e limpar storage key/hash; URL individual expira em 15 min | Evento `privacy.export_created` sem URL/conteúdo |
| Caso DSR resolvido | Mesma transação da resolução | Nulificar `requesterContact`, `resolutionNote`, `assignedTo`, `subjectLeads`, `targetsReviewedBy`, valores corrigidos e qualquer evidência de identidade; export key/hash seguem a linha de TTL do export | Tipo, status, identity status, due/reviewed/resolved timestamps e audit allowlisted |
| Tombstone DB/ledger externo | Até todo backup capaz de ressuscitar o subject expirar + 30 dias | Remover só após prova pelo manifest de backups | Subject ID opaco, motivo, data, versão/hash-chain enquanto necessário |
| Audit central | Política de auditoria do Plano 3 | Nunca recebe PII; retenção própria não é usada para guardar conteúdo descartado | Ator, literal enumerado, target ID opaco, timestamp e metadata allowlisted |
| Worker run state | Upsert por execução | Sobrescrever a única row por worker; nunca armazenar mensagem/payload/subject ID | Nome/status, lease, timestamps, contagem e lag operacional |

`cleanupOperationalData()` executa, com locks/limites separados, limpeza de rate-limit expirado, redaction/TTL da outbox, rows de uploads expirados e exports DSR. Testes congelam o relógio em cada fronteira, executam duas vezes para idempotência e inspecionam banco/storage/logs para garantir que todos os canaries pessoais sumiram.

- [ ] **Step 4: Implementar fluxo do titular**

```ts
export type DataSubjectRequestType =
  | 'access'
  | 'correction'
  | 'deletion'
  | 'marketing-revocation'

type DataSubjectCommandBase = {
  req: PayloadRequest
  requestId: string
  resolutionNote: string
  now: Date
}

export type ProcessDataSubjectRequestInput =
  | (DataSubjectCommandBase & { requestType: 'access' | 'deletion' | 'marketing-revocation'; changes?: never })
  | (DataSubjectCommandBase & {
      requestType: 'correction'
      changes: Array<{
        leadId: string
        field: 'name' | 'whatsapp' | 'email' | 'company'
        value: string | null
      }>
    })

export async function processDataSubjectRequest(
  input: ProcessDataSubjectRequestInput,
): Promise<{ status: 'resolved'; resolvedAt: string }>
```

O canal público é o contato de privacidade do documento legal; não existe formulário anônimo adicional. Todos os comandos inferem o ator de `req`, exigem admin ativo com MFA e nunca aceitam `actorId` do body. Admin registra o caso (`privacy.request_created`), confirma identidade fora de logs/storage e muda `identityStatus` para `verified` (`privacy.request_identity_verified`). **Depois** da verificação, um admin revisa e persiste explicitamente `subjectLeads` hasMany, `targetsReviewedAt` e `targetsReviewedBy`; toda variante operacional exige conjunto não vazio, em especial access/correction/deletion. Não inferir por nome, telefone, e-mail ou busca fuzzy. Ao processar, carregar e bloquear em ordem estável exatamente os IDs revisados, confirmar que ainda existem e que o ator pode administrar todos; mismatch/missing target falha a transação.

O comando lê `requestType` persistido e exige que coincida com a variante discriminada. `access` gera JSON estrito **somente** para o target set revisado, emite `privacy.export_created`, produz URL assinada de no máximo 15 minutos e fixa `exportExpiresAt` em 24 horas; cleanup apaga o objeto mesmo que nunca baixado. `correction` exige `changes` não vazio, IDs todos pertencentes a `subjectLeads`, campos apenas da allowlist e valores validados pelos mesmos schemas do lead; aplica as mudanças na transação e nunca persiste/loga o array ou valores. As outras variantes rejeitam chave `changes`, mesmo vazia. `deletion` inicia para todos os targets o mesmo lifecycle/tombstone idempotente com `disposalReason='data_subject_request'`. `marketing-revocation` altera somente consentimento dos targets revisados, cria receipts de revogação e emite `privacy.marketing_revoked`.

Conclusão emite `privacy.request_resolved` e, na mesma transação (ou depois do TTL do export, para seus ponteiros), limpa contato, resolution note, `subjectLeads`, reviewer/assignee e valores pessoais do caso. Toda decisão é auditada sem PII, URL ou conteúdo. Testes cobrem dois leads do mesmo titular selecionados juntos, homônimos, contato compartilhado por pessoas distintas, target omitido/cruzado, target apagado entre revisão e comando, campo extra, field fora da allowlist, `changes` em comando não correction, concorrência e rollback sem persistir o payload efêmero.

- [ ] **Step 5: Implementar ledger e reaplicação obrigatória após restore**

`S3TombstoneStore` usa prefixo/bucket privado distinto, versioning + Object Lock, SSE e credencial que permite append/read mas não overwrite/delete durante a janela. O schema de env do Plano 5 fornece `TOMBSTONE_LEDGER_CURRENT_SIGNING_KEY` (seed Ed25519 de 32 bytes), `TOMBSTONE_LEDGER_KEY_VERSION` e `TOMBSTONE_LEDGER_VERIFY_KEYS` (mapa versionado para public keys históricas); seeds privadas nunca entram em banco, manifest, build ou log. Cada entrada canônica inclui somente sequence, subject collection/ID opaco, motivo, effectiveAt, `ledgerVersion`, previous digest, `keyVersion` e assinatura Ed25519; nunca protocolo, idempotency key, contato ou file hash. Depois do append confirmado, criar a row completa com sequence/object key/digest/key version/`replicatedAt`; não atualizar tombstone parcial. `reapplyPrivacyTombstones()` verifica sequência sem gap/fork, digest, assinatura pela keyring histórica e hash chain e, idempotentemente, elimina objetos/children restaurados antes de emitir `privacy.tombstone_reapplied`. Testes cobrem duas replicas concorrentes, lease fresca/vencida, CAS perdido, crash ACK→DB, retry, sequence monotônica, rotação v1→v2 aceita e versão/chave desconhecida rejeitada fail-closed.

`npm run privacy:tombstones:reapply -- --manifest <restore-manifest>` é etapa obrigatória entre restore de banco/storage e liberação de readiness/tráfego. O manifest referencia uma cópia do ledger capturada imediatamente antes do restore, fora do snapshot restaurado. Ledger ausente, versão desconhecida, assinatura/hash inválidos, objeto residual ou tombstone não aplicado encerra com exit code não zero e bloqueia release. O teste restaura backup anterior a uma exclusão, comprova que o lead/anexo reapareceram no snapshot isolado, executa o comando e exige zero PII/objeto ao final; segunda execução é no-op. O Plano 5 deve chamar esse comando em todo drill/restore real antes de `release:approve`.

- [ ] **Step 6: Integrar jobs, monitor de readiness e verificar**

O job interno preserva `processPublicationBatch()` e executa publicação, scan, outbox, abandono, cleanup operacional, marcação/replicação de tombstone/finalização de retenção e expiração de exports com locks/leases/métricas separados, lotes limitados e comparação constante do segredo. O monitor consulta a readiness atual e alerta configuração inválida sem PII; esse alerta não controla nem aborta publication/cleanup. Reexecutar os testes de crash/lease do publication worker e do ledger sempre que a rota for modificada. Rodar:

```bash
npm run test:unit -- src/features/privacy src/features/uploads/abandoned-upload-worker.test.ts
npm run test:int -- tests/integration/jobs/internal-jobs.int.test.ts
npm run test:int -- tests/integration/privacy/retention.int.test.ts
npm run test:int -- tests/integration/privacy/tombstone-restore.int.test.ts
npm run test:e2e -- tests/e2e/admin/data-subject-requests.spec.ts
```

Expected: inventário completo, limites anterior/posterior, setting atual inválido sem bloquear vencidos, retry de storage/ledger, TTL do export, cleanup de outbox/rate limit, revogação, exclusão motivada e restore antigo passam sem URL pública, ressurreição ou PII em logs/resíduos.

- [ ] **Step 7: Commit**

```bash
git add src/features/privacy src/features/uploads src/app/api/internal/jobs/route.ts src/collections scripts/reapply-privacy-tombstones.ts package.json tests/integration/privacy tests/integration/jobs/internal-jobs.int.test.ts tests/e2e/admin
git commit -m "feat(privacy): enforce retention and data subject rights"
```
