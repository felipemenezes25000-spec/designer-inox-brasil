/**
 * Contextos de conversão por WhatsApp.
 *
 * Fonte única de verdade, consumida por conteúdo, links e analytics. Manter
 * uma lista só é o que impede que um contexto exista no conteúdo mas não na
 * mensagem, ou que um evento seja emitido com um valor que nenhuma página usa.
 */
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

/** Contextos que correspondem a uma página de serviço com rota própria. */
export type ServiceWhatsAppContext = Exclude<WhatsAppContext, 'general' | 'project'>

export function isWhatsAppContext(value: string): value is WhatsAppContext {
  return (WHATSAPP_CONTEXTS as readonly string[]).includes(value)
}
