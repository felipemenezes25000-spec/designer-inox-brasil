# Designer Inox Brasil

Site institucional da Designer Inox Brasil — projeto, fabricação, instalação,
automação, refrigeração, exaustão e manutenção em aço inox para cozinhas
industriais, hospitais e operações profissionais em Brasília/DF.

25 páginas construídas em TanStack Start (React) e **pré-renderizadas** em
build para HTML estático. Não há servidor em produção: a Vercel publica o
conteúdo de `dist/client/` diretamente.

## Rodar localmente

```bash
npm run dev
```

Sobe em `http://localhost:8080` (porta fixada pelo wrapper
`@lovable.dev/vite-tanstack-config`, não é configurável por `vite.config.ts`).

## Build

```bash
npm run build
```

Roda em sequência: `vite build` (compila e pré-renderiza as 25 rotas em
`dist/client/`), gera `sitemap.xml` e `robots.txt` a partir dos mesmos dados
de conteúdo (`scripts/sitemap.ts`), e valida a saída inteira
(`scripts/check.mjs`). Link quebrado, `alt` ausente, canonical divergente,
`id` duplicado ou sitemap fora de sincronia falham o build — não apenas
avisam.

Para validar uma saída já existente sem rebuildar:

```bash
npx tsx scripts/check.mjs
```

## Conteúdo

`src/content/` é a fonte única do que aparece no site. Não existe HTML
versionado para editar à mão — os componentes em `src/routes/` e
`src/components/site/` leem os dados daqui, e o build gera as páginas.

| Arquivo | O que controla |
| --- | --- |
| `src/content/site.ts` | Marca, contato, WhatsApp, navegação, clientes, catálogo de fotos |
| `src/content/services.ts` | Os 13 serviços |
| `src/content/segments.ts` | Os 4 segmentos de atuação |

## Fotos: regra de proveniência

Cada entrada de `photos` em `src/content/site.ts` declara sua origem:

- **`own: true`** — foto real de uma obra da Designer Inox Brasil. Aparece
  legendada como **"Projeto Designer Inox"**.
- **sem `own`** — banco de imagens licenciado (Pexels). Aparece rotulada como
  **"Imagem ilustrativa"**, com crédito do autor.

Isso não é uma escolha de estilo, é uma obrigação: uma foto de banco nunca
pode ser apresentada como se fosse obra da empresa. `Photo.tsx` decide a
legenda a partir desse único campo — não adicione uma foto nova sem definir
`own` corretamente.

`docs/content/media-provenance.json` é o manifesto de proveniência: cada foto
tem `sha256`, crédito e licença registrados. `scripts/images.mjs` confere o
hash contra esse manifesto antes de gerar qualquer derivado responsivo, e
para se algo divergir.

## URLs

As 25 URLs (`/`, `/servicos/`, `/cozinhas-industriais/`,
`/segmentos/saude-e-ambientes-hospitalares/` etc.) estão **indexadas** e
todas terminam com barra (`trailingSlash: true` em `vercel.json`). Mudar um
slug depois de indexado quebra SEO. Se um caminho antigo precisar apontar
para um novo, use um redirect 308 em `vercel.json` — já há um exemplo lá
(`/solucoes-em-inox` → `/servicos/`).

## `nitro: false`

`vite.config.ts` desliga o `nitro` de propósito. Com ele ligado, a
pré-renderização "funciona" (build verde, 25 rotas relatadas) mas produz 25
arquivos com o mesmo conteúdo da home — um build que parece certo e está
errado. O comentário acima da opção `nitro` em `vite.config.ts` documenta a
causa raiz; leia-o antes de reativar.
