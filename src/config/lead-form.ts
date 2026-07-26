/**
 * Gate do formulário de orçamento.
 *
 * O formulário progressivo (§10.2) só é liberado quando a prontidão LGPD da
 * Fase 4 estiver satisfeita: controlador identificado, aviso de privacidade
 * aprovado, canal do titular, finalidade e base legal revisadas e retenção
 * configurada. Enquanto o gate não é satisfeito, `/orcamento` apenas orienta o
 * contato pelo WhatsApp — e o rótulo do CTA secundário **não pode prometer** um
 * formulário que ainda não existe.
 *
 * Um único flag controla, ao mesmo tempo, o rótulo e o destino do CTA. Quando o
 * Plano 04 abrir o gate, virar este valor para `true` já troca a cópia em todo
 * o site para "Enviar formulário detalhado".
 */
export const LEAD_FORM_ENABLED = false

/** Rota da página de orçamento — hoje orientação, no futuro o formulário. */
export const QUOTE_PATH = '/orcamento'

/**
 * Rótulo do CTA secundário de orçamento, condicionado ao gate.
 * Fechado: leva à página que explica como enviar a necessidade pelo WhatsApp.
 * Aberto: convida a preencher o formulário detalhado.
 */
export const quoteCtaLabel = LEAD_FORM_ENABLED
  ? 'Enviar formulário detalhado'
  : 'Ver como funciona'
