# Roadmap de implementação — Designer Inox Brasil

**Status:** arquitetura e direção aprovadas em 25 de julho de 2026.
**Especificação-base:** `docs/superpowers/specs/2026-07-25-designer-inox-site-design.md` (`fae03cf`).
**Regra de execução:** aplicar os planos 01 → 05 na ordem; dentro de cada plano, executar as tarefas na ordem e preservar os commits pequenos definidos em cada uma.

## Resultado esperado

Entregar uma plataforma modular que apresente e converta a atuação da Designer Inox Brasil em projeto técnico, fabricação, instalação, refrigeração, ventilação e exaustão, aquecimento, automação, cozinhas industriais, corte CNC plasma, reformas e manutenção. Proteção contra incêndio fica fora de navegação, conteúdo, SEO, formulário, CMS, analytics e dados estruturados.

O lançamento público só acontece quando o gate de release comprovar conteúdo publicado, privacidade habilitada, segurança, acessibilidade, performance, backups, adapter Payload em produção e ausência de dados empresariais inventados.

## Ordem de entrega

| Ordem | Plano | Dependências | Saída principal | Critério de saída |
|---|---|---|---|---|
| 01 | [Fundação e design system](./2026-07-25-designer-inox-01-foundation-design-system.md) | Nenhuma | Scaffold Payload/Next, PostgreSQL, master da marca, derivados, fontes locais, tokens, primitivos e shell | Migração `000001`, testes, build, E2E e budgets verdes |
| 02 | [Site público e SEO](./2026-07-25-designer-inox-02-public-site-seo.md) | 01 | Conteúdo inicial, rotas públicas, navegação, soluções, segmentos, projetos condicionais, WhatsApp, SEO e cache | Todas as rotas e estados condicionais testados; repositório local proibido em produção |
| 03 | [CMS e governança editorial](./2026-07-25-designer-inox-03-cms-editorial.md) | 01–02 | RBAC, MFA, workflow, evidências, autorizações, Payload adapter, preview e invalidação | Migração `000002`; somente conteúdo efetivamente publicado chega ao site público |
| 04 | [Leads, privacidade e segurança](./2026-07-25-designer-inox-04-leads-privacy-security.md) | 01–03 | Gate legal, formulário progressivo, uploads privados, Turnstile, idempotência, outbox, antivírus, retenção e direitos do titular | Migração `000003`; zero mutação quando o gate está fechado; fluxo E2E idempotente |
| 05 | [Qualidade, analytics e implantação](./2026-07-25-designer-inox-05-quality-analytics-deployment.md) | 01–04 | Consentimento, analytics allowlisted, ambiente, containers, matriz de browsers, Lighthouse, backup e release gate | `npm run release:gate` termina com `AUTOMATED_GATE_OK`; após evidência manual, `npm run release:approve` termina com `RELEASE_APPROVED` |

Os planos compartilham arquivos centrais como `package.json`, `payload.config.ts`, `src/lib/env/server.ts`, `compose.yaml`, layout, footer e configuração de testes. Por isso, a ordem é um contrato, não apenas uma preferência.

## Contratos canônicos entre planos

| Tema | Contrato único |
|---|---|
| Route group público | `src/app/(frontend)` |
| Unitários | `npm run test:unit`; arquivos em `tests/unit/**`, `src/**/*.test.*` e `scripts/**/*.test.*` |
| Integração | `npm run test:int`; arquivos em `tests/integration/**` |
| E2E | `npm run test:e2e`; arquivos em `tests/e2e/**` |
| Migrações | `20260725_000001_foundation`, `20260725_000002_content_management`, `20260725_000003_leads_privacy_security` |
| Contextos WhatsApp | `general`, `kitchen`, `equipment`, `ventilation`, `integrated-systems`, `cnc`, `renovation`, `maintenance`, `project` |
| Evento público | Um único bus `PublicSiteEvent` em `src/modules/analytics/public-events.ts`; sem PII e sem query string |
| Conteúdo público | `_status='published'`, `workflow.state='published'` e `deletedAt=null` |
| Binding em produção | `PayloadPublicContentRepository`; o adapter local lança `LOCAL_PUBLIC_CONTENT_FORBIDDEN_IN_PRODUCTION` |
| Projetos, logos e depoimentos | Só aparecem com escopo de autorização válido e estado público publicado |
| Imagem ilustrativa externa | Licença, fonte, autor, URL, data de verificação e rótulo de imagem ilustrativa obrigatórios |
| Orçamento | Página, upload e submissão usam o mesmo gate privado de prontidão LGPD |
| Anexos | Bucket privado, tokens one-shot separados para conclusão e associação, quarentena; somente arquivo `clean` pode ser baixado |
| Indexação | Preview pode usar `INDEX_PUBLIC_SITE=false`; liberação pública exige `true` |
| Exclusão funcional | Nenhum item, enum, formulário ou metadata de proteção contra incêndio |

## Cobertura da especificação

| Seções da especificação | Plano responsável | Evidência planejada |
|---|---|---|
| 1–4 — objetivos, princípios e escopo | 02 e este roadmap | Catálogo fechado de serviços, navegação e varredura da exclusão de incêndio |
| 5–6 — marca e identidade | 01 | Hash do master, derivação auditável, tipografia local, tokens e testes de legibilidade |
| 7–9 — arquitetura de informação e templates | 02 | Rotas, loaders, componentes, estados vazios e testes de páginas |
| 10 — conversão | 02 e 04 | WhatsApp contextual, gate, formulário, anexos e confirmação sem PII no link |
| 11 e 13 — painel e dados | 03 e 04 | Collections, globals, RBAC, workflow, tipos gerados e três migrações incrementais |
| 12 — arquitetura técnica | 01–05 | Ports/adapters, composition root, cache, jobs, containers e runbooks |
| 14 — segurança e LGPD | 03–05 | MFA, auditoria, autorização, rate limit, Turnstile, retenção, DSR, backups e gate legal |
| 15 — SEO | 02 | Metadata, canonical, Open Graph, Twitter, JSON-LD verdadeiro, sitemap e robots |
| 16 — analytics e consentimento | 05 | Cookie versionado, GTM somente após consentimento e payload allowlisted |
| 17–20 — acessibilidade, performance, erros e testes | 01, 02 e 05 | Axe, teclado, viewports, browser matrix, Web Vitals, Lighthouse e estados de erro |
| 21 — fases | 01–05 | A própria sequência deste roadmap |
| 22 — dados ausentes | 02, 04 e 05 | Recursos condicionais e bloqueio de publicação/indexação até confirmação |
| 23–24 — aceite e decisão | 05 | Release gate automatizado, checklist, smoke test e evidência agregada |

## Dados que bloqueiam publicação, não desenvolvimento

O produto pode ser construído com estados condicionais seguros, mas estes dados precisam ser confirmados antes da liberação correspondente:

- razão social, CNPJ, endereço público, telefone, e-mail, áreas atendidas e horários;
- usuário oficial do Instagram;
- encarregado/canal de privacidade, bases legais, prazos de retenção e versões jurídicas aprovadas;
- credenciais e domínios reais de produção;
- cases, depoimentos, logos e mídias próprios acompanhados das autorizações exigidas;
- IDs de analytics e CDN, caso esses serviços sejam usados.

Na ausência desses dados, não criar fatos substitutos: ocultar o módulo, manter o formulário fechado, usar `noindex` ou omitir o dado estruturado, conforme o contrato de cada plano.

## Gates de segurança e dependências

A consulta preventiva do Sonatype não pôde ser concluída por falta de autenticação disponível no ambiente de planejamento. Isso não autoriza pular a verificação: antes de executar qualquer lifecycle de dependência, o Plano 01 exige pins exatos, `npm audit`, `npm audit signatures`, instalação com scripts ignorados, novo audit e rebuild explícito apenas de `sharp` e `esbuild`. Os Planos 04 e 05 repetem o gate quando adicionam dependências ou produzem o artefato final.

## Critério global de conclusão

O projeto só pode ser declarado pronto quando:

1. todos os testes unitários, de integração, E2E, acessibilidade, responsividade e browsers passam;
2. build, migrações up/down/reapply e Lighthouse passam;
3. o gate automatizado valida adapter Payload, indexação, segredos e payloads de analytics, e a aprovação final valida também a evidência manual;
4. backup e restauração de banco e storage foram ensaiados;
5. smoke test do preview e checklist manual de browsers, dispositivos, teclado, logo e hero estão registrados;
6. nenhuma alegação, endereço, autorização, projeto ou dado empresarial foi inventado;
7. proteção contra incêndio permanece integralmente ausente do produto público e administrativo.

## Handoff de execução

Ao iniciar a implementação, usar uma destas modalidades sem alterar a ordem dos planos:

1. **Subagent-Driven:** uma tarefa por agente, com revisão de conformidade e qualidade entre tarefas.
2. **Inline:** execução sequencial no agente principal, com os mesmos checkpoints e commits.
