# Migração para TanStack Start — Plano de Implementação

> **Para trabalhadores agênticos:** SUB-SKILL OBRIGATÓRIA: use superpowers:subagent-driven-development (recomendado) ou superpowers:executing-plans para implementar este plano tarefa por tarefa. Os passos usam checkbox (`- [ ]`) para acompanhamento.

**Goal:** Substituir o gerador estático em Node pelo app TanStack Start do repositório `inox-luxe-visions`, preservando as 25 URLs indexadas, as 28 fotos com marcação de proveniência, a marca e o deploy estático na Vercel.

**Architecture:** O app React é pré-renderizado em HTML no build — a Vercel continua servindo arquivos, sem servidor. Todo o conteúdo institucional (13 serviços, 4 segmentos, clientes, empresa) vive em módulos TypeScript tipados em `src/content/`, e as páginas são templates dirigidos por esses dados: 13 páginas de serviço saem de um arquivo, 4 de segmento saem de outro. O design system "Inox Especular" e os primitivos de seção vêm intactos do repositório novo.

**Tech Stack:** TanStack Start · TanStack Router · React 19 · Vite 8 · Tailwind CSS 4 · shadcn/ui · nitro (preset estático) · Vercel

**Spec:** [`docs/superpowers/specs/2026-08-07-migracao-inox-luxe-visions-design.md`](../specs/2026-08-07-migracao-inox-luxe-visions-design.md)

**Origem clonada:** `C:\Users\Felipe\AppData\Local\Temp\claude\C--Users-Felipe-Documents-DESIGNER-INOX\ba87fc49-095a-4a5d-8870-1de33c94db5b\scratchpad\inox-luxe-visions`

Neste documento essa pasta é referida como `$ORIGEM`. Se ela não existir, reclonar:

```bash
git clone --depth 1 https://github.com/felipemenezes25000-spec/inox-luxe-visions.git
```

---

## Estrutura de arquivos

| Arquivo | Responsabilidade |
|---|---|
| `src/content/site.ts` | Marca, contato, empresa, grupos de clientes, catálogo de fotos, aviso legal |
| `src/content/services.ts` | 13 serviços + 4 categorias |
| `src/content/segments.ts` | 4 segmentos |
| `src/content/types.ts` | Tipos `Service`, `Segment`, `Photo`, `ClientGroup` |
| `src/components/site/primitives.tsx` | `SectionShell`, `SectionHeading`, `MagneticLink`, `Ticks` — do repo novo |
| `src/components/site/Photo.tsx` | `<picture>` responsivo + selo de proveniência |
| `src/components/site/PageShell.tsx` | Casca comum: nav, `main`, rodapé, skip-link, reveal |
| `src/components/site/PageHero.tsx` | Cabeçalho das páginas internas |
| `src/components/site/ListSection.tsx` | Seção de lista numerada, reutilizada por serviço e segmento |
| `src/components/site/CardGrid.tsx` | Grid de cards com link, reutilizado pelos dois índices |
| `src/components/site/GallerySection.tsx` | Galeria de fotos da execução |
| `src/components/site/FaqSection.tsx` | Bloco de FAQ, reutilizado por serviço e home |
| `src/components/site/RelatedSection.tsx` | Serviços relacionados |
| `src/components/site/CtaSection.tsx` | CTA de fim de página |
| `src/components/site/LegalDoc.tsx` | Texto corrido dos documentos legais |
| `src/lib/accent.ts` | Mapa `accent` → classe de cor, para o Tailwind enxergar as classes |
| `src/lib/seo.ts` | Monta `head()`: title, description, canonical, OG, JSON-LD |
| `src/routes/$servico.tsx` | 13 páginas de serviço |
| `src/routes/segmentos/$segmento.tsx` | 4 páginas de segmento |
| `scripts/check.mjs` | Valida o HTML pré-renderizado — o teste do projeto |
| `scripts/sitemap.ts` | Gera `sitemap.xml` e `robots.txt` a partir das rotas |

## Estratégia de teste

Este projeto não tem framework de teste e não vai ganhar um: o produto é HTML estático, e o
que importa é o HTML que sai do build. O teste é `scripts/check.mjs`, que já existe e cobre
link interno morto, imagem sem `alt`, asset inexistente, canonical errado e id duplicado.

Ele é adaptado na Task 17 para ler a pasta pré-renderizada em vez da raiz do repositório.
Até lá, cada tarefa é verificada rodando o build e inspecionando a saída — passos explícitos
em cada tarefa, nunca "confira se funcionou".

---

## Task 1: Branch e stack base

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `components.json`, `eslint.config.js`, `.prettierrc`, `.prettierignore`
- Create: `src/routes/`, `src/components/`, `src/hooks/`, `src/lib/`, `src/styles.css`, `src/router.tsx`, `src/server.ts`, `src/start.ts`
- Delete: nenhum ainda — a limpeza é a Task 19

- [ ] **Step 1: Criar a branch**

```bash
git checkout -b feat/migracao-tanstack-start
```

- [ ] **Step 2: Preservar o conteúdo atual antes de sobrescrever `src/`**

O `src/` atual tem o conteúdo institucional. Ele será portado na Task 2, então move para
um nome temporário em vez de deixar o copy sobrescrever:

```bash
git mv src/content src/content-legacy
git mv src/templates src/templates-legacy
git commit -m "chore: reserva o conteúdo legado antes de instalar a stack nova"
```

- [ ] **Step 3: Copiar a stack do repositório de origem**

Copiar de `$ORIGEM` para a raiz do projeto:

- `package.json`, `vite.config.ts`, `tsconfig.json`, `components.json`
- `eslint.config.js`, `.prettierrc`, `.prettierignore`, `bunfig.toml`
- `src/routes/`, `src/components/`, `src/hooks/`, `src/lib/`, `src/assets/`
- `src/styles.css`, `src/router.tsx`, `src/server.ts`, `src/start.ts`, `src/routeTree.gen.ts`

**Não copiar:** `AGENTS.md` (é aviso do Lovable e este repositório não está conectado),
`.lovable/`, `bun.lock`, `README.md`, `public/` (o `public/` deste projeto é montado na Task 3).

- [ ] **Step 4: Ajustar o `package.json`**

Trocar o campo `name` — vem como `tanstack_start_ts`, que é o default do template:

```json
{
  "name": "designer-inox-brasil",
  "version": "3.0.0",
  "private": true,
  "type": "module",
  "description": "Site institucional da Designer Inox Brasil — TanStack Start, pré-renderizado."
}
```

Manter `sideEffects: false` e todas as dependências. Adicionar `sharp` em `devDependencies`
— `scripts/images.mjs` depende dele e continua no projeto:

```json
"sharp": "^0.33.5"
```

- [ ] **Step 5: Atualizar o `.gitignore`**

O `.gitignore` atual é do site estático. Acrescentar as entradas da stack nova:

```
node_modules/
.output/
.nitro/
.tanstack/
dist/
*.local
```

- [ ] **Step 6: Instalar e subir o dev server**

```bash
npm install
```

Esperado: instalação conclui sem erro de peer dependency que impeça o build.

- [ ] **Step 7: Verificar que a landing renderiza**

```bash
npm run dev
```

Esperado: servidor sobe e `http://localhost:3000` mostra a landing com as 10 seções.
Como o painel de browser roda com viewport 0 neste ambiente, verificar com Chrome headless:

```bash
"/c/Program Files/Google/Chrome/Application/chrome.exe" --headless --disable-gpu --screenshot=/tmp/home.png --window-size=1440,2400 --user-data-dir=/tmp/chrome-task1 http://localhost:3000
```

Esperado: captura mostra o hero escuro com o título e o menu. Encerrar o dev server.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: instala a stack TanStack Start do inox-luxe-visions"
```

---

## Task 2: Portar o conteúdo para TypeScript

**Files:**
- Create: `src/content/types.ts`, `src/content/site.ts`, `src/content/services.ts`, `src/content/segments.ts`
- Delete: `src/content-legacy/`

- [ ] **Step 1: Escrever os tipos**

Criar `src/content/types.ts`:

```ts
/** Codifica a natureza térmica/elétrica do item na cor de acento. */
export type Accent = "steel" | "mint" | "volt" | "ember" | "glacial" | "amber";

export interface FaqItem {
  q: string;
  a: string;
}

export interface Service {
  slug: string;
  category: string;
  accent: Accent;
  title: string;
  navTitle: string;
  short: string;
  meta: string;
  lead: string;
  photo: string;
  gallery: string[];
  when: string[];
  deliverables: string[];
  decisions: string[];
  faq: FaqItem[];
  related: string[];
  /** Só `sistemas-integrados-em-inox`: agrega os demais sistemas. */
  hub?: boolean;
  /** Só serviços com linha de equipamentos declarada. */
  specialties?: string[];
}

export interface ServiceCategory {
  id: string;
  label: string;
  note: string;
}

export interface SegmentPressure {
  label: string;
  note: string;
}

export interface Segment {
  slug: string;
  accent: Accent;
  title: string;
  navTitle: string;
  short: string;
  meta: string;
  lead: string;
  photo: string;
  pressures: SegmentPressure[];
  priorities: string[];
  services: string[];
}

export interface PhotoEntry {
  alt: string;
  credit: string;
  /** `true` = obra real da empresa; muda a legenda e remove o aviso de ilustrativa. */
  own?: boolean;
}

export interface ClientGroup {
  sector: string;
  note: string;
  accent: Accent;
  clients: string[];
}
```

- [ ] **Step 2: Portar os três módulos de conteúdo**

Copiar `src/content-legacy/site.mjs` → `src/content/site.ts`,
`services.mjs` → `services.ts`, `segments.mjs` → `segments.ts`.

Regras da conversão, aplicadas a cada arquivo:

1. Preservar **todos** os comentários. Eles documentam decisões editoriais e as duas
   interpretações pendentes sobre a lista de clientes.
2. Preservar **todo** o texto. Nenhuma frase é reescrita.
3. Anotar os tipos nos exports:

```ts
import type { Service, ServiceCategory } from "./types";

export const categories: ServiceCategory[] = [ /* … */ ];
export const services: Service[] = [ /* … */ ];
```

4. Em `site.ts`, tipar o catálogo e os grupos:

```ts
import type { ClientGroup, PhotoEntry } from "./types";

export const photos: Record<string, PhotoEntry> = { /* … */ };
export const clientGroups: ClientGroup[] = [ /* … */ ];
```

- [ ] **Step 3: Adicionar os lookups por slug**

No fim de `src/content/services.ts`:

```ts
export const serviceBySlug = new Map(services.map((s) => [s.slug, s]));
export const serviceSlugs = services.map((s) => s.slug);
```

No fim de `src/content/segments.ts`:

```ts
export const segmentBySlug = new Map(segments.map((s) => [s.slug, s]));
export const segmentSlugs = segments.map((s) => s.slug);
```

- [ ] **Step 4: Verificar que os tipos fecham**

```bash
npx tsc --noEmit
```

Esperado: nenhum erro. Se acusar `accent` fora da união, o valor real está faltando em
`Accent` — acrescentar o valor ao tipo, nunca alterar o dado.

- [ ] **Step 5: Verificar a contagem**

Criar `scripts/count.ts`:

```ts
import { services } from "../src/content/services";
import { segments } from "../src/content/segments";
import { photos } from "../src/content/site";

console.log(
  `serviços ${services.length} | segmentos ${segments.length} | fotos ${Object.keys(photos).length}`,
);
```

```bash
npx tsx scripts/count.ts
```

Esperado exatamente: `serviços 13 | segmentos 4 | fotos 28`

Número diferente significa entrada perdida na conversão. Apagar `scripts/count.ts` depois
de conferir.

- [ ] **Step 6: Remover o conteúdo legado e commitar**

```bash
git rm -r src/content-legacy
git add -A
git commit -m "feat: porta o conteúdo institucional para TypeScript tipado"
```

---

## Task 3: Assets — fotos, marca e fontes

**Files:**
- Create: `public/photos/`, `public/brand/`, `public/fonts/`, `public/favicon.ico`
- Modify: `src/routes/__root.tsx`, `src/styles.css`

- [ ] **Step 1: Mover fotos e marca**

```bash
mkdir -p public/photos public/brand public/fonts
git mv assets/img/photos/* public/photos/
git mv assets/img/og-default.jpg public/
git mv assets/brand/* public/brand/
```

- [ ] **Step 2: Conferir a contagem**

```bash
ls public/photos | wc -l && ls public/brand | wc -l
```

Esperado: `197` fotos e `16` arquivos de marca. Número diferente significa arquivo perdido
no move — parar e investigar antes de seguir.

- [ ] **Step 3: Baixar as fontes**

O repositório de origem carrega Archivo e JetBrains Mono do Google Fonts, o que quebra a
CSP (`font-src 'self'`) e bloqueia a renderização. Baixar os woff2 latinos para
`public/fonts/`:

- `archivo-latin-400.woff2`, `archivo-latin-500.woff2`, `archivo-latin-600.woff2`, `archivo-latin-700.woff2`
- `jetbrains-mono-latin-400.woff2`, `jetbrains-mono-latin-500.woff2`

- [ ] **Step 4: Declarar as fontes no CSS**

No topo de `src/styles.css`, logo após os `@import`:

```css
@font-face {
  font-family: "Archivo";
  font-style: normal;
  font-weight: 400 700;
  font-display: swap;
  src: url("/fonts/archivo-latin-400.woff2") format("woff2");
}

@font-face {
  font-family: "JetBrains Mono";
  font-style: normal;
  font-weight: 400 500;
  font-display: swap;
  src: url("/fonts/jetbrains-mono-latin-400.woff2") format("woff2");
}
```

Repetir o bloco para cada peso baixado, ajustando `font-weight` e a URL.

- [ ] **Step 5: Remover o Google Fonts do `__root.tsx`**

Em `src/routes/__root.tsx`, apagar as três entradas de `links`:

```ts
{ rel: "preconnect", href: "https://fonts.googleapis.com" },
{ rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
{ rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" },
```

Substituir por preloads das duas fontes críticas:

```ts
{ rel: "preload", href: "/fonts/archivo-latin-400.woff2", as: "font", type: "font/woff2", crossOrigin: "anonymous" },
{ rel: "preload", href: "/fonts/archivo-latin-700.woff2", as: "font", type: "font/woff2", crossOrigin: "anonymous" },
```

- [ ] **Step 6: Apontar os favicons para a marca real**

Ainda em `links` de `__root.tsx`, trocar o `favicon.ico` genérico do template:

```ts
{ rel: "icon", href: "/brand/icon-32.png", type: "image/png", sizes: "32x32" },
{ rel: "icon", href: "/brand/icon-16.png", type: "image/png", sizes: "16x16" },
{ rel: "apple-touch-icon", href: "/brand/icon-180.png", sizes: "180x180" },
{ rel: "manifest", href: "/manifest.webmanifest" },
```

Mover o manifest existente: `git mv manifest.webmanifest public/`

- [ ] **Step 7: Verificar que nenhuma requisição externa restou**

```bash
grep -rn "fonts.googleapis\|fonts.gstatic" src/ || echo "OK: nenhuma fonte externa"
```

Esperado: `OK: nenhuma fonte externa`

- [ ] **Step 8: Verificar as fontes renderizadas**

```bash
npm run dev
```

Com o servidor no ar:

```bash
"/c/Program Files/Google/Chrome/Application/chrome.exe" --headless --disable-gpu --screenshot=/tmp/fonts.png --window-size=1440,1200 --user-data-dir=/tmp/chrome-task3 http://localhost:3000
```

Esperado: os títulos aparecem em Archivo (grotesca condensada), não em Helvetica/Arial.
Se caírem no fallback, o `@font-face` não casou — conferir o caminho do arquivo.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: migra fotos, marca e fontes auto-hospedadas"
```

---

## Task 4: Componente Photo com proveniência

**Files:**
- Create: `src/components/site/Photo.tsx`

Este componente carrega uma obrigação legal: foto de banco nunca pode ser apresentada como
obra da empresa. A regra fica no código, não na disciplina de quem escreve a página.

- [ ] **Step 1: Escrever o componente**

Criar `src/components/site/Photo.tsx`:

```tsx
import { photos } from "@/content/site";

type Size = 640 | 1280 | 1920;

const SIZES: Size[] = [640, 1280, 1920];

function srcSet(id: string, ext: "avif" | "webp") {
  return SIZES.map((s) => `/photos/${id}-${s}.${ext} ${s}w`).join(", ");
}

export function Photo({
  id,
  className = "",
  sizes = "100vw",
  priority = false,
  caption = true,
}: {
  id: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  caption?: boolean;
}) {
  const entry = photos[id];
  if (!entry) return null;

  return (
    <figure className={`relative overflow-hidden ${className}`}>
      <picture>
        <source type="image/avif" srcSet={srcSet(id, "avif")} sizes={sizes} />
        <source type="image/webp" srcSet={srcSet(id, "webp")} sizes={sizes} />
        <img
          src={`/photos/${id}-1280.jpg`}
          alt={entry.alt}
          loading={priority ? "eager" : "lazy"}
          decoding={priority ? "sync" : "async"}
          fetchPriority={priority ? "high" : "auto"}
          className="h-full w-full object-cover"
        />
      </picture>

      {caption && (
        <figcaption className="label-mono absolute bottom-0 left-0 bg-background/85 px-3 py-2 text-[0.65rem] backdrop-blur-sm">
          {entry.own ? (
            <span className="text-signal">Projeto Designer Inox</span>
          ) : (
            <span className="text-muted-foreground">
              Imagem ilustrativa · {entry.credit}
            </span>
          )}
        </figcaption>
      )}
    </figure>
  );
}
```

- [ ] **Step 2: Verificar que os dois estados renderizam certo**

Adicionar temporariamente no fim da home (`src/routes/index.tsx`), antes de `</main>`:

```tsx
<Photo id="real-cozinha-industrial" className="aspect-video" />
<Photo id="kitchen" className="aspect-video" />
```

Rodar `npm run dev` e capturar:

```bash
"/c/Program Files/Google/Chrome/Application/chrome.exe" --headless --disable-gpu --screenshot=/tmp/photo.png --window-size=1440,3000 --user-data-dir=/tmp/chrome-task4 http://localhost:3000
```

Esperado: a primeira foto legendada **"Projeto Designer Inox"** em azul-sinal; a segunda
legendada **"Imagem ilustrativa · Bruno Makori"** em cinza. Se as duas saírem iguais, a
condição `entry.own` não está sendo lida.

- [ ] **Step 3: Remover o teste temporário**

Apagar as duas linhas `<Photo>` de `src/routes/index.tsx`.

- [ ] **Step 4: Commit**

```bash
git add src/components/site/Photo.tsx
git commit -m "feat: componente Photo com selo de proveniência"
```

---

## Task 5: Home com o conteúdo real

**Files:**
- Modify: `src/components/site/SiteNav.tsx`, `SiteFooter.tsx`, `Solutions.tsx`, `Segments.tsx`, `Clients.tsx`, `Faq.tsx`, `Hero.tsx`, `References.tsx`
- Delete: `src/lib/site-data.ts`

O repo novo tem os dados duplicados em `src/lib/site-data.ts`, com uma versão resumida do
conteúdo. A fonte da verdade passa a ser `src/content/`.

- [ ] **Step 1: Reapontar os imports**

Em cada componente de `src/components/site/`, trocar:

```ts
import { CONTACT, FRONTS, SEGMENTS, CLIENTS, FAQ, whatsappLink } from "@/lib/site-data";
```

por:

```ts
import { contact, site, company, clientGroups, whatsapp } from "@/content/site";
import { services, categories } from "@/content/services";
import { segments } from "@/content/segments";
```

Mapeamento entre o que o componente usava e o que passa a usar:

| Antes (`site-data.ts`) | Depois (`src/content/`) |
|---|---|
| `CONTACT.phoneLabel` | `contact.whatsappDisplay` |
| `CONTACT.whatsapp` | `whatsapp()` |
| `CONTACT.area` | `site.region` |
| `CONTACT.cnpj` | `company.cnpj` |
| `CONTACT.legalName` | `company.legalName` |
| `FRONTS` | `categories` + `services` agrupados por `category` |
| `SEGMENTS` | `segments` |
| `CLIENTS` | `clientGroups` |
| `FAQ` | manter em `src/content/site.ts` como `export const homeFaq` |
| `whatsappLink(msg)` | `whatsapp(msg)` |

- [ ] **Step 2: Derivar as frentes a partir dos serviços**

`FRONTS` era uma lista escrita à mão que repetia os serviços. Em `Solutions.tsx`, derivar:

```tsx
const fronts = categories.map((cat, i) => {
  const items = services.filter((s) => s.category === cat.id);
  return {
    id: String(i + 1).padStart(2, "0"),
    title: cat.label,
    count: `${items.length} ${items.length === 1 ? "serviço" : "serviços"}`,
    summary: cat.note,
    items,
  };
});
```

E no JSX, trocar o item de texto puro por link para a página do serviço:

```tsx
{f.items.map((item) => (
  <li key={item.slug} className="bg-background py-3">
    <a
      href={`/${item.slug}/`}
      className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-3 text-sm text-foreground/85 transition-colors hover:text-signal"
    >
      <span aria-hidden="true" className="mt-2.5 block h-px w-3 bg-border" />
      <span className="min-w-0">{item.navTitle}</span>
    </a>
  </li>
))}
```

- [ ] **Step 3: Mover o FAQ da home para o conteúdo**

Em `src/content/site.ts`, acrescentar o array `FAQ` de `src/lib/site-data.ts` como
`export const homeFaq: FaqItem[]`, com as quatro perguntas na íntegra.

- [ ] **Step 4: Colocar a marca no cabeçalho e no rodapé**

Em `SiteNav.tsx`, substituir o wordmark de texto pelo lockup negativo — o fundo é escuro:

```tsx
<a href="/" className="flex items-center" aria-label={`${site.name} — página inicial`}>
  <picture>
    <source type="image/avif" srcSet="/brand/lockup-negative.avif" />
    <source type="image/webp" srcSet="/brand/lockup-negative.webp" />
    <img src="/brand/lockup-negative.png" alt={site.name} className="h-8 w-auto sm:h-9" />
  </picture>
</a>
```

Aplicar o mesmo bloco em `SiteFooter.tsx`.

- [ ] **Step 5: Adicionar a navegação para as páginas reais**

Em `SiteNav.tsx`, o menu passa a apontar para páginas, não para âncoras. Usar o `nav`
exportado de `src/content/site.ts` (`/servicos/`, `/segmentos/`, `/clientes/`, `/empresa/`).
As âncoras das seções continuam funcionando dentro da home.

- [ ] **Step 6: Trocar as fotos de banco pelas obras reais**

Em `Hero.tsx` e `References.tsx`, substituir os imports de `src/assets/*.jpg` por `<Photo>`
com ids do catálogo. Preferir obras reais: `real-cozinha-industrial` no hero,
`real-coifa-operacao`, `real-saponificacao`, `real-hospital-cme` nas referências.

- [ ] **Step 7: Adicionar o aviso legal no rodapé**

Em `SiteFooter.tsx`, junto do CNPJ:

```tsx
<p className="mt-6 max-w-3xl text-xs leading-relaxed text-muted-foreground">
  {legalNotice}
</p>
```

- [ ] **Step 8: Remover a fonte duplicada**

```bash
git rm src/lib/site-data.ts
npx tsc --noEmit
```

Esperado: nenhum erro. Erro de import significa que sobrou um componente apontando para o
arquivo removido — reapontar.

- [ ] **Step 9: Verificar a home**

```bash
npm run dev
```

```bash
"/c/Program Files/Google/Chrome/Application/chrome.exe" --headless --disable-gpu --screenshot=/tmp/home-real.png --window-size=1440,6000 --user-data-dir=/tmp/chrome-task5 http://localhost:3000
```

Esperado: logo no topo, 13 serviços listados nas quatro frentes, fotos reais com selo,
CNPJ e aviso legal no rodapé.

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "feat: home consome o conteúdo institucional real"
```

---

## Task 6: Primitivos de página interna

**Files:**
- Create: `src/components/site/PageShell.tsx`, `PageHero.tsx`, `ListSection.tsx`, `FaqSection.tsx`, `RelatedSection.tsx`, `CtaSection.tsx`
- Modify: `src/styles.css`

Sete componentes que as 24 páginas internas compartilham. Escrever uma vez aqui evita
repetir markup em cada rota.

- [ ] **Step 1: PageShell**

Criar `src/components/site/PageShell.tsx`. Toda página interna tem a mesma casca; sem isto
o bloco `SiteNav` / `main` / `SiteFooter` seria repetido 24 vezes:

```tsx
import type { ReactNode } from "react";
import { useReveal } from "@/hooks/use-reveal";
import { SiteNav } from "./SiteNav";
import { SiteFooter } from "./SiteFooter";

export function PageShell({ children }: { children: ReactNode }) {
  useReveal();

  return (
    <div className="min-h-screen bg-background">
      <a
        href="#conteudo"
        className="btn-base btn-solid sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-[60]"
      >
        Ir para o conteúdo principal
      </a>
      <SiteNav />
      <main id="conteudo">{children}</main>
      <SiteFooter />
    </div>
  );
}
```

- [ ] **Step 2: Mapear os acentos do conteúdo para a paleta escura**

`services.ts` e `segments.ts` codificam a natureza térmica/elétrica de cada item em
`accent` — frio em azul glacial, calor em âmbar, elétrica em amarelo, higiene em verde.
Essa informação se perde se tudo renderizar em azul-sinal.

Em `src/styles.css`, dentro do `:root`, acrescentar os acentos derivados da paleta escura:

```css
  --accent-steel: oklch(0.78 0.11 235);
  --accent-glacial: oklch(0.82 0.09 215);
  --accent-amber: oklch(0.8 0.12 65);
  --accent-ember: oklch(0.72 0.15 40);
  --accent-volt: oklch(0.86 0.15 100);
  --accent-mint: oklch(0.82 0.1 165);
```

E no bloco `@theme inline`:

```css
  --color-accent-steel: var(--accent-steel);
  --color-accent-glacial: var(--accent-glacial);
  --color-accent-amber: var(--accent-amber);
  --color-accent-ember: var(--accent-ember);
  --color-accent-volt: var(--accent-volt);
  --color-accent-mint: var(--accent-mint);
```

Criar o helper em `src/lib/accent.ts`:

```ts
import type { Accent } from "@/content/types";

/**
 * Classe de cor por acento. Mapa literal, não template string — o Tailwind
 * varre o código-fonte e não enxerga classe montada em runtime.
 */
const TEXT: Record<Accent, string> = {
  steel: "text-accent-steel",
  glacial: "text-accent-glacial",
  amber: "text-accent-amber",
  ember: "text-accent-ember",
  volt: "text-accent-volt",
  mint: "text-accent-mint",
};

export function accentText(accent: Accent | undefined) {
  return accent ? TEXT[accent] : "text-signal";
}
```

- [ ] **Step 3: PageHero**

Criar `src/components/site/PageHero.tsx`:

```tsx
import type { ReactNode } from "react";
import { Photo } from "./Photo";

export function PageHero({
  eyebrow,
  title,
  lead,
  photo,
  children,
}: {
  eyebrow: string;
  title: string;
  lead: string;
  photo?: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative border-t border-border">
      <div className="mx-auto w-full max-w-[1680px] px-5 sm:px-8 lg:px-14 2xl:px-20">
        <div className="grid gap-12 py-20 sm:py-28 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16 lg:py-32">
          <div className="min-w-0">
            <p className="reveal label-mono flex items-center gap-3" data-reveal>
              <span aria-hidden="true" className="h-px w-8 bg-border" />
              <span>{eyebrow}</span>
            </p>
            <h1
              className="reveal display mt-6 text-[clamp(2.25rem,5.5vw,4.5rem)]"
              data-reveal
              style={{ transitionDelay: "70ms" }}
            >
              {title}
            </h1>
            <p
              className="reveal mt-8 max-w-2xl text-base leading-relaxed text-muted-foreground lg:text-lg"
              data-reveal
              style={{ transitionDelay: "120ms" }}
            >
              {lead}
            </p>
            {children}
          </div>

          {photo && (
            <div className="reveal min-w-0" data-reveal style={{ transitionDelay: "160ms" }}>
              <Photo
                id={photo}
                priority
                className="aspect-[4/3] w-full"
                sizes="(min-width: 1024px) 45vw, 100vw"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: ListSection**

Criar `src/components/site/ListSection.tsx`:

```tsx
import type { Accent } from "@/content/types";
import { accentText } from "@/lib/accent";
import { SectionShell, SectionHeading } from "./primitives";

export function ListSection({
  id,
  index,
  eyebrow,
  title,
  lead,
  items,
  accent,
}: {
  id?: string;
  index: string;
  eyebrow: string;
  title: string;
  lead: string;
  items: string[];
  accent?: Accent;
}) {
  return (
    <SectionShell id={id} className="py-20 sm:py-28">
      <SectionHeading index={index} eyebrow={eyebrow} title={title} lead={lead} align="between" />
      <ul className="mt-14 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => (
          <li
            key={item}
            className="reveal specular flex min-w-0 gap-4 bg-background p-6 sm:p-8"
            data-reveal
            style={{ transitionDelay: `${i * 60}ms` }}
          >
            <span className={`label-mono shrink-0 ${accentText(accent)}`}>
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="min-w-0 text-sm leading-relaxed text-foreground/85">{item}</span>
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}
```

- [ ] **Step 5: FaqSection**

Criar `src/components/site/FaqSection.tsx`:

```tsx
import type { FaqItem } from "@/content/types";
import { SectionShell, SectionHeading } from "./primitives";

export function FaqSection({
  items,
  title = "Antes da proposta.",
  index = "07",
}: {
  items: FaqItem[];
  title?: string;
  index?: string;
}) {
  if (!items.length) return null;

  return (
    <SectionShell id="duvidas" className="py-20 sm:py-28">
      <SectionHeading
        index={index}
        eyebrow="Dúvidas"
        title={title}
        lead="O que costuma ser perguntado antes de uma avaliação técnica."
        align="between"
      />
      <dl className="mt-14 flex flex-col gap-px bg-border">
        {items.map((item, i) => (
          <div
            key={item.q}
            className="reveal bg-background py-8"
            data-reveal
            style={{ transitionDelay: `${i * 60}ms` }}
          >
            <dt className="font-display text-lg font-semibold tracking-tight sm:text-xl">
              {item.q}
            </dt>
            <dd className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
              {item.a}
            </dd>
          </div>
        ))}
      </dl>
    </SectionShell>
  );
}
```

- [ ] **Step 6: RelatedSection**

Criar `src/components/site/RelatedSection.tsx`:

```tsx
import { serviceBySlug } from "@/content/services";
import { SectionShell, SectionHeading } from "./primitives";

export function RelatedSection({ slugs }: { slugs: string[] }) {
  const related = slugs.map((s) => serviceBySlug.get(s)).filter((s) => s !== undefined);
  if (!related.length) return null;

  return (
    <SectionShell className="py-20 sm:py-28">
      <SectionHeading
        index="08"
        eyebrow="Relacionados"
        title="O que costuma entrar junto."
        lead="Serviços que aparecem no mesmo escopo com frequência."
        align="between"
      />
      <ul className="mt-14 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
        {related.map((s, i) => (
          <li
            key={s.slug}
            className="reveal specular group bg-background"
            data-reveal
            style={{ transitionDelay: `${i * 70}ms` }}
          >
            <a href={`/${s.slug}/`} className="flex min-h-full flex-col p-6 sm:p-8">
              <h3 className="font-display text-xl font-bold tracking-tight">{s.navTitle}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.short}</p>
              <span className="label-mono mt-auto inline-flex items-center gap-3 pt-8 transition-colors group-hover:text-signal">
                Ver serviço
                <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-1">
                  →
                </span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}
```

- [ ] **Step 7: CtaSection**

Criar `src/components/site/CtaSection.tsx`:

```tsx
import { whatsapp } from "@/content/site";
import { SectionShell, MagneticLink } from "./primitives";

export function CtaSection({ subject }: { subject: string }) {
  return (
    <SectionShell className="py-20 sm:py-28">
      <div className="reveal" data-reveal>
        <h2 className="display text-[clamp(1.75rem,4vw,3.25rem)]">
          Descreva a operação.
          <span className="block text-muted-foreground">A avaliação começa por aí.</span>
        </h2>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <MagneticLink
            href={whatsapp(`Olá! Meu interesse é: ${subject}. Minha necessidade é:`)}
            external
          >
            Falar no WhatsApp
          </MagneticLink>
          <MagneticLink href="/orcamento/" variant="ghost">
            Pedir avaliação
          </MagneticLink>
        </div>
      </div>
    </SectionShell>
  );
}
```

- [ ] **Step 8: Verificar a tipagem**

```bash
npx tsc --noEmit
```

Esperado: nenhum erro.

- [ ] **Step 9: Commit**

```bash
git add src/components/site/ src/lib/accent.ts src/styles.css
git commit -m "feat: primitivos compartilhados das páginas internas"
```

---

## Task 7: SEO por rota

**Files:**
- Create: `src/lib/seo.ts`
- Modify: `src/content/site.ts`

Escrito antes das páginas porque toda rota vai usá-lo.

- [ ] **Step 1: Escrever o helper**

Criar `src/lib/seo.ts`:

```ts
import { site, contact, company } from "@/content/site";

/** Toda URL indexada termina com barra. Canonical tem que bater. */
export function canonical(path: string) {
  const clean = path.startsWith("/") ? path : `/${path}`;
  const withSlash = clean.endsWith("/") ? clean : `${clean}/`;
  return `${site.origin}${withSlash}`;
}

export function seo({
  title,
  description,
  path,
  image = "/og-default.jpg",
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
}) {
  const url = canonical(path);
  const fullTitle = path === "/" ? title : `${title} | ${site.name}`;

  return {
    meta: [
      { title: fullTitle },
      { name: "description", content: description },
      { property: "og:title", content: fullTitle },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: url },
      { property: "og:image", content: `${site.origin}${image}` },
      { property: "og:locale", content: "pt_BR" },
      { property: "og:site_name", content: site.name },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: url }],
  };
}

export const organizationLd = {
  "@type": ["Organization", "LocalBusiness"],
  "@id": `${site.origin}/#organization`,
  name: site.name,
  legalName: company.legalName,
  taxID: company.cnpj,
  description: site.description,
  url: `${site.origin}/`,
  telephone: `+55${contact.whatsappNumber.slice(2)}`,
  email: contact.email,
  sameAs: [contact.instagramUrl],
  address: {
    "@type": "PostalAddress",
    streetAddress: company.address,
    addressLocality: site.city,
    addressRegion: site.state,
    addressCountry: "BR",
  },
  areaServed: { "@type": "AdministrativeArea", name: site.region },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: "08:00",
    closes: "18:00",
  },
};

export function jsonLd(nodes: unknown[]) {
  return {
    type: "application/ld+json",
    children: JSON.stringify({ "@context": "https://schema.org", "@graph": nodes }),
  };
}

export function serviceLd(s: { slug: string; title: string; meta: string }) {
  return {
    "@type": "Service",
    "@id": `${canonical(`/${s.slug}`)}#service`,
    name: s.title,
    description: s.meta,
    provider: { "@id": `${site.origin}/#organization` },
    areaServed: { "@type": "AdministrativeArea", name: site.region },
  };
}

export function faqLd(items: { q: string; a: string }[]) {
  return {
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}
```

- [ ] **Step 2: Confirmar o `origin`**

`src/content/site.ts` tem `origin: 'https://designer-inox-cinematic.vercel.app'`. Manter —
é o domínio do projeto Vercel em uso e é o que está no sitemap indexado.

- [ ] **Step 3: Aplicar na home**

Em `src/routes/index.tsx`, substituir o `head()` escrito à mão:

```tsx
import { seo, jsonLd, organizationLd, faqLd } from "@/lib/seo";
import { homeFaq } from "@/content/site";

export const Route = createFileRoute("/")({
  head: () => {
    const base = seo({
      title: "Designer Inox Brasil | Cozinhas industriais e manutenção",
      description:
        "Projeto técnico, fabricação sob medida, instalação, exaustão, refrigeração, aquecimento, automação e manutenção em aço inox. Brasília / DF e entorno.",
      path: "/",
    });
    return { ...base, scripts: [jsonLd([organizationLd, faqLd(homeFaq)])] };
  },
  component: Index,
});
```

- [ ] **Step 4: Verificar o canonical e o JSON-LD**

```bash
npm run dev
```

```bash
curl -s http://localhost:3000/ | grep -o '<link rel="canonical"[^>]*>'
```

Esperado: `<link rel="canonical" href="https://designer-inox-cinematic.vercel.app/"/>`

```bash
curl -s http://localhost:3000/ | grep -o 'application/ld+json' | head -1
```

Esperado: `application/ld+json`

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: helper de SEO com canonical, OG e JSON-LD"
```

---

## Task 8: As 13 páginas de serviço

**Files:**
- Create: `src/routes/$servico.tsx`

Uma rota, treze páginas. A ordem das seções reproduz a do site atual, definida em
`src/templates-legacy/pages.mjs:369`.

- [ ] **Step 1: Escrever a rota**

Criar `src/routes/$servico.tsx`:

```tsx
import { createFileRoute, notFound } from "@tanstack/react-router";
import { serviceBySlug } from "@/content/services";
import { PageShell } from "@/components/site/PageShell";
import { PageHero } from "@/components/site/PageHero";
import { ListSection } from "@/components/site/ListSection";
import { FaqSection } from "@/components/site/FaqSection";
import { RelatedSection } from "@/components/site/RelatedSection";
import { CtaSection } from "@/components/site/CtaSection";
import { GallerySection } from "@/components/site/GallerySection";
import { seo, jsonLd, organizationLd, serviceLd, faqLd } from "@/lib/seo";

export const Route = createFileRoute("/$servico")({
  loader: ({ params }) => {
    const service = serviceBySlug.get(params.servico);
    // Sem isto, slug inventado renderiza página vazia com status 200 — pior
    // que 404 para o crawler.
    if (!service) throw notFound();
    return { service };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const { service } = loaderData;
    const base = seo({
      title: service.title,
      description: service.meta,
      path: `/${service.slug}`,
    });
    return {
      ...base,
      scripts: [
        jsonLd([organizationLd, serviceLd(service), ...(service.faq.length ? [faqLd(service.faq)] : [])]),
      ],
    };
  },
  component: ServicePage,
});

function ServicePage() {
  const { service } = Route.useLoaderData();

  return (
    <PageShell>
      <PageHero
        eyebrow="Serviço"
        title={service.title}
        lead={service.lead}
        photo={service.photo}
      />

      {service.specialties && (
        <ListSection
          index="02"
          eyebrow="Especialidades"
          title="Especialidades deste serviço."
          lead="Equipamentos que fabricamos sob medida ou mantemos com assistência técnica especializada."
          items={service.specialties}
          accent={service.accent}
        />
      )}

      <ListSection
        index="03"
        eyebrow="Quando faz sentido"
        title="Situações que orientam a avaliação."
        lead="O escopo final depende das condições reais, das informações disponíveis e dos itens aprovados na proposta."
        items={service.when}
        accent={service.accent}
      />

      <ListSection
        index="04"
        eyebrow="Escopo"
        title="O que pode entrar no escopo."
        lead="Nada é presumido. Cada item precisa estar descrito e aprovado antes da fabricação ou da intervenção."
        items={service.deliverables}
        accent={service.accent}
      />

      <ListSection
        index="05"
        eyebrow="Decisões"
        title="O que muda o projeto."
        lead="Condições que precisam ser entendidas para evitar improviso, retrabalho e incompatibilidades."
        items={service.decisions}
        accent={service.accent}
      />

      <GallerySection ids={service.gallery} index="06" />
      <FaqSection items={service.faq} />
      <RelatedSection slugs={service.related} />
      <CtaSection subject={service.navTitle} />
    </PageShell>
  );
}
```

- [ ] **Step 2: Escrever a GallerySection**

Criar `src/components/site/GallerySection.tsx`:

```tsx
import { Photo } from "./Photo";
import { SectionShell, SectionHeading } from "./primitives";

export function GallerySection({ ids, index = "06" }: { ids: string[]; index?: string }) {
  if (!ids.length) return null;

  return (
    <SectionShell className="py-20 sm:py-28">
      <SectionHeading
        index={index}
        eyebrow="Execução"
        title="Trabalhos executados."
        lead="Registro de obras entregues pela equipe."
        align="between"
      />
      <div className="mt-14 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
        {ids.map((id, i) => (
          <div key={id} className="reveal bg-background" data-reveal style={{ transitionDelay: `${i * 70}ms` }}>
            <Photo id={id} className="aspect-[4/3] w-full" sizes="(min-width: 1024px) 33vw, 100vw" />
          </div>
        ))}
      </div>
    </SectionShell>
  );
}
```

- [ ] **Step 3: Verificar que as 13 rotas resolvem**

```bash
npm run dev
```

```bash
for s in cozinhas-industriais equipamentos-em-inox projeto-tecnico-e-fabricacao-cnc reformas-e-modernizacoes coifas-ventilacao-e-exaustao saponificacao-em-exaustao refrigeracao-industrial aquecimento-industrial sistemas-de-co2 automacao-eletrica sistemas-integrados-em-inox manutencao equipamentos-hospitalares; do printf "%s %s\n" "$(curl -s -o /dev/null -w '%{http_code}' http://localhost:3000/$s/)" "$s"; done
```

Esperado: `200` nas 13 linhas.

- [ ] **Step 4: Verificar que slug inventado dá 404**

```bash
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:3000/servico-que-nao-existe/
```

Esperado: `404`

- [ ] **Step 5: Verificar uma página renderizada**

```bash
"/c/Program Files/Google/Chrome/Application/chrome.exe" --headless --disable-gpu --screenshot=/tmp/servico.png --window-size=1440,6000 --user-data-dir=/tmp/chrome-task8 http://localhost:3000/cozinhas-industriais/
```

Esperado: hero com título e foto legendada "Projeto Designer Inox", quatro listas
numeradas, galeria de três fotos, FAQ, relacionados e CTA.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: 13 páginas de serviço a partir de uma rota dirigida por dados"
```

---

## Task 9: As 4 páginas de segmento e o índice

**Files:**
- Create: `src/routes/segmentos/$segmento.tsx`, `src/routes/segmentos/index.tsx`, `src/components/site/CardGrid.tsx`

- [ ] **Step 1: Escrever a página de segmento**

Criar `src/routes/segmentos/$segmento.tsx` com a mesma forma da rota de serviço, trocando
o conteúdo pelas seções de segmento:

```tsx
import { createFileRoute, notFound } from "@tanstack/react-router";
import { segmentBySlug } from "@/content/segments";
import { PageShell } from "@/components/site/PageShell";
import { PageHero } from "@/components/site/PageHero";
import { ListSection } from "@/components/site/ListSection";
import { RelatedSection } from "@/components/site/RelatedSection";
import { CtaSection } from "@/components/site/CtaSection";
import { SectionShell, SectionHeading } from "@/components/site/primitives";
import { seo, jsonLd, organizationLd } from "@/lib/seo";

export const Route = createFileRoute("/segmentos/$segmento")({
  loader: ({ params }) => {
    const segment = segmentBySlug.get(params.segmento);
    if (!segment) throw notFound();
    return { segment };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const { segment } = loaderData;
    const base = seo({
      title: segment.title,
      description: segment.meta,
      path: `/segmentos/${segment.slug}`,
    });
    return { ...base, scripts: [jsonLd([organizationLd])] };
  },
  component: SegmentPage,
});

function SegmentPage() {
  const { segment } = Route.useLoaderData();

  return (
    <PageShell>
      <PageHero
        eyebrow="Segmento"
        title={segment.title}
        lead={segment.lead}
        photo={segment.photo}
      />

      <SectionShell className="py-20 sm:py-28">
        <SectionHeading
          index="02"
          eyebrow="Pressões"
          title="O que aperta nesta operação."
          lead="As condições que definem as escolhas de projeto neste segmento."
          align="between"
        />
        <ul className="mt-14 grid gap-px bg-border sm:grid-cols-2">
          {segment.pressures.map((p, i) => (
            <li
              key={p.label}
              className="reveal specular bg-background p-6 sm:p-8"
              data-reveal
              style={{ transitionDelay: `${i * 70}ms` }}
            >
              <h3 className="font-display text-xl font-bold tracking-tight">{p.label}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.note}</p>
            </li>
          ))}
        </ul>
      </SectionShell>

      <ListSection
        index="03"
        eyebrow="Prioridades"
        title="O que costuma vir primeiro."
        lead="A ordem muda conforme o estado da operação, mas estes pontos aparecem quase sempre."
        items={segment.priorities}
        accent={segment.accent}
      />

      <RelatedSection slugs={segment.services} />
      <CtaSection subject={segment.navTitle} />
    </PageShell>
  );
}
```

- [ ] **Step 2: Escrever o CardGrid, reutilizado pelos dois índices**

Criar `src/components/site/CardGrid.tsx`. O índice de segmentos e o de serviços mostram a
mesma coisa — card com título, resumo e link:

```tsx
import { SectionShell, SectionHeading } from "./primitives";

export interface CardItem {
  href: string;
  title: string;
  text: string;
}

export function CardGrid({
  index,
  eyebrow,
  title,
  lead,
  items,
}: {
  index: string;
  eyebrow: string;
  title: string;
  lead: string;
  items: CardItem[];
}) {
  return (
    <SectionShell className="py-20 sm:py-28">
      <SectionHeading index={index} eyebrow={eyebrow} title={title} lead={lead} align="between" />
      <ul className="mt-14 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => (
          <li
            key={item.href}
            className="reveal specular group bg-background"
            data-reveal
            style={{ transitionDelay: `${i * 70}ms` }}
          >
            <a href={item.href} className="flex min-h-full flex-col p-6 sm:p-8">
              <h3 className="font-display text-xl font-bold tracking-tight">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
              <span className="label-mono mt-auto inline-flex items-center gap-3 pt-8 transition-colors group-hover:text-signal">
                Ver
                <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-1">
                  →
                </span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}
```

- [ ] **Step 3: Escrever o índice de segmentos**

Criar `src/routes/segmentos/index.tsx`:

```tsx
import { createFileRoute } from "@tanstack/react-router";
import { segments } from "@/content/segments";
import { PageShell } from "@/components/site/PageShell";
import { PageHero } from "@/components/site/PageHero";
import { CardGrid } from "@/components/site/CardGrid";
import { CtaSection } from "@/components/site/CtaSection";
import { seo, jsonLd, organizationLd } from "@/lib/seo";

export const Route = createFileRoute("/segmentos/")({
  head: () => ({
    ...seo({
      title: "Segmentos atendidos",
      description:
        "Restaurantes, hotelaria e alimentação coletiva, produção e varejo de alimentos, saúde e ambientes hospitalares. Soluções em aço inox por contexto de operação.",
      path: "/segmentos",
    }),
    scripts: [jsonLd([organizationLd])],
  }),
  component: SegmentsIndex,
});

function SegmentsIndex() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Segmentos"
        title="Quatro contextos de operação."
        lead="Cada segmento impõe pressões próprias sobre layout, exaustão, higienização e continuidade. O que muda não é o material — é o que a operação exige dele."
      />
      <CardGrid
        index="02"
        eyebrow="Contextos"
        title="Onde a Designer Inox atua."
        lead="A leitura do contexto vem antes da escolha do equipamento."
        items={segments.map((s) => ({
          href: `/segmentos/${s.slug}/`,
          title: s.navTitle,
          text: s.short,
        }))}
      />
      <CtaSection subject="avaliação por segmento" />
    </PageShell>
  );
}
```

- [ ] **Step 4: Verificar as 5 rotas**

```bash
npm run dev
```

```bash
for s in "" restaurantes-e-cozinhas-profissionais hotelaria-e-alimentacao-coletiva producao-e-varejo-de-alimentos saude-e-ambientes-hospitalares; do printf "%s /segmentos/%s\n" "$(curl -s -o /dev/null -w '%{http_code}' http://localhost:3000/segmentos/$s)" "$s"; done
```

Esperado: `200` nas 5 linhas.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: índice e as 4 páginas de segmento"
```

---

## Task 10: Índice de serviços

**Files:**
- Create: `src/routes/servicos/index.tsx`

- [ ] **Step 1: Escrever a rota**

Criar `src/routes/servicos/index.tsx`. Uma seção `CardGrid` por categoria, para que a
organização em quatro frentes fique visível — é a mesma leitura que a home oferece:

```tsx
import { createFileRoute } from "@tanstack/react-router";
import { services, categories } from "@/content/services";
import { PageShell } from "@/components/site/PageShell";
import { PageHero } from "@/components/site/PageHero";
import { CardGrid } from "@/components/site/CardGrid";
import { CtaSection } from "@/components/site/CtaSection";
import { seo, jsonLd, organizationLd } from "@/lib/seo";

export const Route = createFileRoute("/servicos/")({
  head: () => ({
    ...seo({
      title: "Serviços em aço inox",
      description:
        "Projeto técnico, fabricação, instalação, exaustão, refrigeração, aquecimento, CO₂, automação elétrica e manutenção em aço inox para operações profissionais.",
      path: "/servicos",
    }),
    scripts: [jsonLd([organizationLd])],
  }),
  component: ServicesIndex,
});

function ServicesIndex() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Serviços"
        title="Treze serviços, quatro frentes."
        lead="É possível contratar uma etapa isolada ou coordenar projeto, fabricação, sistemas e instalação sob um escopo só."
      />

      {categories.map((cat, i) => (
        <CardGrid
          key={cat.id}
          index={String(i + 2).padStart(2, "0")}
          eyebrow={`Frente ${String(i + 1).padStart(2, "0")}`}
          title={`${cat.label}.`}
          lead={cat.note}
          items={services
            .filter((s) => s.category === cat.id)
            .map((s) => ({ href: `/${s.slug}/`, title: s.navTitle, text: s.short }))}
        />
      ))}

      <CtaSection subject="avaliação de escopo" />
    </PageShell>
  );
}
```

- [ ] **Step 2: Verificar**

```bash
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:3000/servicos/
curl -s http://localhost:3000/servicos/ | grep -c 'href="/cozinhas-industriais/"'
```

Esperado: `200`, e ao menos `1` link para o serviço.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: índice de serviços"
```

---

## Task 11: Clientes, empresa e orçamento

**Files:**
- Create: `src/routes/clientes.tsx`, `src/routes/empresa.tsx`, `src/routes/orcamento.tsx`

As três seguem a mesma casca. O conteúdo sai de `src/content/site.ts` — nenhum texto novo
é inventado; onde faltar texto, usar o do template legado em `src/templates-legacy/pages.mjs`
(`clientsPage()` linha 592, `companyPage()` linha 638, `quotePage()` linha 718).

- [ ] **Step 1: `/clientes/`**

Criar `src/routes/clientes.tsx`:

```tsx
import { createFileRoute } from "@tanstack/react-router";
import { clientGroups, clientCount } from "@/content/site";
import { accentText } from "@/lib/accent";
import { PageShell } from "@/components/site/PageShell";
import { PageHero } from "@/components/site/PageHero";
import { CtaSection } from "@/components/site/CtaSection";
import { SectionShell, SectionHeading } from "@/components/site/primitives";
import { seo, jsonLd, organizationLd } from "@/lib/seo";

export const Route = createFileRoute("/clientes/")({
  head: () => ({
    ...seo({
      title: "Clientes atendidos",
      description:
        "Hospitais, redes de varejo, restaurantes, hotelaria, construtoras e operações institucionais atendidas pela Designer Inox Brasil em Brasília e entorno.",
      path: "/clientes",
    }),
    scripts: [jsonLd([organizationLd])],
  }),
  component: ClientsPage,
});

function ClientsPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Clientes"
        title="Quem já contratou."
        lead={`Operações com exigência sanitária, protocolo de acesso e continuidade crítica. São ${clientCount} organizações atendidas, agrupadas pelo tipo de operação.`}
      />

      <SectionShell className="py-20 sm:py-28">
        <SectionHeading
          index="02"
          eyebrow="Por setor"
          title="Cada setor pede uma leitura."
          lead="A lista crua não comunica nada. Ver os blocos é o que mostra o tipo de exigência que a operação já atendeu."
          align="between"
        />
        <div className="mt-14 grid gap-px bg-border lg:grid-cols-2">
          {clientGroups.map((group, i) => (
            <section
              key={group.sector}
              className="reveal specular bg-background p-6 sm:p-8 lg:p-10"
              data-reveal
              style={{ transitionDelay: `${i * 70}ms` }}
            >
              <h3 className="font-display text-2xl font-bold tracking-tight">{group.sector}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{group.note}</p>
              <ul className="mt-8 flex flex-col gap-px bg-border/70">
                {group.clients.map((client) => (
                  <li key={client} className="bg-background py-3">
                    <span className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-3 text-sm text-foreground/85">
                      <span aria-hidden="true" className={`mt-2 block ${accentText(group.accent)}`}>
                        —
                      </span>
                      <span className="min-w-0">{client}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </SectionShell>

      <CtaSection subject="atendimento" />
    </PageShell>
  );
}
```

- [ ] **Step 2: `/empresa/`**

Criar `src/routes/empresa.tsx`. O método de 6 etapas já existe como componente
(`src/components/site/Method.tsx`) e é reaproveitado:

```tsx
import { createFileRoute } from "@tanstack/react-router";
import { site, contact, company } from "@/content/site";
import { PageShell } from "@/components/site/PageShell";
import { PageHero } from "@/components/site/PageHero";
import { Method } from "@/components/site/Method";
import { CtaSection } from "@/components/site/CtaSection";
import { SectionShell, SectionHeading } from "@/components/site/primitives";
import { seo, jsonLd, organizationLd } from "@/lib/seo";

const IDENTIFICATION = [
  { label: "Razão social", value: company.legalName },
  { label: "CNPJ", value: company.cnpj },
  { label: "Endereço", value: company.address },
  { label: "Área de atendimento", value: site.region },
  { label: "Telefone e WhatsApp", value: contact.whatsappDisplay },
  { label: "E-mail", value: contact.email },
  { label: "Horário", value: contact.hours },
  { label: "Instagram", value: `@${contact.instagram}` },
];

export const Route = createFileRoute("/empresa/")({
  head: () => ({
    ...seo({
      title: "A empresa",
      description:
        "Designer Inox Brasil — engenharia aplicada em aço inox para cozinhas industriais, hospitais e operações profissionais em Brasília, DF e entorno.",
      path: "/empresa",
    }),
    scripts: [jsonLd([organizationLd])],
  }),
  component: CompanyPage,
});

function CompanyPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Empresa"
        title="Engenharia aplicada em aço inox."
        lead="Designer Inox Brasil atende Brasília, o Distrito Federal e o entorno com projeto, fabricação, instalação, sistemas e manutenção em aço inox."
        photo="real-exaustao-equipe"
      />

      <Method />

      <SectionShell className="py-20 sm:py-28">
        <SectionHeading
          index="03"
          eyebrow="Identificação"
          title="Dados da empresa."
          lead="Informação de cadastro e contato direto."
          align="between"
        />
        <dl className="mt-14 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
          {IDENTIFICATION.map((row, i) => (
            <div
              key={row.label}
              className="reveal bg-background p-6 sm:p-8"
              data-reveal
              style={{ transitionDelay: `${i * 50}ms` }}
            >
              <dt className="label-mono text-muted-foreground">{row.label}</dt>
              <dd className="mt-3 text-sm leading-relaxed text-foreground/90">{row.value}</dd>
            </div>
          ))}
        </dl>
      </SectionShell>

      <CtaSection subject="informações sobre a empresa" />
    </PageShell>
  );
}
```

- [ ] **Step 3: `/orcamento/`**

Criar `src/routes/orcamento.tsx`. Não tem backend: os quatro cenários viram links de
WhatsApp com mensagem pré-preenchida, como no site atual.

```tsx
import { createFileRoute } from "@tanstack/react-router";
import { whatsapp, contact } from "@/content/site";
import { PageShell } from "@/components/site/PageShell";
import { PageHero } from "@/components/site/PageHero";
import { ListSection } from "@/components/site/ListSection";
import { SectionShell, SectionHeading } from "@/components/site/primitives";
import { seo, jsonLd, organizationLd } from "@/lib/seo";

const SCENARIOS = [
  { id: "A", label: "Implantar ou ampliar uma operação" },
  { id: "B", label: "Fabricar algo sob medida" },
  { id: "C", label: "Corrigir falha, reformar ou manter" },
  { id: "D", label: "Preciso de orientação" },
];

const SEND = [
  "cidade e endereço aproximado da operação",
  "tipo de operação e volume de produção",
  "fotos gerais do espaço e dos pontos críticos",
  "medidas disponíveis, mesmo aproximadas",
  "descrição do que precisa mudar",
  "prazo pretendido e restrições de acesso",
];

export const Route = createFileRoute("/orcamento/")({
  head: () => ({
    ...seo({
      title: "Pedir avaliação",
      description:
        "Descreva a operação e receba uma avaliação técnica da Designer Inox Brasil. Atendimento por WhatsApp para Brasília, DF e entorno.",
      path: "/orcamento",
    }),
    scripts: [jsonLd([organizationLd])],
  }),
  component: QuotePage,
});

function QuotePage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Avaliação"
        title="Descreva a operação."
        lead="Não existe orçamento sem entender o espaço, o uso e o que já está instalado. Escolha o cenário mais próximo do seu — a conversa começa por ele."
      />

      <SectionShell className="py-20 sm:py-28">
        <SectionHeading
          index="02"
          eyebrow="Cenários"
          title="Por onde começar."
          lead="Cada cenário abre a conversa no WhatsApp com o contexto já preenchido."
          align="between"
        />
        <ul className="mt-14 grid gap-px bg-border sm:grid-cols-2">
          {SCENARIOS.map((s, i) => (
            <li
              key={s.id}
              className="reveal specular group bg-background"
              data-reveal
              style={{ transitionDelay: `${i * 70}ms` }}
            >
              <a
                href={whatsapp(`Olá! Meu cenário é: ${s.label}. Minha necessidade é:`)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-full flex-col p-6 sm:p-8 lg:p-10"
              >
                <span className="label-mono text-signal">{s.id}</span>
                <h3 className="mt-6 font-display text-2xl font-bold tracking-tight">{s.label}</h3>
                <span className="label-mono mt-auto inline-flex items-center gap-3 pt-10 transition-colors group-hover:text-signal">
                  Abrir no WhatsApp
                  <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </SectionShell>

      <ListSection
        index="03"
        eyebrow="O que enviar"
        title="O que faz a avaliação ser melhor."
        lead="Quanto mais contexto vier na primeira mensagem, menos ida e volta até uma resposta útil. Projetos complexos podem exigir levantamento técnico no local."
        items={SEND}
      />

      <SectionShell className="py-20 sm:py-28">
        <div className="reveal" data-reveal>
          <p className="label-mono text-muted-foreground">Atendimento</p>
          <p className="mt-4 text-lg leading-relaxed text-foreground/90">
            {contact.whatsappDisplay} · {contact.email}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">{contact.hours}</p>
          <p className="mt-6 text-sm text-muted-foreground">{contact.emergency}</p>
        </div>
      </SectionShell>
    </PageShell>
  );
}
```

- [ ] **Step 4: Verificar as três**

```bash
for p in clientes empresa orcamento; do printf "%s /%s\n" "$(curl -s -o /dev/null -w '%{http_code}' http://localhost:3000/$p/)" "$p"; done
```

Esperado: `200` nas três.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: páginas de clientes, empresa e orçamento"
```

---

## Task 12: Páginas legais e 404

**Files:**
- Create: `src/routes/politica-de-privacidade.tsx`, `src/routes/termos-de-uso.tsx`, `src/components/site/LegalDoc.tsx`
- Modify: `src/routes/__root.tsx`

- [ ] **Step 1: Escrever o componente de documento legal**

Criar `src/components/site/LegalDoc.tsx`:

```tsx
import { SectionShell } from "./primitives";

export interface LegalBlock {
  heading: string;
  paragraphs: string[];
}

export function LegalDoc({ blocks }: { blocks: LegalBlock[] }) {
  return (
    <SectionShell className="py-20 sm:py-28">
      <div className="max-w-3xl">
        {blocks.map((block, i) => (
          <section
            key={block.heading}
            className="reveal border-t border-border py-10 first:border-t-0 first:pt-0"
            data-reveal
            style={{ transitionDelay: `${i * 50}ms` }}
          >
            <h2 className="font-display text-xl font-bold tracking-tight sm:text-2xl">
              {block.heading}
            </h2>
            {block.paragraphs.map((p) => (
              <p key={p} className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {p}
              </p>
            ))}
          </section>
        ))}
      </div>
    </SectionShell>
  );
}
```

- [ ] **Step 2: Portar os textos legais**

Criar `src/routes/politica-de-privacidade.tsx` e `src/routes/termos-de-uso.tsx` com esta
forma, preenchendo `BLOCKS` com o texto **na íntegra** de `privacyPage()`
(`src/templates-legacy/pages.mjs:765`) e `termsPage()` (linha 798). São documentos
jurídicos: nenhuma frase é reescrita, resumida ou reordenada.

```tsx
import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import { PageHero } from "@/components/site/PageHero";
import { LegalDoc, type LegalBlock } from "@/components/site/LegalDoc";
import { seo } from "@/lib/seo";

const BLOCKS: LegalBlock[] = [
  // Cada <h2> do template legado vira um bloco; cada <p> vira uma string.
];

export const Route = createFileRoute("/politica-de-privacidade/")({
  head: () => seo({
    title: "Política de privacidade",
    description:
      "Como a Designer Inox Brasil trata os dados enviados por quem entra em contato pelo site.",
    path: "/politica-de-privacidade",
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Documento"
        title="Política de privacidade"
        lead="Como os dados enviados por quem entra em contato são tratados."
      />
      <LegalDoc blocks={BLOCKS} />
    </PageShell>
  );
}
```

As duas continuam indexáveis — estão no sitemap atual. Não adicionar `noindex`.

- [ ] **Step 3: Estilizar o 404**

`src/routes/__root.tsx` tem um `notFoundComponent` genérico em inglês, herdado do template.
Substituir pelo equivalente em português, com a casca do site:

```tsx
notFoundComponent: () => (
  <PageShell>
    <PageHero
      eyebrow="Erro 404"
      title="Esta página não existe."
      lead="O endereço pode ter mudado ou nunca ter existido. Os caminhos abaixo levam ao que o site tem."
    />
    <RelatedSection slugs={["cozinhas-industriais", "coifas-ventilacao-e-exaustao", "manutencao"]} />
    <CtaSection subject="orientação" />
  </PageShell>
),
```

Acrescentar os imports correspondentes no topo de `__root.tsx`.

- [ ] **Step 4: Verificar**

```bash
for p in politica-de-privacidade termos-de-uso; do printf "%s /%s\n" "$(curl -s -o /dev/null -w '%{http_code}' http://localhost:3000/$p/)" "$p"; done
curl -s http://localhost:3000/nao-existe/ | grep -c "Esta página não existe"
```

Esperado: `200` nas duas legais; `1` na busca do texto do 404.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: páginas legais e 404 em português"
```

---

## Task 13: Pré-renderização

**Files:**
- Modify: `vite.config.ts`

O ponto mais incerto do plano: `@lovable.dev/vite-tanstack-config` embrulha o nitro e pode
não expor a configuração de pré-renderização.

- [ ] **Step 1: Descobrir a API disponível na versão instalada**

```bash
cat node_modules/@lovable.dev/vite-tanstack-config/package.json | grep -E '"version"|"types"|"exports"' && find node_modules/@lovable.dev/vite-tanstack-config -name "*.d.ts" | head -5
```

Ler o `.d.ts` retornado e localizar as opções aceitas por `defineConfig` — especificamente
se há passagem para `nitro` e/ou `prerender`.

- [ ] **Step 2A: Se o wrapper expuser `nitro`/`prerender`**

Configurar por ele:

```ts
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { serviceSlugs } from "./src/content/services";
import { segmentSlugs } from "./src/content/segments";

const routes = [
  "/",
  "/servicos/",
  "/segmentos/",
  "/clientes/",
  "/empresa/",
  "/orcamento/",
  "/politica-de-privacidade/",
  "/termos-de-uso/",
  ...serviceSlugs.map((s) => `/${s}/`),
  ...segmentSlugs.map((s) => `/segmentos/${s}/`),
];

export default defineConfig({
  tanstackStart: { server: { entry: "server" } },
  nitro: {
    preset: "static",
    prerender: { crawlLinks: false, routes },
  },
});
```

- [ ] **Step 2B: Se o wrapper NÃO expuser**

Trocar pelo `defineConfig` padrão do TanStack Start, reconstruindo os plugins que o wrapper
adicionava (`tanstackStart`, `viteReact`, `tailwindcss`, `tsConfigPaths`, `nitro`). O
próprio comentário no topo do `vite.config.ts` de origem lista exatamente quais são.

Remover então a dependência `@lovable.dev/vite-tanstack-config` do `package.json`.

- [ ] **Step 3: Rodar o build**

```bash
npm run build
```

Esperado: build conclui e a saída contém HTML por rota. Localizar a pasta:

```bash
find .output -name "index.html" | head -30
```

- [ ] **Step 4: Contar as páginas**

```bash
find .output -name "*.html" | wc -l
```

Esperado: **25** (ou 26, se o 404 sair como arquivo). Número menor significa rota que não
foi pré-renderizada — conferir a lista `routes` do Step 2A.

- [ ] **Step 5: Confirmar que o HTML tem conteúdo, não só o shell**

```bash
grep -c "Situações que orientam a avaliação" .output/public/cozinhas-industriais/index.html
```

Esperado: `1`. Se der `0`, a página está sendo só hidratada no cliente e o crawler não
veria o conteúdo — a pré-renderização não funcionou.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: pré-renderização das 25 rotas para HTML estático"
```

---

## Task 14: Sitemap e robots gerados no build

**Files:**
- Create: `scripts/sitemap.ts`
- Modify: `package.json`
- Delete: `sitemap.xml`, `robots.txt` da raiz

- [ ] **Step 1: Escrever o gerador**

Criar `scripts/sitemap.ts`:

É `.ts`, não `.mjs`: ele importa os módulos de conteúdo, que agora são TypeScript. Roda
via `tsx`.

```ts
/**
 * Gera sitemap.xml e robots.txt na saída pré-renderizada.
 *
 * A lista de rotas sai dos mesmos dados que geram as páginas — sitemap
 * escrito à mão diverge do site na primeira mudança e ninguém percebe.
 */

import { writeFile } from "node:fs/promises";
import path from "node:path";

import { site } from "../src/content/site";
import { serviceSlugs } from "../src/content/services";
import { segmentSlugs } from "../src/content/segments";

const OUT = process.argv[2] ?? ".output/public";

const routes = [
  { path: "/", priority: "1.0" },
  { path: "/servicos/", priority: "0.9" },
  { path: "/segmentos/", priority: "0.8" },
  { path: "/clientes/", priority: "0.7" },
  { path: "/empresa/", priority: "0.7" },
  { path: "/orcamento/", priority: "0.9" },
  ...serviceSlugs.map((s) => ({ path: `/${s}/`, priority: "0.8" })),
  ...segmentSlugs.map((s) => ({ path: `/segmentos/${s}/`, priority: "0.7" })),
  { path: "/politica-de-privacidade/", priority: "0.3" },
  { path: "/termos-de-uso/", priority: "0.3" },
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (r) => `  <url>
    <loc>${site.origin}${r.path}</loc>
    <priority>${r.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>
`;

const robots = `User-agent: *
Allow: /

Sitemap: ${site.origin}/sitemap.xml
`;

await writeFile(path.join(OUT, "sitemap.xml"), sitemap);
await writeFile(path.join(OUT, "robots.txt"), robots);

console.log(`sitemap.xml: ${routes.length} URLs`);
```

- [ ] **Step 2: Encadear no build**

Em `package.json`:

```json
"scripts": {
  "build": "vite build && npx tsx scripts/sitemap.ts && node scripts/check.mjs"
}
```

`check.mjs` só é adaptado na Task 16 — até lá, encerrar o comando no `sitemap.ts`.

- [ ] **Step 3: Verificar a contagem de URLs**

```bash
npm run build && grep -c "<loc>" .output/public/sitemap.xml
```

Esperado: **25**, igual ao sitemap atual.

- [ ] **Step 4: Comparar com o sitemap indexado**

```bash
grep -o "<loc>[^<]*</loc>" .output/public/sitemap.xml | sort > /tmp/novo.txt
grep -o "<loc>[^<]*</loc>" sitemap.xml | sort > /tmp/velho.txt
diff /tmp/velho.txt /tmp/novo.txt && echo "IDÊNTICO"
```

Esperado: `IDÊNTICO`. Qualquer diferença é uma URL indexada que sumiu ou mudou — parar e
corrigir antes de seguir.

- [ ] **Step 5: Remover os arquivos estáticos da raiz e commitar**

```bash
git rm sitemap.xml robots.txt
git add -A
git commit -m "feat: sitemap e robots gerados a partir das rotas no build"
```

---

## Task 15: Deploy na Vercel

**Files:**
- Modify: `vercel.json`, `.vercelignore`

- [ ] **Step 1: Reescrever o `vercel.json`**

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".output/public",
  "cleanUrls": true,
  "trailingSlash": true,
  "redirects": [
    { "source": "/solucoes-em-inox", "destination": "/servicos/", "statusCode": 308 },
    { "source": "/solucoes-em-inox/", "destination": "/servicos/", "statusCode": 308 }
  ],
  "headers": [
    {
      "source": "/(photos|brand|fonts)/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    },
    {
      "source": "/_build/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    },
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
        { "key": "X-Frame-Options", "value": "DENY" },
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; font-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'; upgrade-insecure-requests"
        }
      ]
    }
  ]
}
```

Duas mudanças em relação ao atual, ambas necessárias:

- `script-src` ganha `'unsafe-inline'` — o React injeta script inline de hidratação e site
  estático não permite nonce, que exigiria gerar o valor por requisição.
- O caminho de cache muda de `/assets/(img|fonts|brand)/` para `/(photos|brand|fonts)/`,
  acompanhando a nova estrutura de `public/`.

Confirmar o prefixo real dos assets do Vite antes de fixar `/_build/`:

```bash
ls .output/public
```

- [ ] **Step 2: Ajustar o `.vercelignore`**

Ele foi escrito para o site estático e exclui caminhos que não existem mais. Reduzir ao
essencial — com `outputDirectory` definido, a Vercel publica só a saída do build:

```
docs/
scripts/
.playwright-cli/
*.md
!README.md
```

- [ ] **Step 3: Deploy de preview**

```bash
npx vercel --yes
```

Esperado: URL de preview. **Projeto: `designer-inox-cinematic`** — conferir no output; se
apontar para outro projeto, cancelar e corrigir o `.vercel/project.json`.

- [ ] **Step 4: Verificar que as fotos respondem 200 no preview**

Este passo não é opcional. O header `immutable` vale por caminho, não por status: um 404
servido sob `/photos/` fica **um ano** no cache do CDN.

```bash
PREVIEW=<url-do-preview>
for f in /photos/real-cozinha-industrial-1280.jpg /brand/lockup-negative.png /fonts/archivo-latin-400.woff2; do printf "%s %s\n" "$(curl -s -o /dev/null -w '%{http_code}' $PREVIEW$f)" "$f"; done
```

Esperado: `200` nos três. Qualquer 404 aqui **para o deploy** — corrigir o caminho antes
de promover para produção.

- [ ] **Step 5: Verificar os headers**

```bash
curl -sI $PREVIEW/ | grep -i "content-security-policy\|x-frame-options"
curl -sI $PREVIEW/photos/real-cozinha-industrial-1280.jpg | grep -i "cache-control"
```

Esperado: CSP e `X-Frame-Options: DENY` presentes; `Cache-Control: public, max-age=31536000, immutable` na foto.

- [ ] **Step 6: Commit**

```bash
git add vercel.json .vercelignore
git commit -m "feat: deploy pré-renderizado na Vercel com cache e CSP ajustados"
```

---

## Task 16: Adaptar o verificador

**Files:**
- Modify: `scripts/check.mjs`
- Modify: `package.json`

`scripts/check.mjs` já cobre link morto, imagem sem `alt`, asset inexistente, canonical
errado e id duplicado. Ele lia a raiz do repositório; passa a ler a saída pré-renderizada.

- [ ] **Step 1: Trocar a raiz de varredura**

Em `scripts/check.mjs`, substituir:

```js
const root = process.cwd()
```

por:

```js
const root = path.resolve(process.cwd(), process.argv[2] ?? '.output/public')
```

- [ ] **Step 2: Remover a verificação de divergência com o gerador**

O import de `./generate.mjs` e a checagem de "HTML no disco divergente do que os dados
produzem" perdem o sentido: não existe mais HTML versionado para divergir. Apagar:

```js
import { routes, errorPage } from './generate.mjs'
```

e o bloco que compara o HTML gerado com o do disco.

- [ ] **Step 3: Ajustar `collectHtml`**

A lista de diretórios ignorados era da estrutura antiga:

```js
if (['node_modules', '.git', '.vercel', 'src', 'scripts', 'docs', 'assets'].includes(entry.name)) continue
```

Na saída pré-renderizada nada precisa ser ignorado. Substituir por:

```js
if (entry.name.startsWith('.')) continue
```

- [ ] **Step 4: Ajustar `loadDeployIgnore`**

Ele lê `.vercelignore` da raiz do repositório, não da saída. Fixar o caminho:

```js
const raw = await readFile(path.join(process.cwd(), '.vercelignore'), 'utf8')
```

- [ ] **Step 5: Encadear no build**

```json
"build": "vite build && npx tsx scripts/sitemap.ts && node scripts/check.mjs"
```

- [ ] **Step 6: Rodar**

```bash
npm run build
```

Esperado: build conclui e o verificador imprime zero erros. Se acusar link morto, é link
interno real quebrado — corrigir a página, não afrouxar a checagem.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: verificador valida a saída pré-renderizada"
```

---

## Task 17: Verificação visual completa

**Files:** nenhum — é verificação

- [ ] **Step 1: Servir a saída localmente**

```bash
npx serve .output/public -p 4173
```

- [ ] **Step 2: Capturar os quatro tipos de página, desktop**

```bash
for p in "" cozinhas-industriais/ servicos/ segmentos/saude-e-ambientes-hospitalares/ clientes/ empresa/ orcamento/ politica-de-privacidade/; do
  name=$(echo "${p:-home}" | tr '/' '-')
  "/c/Program Files/Google/Chrome/Application/chrome.exe" --headless --disable-gpu --screenshot="/tmp/shot-desktop-$name.png" --window-size=1440,4000 --user-data-dir="/tmp/chrome-$name" "http://localhost:4173/$p"
done
```

Abrir cada captura. Procurar: texto ilegível sobre foto, seção sem espaçamento, logo
esticado, foto clara demais para o fundo escuro.

- [ ] **Step 3: Capturar mobile**

```bash
for p in "" cozinhas-industriais/ clientes/; do
  name=$(echo "${p:-home}" | tr '/' '-')
  "/c/Program Files/Google/Chrome/Application/chrome.exe" --headless --disable-gpu --screenshot="/tmp/shot-mobile-$name.png" --window-size=390,3000 --user-data-dir="/tmp/chrome-m-$name" "http://localhost:4173/$p"
done
```

Procurar: overflow horizontal, menu quebrado, grid de 3 colunas não colapsando.

- [ ] **Step 4: Validar o JSON-LD**

```bash
node -e "const fs=require('fs');const h=fs.readFileSync('.output/public/cozinhas-industriais/index.html','utf8');const m=h.match(/<script type=\"application\/ld\+json\">([\s\S]*?)<\/script>/);JSON.parse(m[1]);console.log('JSON-LD válido')"
```

Esperado: `JSON-LD válido`

- [ ] **Step 5: Conferir os canonicals das 25 páginas**

```bash
find .output/public -name "index.html" -exec grep -o 'rel="canonical" href="[^"]*"' {} \; | sort
```

Esperado: 25 linhas, todas terminando em `/"`. Canonical sem barra final não bate com a
URL indexada.

- [ ] **Step 6: Registrar os achados**

Corrigir o que aparecer e recapturar. Só seguir quando as capturas estiverem limpas.

- [ ] **Step 7: Commit dos ajustes**

```bash
git add -A
git commit -m "fix: ajustes visuais encontrados na verificação"
```

---

## Task 18: Remover o gerador antigo

**Files:**
- Delete: `src/templates-legacy/`, `scripts/generate.mjs`, `scripts/serve.mjs`, os 20 diretórios de HTML, `index.html`, `404.html`, `assets/css`, `assets/js`, `assets/fonts`

Deixado para o fim de propósito: até aqui o site antigo continua no disco como referência
para conferir texto e estrutura.

- [ ] **Step 1: Remover o gerador e os templates**

```bash
git rm -r src/templates-legacy scripts/generate.mjs scripts/serve.mjs
```

- [ ] **Step 2: Remover o HTML gerado**

```bash
git rm -r aquecimento-industrial automacao-eletrica clientes coifas-ventilacao-e-exaustao \
  cozinhas-industriais empresa equipamentos-em-inox equipamentos-hospitalares manutencao \
  orcamento politica-de-privacidade projeto-tecnico-e-fabricacao-cnc reformas-e-modernizacoes \
  refrigeracao-industrial saponificacao-em-exaustao segmentos servicos sistemas-de-co2 \
  sistemas-integrados-em-inox termos-de-uso
git rm index.html 404.html
```

- [ ] **Step 3: Remover os assets órfãos**

```bash
git rm -r assets/css assets/js assets/fonts
```

`assets/content` e `docs/content/media-provenance.json` **ficam** — o manifesto de
proveniência é a origem dos `alt` e dos créditos do catálogo de fotos.

- [ ] **Step 4: Atualizar o README**

Reescrever `README.md` descrevendo a stack nova: como rodar (`npm run dev`), como buildar
(`npm run build`), onde mora o conteúdo (`src/content/`), e a regra de proveniência das
fotos.

- [ ] **Step 5: Rodar o build limpo**

```bash
rm -rf .output && npm run build
```

Esperado: build conclui, 25 páginas, verificador sem erro. Se algo quebrar aqui, um arquivo
removido ainda era referenciado.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "chore: remove o gerador estático e o HTML versionado"
```

---

## Task 19: Merge e deploy de produção

**Files:** nenhum

- [ ] **Step 1: Revisar o diff completo**

```bash
git diff main --stat
```

- [ ] **Step 2: Merge**

```bash
git checkout main
git merge --no-ff feat/migracao-tanstack-start -m "feat: migra o site para TanStack Start pré-renderizado"
```

- [ ] **Step 3: Deploy de produção**

```bash
npx vercel --prod --yes
```

- [ ] **Step 4: Verificar as 25 URLs em produção**

```bash
BASE=https://designer-inox-cinematic.vercel.app
for p in "" servicos/ segmentos/ clientes/ empresa/ orcamento/ politica-de-privacidade/ termos-de-uso/ \
  cozinhas-industriais/ equipamentos-em-inox/ projeto-tecnico-e-fabricacao-cnc/ reformas-e-modernizacoes/ \
  coifas-ventilacao-e-exaustao/ saponificacao-em-exaustao/ refrigeracao-industrial/ aquecimento-industrial/ \
  sistemas-de-co2/ automacao-eletrica/ sistemas-integrados-em-inox/ manutencao/ equipamentos-hospitalares/ \
  segmentos/restaurantes-e-cozinhas-profissionais/ segmentos/hotelaria-e-alimentacao-coletiva/ \
  segmentos/producao-e-varejo-de-alimentos/ segmentos/saude-e-ambientes-hospitalares/; do
  printf "%s /%s\n" "$(curl -s -o /dev/null -w '%{http_code}' $BASE/$p)" "$p"
done
```

Esperado: `200` nas 25 linhas. Qualquer 404 é uma URL indexada perdida.

- [ ] **Step 5: Verificar o redirect preservado**

```bash
curl -s -o /dev/null -w '%{http_code} %{redirect_url}\n' $BASE/solucoes-em-inox
```

Esperado: `308` para `/servicos/`.

- [ ] **Step 6: Verificar assets em produção**

```bash
for f in /photos/real-cozinha-industrial-1280.jpg /brand/lockup-negative.png /fonts/archivo-latin-400.woff2 /sitemap.xml /robots.txt; do printf "%s %s\n" "$(curl -s -o /dev/null -w '%{http_code}' $BASE$f)" "$f"; done
```

Esperado: `200` nos cinco.

- [ ] **Step 7: Push**

```bash
git push origin main
```

---

## Rastreamento do spec

| Requisito do spec | Tarefa |
|---|---|
| Stack TanStack Start instalada | 1 |
| Conteúdo portado para TS, sem reescrita | 2 |
| 197 fotos + marca migradas | 3 |
| Fontes auto-hospedadas, sem Google Fonts | 3 |
| Regra de proveniência em código | 4 |
| Aviso legal no rodapé | 5 |
| Marca no cabeçalho e rodapé | 5 |
| Acentos do conteúdo remapeados na paleta escura | 6 |
| 13 páginas de serviço | 8 |
| 4 páginas de segmento + índice | 9 |
| Índice de serviços | 10 |
| Clientes, empresa, orçamento | 11 |
| Legais + 404 em português | 12 |
| `head()` por rota, canonical com barra | 7 |
| JSON-LD Organization/Service/FAQPage | 7, 8 |
| Pré-renderização das 25 rotas | 13 |
| Sitemap e robots gerados no build | 14 |
| Redirect 308 preservado | 15 |
| CSP ajustada, cache por caminho novo | 15 |
| Fotos com 200 antes de promover | 15, 19 |
| Verificador da saída | 16 |
| Verificação visual desktop e mobile | 17 |
| Gerador antigo removido | 18 |
