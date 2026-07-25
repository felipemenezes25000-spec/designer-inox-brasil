# Validação responsiva da logo — Designer Inox Brasil

**Data:** 25 de julho de 2026
**Método:** composição 1:1 dos ativos publicados sobre grafite `#0D1218` e branco técnico
`#F8FAFC`, com ampliação 6× por vizinho mais próximo para inspeção de pixel.

## Resultado por contexto

| Contexto | Ativo | Resultado |
|---|---|---|
| Cabeçalho desktop (72 px), fundo escuro | `lockup-negative` a 44 px de altura | **Aprovado** — símbolo e wordmark legíveis, sem colapso de traço |
| Cabeçalho desktop (72 px), fundo claro | `lockup-positive` a 44 px de altura | **Aprovado** |
| Cabeçalho mobile (64 px), fundo escuro | `lockup-negative` a 32 px de altura | **Aprovado** — wordmark ainda legível |
| Cabeçalho mobile (64 px), fundo claro | `lockup-positive` a 32 px de altura | **Aprovado** |
| Favicon 32 px | `icon-32.png` | **Aprovado** — engrenagem e floco distinguíveis |
| Favicon 16 px | `icon-16.png` | **Aprovado com ressalva** — ver abaixo |
| Ícone de toque 180 px | `icon-180.png` | **Aprovado** — arte completa, acabamento preservado |
| Símbolo isolado sobre grafite | `symbol-negative` | **Aprovado** — sem halo residual nem franja |
| Símbolo isolado sobre branco | `symbol-positive` | **Aprovado** — silhueta grafite com contraste pleno |

## Achado: legibilidade abaixo de 48 px

A primeira geração usou a arte tridimensional em prata para todos os tamanhos. A 16 e 32 px o
resultado ficou ilegível: o degradê metálico ocupa a mesma faixa tonal dos vãos entre os dentes da
engrenagem e do miolo do floco, e o downsample transforma a marca em ruído.

Comparação registrada lado a lado entre arte tridimensional, silhueta clara sobre grafite e
silhueta grafite sobre branco. As duas silhuetas são nitidamente superiores nos dois tamanhos.

**Decisão aplicada:** abaixo de 48 px o gerador usa o ícone simplificado autorizado pela
especificação §6.4 — a mesma silhueta alfa do master preenchida em prata clara `#E7EDF2` sobre
grafite opaco `#0D1218`. Só o acabamento muda; **a geometria é idêntica ao master**. Nenhum traço
foi redesenhado, removido ou acrescentado.

A ressalva a 16 px é inerente à complexidade do símbolo: a essa resolução a marca lê como massa
reconhecível, mas dentes e braços individuais não são resolvíveis. Reduzir a contagem de dentes ou
simplificar o floco seria **redesenhar a marca** e depende de decisão explícita do proprietário —
não foi feito.

## Pendências que exigem ambiente real

Estes itens não podem ser comprovados por composição de imagem e ficam registrados como
**pendentes**, não aprovados:

| Item | Por que está pendente |
|---|---|
| Modo de alto contraste do Windows | Depende de `forced-colors: active` em navegador real; será verificado no roteiro manual do Plano 05 |
| Aba do navegador em tema claro e escuro | Depende do cromo real do Chrome, Edge, Firefox e Safari |
| Tela de início do iOS | Exige dispositivo físico, conforme a matriz da especificação §20 |

Nenhuma dessas linhas pode ser marcada como aprovada com base apenas nas evidências desta etapa.
