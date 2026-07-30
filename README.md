# Designer Inox Brasil

Site institucional estático: 25 páginas, sem framework e sem nenhuma
dependência em tempo de execução. O HTML é **gerado** a partir dos dados em
`src/` e versionado na raiz — a Vercel publica os arquivos direto, sem build.

## Rodar localmente

```bash
npm run dev
```

O servidor reproduz o `cleanUrls` e o `trailingSlash` da produção, então um
link que funciona aqui funciona no domínio final.

## Fluxo de trabalho

**Nunca edite os arquivos `.html` da raiz.** Eles são gerados e a próxima
execução do gerador sobrescreve qualquer alteração manual. O `npm run check`
falha de propósito se detectar essa divergência.

Para mudar conteúdo, edite `src/content/`:

| Arquivo | O que controla |
| --- | --- |
| `src/content/site.mjs` | Marca, contato, WhatsApp, menu, **clientes**, fotos |
| `src/content/services.mjs` | Os 13 serviços: textos, escopo, FAQ, acento de cor |
| `src/content/segments.mjs` | Os 4 segmentos de atuação |
| `src/templates/` | Casca HTML, blocos de página e esquemas técnicos SVG |

Depois de qualquer mudança:

```bash
npm run build
```

Isso regenera as 26 páginas (25 + a 404), o `sitemap.xml` e o `robots.txt`, e
roda o verificador.

## O que o verificador cobre

`npm run check` falha o build em qualquer um destes casos:

- `<h1>` ausente ou duplicado, `lang`, `charset` ou `viewport` faltando
- imagem sem `alt`
- `id` duplicado na mesma página
- link ou asset referenciado que não existe no disco
- `canonical` divergente da URL realmente servida
- `target="_blank"` sem `rel="noopener"`
- rota fora do `sitemap.xml` (ou o inverso)
- **HTML no disco diferente do que o gerador produz hoje**

Avisa (sem falhar) sobre `title` acima de 70 caracteres, `description` acima de
170 e imagem sem `width`/`height`.

## Imagens

As fotos originais ficam em `assets/content/illustrative/` e **não são
publicadas** — servem apenas de fonte. O `npm run images` confere o `sha256` de
cada uma contra `docs/content/media-provenance.json` e só então gera os
derivados em `assets/img/photos/`: recorte 3:2 em 640/1280/1920, nos formatos
AVIF e WebP, com um JPEG de fallback. Também produz a imagem de compartilhamento
`og-default.jpg` e os placeholders inline de 20px.

Rode `npm run images` apenas quando adicionar ou trocar uma foto.

> Toda fotografia é de banco licenciado (Pexels License) e aparece rotulada
> como **imagem ilustrativa**. Nenhuma representa obra, equipe, instalação ou
> cliente da Designer Inox Brasil. Se um dia houver fotos reais autorizadas,
> basta substituir os arquivos-fonte mantendo os nomes e atualizar o manifesto.

## Publicar na Vercel

Nenhuma configuração de build é necessária — `vercel.json` já define
`buildCommand` e `installCommand` vazios e `outputDirectory: "."`. Basta que os
arquivos gerados estejam commitados.

Projeto de destino: **`designer-inox-cinematic`**.

### Detalhes que não são óbvios

- `styles.css` e `main.js` recebem `?v=<hash do conteúdo>` no HTML. Sem isso,
  um `Cache-Control` longo prenderia visitantes recorrentes à versão antiga,
  porque os nomes desses arquivos não mudam.
- A CSP permite `'unsafe-inline'` apenas em `style-src`. É necessário porque
  cada `<picture>` carrega o placeholder num atributo `style` inline. `script-src`
  continua restrito a `'self'`.
- `.vercelignore` mantém fora do deploy os 6,7 MB de fontes (JPEGs originais,
  master da marca, `src/`, `scripts/`) que precisam existir no repositório mas
  nunca são baixados por quem visita.

## Antes da publicação definitiva

1. **Confirmar a lista de clientes.** Duas fusões foram feitas por
   interpretação: "JC Engenharia" + "JC Goltigio" → **JC Gontijo**, e
   "Hot Cozinha Industrial Ltda. (Stutz…)" + "Stutz Soluções em Alimentação" →
   uma entrada só. Das 25 linhas informadas restaram 23 organizações. Ver o
   comentário em `src/content/site.mjs`.
2. Validar razão social e CNPJ para a política de privacidade e os termos.
3. Confirmar telefone e Instagram no domínio final.
4. Não adicionar cases, depoimentos ou números sem comprovação.

## Contato configurado

WhatsApp: `5561996831052` — (61) 99683-1052


## Redesign de conversão — julho de 2026

A home, os CTAs globais e a página de orçamento receberam uma revisão focada em clareza, prova de confiança, WhatsApp contextual e experiência mobile. O relatório completo está em `AUDITORIA-E-MELHORIAS.md`.
