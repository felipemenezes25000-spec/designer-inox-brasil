# O que foi reformulado

## Arquitetura

- Site passou a ser **gerado** a partir de `src/`, não escrito à mão. Header,
  rodapé e navegação existiam duplicados em 17 arquivos; agora existem em um.
- Verificador reescrito: além de `h1`/`alt`/links, cobre canonical, ids
  duplicados, assets quebrados, `rel="noopener"`, sitemap e divergência entre o
  HTML no disco e o que o gerador produz.

## Identidade visual

- Paleta extraída do próprio símbolo da marca — engrenagem em aço escovado +
  floco de neve. O acento passou a ser o azul glacial `#407182` da logo, no
  lugar do laranja `#ff6319`, que brigava com a identidade.
- Cada acento tem duas versões: clara para fundo escuro e escura ("ink") para
  fundo claro. As versões ink foram medidas — mínimo 5,1:1.
- Cor codifica a natureza do serviço: azul no frio, âmbar no calor, amarelo na
  elétrica, verde na higiene.
- Tipografia trocada de Arial para **Sora + Inter**, self-hosted em woff2.
- Logo oficial aplicada no cabeçalho, rodapé, favicons e imagem social.

## Conteúdo

- De 7 para **13 serviços**. Entraram: sistema saponificante para exaustão,
  refrigeração, aquecimento, sistemas de CO₂, automação elétrica e manutenção
  de equipamentos hospitalares.
- Novo índice de serviços em `/servicos/`, agrupado por categoria.
- Nova página `/clientes/` com 23 organizações agrupadas por setor.
- Novo segmento "Saúde e ambientes hospitalares".
- Fotografia real em todas as páginas, com derivados AVIF/WebP responsivos.

## Correções da auditoria

- `.eyebrow` era sequestrado por regras de container `p` em 21 páginas, que
  sobrescreviam cor e tamanho de fonte.
- `--accent-text` declarado no `:root` não reagia à classe de acento do
  `<body>`: toda página herdava o azul padrão.
- Anel de foco tinha 2,05:1 sobre fundo claro — abaixo do mínimo de 3:1.
- Links de "Privacidade/Termos" tinham 12px de altura de toque.
- `Cache-Control: immutable` de um ano estava aplicado a `styles.css` e
  `main.js`, que não têm hash no nome.
- Servidor de desenvolvimento não conhecia os MIME de imagem nem de fonte.
- `sitemap.xml`, `robots.txt`, JSON-LD, canonical e imagem OG não existiam.

## Verificação executada

- 25 páginas auditadas em 1280px e 375px: **zero** falhas de contraste, **zero**
  overflow horizontal, `h1` único em cada uma.
- Formulário testado: bloqueia submissão incompleta e monta a mensagem
  preservando caracteres especiais.
- Menu mobile: `aria-expanded`, trava de scroll, Escape fecha e devolve o foco.

## Pendências

- As fotografias são de banco licenciado e estão rotuladas como ilustrativas.
  Fotos reais de obra aumentariam muito a credibilidade — a troca é direta,
  basta substituir os arquivos-fonte mantendo os nomes.
- **Lista de clientes: duas linhas foram fundidas.** "JC Engenharia" e
  "JC Goltigio" viraram um único "JC Gontijo"; "Hot Cozinha Industrial Ltda.
  (Stutz…)" e "Stutz Soluções em Alimentação" viraram uma entrada só. Das 25
  linhas informadas restaram 23 organizações. Confirmar antes de publicar —
  ver o comentário em `src/content/site.mjs`.
- Razão social e CNPJ ainda não constam da política de privacidade.
