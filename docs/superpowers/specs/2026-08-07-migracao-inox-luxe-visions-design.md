# Migração para a stack `inox-luxe-visions`

**Data:** 2026-08-07
**Status:** aprovado
**Repositório de origem:** https://github.com/felipemenezes25000-spec/inox-luxe-visions

## Problema

O site atual (`designer-inox-brasil`) é um gerador estático em Node que produz 21 páginas
HTML com SEO completo e 28 fotos tratadas — 18 delas obras reais da empresa. Funciona, mas
o acabamento visual está atrás do que o repositório `inox-luxe-visions` alcançou.

O `inox-luxe-visions` tem um design system coeso ("Inox Especular") e componentes React
polidos, mas é uma **landing de página única**: só `src/routes/index.tsx`. Não tem as 13
páginas de serviço, as 7 institucionais, o sitemap, as fotos reais nem a marca.

Adotar um pelo outro perde metade. A migração tem que juntar os dois.

## Decisões tomadas

| Decisão | Escolha | Por quê |
|---|---|---|
| Escopo | Trocar a stack **e** migrar todo o conteúdo | Nenhuma das 21 páginas nem das 28 fotos pode se perder |
| Servidor | Pré-renderizado (HTML estático no build) | Conteúdo é igual para todo visitante; mantém custo zero, SEO e o modelo de cache atual |
| Páginas de serviço | Uma rota dirigida por dados | 13 páginas com a mesma estrutura; `services.ts` já modela tudo |
| Fontes | Auto-hospedadas | O repo novo puxa do Google Fonts, o que quebra a CSP e adiciona requisição bloqueante |

## Arquitetura alvo

### Estrutura

```
src/
  routes/
    __root.tsx              documento, fontes, favicons, JSON-LD global
    index.tsx               landing (10 seções do repo novo, intactas)
    servicos/index.tsx      índice dos 13 serviços
    $servico.tsx            13 páginas de serviço, dirigidas por dados
    segmentos/index.tsx     índice dos 4 segmentos
    segmentos/$segmento.tsx 4 páginas de segmento, dirigidas por dados
    clientes.tsx
    empresa.tsx
    orcamento.tsx
    politica-de-privacidade.tsx
    termos-de-uso.tsx
  components/
    site/                   as 10 seções do repo novo
    ui/                     shadcn (46 componentes)
    Photo.tsx               <picture> responsivo + selo de proveniência
  content/
    site.ts                 marca, contato, empresa, clientes, catálogo de fotos
    services.ts             13 serviços
    segments.ts             4 segmentos
  styles.css                Inox Especular + tokens de accent do conteúdo
public/
  photos/                   197 arquivos (28 fotos × 3 tamanhos × 3 formatos)
  brand/                    lockups, símbolos, favicons
  fonts/                    Archivo + JetBrains Mono (woff2)
```

### Removido

`scripts/generate.mjs`, `scripts/check.mjs`, `scripts/serve.mjs`, `src/templates/` e os
20 diretórios de HTML na raiz. O conteúdo deles não se perde: mora em `src/content/`.

`scripts/images.mjs` é mantido — é o pipeline que gera as variantes responsivas das fotos.

## Rotas e URLs

Toda URL indexada se mantém, com barra final. Esta tabela é o contrato da migração.

**Serviços (13)** — `$servico.tsx`, uma rota dirigida por `services.ts`:

`/cozinhas-industriais/` · `/equipamentos-em-inox/` · `/projeto-tecnico-e-fabricacao-cnc/` ·
`/reformas-e-modernizacoes/` · `/coifas-ventilacao-e-exaustao/` · `/saponificacao-em-exaustao/` ·
`/refrigeracao-industrial/` · `/aquecimento-industrial/` · `/sistemas-de-co2/` ·
`/automacao-eletrica/` · `/sistemas-integrados-em-inox/` · `/manutencao/` ·
`/equipamentos-hospitalares/`

**Segmentos (4)** — `segmentos/$segmento.tsx`, dirigida por `segments.ts`:

`/segmentos/restaurantes-e-cozinhas-profissionais/` · `/segmentos/hotelaria-e-alimentacao-coletiva/` ·
`/segmentos/producao-e-varejo-de-alimentos/` · `/segmentos/saude-e-ambientes-hospitalares/`

**Institucionais (7):** `/servicos/` · `/segmentos/` · `/clientes/` · `/empresa/` ·
`/orcamento/` · `/politica-de-privacidade/` · `/termos-de-uso/`

**Home (1):** `/`

Total: **25 páginas** + `404`. Confere com as 25 `<loc>` do `sitemap.xml` atual.

### A rota dinâmica

Os slugs de serviço vivem na raiz (`/cozinhas-industriais/`, não `/servicos/cozinhas-industriais/`),
então `$servico.tsx` fica na raiz das rotas. No TanStack Router rota estática vence rota
dinâmica, então `/clientes/` continua resolvendo para `clientes.tsx`. Slug desconhecido
precisa lançar `notFound()` — sem isso, qualquer URL inventada renderiza uma página vazia
com status 200, que é pior que um 404 para o crawler.

A pré-renderização recebe a lista explícita dos 13 slugs, derivada de `services.ts`.

### Navegação

A home mantém as âncoras das seções (`#solucoes`, `#segmentos`, `#clientes`, `#metodo`,
`#duvidas`). Cada seção ganha um link para a página correspondente. O menu do topo aponta
para as páginas reais, não para as âncoras — é o que sustenta a indexação.

## Conteúdo

`src/content/*.mjs` é portado para TypeScript preservando todos os campos. Nenhum texto é
reescrito: o conteúdo veio dos flyers da empresa e foi enriquecido no commit `46fd652`.

Campos por serviço: `slug`, `category`, `accent`, `title`, `navTitle`, `short`, `meta`,
`lead`, `photo`, `gallery`, `when`, `deliverables`, `decisions`, `faq`, `related`.

Os dados de contato do repo novo (`src/lib/site-data.ts`) conferem com os atuais — CNPJ
39.597.817/0001-24, (61) 99602-4701, contato@designerinoxbrasil.com.br. `site.ts` do
projeto atual é a fonte da verdade por ser mais completo (endereço, horário, emergência,
grupos de clientes, catálogo de fotos, aviso legal).

## Fotos e proveniência

As 28 fotos vão para `public/photos/` mantendo 3 tamanhos (640/1280/1920) × 3 formatos
(avif/webp/jpg). O componente `<Photo>` lê o catálogo de `site.ts` e monta o `<picture>`
com fallback `avif → webp → jpg`.

**A regra de proveniência é código, não disciplina:**

- `own: true` → legenda "Projeto Designer Inox", sem aviso de ilustrativa
- caso contrário → crédito do fotógrafo + rótulo de imagem ilustrativa

O `legalNotice` de `site.ts` aparece no rodapé. Apresentar foto de banco como obra da
empresa é falso e a marcação é o que impede isso.

O design novo é escuro e as fotos foram tratadas para layout claro. Cada seção com foto é
revisada renderizada; contraste e véu são ajustados onde necessário.

## Design system

`src/styles.css` do repo novo é mantido: onyx, grafite, titânio, mineral, azul-sinal,
raio 0, Archivo + JetBrains Mono.

`services.ts` usa `accent` por serviço (`steel`, `mint`, `volt`, glacial, âmbar) para
codificar a natureza térmica/elétrica. Esses tokens são remapeados sobre a paleta escura —
não se importa a paleta clara antiga, que brigaria com o sistema novo.

### Marca

O repo novo não tem logo: o `SiteNav` é texto puro. O kit atual (`assets/brand/`) migra
para `public/brand/` e entra no header, no rodapé e nos favicons. Existe lockup negativo,
que é o correto para fundo escuro.

### Fontes

O repo novo carrega Archivo e JetBrains Mono de `fonts.googleapis.com`. Isso quebra a CSP
(`font-src 'self'`, `style-src 'self'`) e adiciona requisição externa bloqueante no
caminho crítico. As duas famílias são baixadas como woff2 e servidas de `public/fonts/`,
com `@font-face` e `font-display: swap`.

Inter e Sora, do projeto atual, saem — o design novo não as usa.

## SEO

- `head()` por rota: title, description, canonical, Open Graph
- `sitemap.xml` e `robots.txt` regerados no build a partir da lista de rotas
- JSON-LD: Organization/LocalBusiness na home, Service nas páginas de serviço, FAQPage
  onde houver FAQ
- `trailingSlash: true` no router, para que canonical e links internos batam com as URLs
  indexadas
- Redirect 308 `/solucoes-em-inox` → `/servicos/` preservado

## Deploy

Vercel, projeto **designer-inox-cinematic** (`prj_ax6FzU9E8ldg3A1RynFH1jhghO7e`).

`vercel.json` passa a ter `buildCommand: "npm run build"` e `outputDirectory` apontando
para a saída pré-renderizada. `cleanUrls`, `trailingSlash`, redirects e headers de
segurança são mantidos.

O preset do nitro é trocado de **cloudflare** (padrão do `@lovable.dev/vite-tanstack-config`)
para estático.

### CSP

A política atual tem `script-src 'self'`. O React injeta script inline de hidratação e,
em site estático, nonce não é possível — nonce exige gerar o valor por requisição, o que
exige servidor. `script-src` passa a incluir `'unsafe-inline'`. O restante da política
fica intacto.

É uma regressão real de segurança, aceita conscientemente: é o custo de trocar HTML gerado
por React hidratado, e é o que praticamente todo site React estático faz.

### Cache

O header `immutable` vale por caminho, não por status: um 404 servido sob um caminho
`immutable` fica um ano no cache. As regras de cache passam a cobrir `/photos/`,
`/brand/`, `/fonts/` e a pasta de assets do Vite. **As fotos precisam responder 200 antes
de o deploy ser considerado pronto.**

## Verificação

Nenhuma etapa é dada por concluída sem evidência:

1. `npm run build` conclui e gera 25 arquivos HTML — contados, não presumidos
2. Cada uma das 25 URLs resolve com o conteúdo correto
3. Chrome headless em home, serviço, índice e legal — desktop e mobile
4. Fotos, marca e fontes respondem 200
5. JSON-LD válido; canonical com barra final

O painel de browser roda com viewport 0 neste ambiente; a verificação visual usa Chrome
headless com perfil próprio por chamada.

## Riscos

**Divergência do Lovable.** Este repositório não é o conectado ao Lovable. Depois da
migração, edições no Lovable não chegam aqui e vice-versa. Se o Lovable continuar em uso,
a estratégia muda e precisa ser rediscutida antes.

**O wrapper do Lovable.** `vite.config.ts` usa `@lovable.dev/vite-tanstack-config`, que
embrulha o nitro e pode não expor a configuração de pré-renderização. Se não expuser, é
substituído pelo `defineConfig` padrão do TanStack Start.

**Volume.** 13 páginas de serviço, 4 de segmento e 7 institucionais para reestilizar —
24 das 25. Só a home chega pronta do repo novo. É o grosso do trabalho e será entregue
em etapas.

**Fotos em fundo escuro.** Tratadas para layout claro. Risco de contraste ruim; mitigado
pela revisão renderizada de cada seção.

## Fora de escopo

- Reescrever textos institucionais
- Novas fotos ou novo tratamento de imagem
- Formulário com backend — `/orcamento/` continua levando ao WhatsApp
- CMS ou área administrativa
