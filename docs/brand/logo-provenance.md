# Proveniência da logo — Designer Inox Brasil

**Data:** 25 de julho de 2026

## Master

| Campo | Valor |
|---|---|
| Origem | `D:\LOGO OFICIALL.png`, fornecido pelo proprietário |
| Cópia versionada | `assets/brand/source/logo-official.png` |
| SHA-256 | `BDBC9A38A01E60D451C4433CA72FF812F8E661DB476F4406585C96955287AD40` |
| Dimensões | 1024 × 1536 |
| Canais | RGBA, com alpha |

A cópia foi conferida byte a byte contra o original: os dois hashes são idênticos e iguais ao
hash aprovado na especificação. **O arquivo original nunca é escrito.** `prepare-symbol.mjs` e
`generate-logo-assets.mjs` gravam exclusivamente em `assets/brand/derived`, `public/brand` e nos
dois ícones de rota do App Router.

## Achado que alterou o procedimento

O plano previa remover o fundo e o halo externo do master com edição assistida por modelo, e
alertava para nunca redesenhar a marca.

A inspeção do arquivo mostrou que **essa etapa é desnecessária**: o master já traz o símbolo
isolado no canal alpha.

| Medição | Resultado |
|---|---|
| Pixels com alpha 0 | 92,15% |
| Pixels com alpha 255 | 2,09% |
| Pixels com alpha parcial | 5,76% |
| Caixa delimitadora de alpha > 8 | (273, 451) → (758, 969), 486 × 519 |
| A caixa toca alguma borda? | Não |

O gradiente cinza visível em alguns visualizadores é RGB residual **sob alpha 0** — não é fundo
real. Visualizadores que ignoram o canal alpha exibem esse resíduo; qualquer composição correta o
descarta.

Portanto o recorte passou a ser um `trim` estrito do alpha (`threshold: 0`, sem tolerância de cor),
executado por `scripts/brand/prepare-symbol.mjs`. Essa abordagem é estritamente superior à
prevista no plano:

- preserva geometria, dentes da engrenagem, floco, contornos e acabamento prata/azul byte a byte;
- é determinística e reproduzível a partir do master;
- elimina por completo o risco de o modelo alterar a forma da marca.

Verificação visual registrada: o recorte foi composto sobre grafite `#0D1218` e sobre branco
técnico `#F8FAFC` e inspecionado — bordas limpas, sem halo residual e sem franja de cor.

## Derivados

| Arquivo | Origem | Observação |
|---|---|---|
| `assets/brand/derived/symbol-isolated.png` | `trim` do alpha do master | 486 × 519 |
| `assets/brand/derived/wordmark-sora.png` | Playwright + Sora 600 | 1272 × 159, raster canônico |
| `public/brand/symbol-negative.{png,webp,avif}` | arte original em prata/azul | 512 × 512, para fundos escuros |
| `public/brand/symbol-positive.{png,webp,avif}` | mesmo alpha preenchido em `#0D1218` | 512 × 512, para fundos claros |
| `public/brand/lockup-negative.{png,webp,avif}` | símbolo + wordmark `#E7EDF2` | 1200 × 320 |
| `public/brand/lockup-positive.{png,webp,avif}` | símbolo grafite + wordmark `#0D1218` | 1200 × 320 |
| `public/brand/icon-{16,32,180}.png` | símbolo redimensionado | 180 px é opaco para o iOS |
| `src/app/(frontend)/icon.png` | cópia do ícone de 32 px | favicon do App Router |
| `src/app/(frontend)/apple-icon.png` | cópia do ícone de 180 px | ícone de toque |

Nenhum SVG foi produzido nesta fase: o master é raster e a condição de preservação vetorial da
especificação (§6.4) não pode ser comprovada.

## Integridade

`assets/brand/logo-manifest.json` registra o SHA-256 aprovado de master, símbolo, wordmark e das
duas fontes. `generate-logo-assets.mjs` recusa executar se qualquer entrada divergir, e
`tests/unit/brand/logo-assets.test.ts` verifica os mesmos hashes na suíte unitária.
