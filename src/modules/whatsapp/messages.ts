import type { WhatsAppContext } from './contexts'

/**
 * Mensagens por contexto, literais da especificação §10.1.
 *
 * Nenhuma mensagem contém dado pessoal, protocolo ou identificador: a URL do
 * WhatsApp é visível na barra de endereços, entra no histórico e pode ser
 * compartilhada. Só o texto de abertura vai nela.
 */
export const WHATSAPP_MESSAGES: Record<WhatsAppContext, string> = {
  general:
    'Olá, encontrei a Designer Inox Brasil pelo site e gostaria de solicitar uma avaliação. Minha necessidade é:',
  kitchen: 'Olá, gostaria de solicitar uma avaliação para uma cozinha industrial em aço inox.',
  equipment: 'Olá, gostaria de avaliar a fabricação de um equipamento ou mobiliário em aço inox sob medida.',
  ventilation: 'Olá, preciso avaliar uma coifa ou sistema de ventilação e exaustão industrial.',
  'integrated-systems':
    'Olá, preciso avaliar refrigeração, aquecimento ou automação integrada a uma solução em aço inox.',
  cnc: 'Olá, gostaria de avaliar um projeto técnico ou fabricação com corte a plasma CNC.',
  renovation: 'Olá, gostaria de avaliar a reforma ou modernização de uma estrutura industrial em inox.',
  maintenance:
    'Olá, preciso de manutenção ou proposta de contrato para estruturas e equipamentos em inox.',
  project: 'Olá, quero uma solução semelhante a este projeto.',
}
