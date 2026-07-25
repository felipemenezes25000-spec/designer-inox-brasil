import type { WhatsAppContext } from '@/modules/whatsapp/contexts'

/**
 * Barramento neutro de eventos públicos.
 *
 * Não conhece fornecedor: não há `dataLayer`, GTM nem SDK no Plano 02. O
 * Plano 05 assina este barramento e decide o que encaminhar, mas só depois do
 * consentimento correspondente.
 *
 * O payload é fechado por tipo de propósito. Nome, telefone, e-mail,
 * descrição, protocolo, nome de arquivo e query string estão ausentes por
 * construção, não por convenção — não existe campo onde caberiam.
 */

export type PublicSiteEvent = {
  name: 'whatsapp_click'
  context: WhatsAppContext
  path: `/${string}`
}

type Subscriber = (event: PublicSiteEvent) => void

const subscribers = new Set<Subscriber>()

export function subscribeToPublicSiteEvents(subscriber: Subscriber): () => void {
  subscribers.add(subscriber)
  return () => {
    subscribers.delete(subscriber)
  }
}

export function publishPublicSiteEvent(event: PublicSiteEvent): void {
  for (const subscriber of subscribers) {
    try {
      subscriber(event)
    } catch {
      // Um assinante com defeito nunca pode impedir a navegação do usuário:
      // o clique no WhatsApp precisa acontecer mesmo se o analytics falhar.
    }
  }
}

/** Somente para testes. */
export function clearPublicSiteEventSubscribers(): void {
  subscribers.clear()
}
