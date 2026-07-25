import type { WhatsAppContext } from './contexts'
import { WHATSAPP_MESSAGES } from './messages'

/** Número confirmado na especificação §10.1. */
export const WHATSAPP_DIGITS = '5561996831052'
export const WHATSAPP_DISPLAY = '+55 61 99683-1052'
export const WHATSAPP_BASE_URL = `https://wa.me/${WHATSAPP_DIGITS}`

/**
 * Monta o link do WhatsApp para um contexto.
 *
 * Só o parâmetro `text` é permitido. Nome, telefone, e-mail, descrição ou
 * protocolo jamais entram na URL: ela fica visível na barra de endereços, é
 * gravada no histórico do navegador e vaza no `Referer` de qualquer navegação
 * subsequente.
 *
 * `URLSearchParams` codifica em `application/x-www-form-urlencoded`, que troca
 * espaço por `+`. O WhatsApp interpreta `+` literalmente, então a codificação
 * é feita com `encodeURIComponent`.
 */
export function buildWhatsAppHref(context: WhatsAppContext): string {
  const message = WHATSAPP_MESSAGES[context]
  if (!message) throw new Error(`UNKNOWN_WHATSAPP_CONTEXT: ${context}`)

  return `${WHATSAPP_BASE_URL}?text=${encodeURIComponent(message)}`
}
