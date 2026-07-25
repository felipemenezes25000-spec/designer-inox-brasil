# Designer Inox — Site Público Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Entregar o site público responsivo da Designer Inox Brasil com conteúdo inicial verificável, conversão contextual por WhatsApp, templates editoriais, SEO técnico e qualidade WCAG 2.2 AA.

**Architecture:** As páginas App Router consomem somente DTOs públicos por meio de `PublicContentRepository`. O plano começa com `LocalPublicContentRepository`, permitindo desenvolver e testar todo o site; o Plano 3 troca apenas o binding em `src/modules/content/public/composition-root.ts` pelo adapter da Payload Local API. Consultas públicas usam Cache Components, tags e expiração máxima de 60 segundos; preview permanece separado e sem cache.

**Tech Stack:** Next.js 16.2.11, React 19.2.8, TypeScript, Payload 3.86.0, Vitest, Testing Library, Playwright, axe e Lighthouse CI; Node 24.14.0, npm 11.9.0.

## Global Constraints

- Nenhuma rota, cópia, metadado ou dado estruturado menciona proteção contra incêndio.
- Todo serviço público está ligado a operações profissionais e soluções industriais em aço inox.
- Não publicar endereço, região atendida, CNPJ, CREA, ART, certificações, história, clientes, métricas ou garantias enquanto não houver confirmação.
- WhatsApp confirmado: `+55 61 99683-1052`; link base: `https://wa.me/5561996831052`.
- Nenhum dado pessoal pode ser incluído automaticamente em URLs do WhatsApp ou eventos.
- O formulário permanece desativado; `/orcamento` mostra somente o contato pelo WhatsApp até o gate de privacidade da Fase 3.
- Projetos, clientes, depoimentos, artigos e documentos legais começam vazios. Se vazia, a coleção não gera menu, seção, CTA, rota indexável ou entrada no sitemap.
- Mídia ilustrativa sempre exibe a legenda literal `Imagem ilustrativa`, nunca entra em projetos e guarda autor, página de origem, licença, URL da licença e data da verificação.
- Meta WCAG 2.2 AA; alvos mínimos de `44 × 44 CSS px`; suporte até 320 px; respeito a `prefers-reduced-motion`.
- Metas Lighthouse: performance `> 90`; acessibilidade, boas práticas e SEO `> 95`.
- O plano consome tokens, fontes, logo, `Button`, `ButtonLink`, `Container`, `BrandMark`, `BrandLockup`, `FoldLine`, `SkipLink` e `SiteShell` produzidos pelo Plano 1.
- `next build` nunca consulta conteúdo, banco, Payload ou storage e não exige segredos; loaders CMS-dependent são adiados ao runtime com `connection()`, e rotas dinâmicas retornam `[]` em `generateStaticParams()` com `dynamicParams = true`.

## Contrato entre os Planos 2 e 3

Criar em `src/modules/content/public/types.ts`:

```ts
import type { WhatsAppContext } from '@/modules/whatsapp/contexts'

export type SeoFields = {
  title: string
  description: string
  noIndex?: boolean
  image?: PublicMedia
}

export type PublicMedia = {
  id: string
  src: string
  width: number
  height: number
  alt: string
  kind: 'company' | 'illustrative'
  caption: string | null
  credit: string | null
  sourceUrl: string | null
  licenseName: string | null
  licenseUrl: string | null
  licenseCheckedAt: string | null
}

export type ProcessStep = {
  id: 'understand' | 'survey' | 'define' | 'fabricate' | 'install' | 'follow'
  title: string
  description: string
}

export type PublicFaq = {
  id: string
  question: string
  answer: string
}

export type PublicPageKind =
  | 'home'
  | 'company'
  | 'solutionsHub'
  | 'segmentsHub'
  | 'projectsHub'
  | 'quote'
  | 'notFound'

export type PublicPageBlock =
  | { type: 'richText'; heading: string; paragraphs: readonly string[] }
  | { type: 'journeyRouter'; items: readonly { title: string; body: string; href: string }[] }
  | { type: 'process'; steps: readonly ProcessStep[] }
  | { type: 'services'; serviceSlugs: readonly string[] }
  | { type: 'segments'; segmentSlugs: readonly string[] }
  | { type: 'clients'; clientSlugs: readonly string[] }
  | { type: 'testimonials'; testimonialIds: readonly string[] }
  | { type: 'latestArticles'; articleSlugs: readonly string[] }
  | { type: 'faq'; faqs: readonly PublicFaq[] }
  | { type: 'finalCta'; heading: string; body: string; whatsappContext: WhatsAppContext }

export type PublicPage = {
  id: string
  slug: string
  kind: PublicPageKind
  title: string
  heading: string
  intro: string
  hero: {
    eyebrow: string | null
    heading: string
    summary: string
    microcopy: string | null
    media: PublicMedia | null
  }
  blocks: readonly PublicPageBlock[]
  seo: SeoFields
  updatedAt: string
}

export type PublicService = {
  id: string
  slug: string
  title: string
  eyebrow: string
  summary: string
  needs: readonly string[]
  deliverables: readonly string[]
  process: readonly ProcessStep[]
  relatedServiceSlugs: readonly string[]
  faqs: readonly PublicFaq[]
  heroMedia: PublicMedia | null
  whatsappContext: Exclude<WhatsAppContext, 'general' | 'project'>
  seo: SeoFields
  updatedAt: string
}

export type PublicSegment = {
  id: string
  slug: string
  title: string
  summary: string
  operationalContext: string
  carePoints: readonly string[]
  serviceSlugs: readonly string[]
  faqs: readonly PublicFaq[]
  whatsappContext: 'general'
  heroMedia: PublicMedia | null
  seo: SeoFields
  updatedAt: string
}

export type PublicProject = {
  id: string
  slug: string
  title: string
  summary: string
  cover: PublicMedia
  segment: { slug: string; title: string }
  locality: string | null
  clientName: string | null
  challenge: string
  scope: readonly string[]
  solution: string
  systems: readonly string[]
  result: string
  gallery: readonly PublicMedia[]
  beforeAfter: { before: PublicMedia; after: PublicMedia } | null
  video: {
    src: string
    poster: PublicMedia
    captionsSrc: string
    captionsLanguage: 'pt-BR'
  } | null
  relatedProjectSlugs: readonly string[]
  seo: SeoFields
  updatedAt: string
}

export type PublicLegalDocument = {
  type: 'privacy' | 'terms'
  title: string
  version: string
  effectiveAt: string
  body: readonly { heading: string; paragraphs: readonly string[] }[]
  seo: SeoFields
  updatedAt: string
}

export type PublicLink = {
  label: string
  href: string
  external?: boolean
}

export type PublicNavigation = {
  solutionGroups: readonly {
    label: 'Construir' | 'Fabricar' | 'Integrar' | 'Transformar' | 'Manter'
    serviceSlugs: readonly string[]
  }[]
  projectsLabel: string
  articlesLabel: string
  segmentsLabel: string
  maintenanceLabel: string
  companyLabel: string
  quoteLabel: string
}

export type PublicFooter = {
  primary: readonly PublicLink[]
  legal: readonly PublicLink[]
  social: readonly PublicLink[]
  cookiePreferencesLabel: 'Preferências de cookies'
}

export type PublicArticle = {
  id: string
  slug: string
  title: string
  summary: string
  author: string
  technicalReviewer: string | null
  categories: readonly { slug: string; title: string }[]
  publishedAt: string
  updatedAt: string
  sections: readonly {
    id: string
    heading: string
    paragraphs: readonly string[]
  }[]
  sources: readonly { title: string; url: `https://${string}`; checkedAt: string | null }[]
  media: readonly PublicMedia[]
  seo: SeoFields
}

export type PublicClient = {
  id: string
  slug: string
  name: string
  logo: PublicMedia | null
  summary: string | null
  updatedAt: string
}

export type PublicTestimonial = {
  id: string
  client: { slug: string; name: string } | null
  name: string
  role: string | null
  text: string
  updatedAt: string
}

export type PublicRedirect = {
  sourcePath: `/${string}`
  targetPath: `/${string}`
  permanent: boolean
}

export type PublicSiteSettings = {
  brandName: 'Designer Inox Brasil'
  phoneDisplay: '+55 61 99683-1052'
  whatsappDigits: '5561996831052'
  email: string | null
  address: {
    streetAddress: string
    addressLocality: string
    addressRegion: string
    postalCode: string
    addressCountry: 'BR'
  } | null
  geo: { latitude: number; longitude: number } | null
  areaServed: readonly string[]
  businessHours: readonly {
    days: readonly string[]
    opens: string
    closes: string
  }[]
  socialLinks: readonly { label: string; href: string }[]
}
```

Criar antes desse arquivo `src/modules/whatsapp/contexts.ts`, única fonte de verdade usada por conteúdo, links e analytics:

```ts
export const WHATSAPP_CONTEXTS = [
  'general',
  'kitchen',
  'equipment',
  'ventilation',
  'integrated-systems',
  'cnc',
  'renovation',
  'maintenance',
  'project',
] as const

export type WhatsAppContext = (typeof WHATSAPP_CONTEXTS)[number]
```

Criar em `src/modules/content/public/repository.ts`:

```ts
export interface PublicContentRepository {
  getSiteSettings(): Promise<PublicSiteSettings>
  getNavigation(): Promise<PublicNavigation>
  getFooter(): Promise<PublicFooter>
  getPageBySlug(slug: string): Promise<PublicPage | null>
  listServices(): Promise<readonly PublicService[]>
  getServiceBySlug(slug: string): Promise<PublicService | null>
  listSegments(): Promise<readonly PublicSegment[]>
  getSegmentBySlug(slug: string): Promise<PublicSegment | null>
  listProjects(): Promise<readonly PublicProject[]>
  getProjectBySlug(slug: string): Promise<PublicProject | null>
  listClients(): Promise<readonly PublicClient[]>
  listTestimonials(): Promise<readonly PublicTestimonial[]>
  listFaqs(scope: {
    kind: 'global' | 'service' | 'segment'
    slug?: string
  }): Promise<readonly PublicFaq[]>
  listArticles(): Promise<readonly PublicArticle[]>
  getArticleBySlug(slug: string): Promise<PublicArticle | null>
  getLegalDocument(
    type: 'privacy' | 'terms',
  ): Promise<PublicLegalDocument | null>
  getRedirectBySourcePath(path: string): Promise<PublicRedirect | null>
  listRedirects(): Promise<readonly PublicRedirect[]>
}
```

`PublicProject.clientName` já chega anonimizado quando a autorização estiver ausente, revogada ou vencida. O site nunca recebe nem interpreta registros de autorização.

## Conteúdo inicial fechado

### Páginas gerais

- Home H1: “Soluções industriais completas em aço inox, do espaço vazio à operação pronta.”
- Empresa H1: “Uma solução coordenada para operações profissionais em inox.”
- Hub de soluções H1: “Soluções em inox organizadas pela necessidade da sua operação.”
- Hub de segmentos H1: “Soluções em inox para diferentes operações profissionais.”
- Orçamento H1: “Solicite uma avaliação inicial.”
- 404 H1: “Esta página não foi encontrada.”

Processo comum:

1. **Entender:** “Mapeamos a operação, o espaço e a necessidade apresentada.”
2. **Levantar:** “Conferimos medidas, interferências e condições que influenciam o escopo.”
3. **Definir:** “Organizamos materiais, sistemas, entregáveis e limites da proposta.”
4. **Fabricar:** “Produzimos os componentes em inox previstos no projeto aprovado.”
5. **Instalar:** “Montamos e integramos a solução dentro do escopo contratado.”
6. **Acompanhar:** “Testamos o que foi entregue e orientamos a continuidade de manutenção.”

Roteador da home:

- **Construir do zero:** “Planejamento, fabricação e instalação de cozinhas, ambientes e estruturas industriais em inox.”
- **Fabricar e integrar:** “Equipamentos, mobiliário, coifas e sistemas associados, dimensionados para o uso profissional.”
- **Reformar e manter:** “Adequações, modernizações e continuidade para estruturas e equipamentos existentes.”

Texto curto sobre inox:

> A escolha da solução não depende apenas da aparência. Uso, temperatura, umidade, limpeza, carga, circulação e integração com outros sistemas influenciam projeto, fabricação e manutenção. Por isso, cada orçamento começa pela operação que a estrutura ou o equipamento precisa sustentar.

### Sete soluções iniciais

| Slug | H1 | Resumo |
|---|---|---|
| `cozinhas-industriais` | Cozinhas industriais completas em aço inox | Projeto aplicado, fabricação, instalação e integração de estruturas e equipamentos para cozinhas profissionais. |
| `equipamentos-em-inox` | Equipamentos e mobiliário em inox sob medida | Fabricação dimensionada para o espaço, o fluxo de trabalho e o uso profissional informado pelo cliente. |
| `coifas-ventilacao-e-exaustao` | Coifas, ventilação e exaustão industrial | Avaliação e integração de coifas, dutos, filtragem, captação e renovação de ar para ambientes profissionais. |
| `sistemas-integrados-em-inox` | Sistemas integrados a estruturas e equipamentos em inox | Refrigeração, aquecimento, sensores, comandos e automação incorporados ao escopo em aço inox. |
| `projeto-tecnico-e-fabricacao-cnc` | Projeto técnico aplicado e fabricação com corte plasma CNC | Levantamento, desenvolvimento técnico, corte de chapas e fabricação associados à necessidade apresentada. |
| `reformas-e-modernizacoes` | Reformas e modernizações de estruturas industriais em inox | Recuperação, ampliação e reconfiguração de instalações e equipamentos existentes após avaliação. |
| `manutencao` | Manutenção de estruturas e equipamentos industriais em inox | Atendimento preventivo, corretivo e contratos definidos conforme quantidade, condição e criticidade informadas. |

### Segmentos iniciais

- `restaurantes-e-cozinhas-profissionais`
- `hotelaria-e-alimentacao-coletiva`
- `producao-e-varejo-de-alimentos`

Cada página terá contexto próprio, cuidados operacionais sem alegações normativas, links somente para serviços aplicáveis e duas FAQs próprias.

### Estado inicial deliberado

```ts
export const initialProjects = []
export const initialClients = []
export const initialTestimonials = []
export const initialArticles = []
export const initialLegalDocuments = []
export const initialRedirects = []
```

Assim, “Projetos” não aparece no menu, hero, home ou sitemap; `/projetos` e seus detalhes respondem 404. Documentos legais só aparecem no rodapé e nas rotas após publicação aprovada pelo Plano 3.

### Imagens ilustrativas

Registrar três mídias, todas com `caption: "Imagem ilustrativa"` e `licenseCheckedAt: "2026-07-25"`:

- Cozinha profissional: Bruno Makori, [página da fotografia](https://www.pexels.com/photo/commercial-kitchen-with-stainless-steel-equipment-28704740/), fonte `https://images.pexels.com/photos/28704740/pexels-photo-28704740.jpeg?auto=compress&cs=tinysrgb&w=2000`.
- Soldagem industrial: JL Photographie, [página da fotografia](https://www.pexels.com/photo/welder-at-work-5650006/), fonte `https://images.pexels.com/photos/5650006/pexels-photo-5650006.jpeg?auto=compress&cs=tinysrgb&w=2000`.
- Corte plasma: Ana Victoria Valverde, [página da fotografia](https://www.pexels.com/photo/plasma-cutting-in-factory-17180807/), fonte `https://images.pexels.com/photos/17180807/pexels-photo-17180807.jpeg?auto=compress&cs=tinysrgb&w=2000`.

Licença de todas: `Pexels License`, URL [pexels.com/license](https://www.pexels.com/license/). O Plano 3 deve importar os arquivos para mídia pública; não servir os URLs de origem como armazenamento definitivo.

### Contrato fechado de conteúdo inicial

Os arquivos de seed usam literalmente o conteúdo abaixo; ajustes editoriais posteriores passam pelo workflow do Plano 3. Nenhuma linha pode receber alegação normativa, certificação, prazo, garantia ou capacidade não confirmada.

**SEO e hero das páginas gerais**

| Rota | `seo.title` | `seo.description` | Hero summary |
|---|---|---|---|
| `/` | `Designer Inox Brasil | Soluções industriais completas em inox` | `Projeto técnico, fabricação, instalação e integração de soluções profissionais em aço inox.` | `Projeto técnico, fabricação, instalação, refrigeração, ventilação, exaustão, aquecimento, automação, reformas e manutenção coordenados conforme a necessidade da operação.` |
| `/empresa` | `Empresa | Designer Inox Brasil` | `Conheça a abordagem coordenada da Designer Inox Brasil para soluções profissionais em aço inox.` | `Integramos levantamento, definição técnica, fabricação, instalação e acompanhamento dentro do escopo aprovado.` |
| `/solucoes-em-inox` | `Soluções em aço inox | Designer Inox Brasil` | `Encontre soluções em cozinhas industriais, equipamentos, exaustão, sistemas integrados, CNC, reformas e manutenção.` | `Escolha pela necessidade da operação e avance para uma avaliação inicial pelo WhatsApp.` |
| `/segmentos` | `Segmentos atendidos | Designer Inox Brasil` | `Soluções profissionais em aço inox para alimentação, hotelaria, produção e varejo de alimentos.` | `Cada operação combina espaço, fluxo, temperatura, limpeza, carga e continuidade de forma diferente.` |
| `/orcamento` | `Solicite uma avaliação | Designer Inox Brasil` | `Inicie uma conversa sobre projeto, fabricação, instalação, integração, reforma ou manutenção em aço inox.` | `Enquanto o formulário estiver fechado, o WhatsApp é o canal disponível para a avaliação inicial.` |

**Conteúdo das sete soluções**

| Slug | `needs` | `deliverables` | `relatedServiceSlugs` | `whatsappContext` |
|---|---|---|---|---|
| `cozinhas-industriais` | `implantação de uma operação nova`; `reorganização de fluxo e áreas de trabalho`; `integração de estruturas, equipamentos e sistemas associados` | `levantamento e definição do escopo`; `projeto técnico aplicado quando contratado`; `fabricação e instalação dos itens aprovados`; `integração e testes previstos na proposta` | `equipamentos-em-inox`; `coifas-ventilacao-e-exaustao`; `sistemas-integrados-em-inox` | `kitchen` |
| `equipamentos-em-inox` | `mobiliário fora de medidas padronizadas`; `equipamento adequado ao espaço e ao uso informado`; `substituição ou ampliação de item existente` | `levantamento de medidas e interferências`; `detalhamento do item aprovado`; `fabricação em inox`; `instalação quando incluída no escopo` | `cozinhas-industriais`; `projeto-tecnico-e-fabricacao-cnc`; `manutencao` | `equipment` |
| `coifas-ventilacao-e-exaustao` | `captação de vapores, calor e contaminantes do processo`; `renovação ou movimentação de ar`; `adequação de coifas, dutos e componentes existentes` | `avaliação do ambiente e dos equipamentos informados`; `definição de coifas, dutos, filtragem e insuflamento aplicáveis`; `fabricação e montagem do escopo aprovado`; `testes funcionais previstos na proposta` | `cozinhas-industriais`; `sistemas-integrados-em-inox`; `manutencao` | `ventilation` |
| `sistemas-integrados-em-inox` | `refrigeração incorporada a equipamentos ou estruturas`; `aquecimento controlado`; `sensores, comandos e automação da solução contratada` | `definição das interfaces do sistema`; `integração de componentes e infraestrutura prevista`; `montagem, configuração e testes do escopo`; `orientação operacional da entrega` | `equipamentos-em-inox`; `cozinhas-industriais`; `manutencao` | `integrated-systems` |
| `projeto-tecnico-e-fabricacao-cnc` | `transformação de medidas ou desenhos em peças fabricáveis`; `corte de chapas para lote ou componente sob medida`; `apoio técnico associado à fabricação contratada` | `conferência dos arquivos e requisitos recebidos`; `detalhamento técnico dentro do escopo`; `corte plasma CNC`; `acabamento e fabricação complementar quando contratados` | `equipamentos-em-inox`; `cozinhas-industriais`; `reformas-e-modernizacoes` | `cnc` |
| `reformas-e-modernizacoes` | `recuperação de estrutura ou equipamento existente`; `mudança de layout, capacidade ou forma de uso`; `integração de novos componentes à instalação atual` | `diagnóstico inicial do estado aparente`; `definição do que será preservado, removido ou substituído`; `fabricação e montagem das alterações aprovadas`; `testes do escopo modificado` | `equipamentos-em-inox`; `sistemas-integrados-em-inox`; `manutencao` | `renovation` |
| `manutencao` | `falha observada em equipamento ou estrutura`; `rotina preventiva planejada`; `avaliação de contrato para múltiplas unidades ou ativos` | `triagem e levantamento inicial`; `diagnóstico dentro das condições acessíveis`; `proposta corretiva, preventiva ou contratual`; `registro do serviço executado quando contratado` | `equipamentos-em-inox`; `coifas-ventilacao-e-exaustao`; `sistemas-integrados-em-inox` | `maintenance` |

**Meta descriptions aprovadas das sete soluções**

| Slug | `seo.description` |
|---|---|
| `cozinhas-industriais` | `Planejamento, fabricação e instalação de cozinhas industriais em inox, com equipamentos e sistemas integrados conforme o escopo aprovado.` |
| `equipamentos-em-inox` | `Equipamentos em aço inox sob medida, do levantamento e detalhamento à fabricação e instalação previstas na proposta aprovada.` |
| `coifas-ventilacao-e-exaustao` | `Coifas, dutos, filtragem, insuflamento e exaustão para operações profissionais, definidos após avaliação do ambiente e do processo.` |
| `sistemas-integrados-em-inox` | `Refrigeração, aquecimento, sensores, comandos e automação integrados a estruturas e equipamentos em inox conforme a solução contratada.` |
| `projeto-tecnico-e-fabricacao-cnc` | `Projeto técnico aplicado, detalhamento e corte plasma CNC para peças e conjuntos em inox, com fabricação complementar quando contratada.` |
| `reformas-e-modernizacoes` | `Reformas e modernizações em estruturas e equipamentos de inox, com diagnóstico inicial, fabricação, montagem e testes do escopo aprovado.` |
| `manutencao` | `Manutenção preventiva e corretiva de estruturas, equipamentos e sistemas em inox, iniciada por triagem e diagnóstico das condições acessíveis.` |

Os títulos SEO das soluções usam `<H1> | Designer Inox Brasil`. O seed usa literalmente as descrições desta tabela, sem derivá-las do resumo do hero; cada uma tem de 120 a 160 caracteres e é exclusiva, verificado por teste.

**FAQs globais da home**

1. `A Designer Inox trabalha apenas com fabricação?` — `Não. O escopo pode reunir projeto técnico aplicado, fabricação, instalação e integração, conforme a necessidade apresentada e a proposta aprovada.`
2. `É possível solicitar uma solução completa para uma operação nova?` — `Sim. O atendimento inicial organiza espaço, uso, equipamentos e sistemas envolvidos para definir quais etapas devem fazer parte do escopo.`
3. `Vocês trabalham com refrigeração, aquecimento e automação?` — `Esses sistemas podem ser integrados a estruturas e equipamentos em inox quando fizerem parte da solução contratada.`
4. `A Designer Inox realiza reformas e manutenção?` — `Sim. Reformas, modernizações e manutenção preventiva ou corretiva começam por uma avaliação da estrutura, do equipamento e da continuidade necessária.`
5. `Posso enviar desenho, medidas ou fotos?` — `Sim. Esse material ajuda na avaliação inicial. O canal disponível informa quais formatos podem ser recebidos em cada etapa.`
6. `Como começa um orçamento?` — `Começa pela necessidade, cidade, tipo de operação e condições conhecidas. Depois são definidos levantamento, entregáveis e limites da proposta.`

**FAQs contextuais das soluções**

```ts
export const serviceFaqs = {
  'cozinhas-industriais': [
    ['O projeto pode reunir equipamentos e exaustão?', 'Sim. A solução pode coordenar estruturas, equipamentos, ventilação, exaustão e sistemas integrados quando esses itens fizerem parte do escopo aprovado.'],
    ['É necessário fazer levantamento no local?', 'A necessidade de visita e levantamento depende das medidas, interferências e informações disponíveis na avaliação inicial.'],
  ],
  'equipamentos-em-inox': [
    ['Os equipamentos podem ser feitos sob medida?', 'Sim. Dimensões, uso, carga, temperatura e integração informados orientam o detalhamento da proposta.'],
    ['É possível fabricar a partir de um desenho do cliente?', 'O desenho pode ser analisado como referência e conferido antes da fabricação contratada.'],
  ],
  'coifas-ventilacao-e-exaustao': [
    ['O atendimento inclui dutos e renovação de ar?', 'Pode incluir coifas, dutos, filtragem, insuflamento e renovação de ar conforme a avaliação e o escopo aprovado.'],
    ['Vocês avaliam sistemas já instalados?', 'Sim. Condição aparente, acesso, equipamentos atendidos e problema observado são levantados antes da proposta.'],
  ],
  'sistemas-integrados-em-inox': [
    ['Quais sistemas podem ser integrados?', 'Refrigeração, aquecimento, sensores, comandos e automação podem integrar a solução quando tecnicamente aplicáveis ao escopo.'],
    ['A automação é entregue separadamente?', 'A página trata da automação associada à estrutura ou ao equipamento em inox contratado, com interfaces definidas na proposta.'],
  ],
  'projeto-tecnico-e-fabricacao-cnc': [
    ['Quais arquivos ajudam na avaliação?', 'Desenhos, plantas, medidas, quantidade e material pretendido ajudam a verificar o caminho de detalhamento e fabricação.'],
    ['O corte CNC inclui acabamento e montagem?', 'Corte, acabamento, dobra, solda e montagem são itens separados e só entram quando descritos na proposta.'],
  ],
  'reformas-e-modernizacoes': [
    ['É possível reformar sem interromper toda a operação?', 'A necessidade de continuidade deve ser informada para que etapas, acessos e limites possam ser avaliados.'],
    ['Todo equipamento existente pode ser recuperado?', 'Não é possível afirmar antes da avaliação. Estado, material, acesso e objetivo definem se a recuperação é adequada.'],
  ],
  manutencao: [
    ['Vocês oferecem manutenção preventiva e corretiva?', 'Sim. O formato depende da quantidade de ativos, condição informada, criticidade e frequência definida na proposta.'],
    ['Como informar uma operação parada?', 'Selecione a urgência correspondente e descreva o sintoma sem desmontar ou operar o equipamento fora das condições seguras.'],
  ],
} as const
```

**Segmentos**

| Slug | Resumo e contexto operacional | Pontos de atenção | Serviços relacionados | SEO title |
|---|---|---|---|---|
| `restaurantes-e-cozinhas-profissionais` | `Operações que precisam coordenar preparo, cocção, higienização, circulação, armazenamento e atendimento.` | `fluxo entre etapas`; `calor e umidade`; `limpeza e acesso`; `continuidade do serviço` | cozinhas, equipamentos, exaustão, sistemas integrados, manutenção | `Inox para restaurantes e cozinhas profissionais | Designer Inox` |
| `hotelaria-e-alimentacao-coletiva` | `Ambientes com produção recorrente, múltiplos pontos de serviço e necessidade de padronizar a operação.` | `volume e horários de pico`; `deslocamento interno`; `interfaces entre áreas`; `planejamento de manutenção` | cozinhas, equipamentos, exaustão, sistemas integrados, reformas, manutenção | `Inox para hotelaria e alimentação coletiva | Designer Inox` |
| `producao-e-varejo-de-alimentos` | `Produção, apoio e exposição de alimentos em operações que combinam fabricação, armazenamento e atendimento.` | `sequência do processo`; `temperatura e umidade`; `carga e movimentação`; `expansão futura` | equipamentos, sistemas integrados, CNC, reformas, manutenção | `Inox para produção e varejo de alimentos | Designer Inox` |

Cada segmento usa duas perguntas: `Quais informações ajudam na avaliação deste segmento?` — `Tipo de operação, espaço, fluxo, equipamentos, horários e problema ou objetivo ajudam a organizar o escopo inicial.`; e `Os serviços podem ser combinados?` — `Sim. Somente os serviços relacionados à necessidade e aprovados na proposta são coordenados na entrega.` As meta descriptions usam o resumo do segmento, acrescentando `Conheça as soluções relacionadas da Designer Inox Brasil.`, e o teste garante exclusividade.

---

### Task 1: Contrato público, catálogo de rotas e composition root

**Files:**

- Create: `src/modules/content/public/types.ts`
- Create: `src/modules/content/public/repository.ts`
- Create: `src/modules/content/public/composition-root.ts`
- Create: `src/modules/whatsapp/contexts.ts`
- Create: `src/modules/site/routing/public-routes.ts`
- Test: `tests/unit/content/public-contract.test.ts`
- Test: `tests/unit/site/public-routes.test.ts`

**Interfaces:**

- Produces: `PublicContentRepository` e DTOs definidos acima.
- Produces: `getPublicContentRepository(): PublicContentRepository`.
- Plano 3 modifica somente `src/modules/content/public/composition-root.ts`.

- [ ] **Step 1: Write the failing route-contract tests**

```ts
expect(SERVICE_ROUTES).toEqual({
  kitchen: '/cozinhas-industriais',
  equipment: '/equipamentos-em-inox',
  ventilation: '/coifas-ventilacao-e-exaustao',
  'integrated-systems': '/sistemas-integrados-em-inox',
  cnc: '/projeto-tecnico-e-fabricacao-cnc',
  renovation: '/reformas-e-modernizacoes',
  maintenance: '/manutencao',
})
expect(JSON.stringify(PUBLIC_ROUTE_CATALOG)).not.toMatch(/incêndio/i)
```

- [ ] **Step 2: Verify failure**

Run: `npx vitest run --config ./vitest.config.mts tests/unit/content/public-contract.test.ts tests/unit/site/public-routes.test.ts`

Expected: FAIL because both modules are unresolved.

- [ ] **Step 3: Add the contracts and exact route constants**

Include all initial routes from the specification and no blog route.

- [ ] **Step 4: Verify**

Expected: 5 tests passed.

- [ ] **Step 5: Commit**

```bash
git add src/modules/content/public src/modules/site/routing tests/unit/content tests/unit/site
git commit -m "feat: define public content and route contracts"
```

### Task 2: Conteúdo inicial, mídia e repositório local

**Files:**

- Create: `src/modules/content/initial/pages.ts`
- Create: `src/modules/content/initial/services.ts`
- Create: `src/modules/content/initial/segments.ts`
- Create: `src/modules/content/initial/faqs.ts`
- Create: `src/modules/content/initial/media.ts`
- Create: `src/modules/content/initial/settings.ts`
- Create: `src/modules/content/initial/index.ts`
- Create: `src/modules/content/public/local-repository.ts`
- Create: `assets/content/illustrative/kitchen.jpg`
- Create: `assets/content/illustrative/welding.jpg`
- Create: `assets/content/illustrative/plasma.jpg`
- Create: `docs/content/media-provenance.json`
- Create: `scripts/content/fetch-illustrative-media.mjs`
- Modify: `src/modules/content/public/composition-root.ts`
- Test: `tests/unit/content/initial-content.test.ts`
- Test: `tests/unit/content/local-repository.test.ts`

- [ ] **Step 1: Write failing invariants**

```ts
expect(initialServices).toHaveLength(7)
expect(initialSegments).toHaveLength(3)
expect(initialProjects).toEqual([])
expect(initialArticles).toEqual([])
expect(JSON.stringify(initialPublicContent)).not.toMatch(
  /proteção contra incêndio|atendimento doméstico|CREA|ART|garantia absoluta/i,
)

for (const media of initialMedia.filter(item => item.kind === 'illustrative')) {
  expect(media.caption).toBe('Imagem ilustrativa')
  expect(media.credit).toBeTruthy()
  expect(media.sourceUrl).toMatch(/^https:\/\/www\.pexels\.com\/photo\//)
  expect(media.licenseUrl).toBe('https://www.pexels.com/license/')
}
```

- [ ] **Step 2: Verify failure**

Run: `npx vitest run --config ./vitest.config.mts tests/unit/content/initial-content.test.ts tests/unit/content/local-repository.test.ts`

Expected: FAIL because initial content does not exist.

- [ ] **Step 3: Implement exact content and local repository**

`scripts/content/fetch-illustrative-media.mjs` aceita somente as três URLs HTTPS enumeradas neste plano, limita cada resposta a 20 MB, exige MIME e magic bytes JPEG, lê dimensões reais com Sharp, rejeita largura/altura zero e grava os três arquivos locais fora de `public/`. O manifesto registra nome local, SHA-256, bytes, dimensões, autor, página de origem, licença, URL da licença e `licenseCheckedAt`; o teste recalcula hash e metadata. Nesta fase, `initialMedia` usa imports estáticos de `assets/content/illustrative/*.jpg`, recebendo apenas paths hashed de `/_next/static/media/...`; nunca expõe `/media/illustrative/*`, filesystem ou host externo. Quando o adapter Payload substituir o repositório local, esses imports saem do bundle público e os mesmos binários permanecem apenas como fonte de seed do target de migração. Os binários e o manifesto versionados tornam build e seed reproduzíveis mesmo se a origem mudar. A execução futura do fetch falha e exige revisão explícita se o hash do download mudar.

O repositório local é o binding de desenvolvimento do Plano 2; Payload o substitui no Plano 3. A guarda fica dentro de cada método, não no import/construtor, para que `next build` possa analisar módulos sem consultar conteúdo. Qualquer chamada em runtime fora de development/test falha fechada:

```ts
function assertLocalContentAllowed() {
  if (process.env.CONTENT_ACCESS_SENTINEL === 'throw') {
    throw new Error('BUILD_CONTENT_ACCESS_FORBIDDEN')
  }
  if (process.env.NODE_ENV === 'production') {
    throw new Error('LOCAL_PUBLIC_CONTENT_FORBIDDEN_IN_PRODUCTION')
  }
}
```

O teste espiona todos os métodos: importar o composition root durante `phase-production-build` faz zero leituras; chamar qualquer método com `NODE_ENV=production` lança o erro acima.

- [ ] **Step 4: Verify**

Expected: all content invariants and repository lookups pass.

- [ ] **Step 5: Commit**

```bash
git add assets/content/illustrative docs/content/media-provenance.json scripts/content/fetch-illustrative-media.mjs src/modules/content tests/unit/content
git commit -m "feat: add verified initial public content"
```

### Task 3: Mega menu, shell e publicação condicional

**Files:**

- Modify: `src/components/layout/navigation.ts`
- Modify: `src/components/layout/SiteHeader.tsx`
- Modify: `src/components/layout/MobileNavigation.tsx`
- Modify: `src/app/(frontend)/layout.tsx`
- Create: `src/modules/site/navigation/build-site-navigation.ts`
- Test: `tests/unit/site/build-site-navigation.test.tsx`
- Test: `tests/e2e/public-navigation.spec.ts`

**Interfaces:**

```ts
export type NavigationSection = {
  label: 'Construir' | 'Fabricar' | 'Integrar' | 'Transformar' | 'Manter'
  items: readonly NavigationLink[]
}
```

- [ ] **Step 1: Test menu structure and conditional Projects/Contents**

Assert the exact five solution sections, main-menu order, WhatsApp CTA, and absence/presence of Projects and Conteúdos based respectively on `listProjects()` and `listArticles()`.

- [ ] **Step 2: Verify failure**

Expected: unit failure because sectioned groups are unsupported.

- [ ] **Step 3: Extend the Plan 1 shell**

Desktop renders a sectioned mega menu. Mobile renders the same sections as accordions inside the existing focus-managed panel. The header CTA label remains `Solicitar orçamento`, but its destination is WhatsApp.

- [ ] **Step 4: Verify keyboard behavior**

Run:

```bash
npx vitest run --config ./vitest.config.mts tests/unit/site/build-site-navigation.test.tsx
npx playwright test tests/e2e/public-navigation.spec.ts
```

Expected: menu opens by keyboard, closes with `Esc`, restores focus, and contains neither Projects nor Conteúdos while the corresponding collections are empty.

- [ ] **Step 5: Commit**

```bash
git add src/app src/components/layout src/modules/site/navigation tests
git commit -m "feat: connect responsive public navigation"
```

### Task 4: WhatsApp contextual e evento sem PII

**Files:**

- Create: `src/modules/whatsapp/messages.ts`
- Create: `src/modules/whatsapp/build-whatsapp-href.ts`
- Create: `src/modules/analytics/public-events.ts`
- Create: `src/components/conversion/WhatsAppLink.tsx`
- Create: `src/components/conversion/FloatingWhatsApp.tsx`
- Modify: `src/app/(frontend)/layout.tsx`
- Test: `tests/unit/whatsapp/build-whatsapp-href.test.ts`
- Test: `tests/unit/components/whatsapp-link.test.tsx`

- [ ] **Step 1: Test every required message**

```ts
expect(buildWhatsAppHref('kitchen')).toBe(
  'https://wa.me/5561996831052?text=Ol%C3%A1%2C%20gostaria%20de%20solicitar%20um%20or%C3%A7amento%20para%20uma%20cozinha%20industrial%20em%20a%C3%A7o%20inox.',
)
expect(buildWhatsAppHref('project')).not.toMatch(/name=|email=|phone=/i)
```

Include the eight commercial messages verbatim from the specification plus `project: "Olá, quero uma solução semelhante a este projeto."`.

- [ ] **Step 2: Verify failure**

Expected: module unresolved.

- [ ] **Step 3: Implement**

`src/modules/analytics/public-events.ts` define o bus neutro, sem fornecedor, que o Plano 5 observará:

```ts
export type PublicSiteEvent = {
  name: 'whatsapp_click'
  context: WhatsAppContext
  path: `/${string}`
}

export function publishPublicSiteEvent(event: PublicSiteEvent): void
```

`WhatsAppLink` publica somente `{ name: 'whatsapp_click', context, path: window.location.pathname as `/${string}` }`. Não existe `dataLayer` nem SDK de analytics no Plano 2.

Desktop floating CTA displays icon and `Falar no WhatsApp`; mobile displays the icon, `aria-label="Falar no WhatsApp"` and a minimum 44 px target.

- [ ] **Step 4: Verify**

Expected: eight URL tests and component-event tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/modules/whatsapp src/modules/analytics src/components/conversion src/app tests/unit
git commit -m "feat: add contextual WhatsApp conversion"
```

### Task 5: Home pública

**Files:**

- Create: `src/components/home/HomeHero.tsx`
- Create: `src/components/home/JourneyRouter.tsx`
- Create: `src/components/home/ProcessTimeline.tsx`
- Create: `src/components/home/SolutionGroups.tsx`
- Create: `src/components/home/MaintenanceFeature.tsx`
- Create: `src/components/home/InoxExplainer.tsx`
- Create: `src/components/home/HomeSocialProof.tsx`
- Create: `src/components/home/HomeFaq.tsx`
- Create: `src/components/home/FinalContact.tsx`
- Create: `src/modules/site/loaders/load-home-page.ts`
- Modify: `src/app/(frontend)/page.tsx`
- Test: `tests/unit/pages/home-page.test.tsx`

- [ ] **Step 1: Test exact hero and empty-collection behavior**

Assert the approved H1/subtitle, microcopy, `Conhecer nossas soluções` when projects are empty, absence of project/client/testimonial headings with empty collections and exactly six process steps. A second fixture with authorized published clients/testimonials renders the social-proof section; expired or revoked authorization renders neither identity, logo nor quote.

- [ ] **Step 2: Verify failure**

Expected: home assertions fail against the foundation page.

- [ ] **Step 3: Compose the page**

Use the kitchen illustrative image in the hero, with reserved `aspect-ratio`, `priority`, responsive `sizes` and visible `Imagem ilustrativa`. Use `FoldLine` once to connect the process; disable its movement for reduced motion. `FinalContact` sempre oferece o CTA secundário literal `Enviar formulário detalhado` com `href="/orcamento"`; ele continua útil quando a rota mostra `QuoteGate`.

- [ ] **Step 4: Verify**

Expected: four home tests pass.

- [ ] **Step 5: Commit**

```bash
git add 'src/app/(frontend)/page.tsx' src/components/home src/modules/site/loaders tests/unit/pages
git commit -m "feat: build conditional public home"
```

### Task 6: Hub e sete templates de solução

**Files:**

- Create: `src/components/content/Breadcrumbs.tsx`
- Create: `src/components/content/PageHero.tsx`
- Create: `src/components/content/IllustrativeMedia.tsx`
- Create: `src/components/solutions/SolutionsHub.tsx`
- Create: `src/components/solutions/SolutionPage.tsx`
- Create: `src/modules/site/loaders/load-service-page.ts`
- Create: `src/app/(frontend)/solucoes-em-inox/page.tsx`
- Create one `page.tsx` under each of the seven service route directories
- Test: `tests/unit/pages/solution-page.test.tsx`
- Test: `tests/e2e/solutions.spec.ts`

- [ ] **Step 1: Test the template**

Assert one H1, breadcrumb, needs, deliverables, process, related solutions, contextual FAQs, illustration label and contextual WhatsApp URL.

- [ ] **Step 2: Verify failure**

Expected: template unresolved.

- [ ] **Step 3: Implement one reusable renderer and seven explicit route modules**

Unknown service slug calls `notFound()`. Every route defines metadata using the service record; route files contain no duplicated copy.

- [ ] **Step 4: Verify**

Expected: all seven routes return 200 and expose their unique H1; `/protecao-contra-incendio` returns 404.

- [ ] **Step 5: Commit**

```bash
git add 'src/app/(frontend)' src/components/content src/components/solutions src/modules/site/loaders tests
git commit -m "feat: add public solution pages"
```

### Task 7: Empresa e segmentos

**Files:**

- Create: `src/components/company/CompanyPage.tsx`
- Create: `src/components/company/ClientGrid.tsx`
- Create: `src/components/company/Testimonials.tsx`
- Create: `src/components/segments/SegmentsHub.tsx`
- Create: `src/components/segments/SegmentPage.tsx`
- Create: `src/modules/site/loaders/load-segment-page.ts`
- Create: `src/app/(frontend)/empresa/page.tsx`
- Create: `src/app/(frontend)/segmentos/page.tsx`
- Create: `src/app/(frontend)/segmentos/[slug]/page.tsx`
- Test: `tests/unit/pages/company-page.test.tsx`
- Test: `tests/unit/pages/segment-page.test.tsx`

- [ ] **Step 1: Test confirmed-only company content**

Assert that Empresa describes the coordinated process and capabilities, but has no history, team, address, certificate or metric block. Empty clients/testimonials produce no section; authorized published fixtures render only their permitted name/logo/quote fields.

- [ ] **Step 2: Test segment gating**

Assert three initial segments, unique operational context, applicable service links and `notFound()` for an absent segment.

- [ ] **Step 3: Implement**

`generateStaticParams()` retorna `[]` e `dynamicParams = true`; segmentos são resolvidos em runtime, permitindo publicação posterior sem acesso ao CMS ou segredos durante build. O loader chama `await connection()` antes do primeiro acesso ao repository e então usa as funções cacheadas do contrato público.

- [ ] **Step 4: Verify**

Expected: six tests pass.

- [ ] **Step 5: Commit**

```bash
git add 'src/app/(frontend)/empresa' 'src/app/(frontend)/segmentos' src/components/company src/components/segments src/modules/site/loaders tests/unit/pages
git commit -m "feat: add company and segment pages"
```

### Task 8: Projetos, conteúdos e prova social condicionais

**Files:**

- Create: `src/components/projects/ProjectCard.tsx`
- Create: `src/components/projects/ProjectGallery.tsx`
- Create: `src/components/projects/BeforeAfter.tsx`
- Create: `src/components/projects/ProjectVideo.tsx`
- Create: `src/components/projects/ProjectPage.tsx`
- Create: `src/components/projects/ProjectsHub.tsx`
- Create: `src/components/content-hub/ArticleCard.tsx`
- Create: `src/components/content-hub/ArticlesHub.tsx`
- Create: `src/components/content-hub/ArticlePage.tsx`
- Create: `src/modules/site/loaders/load-project-page.ts`
- Create: `src/modules/site/loaders/load-article-page.ts`
- Create: `src/app/(frontend)/projetos/page.tsx`
- Create: `src/app/(frontend)/projetos/[slug]/page.tsx`
- Create: `src/app/(frontend)/conteudos/page.tsx`
- Create: `src/app/(frontend)/conteudos/[slug]/page.tsx`
- Modify: `src/app/(frontend)/empresa/page.tsx`
- Test: `tests/unit/pages/project-page.test.tsx`
- Test: `tests/unit/pages/article-page.test.tsx`
- Test: `tests/e2e/project-media.spec.ts`
- Test: `tests/e2e/articles.spec.ts`

- [ ] **Step 1: Write a test-only project fixture**

Use `tests/fixtures/public-project.ts`; identify it explicitly as test content and never include it in `initialProjects`.

- [ ] **Step 2: Test optional and protected fields**

Assert omitted `clientName`, prohibition of `illustrative` gallery media, caption requirement for video, accessible labels for before/after and related CTA text `Quero uma solução semelhante`.

Testar também estado inicial vazio: `/conteudos` e detalhe retornam 404, menu/sitemap omitem o módulo. Com artigo publicado, índice/detalhe aparecem com autor, revisão, datas, sumário, fontes HTTPS (`rel="noopener noreferrer"` quando externas), mídia licenciada, links internos, CTA contextual, metadata e `Article` JSON-LD; draft, approved, archived e trash permanecem 404.

- [ ] **Step 3: Implement**

Gallery dialog closes with `Esc` and restores focus. Before/after accepts arrow keys. Video renders only with poster and Portuguese caption track. `generateStaticParams()` de projetos, conteúdos e artigos retorna `[]`, todos usam `dynamicParams = true`, chamam `await connection()` antes do repository e nunca consultam CMS no build. Empresa, Home e Projetos consomem `listClients()`/`listTestimonials()` e não renderizam wrappers vazios.

- [ ] **Step 4: Verify**

With empty production data, project and content routes render the shared 404. With injected repositories, all project/media/article/social-proof interactions pass.

- [ ] **Step 5: Commit**

```bash
git add 'src/app/(frontend)/projetos' 'src/app/(frontend)/conteudos' 'src/app/(frontend)/empresa/page.tsx' src/components/projects src/components/content-hub src/components/company src/modules/site/loaders tests
git commit -m "feat: add gated projects articles and social proof"
```

### Task 9: Orçamento bloqueado, documentos legais, redirects e 404

**Files:**

- Create: `src/app/(frontend)/orcamento/page.tsx`
- Create: `src/components/conversion/QuoteGate.tsx`
- Create: `src/components/legal/LegalDocumentPage.tsx`
- Create: `src/app/(frontend)/politica-de-privacidade/page.tsx`
- Create: `src/app/(frontend)/termos-de-uso/page.tsx`
- Create: `src/app/(frontend)/not-found.tsx`
- Create: `src/app/(frontend)/[...path]/page.tsx`
- Create: `src/modules/site/redirects/validate-public-redirect.ts`
- Test: `tests/unit/pages/quote-gate.test.tsx`
- Test: `tests/unit/site/redirects.test.ts`
- Test: `tests/e2e/public-errors.spec.ts`

- [ ] **Step 1: Test the quote gate**

Exact copy:

> O formulário detalhado ainda não está disponível. Fale com a Designer Inox Brasil pelo WhatsApp e envie uma descrição da necessidade. Fotos, medidas ou plantas ajudam na avaliação inicial. Projetos complexos podem exigir levantamento técnico.

Assert no `input`, `textarea`, upload or submit button.

- [ ] **Step 2: Test legal and redirect gating**

A missing legal document returns 404 and is absent from the footer. Redirect source and target must start with one `/`, target cannot start `//`, and source cannot equal target.

- [ ] **Step 3: Implement**

`QuoteGate` rendersiza a cópia exata da Step 1, um `WhatsAppLink` com contexto `general` e nenhum controle de coleta. `/orcamento` apenas compõe esse componente; o Plano 4 o mantém como fallback quando o gate de privacidade estiver fechado. The catch-all resolves an approved redirect and calls `permanentRedirect()` or `redirect()`; otherwise calls `notFound()`. The 404 offers Home, Soluções and WhatsApp, with Projects only when public projects exist.

- [ ] **Step 4: Verify**

Expected: no form fields, safe redirect succeeds, unsafe redirect is rejected, unknown route has 404 status and one H1.

- [ ] **Step 5: Commit**

```bash
git add 'src/app/(frontend)' src/components/conversion/QuoteGate.tsx src/components/legal src/modules/site/redirects tests
git commit -m "feat: add quote gate legal routes and public errors"
```

### Task 10: Metadata, JSON-LD, sitemap, robots e manifest

**Files:**

- Create: `src/modules/seo/site-url.ts`
- Create: `src/modules/seo/build-metadata.ts`
- Create: `src/modules/seo/structured-data.ts`
- Create: `src/components/seo/StructuredData.tsx`
- Create: `src/app/sitemap.ts`
- Create: `src/app/robots.ts`
- Create: `src/app/manifest.ts`
- Create: `src/app/(frontend)/opengraph-image.tsx`
- Modify: `.env.example`
- Test: `tests/unit/seo/metadata.test.ts`
- Test: `tests/unit/seo/structured-data.test.ts`
- Test: `tests/unit/seo/sitemap.test.ts`
- Test: `tests/e2e/technical-seo.spec.ts`

**Configuration:**

```dotenv
SITE_URL=http://127.0.0.1:3000
INDEX_PUBLIC_SITE=false
```

Production throws if `SITE_URL` is not HTTPS. Indexação só é liberada com `INDEX_PUBLIC_SITE=true`.

- [ ] **Step 1: Test canonical, social metadata and structured-data truthfulness**

Assert unique titles, canonical without query/hash, one H1 per template, `openGraph.title`, `openGraph.description`, image and URL, and `twitter.card === 'summary_large_image'`. Home emits `Organization + WebSite + WebPage`; solution emits `Service + BreadcrumbList + WebPage`; project with authorized first-party media emits `BreadcrumbList + WebPage + ImageObject`; article emits `Article` only when published. No address, coordinate or `LocalBusiness` appears until a complete visible address exists; no page emits `FAQPage`; illustrative images are never identified as projects. `/orcamento` while gated and every 404 use `robots: { index: false, follow: false }`.

- [ ] **Step 2: Test sitemap conditions**

Home, Empresa, Soluções, seven services, Segmentos and three segment details appear. Projects, legal documents, `/conteudos`, article details and `/orcamento` do not appear initially. Published fixtures add `/projetos`, project detail, `/conteudos`, article detail and authorized legal URLs; draft/approved/archived/trashed fixtures never do.

- [ ] **Step 3: Implement metadata routes**

Manifest:

```ts
{
  name: 'Designer Inox Brasil',
  short_name: 'Designer Inox',
  start_url: '/',
  display: 'browser',
  background_color: '#06090D',
  theme_color: '#0D1218',
  icons: [
    { src: '/brand/icon-32.png', sizes: '32x32', type: 'image/png' },
    { src: '/brand/icon-180.png', sizes: '180x180', type: 'image/png' },
  ],
}
```

Robots disallows `/admin`, `/api` and `/preview` when indexing is active; prelaunch disallows `/`.

- [ ] **Step 4: Verify**

Run:

```bash
npx vitest run --config ./vitest.config.mts tests/unit/seo
npx playwright test tests/e2e/technical-seo.spec.ts
```

Expected: metadata and XML endpoints pass; prohibited or unpublished URLs are absent.

- [ ] **Step 5: Commit**

```bash
git add .env.example src/app src/components/seo src/modules/seo tests
git commit -m "feat: add truthful technical SEO"
```

### Task 11: Cache público e invalidação on-demand

**Files:**

- Modify: `next.config.ts`
- Create: `src/modules/content/public/cache-tags.ts`
- Create: `src/modules/content/public/queries.ts`
- Create: `src/modules/content/revalidation/types.ts`
- Create: `src/modules/content/revalidation/paths.ts`
- Create: `src/modules/content/revalidation/port.ts`
- Create: `src/modules/content/revalidation/cdn-port.ts`
- Create: `src/modules/content/revalidation/composition-root.ts`
- Create: `src/modules/content/revalidation/next-content-invalidation.ts`
- Test: `tests/unit/content/cache-tags.test.ts`
- Test: `tests/unit/content/revalidation-paths.test.ts`
- Test: `tests/integration/content/public-cache.test.ts`

**Interfaces:**

```ts
export type ContentChange = {
  collection:
    | 'pages'
    | 'services'
    | 'segments'
    | 'projects'
    | 'media'
    | 'clients'
    | 'client-authorizations'
    | 'testimonials'
    | 'faqs'
    | 'categories'
    | 'articles'
    | 'legal-documents'
    | 'redirects'
    | 'site-settings'
    | 'navigation'
    | 'footer'
  operation:
    | 'publish'
    | 'update'
    | 'unpublish'
    | 'archive'
    | 'revoke'
    | 'delete'
    | 'restore'
  slug?: string
  previousSlug?: string
  relatedPaths: readonly string[]
}

export interface ContentInvalidationPort {
  invalidate(change: ContentChange): Promise<void>
}

export interface CdnPurgePort {
  purge(paths: readonly string[]): Promise<void>
}
```

- [ ] **Step 1: Test affected tags and paths**

A project change invalidates its current/previous detail paths, `/projetos`, `/`, related segment paths and `/sitemap.xml`. A service change invalidates its route, `/solucoes-em-inox`, `/` and related segment paths. Navigation/footer/settings invalidate the frontend layout.

- [ ] **Step 2: Configure cache profile**

```ts
cacheLife: {
  'public-editorial': {
    stale: 30,
    revalidate: 30,
    expire: 60,
  },
}
```

- [ ] **Step 3: Implement tagged cached queries**

Each function uses `'use cache'`, `cacheLife('public-editorial')` and stable tags. Preview and draft repositories never call these functions.

- [ ] **Step 4: Implement immediate removal across application and CDN**

`NextContentInvalidation` recebe `CdnPurgePort`; `composition-root.ts` injeta um typed no-op apenas em development/test e lança `NOOP_CDN_FORBIDDEN_IN_PRODUCTION` se esse binding for usado em produção. O Plano 5 modifica exatamente esse composition root para Cloudflare. Para `unpublish`, `archive` e `revoke`, chama `revalidateTag(tag, { expire: 0 })`, `revalidatePath(path)` e `cdn.purge(paths)`. O port resolve somente depois das três camadas. Ele é assíncrono e nunca é chamado por hook dentro da transação editorial: o publication worker/saga durável do Plano 3 mantém a operação pendente, registra alerta sem segredo e repete com backoff até concluir ou exigir intervenção.

- [ ] **Step 5: Verify**

Expected: cached content refreshes within 60 seconds without a hook and disappears on the first request after explicit revoke.

- [ ] **Step 6: Commit**

```bash
git add next.config.ts src/modules/content tests
git commit -m "feat: add bounded public content revalidation"
```

### Task 12: Acessibilidade, responsividade e budgets finais

**Files:**

- Create: `tests/e2e/public-keyboard.spec.ts`
- Create: `tests/e2e/public-a11y.spec.ts`
- Create: `tests/e2e/public-responsive.spec.ts`
- Create: `scripts/verify-build-isolation.mjs`
- Modify: `lighthouserc.cjs`
- Modify: `package.json`
- Create: `docs/qa/public-site-checklist.md`

- [ ] **Step 1: Add keyboard journeys**

Cover skip link, mega menu, mobile navigation, FAQ, project lightbox, before/after control, WhatsApp and focus restoration.

- [ ] **Step 2: Add viewport matrix**

Run Home, Cozinhas, Empresa, Segmento and Orçamento at `320, 360, 390, 768, 1024, 1440, 1920`; assert no horizontal overflow and 44 px interactive targets. At 320 and 390 px, compare `boundingBox()` values and prove the floating WhatsApp does not intersect footer, form controls, navigation or the currently focused element.

- [ ] **Step 3: Add axe coverage**

Run Home, one solution, one segment, quote gate and 404 in Chromium, Firefox and WebKit.

Also verify the header is transparent while the hero sentinel intersects the viewport and changes to opaque graphite after it leaves; the transition must be disabled under `prefers-reduced-motion`.

- [ ] **Step 4: Configure Lighthouse**

Use três runs por URL para `/`, `/cozinhas-industriais` e `/orcamento`, sempre com `aggregationMethod: 'median'`. Em `assertMatrix`, Home/solução exigem `0.90` performance e `0.95` acessibilidade, boas práticas e SEO; `/orcamento` neste plano ainda é o `QuoteGate` deliberadamente `noindex`, portanto exige somente performance/acessibilidade/boas práticas e deixa `categories:seo` off. O E2E técnico exige o `noindex` correto, em vez de tratar a indexabilidade bloqueada como falha. O Plano 5 mede a mesma rota com o gate jurídico sintético/real aberto e então aplica SEO ≥ 0.95. Adicionar projeto somente depois de existir publicação autorizada.

- [ ] **Step 5: Run complete verification**

Adicionar `"build:isolated": "node scripts/verify-build-isolation.mjs"`. O script cria um ambiente allowlisted sem `DATABASE_URL`, `PAYLOAD_SECRET`, S3, SMTP ou outros segredos, define `CONTENT_ACCESS_SENTINEL=throw` e executa `npm run build`. Todo método dos repositories começa rejeitando esse sentinel com `BUILD_CONTENT_ACCESS_FORBIDDEN`; portanto o build só passa quando nenhuma leitura de conteúdo ocorre.

```bash
npm run lint
npm run typecheck
npm run test:contracts
npm run test:unit
npm run test:int
npm run build:isolated
npm run test:a11y
npm run test:responsive
npm run test:e2e
npm run lighthouse
npm run security:audit
npm run security:signatures
```

Expected: all commands exit `0`; no serious/critical axe violations; all Lighthouse assertions pass.

- [ ] **Step 6: Commit**

```bash
git add tests scripts/verify-build-isolation.mjs lighthouserc.cjs docs/qa package.json package-lock.json
git commit -m "test: verify public site quality gates"
```

O ponto de troca solicitado pelo Plano 3 é, exatamente, `src/modules/content/public/composition-root.ts`.
