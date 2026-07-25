# Payload CMS Content Management Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` or `superpowers:executing-plans`. Track every step with checkboxes.

**Goal:** Entregar o Payload CMS 3.86.0 completo para gestão editorial, autorizações, publicação controlada, mídia, conteúdo público e invalidação de cache.

**Architecture:** Expandir a fundação do plano 1 sem substituir seus arquivos-base. Payload continua como monólito modular com PostgreSQL. Collections públicas usam versões/drafts, workflow adicional, soft delete e DTOs públicos explícitos. Publicação usa saga/outbox durável: o candidato permanece em `publishing` e não público enquanto mídia é promovida e caches são pré-purgados; somente então a versão é ativada atomicamente, seguida por purge final idempotente. PostgreSQL nunca tenta tornar storage/CDN parte de sua transação; archive, delete e revoke tornam o conteúdo não público primeiro e persistem o purge para retry e alerta.

**Tech Stack:** Payload CMS 3.86.0, Next.js, TypeScript strict, PostgreSQL, Vitest, Playwright, Node `crypto`.

## Global Constraints

- Usar `npm` e os scripts do plano 1.
- Não modificar `src/migrations/20260725_000001_foundation.ts`.
- Não criar conteúdo ou campos de proteção contra incêndio.
- Conteúdo público exige `_status = published`, `workflow.state = published` e ausência de `deletedAt`.
- Somente administrador aprova e solicita publicação, arquivamento, restauração ou exclusão; o worker interno apenas conclui operações duráveis previamente autorizadas, sem adquirir permissão editorial própria.
- Editor cria e altera drafts e solicita aprovação.
- Comercial não acessa conteúdo editorial privado.
- Leitor acessa apenas conteúdo público liberado.
- Publicação, arquivamento, ocultação, restauração e revogação de autorização persistem uma operação idempotente em `content-publication-operations`; nenhuma chamada de storage, Next cache ou CDN ocorre dentro da transação PostgreSQL.
- Publish cria uma versão candidata `publishing` não pública e preserva a versão pública anterior. A operação só termina depois de promover mídia/WebVTT, executar pre-purge, ativar a versão em uma transação curta e concluir o purge final; falhas antes da ativação mantêm o candidato não público e falhas posteriores mantêm a operação pendente com retry e alerta.
- Archive, delete e revoke tornam origem/DTO não públicos e criam o outbox na mesma transação; purge ocorre depois do commit, com retry até sucesso. Concorrência usa geração monotônica e lock por alvo, de modo que revoke/archive invalida qualquer publish antigo ainda em voo.
- Mídia ilustrativa nunca pode aparecer em projeto.
- Identidade de cliente, logo, projeto e depoimento dependem de autorização válida.
- Preview e painel usam `no-store`; conteúdo público usa o contrato de cache do plano 2.
- Globals e documentos legais não armazenam segredos ou credenciais.
- Implementar TOTP sem nova dependência, usando `node:crypto` e vetores RFC 6238. A verificação Sonatype para bibliotecas TOTP não pôde ser executada por ausência de token.
- Aprovação e ativação executam o mesmo validator normalizado sobre todos os strings publicáveis, inclusive Lexical, SEO, slug, links e JSON aninhado; qualquer menção normalizada a incêndio ou ao escopo proibido bloqueia a operação sem registrar o conteúdo rejeitado.
- Legendas de vídeo são produzidas no servidor a partir de cues estruturados em português do Brasil; upload arbitrário de WebVTT não é aceito e `captionsSrc` só existe após promoção junto com a publicação do projeto.
- Cada task que cria collection, global, endpoint, hook ou componente admin registra o artefato em `payload.config.ts` no mesmo commit e roda `generate:types`/`generate:importmap` quando aplicável. Integrações das Tasks 1–12 usam apenas o banco descartável terminado em `_test` com `PAYLOAD_TEST_SCHEMA_SYNC=true`; a Task 13 desliga a flag e prova a migration `000002` em banco vazio. Nenhuma integração depende de schema ainda não registrado.
- Limite de dependência incremental: as Tasks 6 e 7 entregam somente modelo, validação, acesso privado e staging. Elas não importam `content-publication-operations`, enqueue, worker, invalidator nem `PublishedAssetPromotionPort`; o wiring de revogação entra na Task 10 e os efeitos externos, promoção e testes de saga entram na Task 11, mantendo cada commit compilável e testável isoladamente.

## Mapa de arquivos

Modificar:

- `src/payload.config.ts`
- `src/collections/Users.ts`
- `src/collections/Media.ts`
- `src/lib/env/server.ts`
- `.env.example`
- `.env.test.example`
- `src/migrations/index.ts`
- `src/modules/content/public/composition-root.ts`
- `src/modules/site/redirects/validate-public-redirect.ts`
- `src/app/(payload)/admin/importMap.js` — somente por geração automática

Criar:

- `src/collections/AuditEvents.ts`
- `src/collections/AdminSessions.ts`
- `src/collections/AuthRateLimits.ts`
- `src/collections/Pages.ts`
- `src/collections/Services.ts`
- `src/collections/Segments.ts`
- `src/collections/Clients.ts`
- `src/collections/ClientAuthorizations.ts`
- `src/collections/Testimonials.ts`
- `src/collections/Projects.ts`
- `src/collections/FAQs.ts`
- `src/collections/Categories.ts`
- `src/collections/Articles.ts`
- `src/collections/LegalDocuments.ts`
- `src/collections/Redirects.ts`
- `src/collections/ContentApprovals.ts`
- `src/collections/ContentPublicationOperations.ts`
- `src/collections/VideoCaptionAssets.ts`
- `src/globals/SiteSettings.ts`
- `src/globals/Navigation.ts`
- `src/globals/Footer.ts`
- `src/globals/BootstrapState.ts`
- `src/modules/identity/roles.ts`
- `src/modules/identity/access.ts`
- `src/modules/identity/password/argon2id.ts`
- `src/modules/identity/password/service.ts`
- `src/modules/identity/session/service.ts`
- `src/modules/identity/session/payload-strategy.ts`
- `src/modules/identity/session/cookies.ts`
- `src/modules/identity/rate-limit/service.ts`
- `src/modules/identity/admin-auth-endpoints.ts`
- `src/modules/identity/mfa/crypto.ts`
- `src/modules/identity/mfa/totp.ts`
- `src/modules/identity/mfa/service.ts`
- `src/modules/identity/mfa/endpoints.ts`
- `src/components/admin/auth/AdminLogin.tsx`
- `src/components/admin/auth/AdminLogoutButton.tsx`
- `src/components/admin/auth/AdminLogoutView.tsx`
- `src/components/admin/auth/AdminAccountSecurity.tsx`
- `scripts/bootstrap-admin.ts`
- `src/modules/audit/events.ts`
- `src/modules/audit/write-audit-event.ts`
- `src/modules/cms/fields/slug.ts`
- `src/modules/cms/fields/seo.ts`
- `src/modules/cms/fields/link.ts`
- `src/modules/cms/fields/workflow.ts`
- `src/modules/cms/fields/evidence.ts`
- `src/modules/cms/blocks/index.ts`
- `src/modules/cms/workflow/types.ts`
- `src/modules/cms/workflow/fingerprint.ts`
- `src/modules/cms/workflow/machine.ts`
- `src/modules/cms/workflow/service.ts`
- `src/modules/cms/workflow/endpoints.ts`
- `src/modules/cms/workflow/hooks.ts`
- `src/modules/cms/publication/types.ts`
- `src/modules/cms/publication/enqueue.ts`
- `src/modules/cms/publication/worker.ts`
- `src/modules/cms/publication/asset-promotion-port.ts`
- `src/modules/cms/validation/media.ts`
- `src/modules/cms/validation/authorization.ts`
- `src/modules/cms/validation/project.ts`
- `src/modules/cms/validation/article.ts`
- `src/modules/cms/validation/redirect.ts`
- `src/modules/cms/validation/forbidden-scope.ts`
- `src/modules/cms/video-captions/build-webvtt.ts`
- `src/modules/cms/video-captions/store.ts`
- `src/components/admin/mfa/MfaGate.tsx`
- `src/components/admin/workflow/WorkflowControls.tsx`
- `src/components/admin/workflow/HiddenPublishControls.tsx`
- `src/modules/content/public/payload-repository.ts`
- `src/modules/content/preview/payload-repository.ts`
- `src/modules/content/revalidation/payload-hooks.ts`
- `src/modules/content/revalidation/content-change-contract.ts`
- `src/modules/content/seed/initial-content.ts`
- `src/modules/content/seed/bootstrap-seed.ts`
- `scripts/seed-initial-content.ts`
- `src/migrations/20260725_000002_content_management.ts`

## Contratos centrais

```ts
export type Role = 'admin' | 'editor' | 'commercial' | 'reader'

export type WorkflowState =
  | 'draft'
  | 'pending_evidence'
  | 'approved'
  | 'publishing'
  | 'published'
  | 'archived'

export const WORKFLOW_COLLECTIONS = [
  'pages',
  'services',
  'segments',
  'media',
  'clients',
  'testimonials',
  'projects',
  'faqs',
  'categories',
  'articles',
  'legal-documents',
  'redirects',
] as const

export type WorkflowCollectionSlug =
  (typeof WORKFLOW_COLLECTIONS)[number]

export type WorkflowGlobalSlug =
  | 'site-settings'
  | 'navigation'
  | 'footer'

export type ContentTarget =
  | {
      kind: 'collection'
      collection: WorkflowCollectionSlug
      id: string
    }
  | {
      kind: 'global'
      global: WorkflowGlobalSlug
    }

export interface WorkflowResult {
  state: WorkflowState
  approvalId: string | null
  publishedAt: string | null
  operationId: string | null
}

export type PublicationOperationKind =
  | 'publish'
  | 'archive'
  | 'delete'
  | 'restore'
  | 'revoke'

export type PublicationOperationPhase =
  | 'queued'
  | 'copying_assets'
  | 'pre_purge'
  | 'activating'
  | 'final_purge'
  | 'completed'
  | 'failed'

export interface PublicationOperationResult {
  operationId: string
  phase: PublicationOperationPhase
  workflowState: WorkflowState
  retryable: boolean
}

// Importar ContentChange e ContentInvalidationPort do Plano 2; não redeclarar.
// src/modules/content/revalidation/content-change-contract.ts contém a asserção
// de tipo exata abaixo e faz o typecheck falhar se qualquer plano divergir.
type RequiredContentChangeCollection =
  | WorkflowCollectionSlug
  | 'client-authorizations'
  | WorkflowGlobalSlug

type RequiredContentChangeOperation =
  | 'publish'
  | 'update'
  | 'unpublish'
  | 'archive'
  | 'revoke'
  | 'delete'
  | 'restore'

type Equal<A, B> =
  (<T>() => T extends A ? 1 : 2) extends
  (<T>() => T extends B ? 1 : 2) ? true : false
type Expect<T extends true> = T

export type ContentChangeCollectionsAreExact = Expect<
  Equal<ContentChange['collection'], RequiredContentChangeCollection>
>
export type ContentChangeOperationsAreExact = Expect<
  Equal<ContentChange['operation'], RequiredContentChangeOperation>
>
```

Collections públicas usam:

```ts
versions: {
  drafts: {
    autosave: {
      interval: 1500,
      showSaveDraftButton: true,
    },
    validate: false,
  },
  maxPerDoc: 50,
},
trash: true
```

## Esquema editorial

- `pages`: `kind`, `title`, `slug`, `hero`, `blocks`, `seo`, `evidence`, `workflow`.
- `services`: `group`, `title`, `slug`, `eyebrow`, `summary`, `heroMedia`, `needs`, `deliverables`, `process`, `relatedServices`, `whatsappContext`, `seo`, `evidence`, `workflow`.
- `segments`: `title`, `slug`, `summary`, `operationalContext`, `carePoints`, `services`, `faqs`, `heroMedia`, `whatsappContext`, `seo`, `evidence`, `workflow`.
- `media`: upload público, `kind`, `alt`, `caption`, `credit`, `sourceUrl`, `licenseName`, `licenseUrl`, `licenseCheckedAt`, `clientAuthorization`, `workflow`.
- `clients`: `name`, `slug`, `logo`, `summary`, `evidence`, `workflow`.
- `client-authorizations`: upload privado, `client`, `scopes`, `grantedAt`, `expiresAt`, `revokedAt`, `status`, `notes`.
- `testimonials`: `client`, `authorization`, `name`, `role`, `text`, `sourceUrl`, `evidence`, `workflow`.
- `projects`: `title`, `slug`, `summary`, `locality`, `client`, `clientDisclosure`, `authorization`, `segment`, `services`, `challenge`, `scope`, `solution`, `systems`, `result`, `cover`, `gallery`, `beforeAfter`, `video` (`src`, `poster`, `captionCues`, `captionsLanguage='pt-BR'`, `captionAsset` interno), `relatedProjects`, `seo`, `evidence`, `workflow`.
- `faqs`: `question`, `answer`, `scope`, `services`, `segments`, `evidence`, `workflow`.
- `categories`: `title`, `slug`, `description`, `evidence`, `workflow`.
- `articles`: `title`, `slug`, `excerpt`, `content`, `heroMedia`, `categories`, `author`, `technicalReviewer`, `hasNormativeClaims`, `sources`, `evidence`, `relatedServices`, `seo`, `workflow`.
- `legal-documents`: `type`, `title`, `version`, `effectiveAt`, `controllerName`, `privacyContact`, `content`, `seo`, `workflow`; o adapter converte Lexical para `PublicLegalDocument.body`.
- `redirects`: `sourcePath`, `destinationPath`, `kind`, `workflow`.
- `content-approvals`: `targetKind`, `targetCollection`, `targetGlobal`, `fingerprint`, `status`, ator solicitante/decisor discriminado como `AuditActor`, `requestedAt`, `decidedAt`, `requestNote`, `decisionNote`; exatamente um user/system por ator.
- `content-publication-operations`: outbox/saga privada com `target`, `kind`, `candidateVersionId`, `fingerprint`, `generation`, `phase`, `attempts`, `nextAttemptAt`, `leaseOwner`, `leaseExpiresAt`, `preparedAssets`, `lastErrorCode`, timestamps de ativação/conclusão e `deduplicationKey` único; administrador somente lê e worker interno cria/atualiza.
- `video-caption-assets`: artefato interno gerado, nunca upload do navegador; guarda projeto/versão, `language='pt-BR'`, `cuesHash`, chave staging, chave pública imutável opcional, bytes, SHA-256 e estado `draft | promoted | retired`.
- `admin-sessions`: token HMAC, usuário, `sessionVersion`, estado `preauth | authenticated`, `mfaVerifiedAt`, expiração/idle/revogação; internal-only, sem token claro, IP ou user-agent.
- `auth-rate-limits`: chave HMAC opaca, ação de senha/MFA, bucket de 15 minutos, tentativas e bloqueio; não guarda usuário, e-mail, token ou IP bruto e só código interno lê/escreve.
- `site-settings`: empresa, contatos, localidade, atendimento, dados públicos e grupo privado `leadPrivacyReadiness` (revisão de finalidade/base, `authorizedUserIds` e retenção), nunca exposto por `PublicSiteSettings`.
- `navigation`: links principais e visibilidade condicional.
- `footer`: descrição, colunas, redes e links legais.

Escopos de autorização:

```ts
export type AuthorizationScope =
  | 'client_name'
  | 'client_logo'
  | 'project_details'
  | 'project_media'
  | 'testimonial'
```

## Task 1: RBAC e auditoria

**Files:**

- Create: `src/modules/identity/roles.ts`
- Create: `src/modules/identity/access.ts`
- Create: `src/modules/identity/password/argon2id.ts`
- Create: `src/modules/identity/password/service.ts`
- Create: `src/modules/identity/session/service.ts`
- Create: `src/modules/identity/session/payload-strategy.ts`
- Create: `src/modules/identity/session/cookies.ts`
- Create: `src/modules/identity/rate-limit/service.ts`
- Create: `src/modules/identity/admin-auth-endpoints.ts`
- Create: `src/components/admin/auth/AdminLogoutButton.tsx`
- Create: `src/components/admin/auth/AdminLogoutView.tsx`
- Create: `src/modules/audit/events.ts`
- Create: `src/modules/audit/write-audit-event.ts`
- Create: `src/collections/AuditEvents.ts`
- Create: `src/collections/AdminSessions.ts`
- Create: `src/collections/AuthRateLimits.ts`
- Create: `scripts/bootstrap-admin.ts`
- Create: `src/lib/env/bootstrap.ts`
- Modify: `src/lib/env/server.ts`
- Modify generated: `src/app/(payload)/admin/importMap.js`
- Modify: `.env.example`
- Modify: `.env.test.example`
- Modify: `package.json`
- Modify: `src/collections/Users.ts`
- Test: `tests/unit/identity/access.test.ts`
- Test: `tests/unit/identity/argon2id.test.ts`
- Test: `tests/integration/identity/admin-session.test.ts`
- Test: `tests/integration/identity/rbac.test.ts`
- Test: `tests/integration/identity/admin-bootstrap.test.ts`
- Test: `tests/e2e/admin/custom-auth-logout.spec.ts`

**Interfaces:**

```ts
export function hasRole(
  user: Pick<User, 'roles'> | null | undefined,
  roles: readonly Role[],
): boolean

export async function hasVerifiedMfa(req: PayloadRequest): Promise<boolean>

export type AuthRateLimitAction = 'password'

export async function consumeAuthRateLimit(input: {
  normalizedSubject: string
  normalizedIp: string
  action: AuthRateLimitAction
  now: Date
}): Promise<{ allowed: boolean; retryAfterSeconds: number }>

export async function writeAuditEvent(
  req: PayloadRequest,
  input: {
    event: AuditEventName
    subjectCollection?: string
    subjectId?: string
    metadata?: Record<string, string | number | boolean | null>
  },
): Promise<void>

export async function writeSystemAuditEvent(
  actor: Extract<AuditActor, { kind: 'system' }>,
  input: Omit<Parameters<typeof writeAuditEvent>[1], 'actor'>,
): Promise<void>

export const AUDIT_SYSTEM_ACTORS = [
  'initial-seed',
  'admin-bootstrap',
  'identity-service',
  'job-scheduler',
  'publication-worker',
  'invalidation-worker',
  'lead-intake',
  'upload-inspector',
  'scan-worker',
  'outbox-worker',
  'retention-worker',
  'privacy-worker',
  'storage-migrator',
  'backup-worker',
  'restore-verifier',
  'deployment-runner',
  'release-gate',
  'incident-automation',
] as const

export type AuditSystemActor = (typeof AUDIT_SYSTEM_ACTORS)[number]

export type AuditActor =
  | { kind: 'user'; userId: string }
  | { kind: 'system'; system: AuditSystemActor }

export const AUDIT_EVENT_NAMES = [
  'auth.login_success',
  'auth.login_failure',
  'auth.logout',
  'mfa.enroll',
  'mfa.changed',
  'mfa.disabled',
  'mfa.verify_failure',
  'mfa.rate_limited',
  'mfa.recovery_used',
  'user.created',
  'user.updated',
  'user.activated',
  'user.deactivated',
  'user.deleted',
  'role.changed',
  'permission.changed',
  'content.approval_requested',
  'content.approved',
  'content.rejected',
  'content.publish_queued',
  'content.published',
  'content.publish_failed',
  'content.publish_cancelled',
  'content.archive_queued',
  'content.archived',
  'content.deleted',
  'content.restored',
  'content.invalidation_queued',
  'content.invalidation_retried',
  'content.invalidation_failed',
  'content.invalidation_completed',
  'client_authorization.created',
  'client_authorization.revoked',
  'client_authorization.expired',
  'settings.updated',
  'legal.updated',
  'legal.published',
  'lead.created',
  'lead.pii_read',
  'lead.status_changed',
  'lead.disposal_requested',
  'lead.attachment_download_authorized',
  'lead.attachment_scan_clean',
  'lead.attachment_scan_rejected',
  'lead.notification_sent',
  'lead.notification_failed',
  'upload.security_rejected',
  'privacy.upload_expired',
  'privacy.retention_marked',
  'privacy.lead_anonymized',
  'privacy.marketing_revoked',
  'privacy.request_created',
  'privacy.request_identity_verified',
  'privacy.export_created',
  'privacy.request_resolved',
  'privacy.tombstone_reapplied',
  'operations.storage_migration_completed',
  'operations.storage_migration_failed',
  'operations.backup_completed',
  'operations.backup_failed',
  'operations.restore_test_completed',
  'operations.restore_test_failed',
  'operations.deployment_completed',
  'operations.deployment_failed',
  'operations.release_gate_completed',
  'operations.release_gate_failed',
  'operations.job_failed',
  'operations.configuration_changed',
  'operations.incident_opened',
  'operations.incident_closed',
] as const

export type AuditEventName = (typeof AUDIT_EVENT_NAMES)[number]
```

`src/modules/audit/events.ts` é a única fonte de `AUDIT_EVENT_NAMES`, `AuditEventName`, `AUDIT_SYSTEM_ACTORS` e `AuditActor`. Os Planos 4 e 5 importam esses símbolos pelo mesmo caminho; não criam unions locais, module augmentation ou cópias. Se um evento operacional novo for aprovado, o plano consumidor modifica este array canônico e seu teste de contrato no mesmo commit. Preferências públicas de cookie e eventos de analytics não viram `audit-events`, pois permanecem no cliente e não são eventos administrativos.

- [ ] Escrever testes falhando para os quatro papéis, usuário sem papel, editor tentando publicar, editor tentando excluir, comercial lendo draft e leitor lendo draft.
- [ ] Rodar `npm run test:unit -- tests/unit/identity/access.test.ts`; esperado: falhas por exports ausentes.
- [ ] Implementar `roles` como enum múltiplo embutido em `Users` e carregado no usuário autenticado da request, fonte única do RBAC; não criar collections/tabelas paralelas `roles` ou `user_roles`. `Users.active` é booleano admin-only; usuário desativado não autentica, invalida imediatamente todas as sessões opacas, sai da readiness e não acessa CMS/PII. Somente administrador altera papéis ou ativação.
- [ ] Desabilitar criação pública do “primeiro usuário”. `Users.create` sem usuários aceita somente `req.context.adminBootstrap=true`; a UI/rota pública de first-user permanece indisponível. `scripts/bootstrap-admin.ts`, exposto por `npm run admin:bootstrap`, adquire advisory lock e primeiro encerra com sucesso se já existir admin ativo; somente numa instalação vazia exige o schema separado `BOOTSTRAP_ADMIN_EMAIL`/`BOOTSTRAP_ADMIN_PASSWORD` (mínimo 16 caracteres), lê ambos de secret runtime e cria um único admin em transação. Corridas retornam o mesmo estado; segredo e hash nunca entram em log. Readiness falha enquanto não existir admin ativo.
- [ ] Não usar a estratégia local nativa do Payload 3.86.0, que grava `salt/hash` com PBKDF2. Configurar `Users.auth.disableLocalStrategy=true` e redefinir explicitamente `email` como campo required, unique, indexed, normalizado em lowercase e indisponível para alteração fora do comando administrativo, pois esse modo remove também o campo base de e-mail. Definir `admin.useAsTitle='email'`, `admin.autoRefresh=false`, bloquear REST/GraphQL/Local API nativos de login/forgot/reset/refresh e registrar exatamente `payload.authStrategies=['opaque-admin-session']`. `Users` possui `passwordHash` hidden/admin-read-false, `passwordChangedAt` e `sessionVersion`; não possui senha, salt, hash, reset token ou sessões JWT/Payload utilizáveis. Todo create/change/bootstrap passa por `PasswordService`; update direto de `passwordHash` é negado inclusive ao admin sem `req.context.passwordCommand=true`. Testes de contrato provam que nenhuma resposta/cookie contém JWT ou `token` e que refresh permanece negado mesmo quando a custom strategy autentica o usuário.
- [ ] `argon2id.ts` usa exclusivamente o `node:crypto.argon2()` assíncrono disponível no Node 24.14.0, sem dependência nativa adicional, encapsulando sua API callback em `Promise` com rejeição explícita: salt aleatório de 16 bytes, tag de 32 bytes, Argon2id `memory=65536`, `passes=3`, `parallelism=2`, e serialização PHC canônica `$argon2id$v=19$m=65536,t=3,p=2$...$...`. O parser aceita apenas esse perfil/limites, recusa PHC gigante ou algoritmo diferente e compara tag em tempo constante. Testes golden/re-hash provam o prefixo, parâmetros, callback de erro, salt único e que os campos PBKDF2 nativos ficam ausentes.
- [ ] Criar autenticação completa por sessão opaca, não apenas um verificador de senha. `/api/admin-auth/password` chama `consumeAuthRateLimit(action='password')` antes do Argon2 e, em sucesso, cria uma row `AdminSessions.state='preauth'` de cinco minutos; a Task 2 consome essa mesma row e cria/rotaciona para `authenticated` somente após TOTP/recovery. `AdminSessions` guarda apenas HMAC-SHA256 de token aleatório de 32 bytes, usuário, `sessionVersion`, estado, `mfaVerifiedAt`, expiração, idle deadline e revogação; token nunca é persistido em claro. Para e-mail inexistente, a rota consome o mesmo limite e executa um Argon2id dummy com PHC válido antes de responder o mesmo `401`, corpo/tamanho e envelope de tempo; nunca revela se o usuário existe. `consumeAuthRateLimit()` e `AuthRateLimits` são implementados nesta task, são internal-only e aplicam atomicamente cinco tentativas por 15 minutos entre réplicas/restarts sobre `HMAC-SHA256(AUTH_RATE_LIMIT_HMAC_KEY, "v1\0password\0<normalizedEmail>\0<normalizedIp>")`, sem persistir os valores; banco indisponível falha fechado.
- [ ] `opaqueAdminSessionStrategy` lê o cookie de sessão, valida HMAC/estado/prazos/usuário ativo/versão e retorna o user ao Payload. Logout, troca de senha, desativação, mudança de papel e recovery revogam/rotacionam em transação. Em produção HTTPS, os nomes são `__Host-dib-admin`/`__Host-dib-preauth` e ambos sempre usam `Secure`, `HttpOnly`, `Path=/`, sem `Domain`; sessão plena usa `SameSite=Lax` e pre-auth `SameSite=Strict`. Em development/test HTTP, o helper retorna nomes sem prefixo `dib-admin-dev`/`dib-preauth-dev` e `Secure=false`; nunca emula equivalência em produção. Teste Playwright prova que o browser aceita/envia cada variante na origem correta e rejeita configuração `__Host-` sem Secure. Mutações exigem Origin/CSRF exato. `/api/admin-auth/logout`, `/me` e `/password/change` são próprios e testados; nenhum endpoint retorna token no JSON. Substituir `admin.components.logout.Button` e a view `/admin/logout` por componentes que chamam o endpoint próprio, aguardam revogação server-side, limpam somente os cookies próprios e redirecionam ao login; o logout nativo `/api/users/logout` fica bloqueado. O E2E prova que voltar/recarregar após logout não recupera a sessão.
- [ ] `ADMIN_SESSION_HMAC_KEY` e `AUTH_RATE_LIMIT_HMAC_KEY` são Base64 de exatamente 32 bytes, obrigatórios em test/production e distintos entre si, de todas as chaves MFA/upload/tombstone e de `PAYLOAD_SECRET`; `src/lib/env/server.ts`, `.env.example` e `.env.test.example` são atualizados nesta task, e ausência/reuso impede startup. Testes de integração cobrem login nativo negado, custom strategy no Admin/REST/GraphQL, cookie fraco ausente, expiração/idle, replay após rotação, usuário desativado, mudança de senha, rate limit, concorrência e restart.
- [ ] Implementar `AuditEvents` como coleção append-only: administrador lê; nenhum papel atualiza ou exclui. `writeAuditEvent` sempre infere usuário ativo de `req` e não aceita ator no payload; `writeSystemAuditEvent` recebe somente `AuditSystemActor` allowlisted e capability interna não serializável, sem endpoint. Campos discriminados aceitam exatamente um ator: relação de usuário ou system; HTTP nunca escolhe system e seed/jobs nunca forjam FK de usuário. `admin-bootstrap` audita a criação inicial; `identity-service` audita falha de senha, pre-auth, MFA/recovery e rate limit antes de existir `req.user`. Para e-mail desconhecido não grava target; após lookup pode usar somente ID opaco do usuário, nunca e-mail/IP/token/resultado detalhado. Um teste de contrato percorre `AUDIT_EVENT_NAMES`, exige unicidade e prova que os imports usados pelos módulos de identidade, conteúdo, leads, privacidade, storage, backup, restore e release apontam para `src/modules/audit/events.ts`; chamadas HTTP não conseguem selecionar os dois atores.
- [ ] Rodar os testes unitários e de integração; esperado: todos passam, criação externa do primeiro usuário é 403, bootstrap concorrente cria um admin, operações negadas retornam `Forbidden` e cada evento enumerado possui teste que comprova ator, alvo e timestamp sem segredo ou conteúdo privado.
- [ ] Commit:

```bash
git add src/payload.config.ts src/payload-types.ts "src/app/(payload)/admin/importMap.js" src/modules/identity src/modules/audit src/components/admin/auth src/collections/Users.ts src/collections/AdminSessions.ts src/collections/AuthRateLimits.ts src/collections/AuditEvents.ts src/lib/env/bootstrap.ts src/lib/env/server.ts scripts/bootstrap-admin.ts .env.example .env.test.example package.json package-lock.json tests
git commit -m "feat(cms): add roles and immutable audit events"
```

## Task 2: TOTP obrigatório em produção

**Files:**

- Modify: `src/collections/AdminSessions.ts`
- Modify: `src/collections/AuthRateLimits.ts`
- Modify: `src/modules/identity/rate-limit/service.ts`
- Create: `src/modules/identity/mfa/crypto.ts`
- Create: `src/modules/identity/mfa/totp.ts`
- Create: `src/modules/identity/mfa/service.ts`
- Create: `src/modules/identity/mfa/endpoints.ts`
- Create: `src/components/admin/auth/AdminLogin.tsx`
- Create: `src/components/admin/auth/AdminAccountSecurity.tsx`
- Create: `src/components/admin/mfa/MfaGate.tsx`
- Modify: `src/lib/env/server.ts`
- Modify: `.env.example`
- Modify: `.env.test.example`
- Modify: `src/collections/Users.ts`
- Test: `tests/unit/identity/totp.test.ts`
- Test: `tests/integration/identity/mfa.test.ts`

**Interfaces:**

```ts
export function generateTotpSecret(bytes?: Uint8Array): string

export function createOtpAuthUri(input: {
  issuer: 'Designer Inox Brasil'
  accountName: string
  secret: string
}): string

export function verifyTotp(input: {
  secret: string
  token: string
  now: number
  window?: number
  digits?: 6 | 8
}): { valid: boolean; counter: number | null }

export type AuthRateLimitAction =
  | 'password'
  | 'enroll'
  | 'verify'
  | 'recovery'
  | 'password_change'

export async function consumeAuthRateLimit(input: {
  normalizedSubject: string
  normalizedIp: string
  action: AuthRateLimitAction
  now: Date
}): Promise<{ allowed: boolean; retryAfterSeconds: number }>
```

- [ ] Escrever testes com os vetores SHA-1 de oito dígitos do RFC 6238 e testes de janela `-1/0/+1`.
- [ ] Rodar `npm run test:unit -- tests/unit/identity/totp.test.ts`; esperado: falha por módulo inexistente.
- [ ] Implementar Base32, HMAC-SHA1, truncamento dinâmico e comparação constante usando `node:crypto`.
- [ ] Adicionar `MFA_ENCRYPTION_KEY` e `MFA_RECOVERY_PEPPER`, obrigatórias em `production` e `test`, cada uma com 32 bytes em Base64. O parser decodifica ambas e rejeita igualdade byte a byte entre elas, `AUTH_RATE_LIMIT_HMAC_KEY`, `ADMIN_SESSION_HMAC_KEY`, `PAYLOAD_SECRET` ou qualquer outro segredo. Criptografar segredos com AES-256-GCM. `Users` guarda `lastAcceptedTotpCounter`; aceitar um TOTP atualiza o contador atomicamente e rejeita qualquer contador menor ou igual, inclusive replay dentro da janela.
- [ ] Na confirmação de enrollment, gerar dez recovery codes com 128 bits de entropia cada, mostrá-los uma vez e persistir somente HMAC-SHA256 com `MFA_RECOVERY_PEPPER`. Recovery consome um hash atomicamente, revoga pre-auth/sessões anteriores e cria nova sessão plena; nunca registra o código.
- [ ] Implementar endpoints `/api/mfa/enroll/start`, `/api/mfa/enroll/confirm`, `/api/mfa/verify` e `/api/mfa/recovery`; todos exigem a row/cookie pre-auth opacos de cinco minutos da Task 1 e Origin/CSRF válido. `consumeAuthRateLimit()` calcula somente `HMAC-SHA256(AUTH_RATE_LIMIT_HMAC_KEY, "v1\0<action>\0<normalizedSubject>\0<normalizedIp>")`, persiste o digest em `auth-rate-limits` com operação atômica e limita cinco tentativas por janela móvel de 15 minutos mesmo entre réplicas/restarts; banco indisponível falha fechado. Nem digest, IP, subject, token ou resultado entra no audit metadata. O helper de cookies usa `__Host-dib-preauth` sempre Secure em produção HTTPS ou `dib-preauth-dev` em HTTP local; TOTP/recovery válido consome pre-auth uma vez e emite somente a variante correspondente da sessão plena com `mfaVerifiedAt`, máximo de oito horas e idle timeout. Não existe cookie MFA independente que possa ser combinado com outra sessão.
- [ ] Auditar login bem/mal-sucedido, enrollment, alteração de MFA, bloqueio por rate limit e uso de recovery sem token, segredo, código ou IP bruto.
- [ ] Substituir o login nativo do Admin por `AdminLogin`: senha → enrollment quando necessário → TOTP/recovery → sessão plena. `AdminAccountSecurity` expõe somente troca de senha, enrollment/rotação/recovery e encerramento de sessões pelos endpoints próprios; nunca usa operações auth nativas. `MfaGate` continua como defesa em profundidade antes do dashboard e para step-up de ações sensíveis. Sem sessão opaca `authenticated` com `mfaVerifiedAt`, todas as collections privadas negam acesso; possuir apenas pre-auth nunca faz `req.user` existir.
- [ ] Rodar `npm run test:int -- tests/integration/identity/mfa.test.ts`; esperado: senha válida sem MFA não lê drafts; TOTP válido libera; token repetido na mesma janela falha; recovery funciona uma vez; usuário desconhecido e senha errada são indistinguíveis; origem cruzada e sexta tentativa são bloqueadas; concorrência não ultrapassa cinco tentativas; restart preserva bloqueio; ausência ou reutilização de `AUTH_RATE_LIMIT_HMAC_KEY` impede inicialização.
- [ ] Commit:

```bash
git add src/payload.config.ts src/payload-types.ts "src/app/(payload)/admin/importMap.js" src/modules/identity/mfa src/modules/identity/rate-limit/service.ts src/components/admin/auth src/components/admin/mfa src/collections/AdminSessions.ts src/collections/AuthRateLimits.ts src/lib/env/server.ts .env.example .env.test.example tests
git commit -m "feat(identity): require TOTP for administrative access"
```

## Task 3: Workflow e fingerprint de conteúdo

**Files:**

- Create: `src/modules/cms/workflow/types.ts`
- Create: `src/modules/cms/workflow/fingerprint.ts`
- Create: `src/modules/cms/workflow/machine.ts`
- Create: `src/modules/cms/fields/workflow.ts`
- Create: `src/modules/cms/fields/evidence.ts`
- Create: `src/modules/cms/validation/forbidden-scope.ts`
- Test: `tests/unit/cms/workflow-machine.test.ts`
- Test: `tests/unit/cms/content-fingerprint.test.ts`
- Test: `tests/unit/cms/forbidden-scope.test.ts`

**Rules:**

- `draft → pending_evidence`: editor ou administrador.
- `pending_evidence → approved`: administrador.
- `pending_evidence → draft`: rejeição pelo administrador.
- `approved → publishing`: administrador, fingerprint idêntico e criação atômica da operação durável; `publishing` é sempre draft/não público e preserva a versão publicada anterior.
- `publishing → published`: somente `publication-worker`, depois de assets promovidos, pre-purge concluído e revalidação de fingerprint, autorização e escopo proibido dentro do lock do alvo.
- `publishing → approved`: somente cancelamento administrativo antes da ativação, após agendar compensação idempotente de assets promovidos.
- `published → archived`: administrador; a transação torna o alvo não público e enfileira purge antes de retornar.
- `archived → draft`: administrador.
- Alteração de campo publicável invalida aprovação anterior.
- `id`, timestamps, `_status`, `deletedAt` e metadados de workflow não entram no fingerprint.
- `evidence` entra no fingerprint e usa itens `{ claim, sourceTitle, sourceUrl, checkedAt, note }`; toda alegação comprovável marcada pelo editor exige fonte HTTPS e data válida.
- O grupo `evidence` é anexado a todas as collections editoriais capazes de publicar alegações; mídia usa os campos equivalentes de proveniência e documento legal usa sua aprovação/versionamento próprios.
- `pending_evidence → approved` falha quando existe alegação marcada sem evidência completa, mídia sem proveniência ou artigo normativo sem revisor/fontes.
- `assertNoForbiddenPublicScope()` percorre em ordem todos os strings do candidato publicável: campos simples, slug, SEO, links, arrays, objetos, blocos e nós Lexical. Ele decodifica entidades HTML numéricas e a allowlist de entidades portuguesas, aplica Unicode NFKD, remove marcas combinantes, controles/bidi/zero-width, converte para minúsculas e substitui pontuação/separadores por um espaço antes de colapsar whitespace. Strings adjacentes de rich text são concatenadas antes da busca, impedindo bypass por divisão entre nós.
- O validator rejeita o token normalizado `incendio` em qualquer campo público e, defensivamente, as sequências `protecao contra incendio` e `combate a incendio`; isso cobre caixa, acento, hífen, slug, entidade e JSON fragmentado. O erro público contém somente código `FORBIDDEN_PUBLIC_SCOPE` e path lógico, nunca ecoa o texto.

```ts
export type ForbiddenScopeViolation = {
  code: 'FORBIDDEN_PUBLIC_SCOPE'
  path: string
}

export function assertNoForbiddenPublicScope(
  candidate: unknown,
): asserts candidate
```

- [ ] Escrever testes para toda transição, evidência ausente/inválida/válida e serialização determinística de objetos com ordem de chaves diferente. Em `forbidden-scope.test.ts`, cobrir texto/SEO/slug/URL/JSON/Lexical, `PROTEÇÃO`, `protecao`, `inc&#234;ndio`, `inc&#xEA;ndio`, zero-width, controles, hífens e frase repartida entre nós; todos falham sem vazar o valor, enquanto conteúdo técnico permitido passa.
- [ ] Rodar `npm run test:unit -- tests/unit/cms/workflow-machine.test.ts tests/unit/cms/content-fingerprint.test.ts tests/unit/cms/forbidden-scope.test.ts`; esperado: falha.
- [ ] Implementar máquina pura, fingerprint SHA-256 de JSON canônico e o validator recursivo normalizado sem nova dependência. Executá-lo ao solicitar aprovação, ao aprovar e novamente sobre a versão candidata dentro do lock imediatamente antes da ativação pública; nenhum caminho admin/system/seed normal usa bypass.
- [ ] Rodar novamente; esperado: todos os casos passam.
- [ ] Commit:

```bash
git add src/modules/cms tests/unit/cms
git commit -m "feat(cms): add approval workflow state machine"
```

## Task 4: Campos, blocos e conteúdo central

**Files:**

- Create: `src/modules/cms/fields/slug.ts`
- Create: `src/modules/cms/fields/seo.ts`
- Create: `src/modules/cms/fields/link.ts`
- Create: `src/modules/cms/blocks/index.ts`
- Create: `src/collections/Pages.ts`
- Create: `src/collections/Services.ts`
- Create: `src/collections/Segments.ts`
- Test: `tests/unit/cms/core-collections.test.ts`
- Test: `tests/integration/cms/core-content.test.ts`

`Page.kind` será exatamente:

```ts
'home'
| 'company'
| 'solutionsHub'
| 'segmentsHub'
| 'projectsHub'
| 'quote'
| 'notFound'
```

`Service.group` será exatamente:

```ts
'build' | 'fabricate' | 'integrate' | 'transform' | 'maintain'
```

- [ ] Escrever teste que carrega as configs e verifica slugs, índices únicos, drafts, trash, SEO e ausência de qualquer opção relacionada a incêndio.
- [ ] Rodar `npm run test:unit -- tests/unit/cms/core-collections.test.ts`; esperado: falha por configs ausentes.
- [ ] Criar as três collections e blocos tipados de hero, jornada, processo, grade relacionada, rich text, FAQ e CTA.
- [ ] Rodar testes unitários e integração CRUD draft; esperado: editor cria draft, público não lê.
- [ ] Commit:

```bash
git add src/payload.config.ts src/payload-types.ts src/collections/Pages.ts src/collections/Services.ts src/collections/Segments.ts src/modules/cms/fields src/modules/cms/blocks tests
git commit -m "feat(cms): model pages services and segments"
```

## Task 5: Mídia pública e proveniência

**Files:**

- Modify: `src/collections/Media.ts`
- Create: `src/modules/cms/validation/media.ts`
- Test: `tests/unit/cms/media-validation.test.ts`
- Test: `tests/integration/cms/media-access.test.ts`

**Rules:**

- `kind = company | illustrative`.
- `illustrative` exige `caption = "Imagem ilustrativa"`, `credit`, `sourceUrl`, `licenseName`, `licenseUrl` e `licenseCheckedAt`.
- Alt é obrigatório antes de publicação.
- Projeto nunca aceita mídia `illustrative`.
- Upload público aceita JPEG, PNG, WebP, AVIF e MP4.
- Tamanhos de imagem: `thumbnail` 400×300, `card` 768×512 e `hero` 1920×1080.
- Arquivo só é público quando o registro estiver publicado.

- [ ] Escrever testes de validação e acesso ao arquivo.
- [ ] Rodar testes; esperado: falhas.
- [ ] Expandir `Media` preservando slug e upload do plano 1.
- [ ] Rodar testes; esperado: mídia draft retorna 403, mídia publicada retorna 200.
- [ ] Commit:

```bash
git add src/payload.config.ts src/payload-types.ts src/collections/Media.ts src/modules/cms/validation/media.ts tests
git commit -m "feat(cms): govern public media provenance"
```

## Task 6: Clientes, autorizações e depoimentos

**Files:**

- Create: `src/collections/Clients.ts`
- Create: `src/collections/ClientAuthorizations.ts`
- Create: `src/collections/Testimonials.ts`
- Create: `src/modules/cms/validation/authorization.ts`
- Test: `tests/unit/cms/authorization.test.ts`
- Test: `tests/integration/cms/client-authorization-access.test.ts`

**Interfaces:**

```ts
export function isAuthorizationValid(input: {
  status: 'valid' | 'revoked'
  scopes: AuthorizationScope[]
  grantedAt: string
  expiresAt?: string | null
  revokedAt?: string | null
  requiredScope: AuthorizationScope
  now: Date
}): boolean
```

- [ ] Escrever casos válido, expirado, revogado, escopo ausente e data futura.
- [ ] Rodar testes unitários; esperado: falha.
- [ ] Implementar `ClientAuthorizations` como upload privado; editor lê somente cliente, escopos, status e validade; arquivo, notas e dados do concedente ficam restritos ao administrador.
- [ ] Bloquear publicação campo a campo: `client_name` para nome, `client_logo` para logo, `testimonial` para depoimento, `project_details` para desafio/escopo/solução/sistemas/resultado e `project_media` para capa/galeria/vídeo/antes-depois.
- [ ] Nesta task, rejeitar mutação direta `valid → revoked` com `AUTHORIZATION_REVOCATION_REQUIRES_WORKFLOW`; não criar operação, hook de outbox nem import de `src/modules/cms/publication`. A Task 10 adiciona o comando transacional de revogação depois que a collection de operações existe, e a Task 11 adiciona o worker/purge.
- [ ] Rodar matriz de integração para cada um dos cinco escopos nos estados ausente, válido, expirado e revogado contra o resolver de autorização desta task; esperado: o mapa de campos elegíveis libera somente os escopos válidos e o access control nunca expõe documento, notas ou dados do concedente. A projeção em DTO público é testada somente na Task 12.
- [ ] Commit:

```bash
git add src/payload.config.ts src/payload-types.ts src/collections/Clients.ts src/collections/ClientAuthorizations.ts src/collections/Testimonials.ts src/modules/cms/validation/authorization.ts tests
git commit -m "feat(cms): enforce client publication authorizations"
```

## Task 7: Projetos e FAQ

**Files:**

- Create: `src/collections/Projects.ts`
- Create: `src/collections/FAQs.ts`
- Create: `src/collections/VideoCaptionAssets.ts`
- Create: `src/modules/cms/validation/project.ts`
- Create: `src/modules/cms/video-captions/build-webvtt.ts`
- Create: `src/modules/cms/video-captions/store.ts`
- Test: `tests/unit/cms/project-validation.test.ts`
- Test: `tests/unit/cms/video-captions.test.ts`
- Test: `tests/integration/cms/projects-faqs.test.ts`
- Test: `tests/integration/cms/video-caption-assets.test.ts`

**Video caption contract:**

```ts
export type VideoCaptionCue = {
  startMs: number
  endMs: number
  text: string
}

export function buildPortugueseWebVtt(input: {
  cues: readonly VideoCaptionCue[]
  videoDurationMs: number
}): { body: string; bytes: number; sha256: string }

export interface VideoCaptionAssetStagingStore {
  putStaging(input: { projectId: string; body: string; sha256: string }): Promise<{ key: string }>
  discardStaging(input: { stagingKey: string }): Promise<void>
}
```

- [ ] Testar que projeto publicável exige título, slug, resumo, desafio, solução, capa, serviço e segmento.
- [ ] Testar que mídia ilustrativa é recusada em capa, galeria, vídeo e antes/depois.
- [ ] Testar `clientDisclosure = confidential | name_only | name_and_logo`.
- [ ] Testar WebVTT canônico `pt-BR`: de 1 a 500 cues, inteiros em milissegundos, `0 <= startMs < endMs <= videoDurationMs`, ordenados e sem sobreposição; texto de 1 a 200 caracteres e artefato total de no máximo 256 KiB. Rejeitar `-->`, NUL, controles/bidi/zero-width, `<`, `>`, entidades ou markup; normalizar quebra para LF e emitir somente `WEBVTT\n\n` mais timestamps `HH:MM:SS.mmm --> HH:MM:SS.mmm` e texto plano. Cobrir payloads XSS, cue fora de ordem, overlap, duração excedida e saída golden.
- [ ] Implementar collections, relações e validações. Projeto com vídeo exige MP4 próprio/autorizado, poster válido, pelo menos um cue e `captionsLanguage='pt-BR'`; o cliente nunca envia WebVTT pronto. `buildPortugueseWebVtt()` gera o corpo determinístico e SHA-256, `VideoCaptionAssets` persiste somente metadata e chave staging privada, com create/update/delete negados a HTTP. O campo interno `captionAsset` é preenchido pelo serviço e não aparece em preview/DTO.
- [ ] Limitar `store.ts` a `putStaging()` e descarte idempotente de staging privado. Esta task não cria nem importa `asset-promotion-port`, não publica chave/URL e não chama CDN; a promoção, retirada e exposição de `captionsSrc` entram somente na Task 11, quando o port e o worker já existem.
- [ ] Testar `VideoCaptionAssets` apenas como metadata/staging privado: geração determinística, create/update/delete HTTP negados, descarte idempotente e nenhuma chave pública ou `captionsSrc` presente.
- [ ] Rodar `npm run test:int -- tests/integration/cms/projects-faqs.test.ts tests/integration/cms/video-caption-assets.test.ts`; esperado nesta task: relações/validações e acesso privado funcionam, estados não públicos não vazam pela leitura anônima, staging permanece privado e nenhum teste instancia worker, operação ou promotion port. A ativação pública e o `captionsSrc` são exercitados nas Tasks 11/12.
- [ ] Commit:

```bash
git add src/payload.config.ts src/payload-types.ts src/collections/Projects.ts src/collections/FAQs.ts src/collections/VideoCaptionAssets.ts src/modules/cms/validation/project.ts src/modules/cms/video-captions tests
git commit -m "feat(cms): add governed projects and contextual FAQs"
```

## Task 8: Blog e categorias

**Files:**

- Create: `src/collections/Categories.ts`
- Create: `src/collections/Articles.ts`
- Create: `src/modules/cms/validation/article.ts`
- Test: `tests/unit/cms/article-validation.test.ts`
- Test: `tests/integration/cms/blog-publication.test.ts`

- [ ] Testar artigo comum e artigo com `hasNormativeClaims = true`.
- [ ] Exigir fontes e revisor técnico para alegações normativas.
- [ ] Implementar categorias, artigo Lexical, fontes, autor, revisor e relações com serviços.
- [ ] Testar que lista pública vazia mantém blog desativado e que somente artigo com `_status='published'`, `workflow.state='published'` e `deletedAt=null` ativa a consulta; `approved`, `archived` e trash continuam ausentes.
- [ ] Commit:

```bash
git add src/payload.config.ts src/payload-types.ts src/collections/Categories.ts src/collections/Articles.ts src/modules/cms/validation/article.ts tests
git commit -m "feat(cms): add reviewed editorial content"
```

## Task 9: Settings, navegação, legal e redirects

**Files:**

- Create: `src/globals/SiteSettings.ts`
- Create: `src/globals/Navigation.ts`
- Create: `src/globals/Footer.ts`
- Create: `src/collections/LegalDocuments.ts`
- Create: `src/collections/Redirects.ts`
- Create: `src/modules/cms/validation/redirect.ts`
- Modify: `src/modules/site/redirects/validate-public-redirect.ts`
- Test: `tests/unit/cms/redirect-validation.test.ts`
- Test: `tests/integration/cms/globals-legal.test.ts`

**Redirect rules:**

- Origem e destino passam pela mesma `canonicalizeInternalRedirectPath()` usada pelo site público; o valor persistido é a saída canônica, nunca o raw.
- Exigem exatamente uma slash inicial, rejeitam segunda slash inicial, slash repetida, trailing slash exceto `/`, segmentos `.`/`..`, host/scheme externo, `\`, controles, bidi e zero-width.
- Rejeitam query ou fragmento antes e depois de decode; `decodeURIComponent` inválido falha fechado. `%2f` e `%5c` em qualquer caixa são proibidos no raw, e a saída do primeiro decode não pode conter outro escape `%HH`, impedindo double encoding.
- Depois de decode, Unicode NFC e casefold apenas para a checagem de segurança, rejeitam `/api`, `/admin`, `/_next` ou `/graphql`, tanto exatos quanto prefixos seguidos por `/`.
- Origem e destino não podem ser iguais.
- Não aceitam duplicidade, cadeia ou ciclo.
- `kind = permanent | temporary`, mapeado para 308 ou 307.

```ts
export function canonicalizeInternalRedirectPath(raw: string): `/${string}`
```

- [ ] Escrever os testes de redirects e legal. Cobrir `//evil.example`, `https://evil.example`, `/\\evil`, `/%2F%2Fevil`, `/%5cevil`, `/%61pi`, `/%2561pi`, `/api%2Fusers`, controles raw/codificados, query/hash codificados, dot-segments e cadeia/ciclo que só aparece após canonicalização; todos falham. Provar que origem e destino persistidos são canônicos e que unicidade compara a forma canônica.
- [ ] Exportar `canonicalizeInternalRedirectPath()` de `src/modules/site/redirects/validate-public-redirect.ts`, criado pelo Plano 2. O validator CMS importa essa função única para `sourcePath` e `destinationPath`, persiste o retorno antes do índice unique e monta o grafo de cadeia/ciclo somente com valores canônicos; não mantém segunda implementação. O catch-all público canonicaliza o pathname recebido com a mesma função antes de consultar `getRedirectBySourcePath()`.
- [ ] Implementar os três globals com versões/drafts e atualização apenas por administrador.
- [ ] Implementar legal com tipos `privacy | terms`; privacidade só publica com controlador, contato, versão, vigência e conteúdo.
- [ ] Rodar testes; esperado: globals draft não aparecem e redirect cíclico é recusado.
- [ ] Commit:

```bash
git add src/payload.config.ts src/payload-types.ts src/globals src/collections/LegalDocuments.ts src/collections/Redirects.ts src/modules/cms/validation/redirect.ts src/modules/site/redirects/validate-public-redirect.ts tests
git commit -m "feat(cms): manage settings legal documents and redirects"
```

## Task 10: Aprovação, publicação e controles do painel

**Files:**

- Create: `src/collections/ContentApprovals.ts`
- Create: `src/collections/ContentPublicationOperations.ts`
- Create: `src/modules/cms/workflow/service.ts`
- Create: `src/modules/cms/workflow/endpoints.ts`
- Create: `src/modules/cms/workflow/hooks.ts`
- Create: `src/modules/cms/publication/types.ts`
- Create: `src/modules/cms/publication/enqueue.ts`
- Create: `src/components/admin/workflow/WorkflowControls.tsx`
- Create: `src/components/admin/workflow/HiddenPublishControls.tsx`
- Test: `tests/unit/cms/workflow-service.test.ts`
- Test: `tests/integration/cms/workflow-endpoints.test.ts`

**Endpoints:**

- `POST /api/cms-workflow/request`
- `POST /api/cms-workflow/approve`
- `POST /api/cms-workflow/reject`
- `POST /api/cms-workflow/publish`
- `POST /api/cms-workflow/archive`
- `POST /api/cms-workflow/restore`
- `POST /api/cms-workflow/delete`
- `POST /api/cms-workflow/authorizations/:id/revoke`
- `GET /api/cms-workflow/operations/:id`
- `POST /api/cms-workflow/operations/:id/retry`
- `POST /api/cms-workflow/operations/:id/cancel`

Corpo:

```ts
interface WorkflowCommandBody {
  target: ContentTarget
  note?: string
}
```

- [ ] Testar permissões e transições de todos os endpoints, resposta `202` com `operationId`, polling do estado `queued`, retry idempotente e cancelamento permitido somente antes de `activating`. Esta task usa um executor fake tipado nos testes de endpoint; não importa nem instancia o worker real, criado na Task 11.
- [ ] Implementar comandos passando o mesmo `PayloadRequest` às Local APIs de cada transação curta e `req.context.workflowCommand = true` somente dentro do serviço autenticado. O request de publish valida aprovação/fingerprint/autorizações/escopo proibido, salva a versão candidata como `_status='draft'` + `workflow.state='publishing'` e cria registro em `content-publication-operations` com `kind='publish'`/`phase='queued'` na mesma transação. O request termina em `202` depois do commit; nenhum import, chamada ou tentativa imediata do worker existe antes da Task 11.
- [ ] Exigir aprovação com fingerprint idêntico no comando publish. Atualização de conteúdo já publicado cria nova versão candidata e mantém a versão publicada anterior ativa até a fase `activating`; primeira publicação permanece ausente do repositório público.
- [ ] Reutilizar o contrato `AuditActor` em approvals; comandos HTTP aceitam somente ator `user`, enquanto o seed interno aceita apenas `system:initial-seed` e não expõe esse caminho por endpoint.
- [ ] Adicionar `beforeChange`/`beforeDelete` em todas as collections e globals governadas: rejeitar alteração direta de `_status`, `workflow.state`, trash, restore ou delete quando `req.context.workflowCommand !== true`, inclusive por REST, GraphQL ou Local API de administrador.
- [ ] Esconder Publish/Unpublish nativos e renderizar controles conforme papel e estado. O botão público `Ocultar` chama formalmente `archive`: em uma única transação incrementa a geração do alvo, muda `_status/workflow` para não público e cria operação em `final_purge`; purge e CDN ficam fora da transação. `restore` volta a draft não público. Revoke usa a mesma primitiva para todos os dependentes, em locks ordenados.
- [ ] Conectar a revogação adiada na Task 6: `POST /api/cms-workflow/authorizations/:id/revoke` adquire locks dos alvos em ordem estável, incrementa a geração, marca a autorização como `revoked`, arquiva ou anonimiza dependentes e cria operações `revoke`/purge deduplicadas na mesma transação. O commit contém somente comando + enqueue durável; o processamento externo permanece para a Task 11.
- [ ] `delete` exige administrador, nota/motivo não vazio e alvo já arquivado ou em trash; antes de qualquer remoção física, torna o alvo não público e persiste a operação de purge/cleanup. Não existe delete permanente pela API nativa. Registrar os eventos canônicos de aprovação, rejeição, queue, ativação, arquivamento, restauração, exclusão e falha.
- [ ] `WorkflowControls` mostra `publishing`, fase, tentativa e erro sanitizado, faz polling pelo operation ID e oferece retry apenas quando `retryable=true`; nunca anuncia sucesso antes de `phase='completed'`. Cancelamento antes da ativação retorna a `approved` e agenda compensação de assets; depois da ativação, ocultação exige novo comando archive.
- [ ] Rodar integração; esperado: editor recebe 403 em publish, administrador recebe operação durável em `queued`, revogação torna autorização/dependentes não públicos e enfileira purge atomicamente, e o mesmo administrador recebe 403 ao tentar `_status='published'` diretamente sem comando/aprovação. Crash do request após enqueue não perde a operação. Conclusão do worker e purge final são exercitadas somente na Task 11.
- [ ] Commit:

```bash
git add src/payload.config.ts src/payload-types.ts "src/app/(payload)/admin/importMap.js" src/collections/ContentApprovals.ts src/collections/ContentPublicationOperations.ts src/modules/cms/workflow src/modules/cms/publication src/components/admin/workflow tests
git commit -m "feat(cms): add controlled editorial publishing"
```

## Task 11: Saga/outbox de publicação e invalidação

**Files:**

- Create: `src/modules/cms/publication/worker.ts`
- Create: `src/modules/cms/publication/asset-promotion-port.ts`
- Create: `src/modules/content/revalidation/payload-hooks.ts`
- Create: `src/modules/content/revalidation/content-change-contract.ts`
- Modify: `src/modules/content/revalidation/port.ts`
- Modify: `src/modules/content/revalidation/paths.ts`
- Test: `tests/unit/cms/publication-saga.test.ts`
- Test: `tests/unit/content/revalidation-hooks.test.ts`
- Test: `tests/unit/content/content-change-contract.test.ts`
- Test: `tests/integration/content/publication-saga.test.ts`
- Test: `tests/integration/content/publication-failpoints.test.ts`
- Test: `tests/integration/content/publication-concurrency.test.ts`
- Test: `tests/integration/cms/authorization-revocation-saga.test.ts`
- Test: `tests/integration/cms/video-caption-promotion.test.ts`

**Consumes:**

```ts
ContentInvalidationPort.invalidate(change: ContentChange): Promise<void>
getAffectedPaths(change: ContentChange): string[]

export type PreparedPublishedAsset = {
  kind: 'media' | 'captions'
  sourceId: string
  stagingKey: string
  publicKey: string
  sha256: string
}

export interface PublishedAssetPromotionPort {
  prepareCandidate(input: {
    operationId: string
    target: ContentTarget
    candidateVersionId: string
    deduplicationKey: string
  }): Promise<readonly PreparedPublishedAsset[]>
  compensate(input: {
    operationId: string
    assets: readonly PreparedPublishedAsset[]
  }): Promise<void>
  retire(input: {
    operationId: string
    assets: readonly PreparedPublishedAsset[]
  }): Promise<void>
}

export async function processPublicationOperation(
  operationId: string,
  dependencies: PublicationWorkerDependencies,
): Promise<PublicationOperationResult>

export async function processPublicationBatch(input: {
  limit: number
  workerId: string
  now: Date
}): Promise<{ claimed: number; completed: number; pending: number }>
```

- [ ] Testar paths para page, service, segment, project, FAQ, article, legal, redirect, media, client, authorization, testimonial, category e globals. `content-change-contract.ts` importa `ContentChange` do Plano 2 e contém `Expect<Equal<...>>` para exigir exatamente todas as collections e operações declaradas em Contratos centrais; não existe cópia runtime do tipo.
- [ ] Testar que salvar draft/preview não cria operação nem invalida conteúdo público. Hooks apenas persistem estado/outbox usando o mesmo `PayloadRequest` e a guarda de `req.context`; eles nunca chamam storage, `revalidateTag`, `revalidatePath` ou CDN dentro da transação.
- [ ] Conectar o `PublishedAssetPromotionPort` ao staging privado entregue na Task 7. Para captions, promover para a chave imutável `published/media/captions/<sha256>.vtt` e path same-origin `/published/media/captions/<sha256>.vtt`, com `Content-Type: text/vtt; charset=utf-8`, `Content-Disposition: inline`, `X-Content-Type-Options: nosniff`, `Cache-Control: public, max-age=31536000, immutable` e CORS restrito à origem canônica de `SITE_URL`, nunca `*`. `captionsSrc` e `captionsLanguage='pt-BR'` entram no DTO somente depois da ativação; archive/delete/revoke retiram a referência, purgam e agendam limpeza idempotente.
- [ ] Exercitar o wiring de revogação entregue na Task 10: após o commit fail-closed, o worker purga todas as rotas relacionadas com retry; nenhuma chamada externa ocorre sob lock. Publish concorrente com geração anterior falha antes de ativar, e a operação antiga compensa assets preparados.
- [ ] Implementar claim com `FOR UPDATE SKIP LOCKED`, lease expirável, `deduplicationKey` único e geração monotônica por alvo. Cada efeito externo recebe `operationId + generation` como chave idempotente. Retomar lease expirado é seguro e dois workers nunca ativam gerações diferentes fora de ordem.
- [ ] Implementar publish por fases duráveis: `queued → copying_assets → pre_purge → activating → final_purge → completed`. A versão candidata permanece `_status='draft'/publishing`; `prepareCandidate()` promove mídia e WebVTT para chaves imutáveis ainda não expostas por DTO; pre-purge aguarda `invalidate(change)` fora da transação. Em `activating`, uma transação curta bloqueia alvo/operação, confirma geração, candidate version, fingerprint, autorização, evidência e `assertNoForbiddenPublicScope()`, publica atomicamente e grava `activatedAt`. Depois do commit, final purge repete a invalidação idempotente e só então grava `completed`/auditoria.
- [ ] Implementar archive/delete/revoke fail-closed na origem: o comando já incrementou geração, tornou todos os alvos não públicos e criou operações em `final_purge` na mesma transação. O worker purga Next/CDN e retira assets depois do commit; falha nunca republica o alvo, permanece retryable e gera alerta. Restore volta a draft e também purga referências antigas antes de concluir.
- [ ] Em erro antes da ativação, preservar a versão pública anterior e manter o candidato `publishing`; primeira publicação continua ausente. Em erro depois da ativação, não fingir rollback de storage/CDN: manter `final_purge`, alertar e repetir. Usar cinco tentativas automáticas com intervalos de 1, 5, 30 e 120 minutos; após a quinta falha, marcar `failed` retryable sem descartar a operação. Retry manual ou scheduler retoma da fase comprovada. `lastErrorCode` é allowlisted e nunca guarda stack, conteúdo, URL assinada ou credencial.
- [ ] Adicionar failpoints injetáveis somente pelos testes — não env/HTTP — em `after_enqueue_commit`, `after_asset_copy_before_phase_save`, `after_pre_purge`, `before_activation_commit`, `after_activation_commit_before_phase_save` e `during_final_purge`. Para cada um, derrubar o worker, expirar lease, reiniciar e provar: sem publicação parcial, sem mídia duplicada, sem perda do outbox e conclusão exatamente uma vez do ponto de vista lógico.
- [ ] Testar concorrência publish×publish, publish×archive e publish×revoke. Operação com geração antiga falha antes da ativação e compensa assets; revoke ganha ao tornar dependentes não públicos primeiro. Testar também purge parcial (Next passa/CDN falha), duplicate delivery, crash após ativação e indisponibilidade prolongada, com alerta canônico `content.invalidation_failed` e retry.
- [ ] Rodar integrações; esperado: publish só retorna operação concluída após purge final; falha pré-ativação mantém versão pública anterior; archive/revoke ficam imediatamente não públicos na origem e convergem no cache em até 60 segundos quando o invalidator volta.
- [ ] Commit:

```bash
git add src/payload.config.ts src/payload-types.ts src/modules/cms/publication src/modules/content/revalidation tests
git commit -m "feat(cms): orchestrate durable publication saga"
```

## Task 12: Adapter Payload para conteúdo público e preview

**Files:**

- Create: `src/modules/content/public/payload-repository.ts`
- Create: `src/modules/content/preview/payload-repository.ts`
- Modify: `src/modules/content/public/composition-root.ts`
- Test: `tests/integration/content/payload-public-repository.test.ts`
- Test: `tests/integration/content/payload-preview-repository.test.ts`

**Produces:**

Implementar integralmente `PublicContentRepository` do plano 2:

```ts
getSiteSettings()
getNavigation()
getFooter()
getPageBySlug(slug)
listServices()
getServiceBySlug(slug)
listSegments()
getSegmentBySlug(slug)
listProjects()
getProjectBySlug(slug)
listClients()
listTestimonials()
listFaqs(scope)
listArticles()
getArticleBySlug(slug)
getLegalDocument(type)
getRedirectBySourcePath(path)
listRedirects()
```

- [ ] Criar fixtures draft, pending, approved, publishing, published, archived e trashed, incluindo atualização com versão pública anterior e candidato `publishing`.
- [ ] Testar que somente a versão ativa com `_status='published'`, `workflow.state='published'` e `deletedAt=null` chega aos DTOs públicos. Durante `publishing`, a versão pública anterior continua sendo lida; na primeira publicação, o alvo continua ausente. Assets preparados, `captionAsset` staging e operation IDs nunca chegam ao DTO.
- [ ] Testar autorização expirada com relógio injetável.
- [ ] Implementar `PayloadPublicContentRepository`; o DTO nunca expõe workflow, aprovação, e-mail, notas privadas ou documento de autorização. Testar o shape integral de cada DTO, incluindo `PublicProject.summary/cover`, `PublicClient`, `PublicTestimonial`, categorias/fontes HTTPS do artigo, `destinationPath → targetPath`, `kind → permanent`, Lexical → `body/sections`, `licenseCheckedAt`, contextos WhatsApp e todos os campos condicionados por autorização.
- [ ] Implementar preview autenticado apenas para administrador/editor, sempre com `draft: true`, `overrideAccess: false` e `no-store`.
- [ ] Trocar somente o binding de `src/modules/content/public/composition-root.ts` do adapter local para Payload; nenhuma página pública importa Payload diretamente. Construtor e import do adapter são puros: cada método rejeita primeiro `CONTENT_ACCESS_SENTINEL=throw`, e `getPayload()`, env, banco e storage só são resolvidos depois, em runtime, nunca durante `next build`.
- [ ] Rodar testes; esperado: `PublicProject.clientName` é `null` quando nome não está autorizado.
- [ ] Commit:

```bash
git add src/modules/content/public src/modules/content/preview tests
git commit -m "feat(content): read governed Payload content"
```

## Task 13: Registro, tipos, migração e seed inicial idempotente

**Files:**

- Modify: `src/payload.config.ts`
- Modify: `src/migrations/index.ts`
- Create: `src/migrations/20260725_000002_content_management.ts`
- Modify generated: `src/payload-types.ts`
- Modify generated: `src/app/(payload)/admin/importMap.js`
- Create: `src/modules/content/seed/initial-content.ts`
- Create: `src/modules/content/seed/bootstrap-seed.ts`
- Create: `src/globals/BootstrapState.ts`
- Create: `scripts/seed-initial-content.ts`
- Modify: `package.json`
- Reuse: `scripts/run-payload-cli.mjs` do Plano 1
- Test: `tests/unit/scripts/cms-migration-scripts.test.ts`
- Test: `tests/integration/migrations/content-management.test.ts`
- Test: `tests/integration/content/initial-content-seed.test.ts`

- [ ] Verificar que todas as collections, globals, endpoints, componentes e hooks já foram registrados incrementalmente pelas Tasks 1–12; falhar se o config ou os tipos gerados estiverem incompletos. O contrato exige `Users.email` explícito e normalizado, password/session/rate-limit services, `AdminSessions`, `AuthRateLimits`, endpoints próprios, custom strategy, `AdminLogin`, logout/button/view, account security, import-map e env/tests correspondentes. A migration `000002` inclui explicitamente `admin_sessions` e `auth_rate_limits`, seus índices/uniques/foreign keys e rollback, preserva/migra `users.email` e remove ou deixa inequivocamente inutilizáveis as colunas nativas `salt`, `hash`, reset-token e session/JWT; não reutiliza nenhum artefato PBKDF2/Payload. Testes rodam up/down/up em banco vazio e em fixture de schema anterior e provam que nenhum endpoint refresh/JWT reaparece.
- [ ] Antes de gerar tipos ou migration, implementar e registrar `BootstrapState` como global internal-only sem REST/GraphQL write, com `initialContentInstalledAt`, `seedRevision` e digest do manifesto; somente a capability privada do seed escreve. O config registra o global nesta etapa, `000002` cria/reverte sua tabela/row e o teste de migration prova up/down/up. Nenhum comando de geração abaixo roda antes desse registro.
- [ ] Rodar `npm run generate:types`; esperado: `payload-types.ts` contém todas as collections/globals.
- [ ] Rodar `npm run generate:importmap`; esperado: import map contém MFA e WorkflowControls.
- [ ] Rodar `npm run migrate:create -- content_management`.
- [ ] Renomear a migration gerada para `src/migrations/20260725_000002_content_management.ts` e ajustar `src/migrations/index.ts`.
- [ ] Rodar `npm run migrate`; esperado: migration aplicada.
- [ ] Rodar `npm run migrate:status`; esperado: foundation e content management em estado `Ran`.
- [ ] Adicionar ao `package.json` exatamente os scripts abaixo e cobri-los com `cms-migration-scripts.test.ts`. Ambos reutilizam o wrapper do Plano 1, carregam somente `.env.test`, forçam schema sync desligado e exigem que o `DATABASE_URL` resolvido termine em `_test`; nenhum deles pode delegar a `npm run payload`, herdar `.env` de desenvolvimento ou aceitar banco sem o sufixo descartável:

```json
{
  "scripts": {
    "migrate:fresh:test": "node scripts/run-payload-cli.mjs --env .env.test --schema-sync false --database-suffix _test -- migrate:fresh --force-accept-warning",
    "migrate:down:test": "node scripts/run-payload-cli.mjs --env .env.test --schema-sync false --database-suffix _test -- migrate:down"
  }
}
```

- [ ] Executar o drill exclusivamente com `npm run migrate:fresh:test`, `npm run migrate:down:test` e `npm run migrate:test`, nessa ordem; esperado: fresh aplica `000001` + `000002`, down reverte somente `000002`, e `migrate:test` a reaplica preservando `000001`. O teste captura argv/env do wrapper e prova `PAYLOAD_TEST_SCHEMA_SYNC=false`, origem `.env.test` e database suffix `_test` nos três comandos; é proibido usar `npm run payload` ou a `.env` de desenvolvimento neste drill.
- [ ] Adicionar `"seed:initial": "tsx scripts/seed-initial-content.ts"`. O seed consome somente `src/modules/content/seed/initial-content.ts`, os três binários locais e `docs/content/media-provenance.json` do Plano 2; não baixa nada da internet durante deploy. `bootstrap-seed.ts` guarda uma capability `Symbol` privada ao módulo: somente a função CLI exportada consegue criá-la; `req.context.bootstrapSeed=true`, header, endpoint ou Local API externa sem o símbolo sempre falham. A CLI aceita somente `--if-needed`, usado por deploy recorrente.
- [ ] Implementar materialização determinística por `seedKey`/slug com `seedRevision` fixo, sem upsert mutável fora do bootstrap vazio. Em banco vazio, criar settings públicos confirmados, navegação, footer, páginas gerais, sete serviços, três segmentos, FAQs e as três mídias ilustrativas; projetos, clientes, depoimentos, artigos, redirects e documentos legais permanecem vazios.
- [ ] Antes do bypass, adquirir advisory lock e consultar `BootstrapState` e todas as collections/globals/versions editoriais. Se o marker durável `initialContentInstalledAt + seedRevision` existe, `--if-needed` encerra com sucesso sem comparar nem alterar conteúdo editorial, ainda que os seeds tenham sido legitimamente editados ou existam novos projetos/artigos. Se o marker não existe, a instalação só executa em domínio editorial totalmente vazio, via CLI pré-web, sem operação de publicação ou cache; qualquer estado parcial ou conteúdo alheio falha. Preparar e verificar os três assets antes da transação; falha posterior agenda compensação local.
- [ ] Dentro de uma única transação de banco, aplicar exatamente `assertNoForbiddenPublicScope()`, validação editorial, JSON canônico e fingerprint das Tasks 3/10; gravar aprovação, `_status='published'`, `workflow.state='published'`, timestamps, auditoria `system:initial-seed` e o marker `BootstrapState` somente como último write da mesma transação. A capability interna permite somente nessa instalação suprimir criação de `content-publication-operations` e invalidação externa, porque nenhum processo web/cache/CDN existe ainda. Hooks exigem simultaneamente capability, marker ausente, banco vazio comprovado e origem CLI; não chamam `revalidateTag`, `revalidatePath`, Cloudflare nem o worker. Publicação normal, inclusive por admin/system após o bootstrap, nunca aceita esse bypass e sempre usa a saga.
- [ ] Para mídia, recalcular SHA-256/dimensões a partir de `assets/content/illustrative`, diretório deliberadamente fora de `public/`, comparar com o manifesto e enviar o binário pela collection `media`; o adapter de storage ativo decide o destino. Falha ou arquivo ausente aborta todo o seed e impede promover o ambiente. O web/runner não copia esse diretório e `/media/illustrative/*` permanece 404.
- [ ] Testar instalação vazia e deploy recorrente. Esperado: a primeira execução produz os fingerprints/estados/audits e marker sem chamar o fake invalidator; depois de criar projeto/artigo e editar um seed legitimamente, `npm run seed:initial -- --if-needed` retorna 0, não compara fingerprint original e não altera contagens, IDs ou conteúdo. Banco parcial ou não vazio sem marker, marker gravado sem a transação completa, tentativa HTTP/`req.context` forjada e versão de marker desconhecida falham. Em seguida, comprovar que uma publicação normal com invalidator indisponível cria operação pendente e não reutiliza o bypass.
- [ ] Commit:

```bash
git add src/payload.config.ts src/payload-types.ts "src/app/(payload)/admin/importMap.js" src/globals/BootstrapState.ts src/migrations src/modules/content/seed scripts/seed-initial-content.ts package.json package-lock.json tests/unit/scripts/cms-migration-scripts.test.ts tests/integration/migrations tests/integration/content
git commit -m "feat(cms): migrate and seed governed initial content"
```

## Task 14: Verificação integrada de segurança editorial

**Files:**

- Create: `tests/e2e/admin/editorial-workflow.spec.ts`
- Create: `tests/e2e/admin/role-boundaries.spec.ts`
- Create: `tests/e2e/admin/mfa.spec.ts`
- Create: `tests/e2e/admin/authorizations.spec.ts`

- [ ] E2E: editor cria serviço, solicita aprovação e não vê controles de publicação.
- [ ] E2E: administrador aprova, recebe `operationId`, acompanha `publishing` e a página pública só aparece depois de assets, ativação e purge final; atualização mantém a versão anterior até esse ponto.
- [ ] E2E: após banco vazio + migrations + `npm run seed:initial -- --if-needed`, Home, sete serviços e três segmentos aparecem; um segundo deploy após criação/edição editorial retorna 0 e não altera contagens, IDs ou conteúdo.
- [ ] E2E: administrador tenta publicar por REST/GraphQL nativo sem `workflowCommand` e recebe 403.
- [ ] E2E: conteúdo com alegação comprovável sem evidência não sai de `pending_evidence`; variantes normalizadas de incêndio em rich text, SEO, slug e JSON são recusadas na aprovação e novamente na ativação.
- [ ] E2E: cada failpoint da saga é retomado sem ativação parcial/asset duplicado. Falha pré-ativação mantém a versão pública anterior; falha de purge final mantém operação incompleta, alerta e retry até sucesso.
- [ ] E2E: archive e revogação tornam origem não pública antes do purge; revogar autorização vence publish concorrente, remove cliente/projeto relacionado e converge nos caches em até 60 segundos.
- [ ] E2E: projeto com vídeo publica WebVTT `pt-BR` gerado e seguro; cue/markup inválido não gera asset nem URL pública, e archive retira `captionsSrc`.
- [ ] E2E: comercial e leitor não veem drafts, documentos de autorização, usuários ou settings privados.
- [ ] E2E: sessão de senha sem MFA não acessa o CMS; TOTP válido libera; recovery code funciona uma vez; sexta tentativa continua bloqueada após restart e chaves MFA iguais impedem boot.
- [ ] Contrato final: `AUDIT_EVENT_NAMES` é único e cobre eventos dos Planos 3/4/5; `ContentChange` aceita exatamente todas as collections/operações requeridas; não existe `get-public-content-repository.ts` e o único binding é `src/modules/content/public/composition-root.ts`.
- [ ] Rodar:

```bash
npm run test:unit
npm run test:int
npm run test:e2e
npm run verify
```

Esperado: todos os comandos terminam com exit code 0, sem falhas de TypeScript, lint, testes ou migrations.

- [ ] Commit:

```bash
git add tests
git commit -m "test(cms): verify editorial governance end to end"
```

Referências técnicas confirmadas: [drafts e controle de publicação](https://payloadcms.com/docs/versions/drafts), [access control](https://payloadcms.com/docs/access-control/collections), [trash e restauração](https://payloadcms.com/docs/trash/overview), [migrations PostgreSQL](https://payloadcms.com/docs/database/migrations) e [custom endpoints](https://payloadcms.com/docs/rest-api/overview).
