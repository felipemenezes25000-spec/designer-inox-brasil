import type { ProcessStep } from '@/modules/content/public/types'

/**
 * As seis etapas do processo.
 *
 * A cópia é descritiva de propósito: nenhuma etapa promete prazo, valor,
 * visita gratuita ou resultado. "Dentro do escopo contratado" e "previsto na
 * proposta" são condicionantes explícitos exigidos pela especificação §3.
 *
 * Serviços que não seguem o fluxo completo de fabricação e instalação recebem
 * etapas personalizadas via `processForService`.
 */
export const commonProcess: readonly ProcessStep[] = [
  {
    id: 'understand',
    title: 'Entender',
    description: 'Mapeamos a operação, o espaço e a necessidade apresentada.',
  },
  {
    id: 'survey',
    title: 'Levantar',
    description: 'Conferimos medidas, interferências e condições que influenciam o escopo.',
  },
  {
    id: 'define',
    title: 'Definir',
    description: 'Organizamos materiais, sistemas, entregáveis e limites da proposta.',
  },
  {
    id: 'fabricate',
    title: 'Fabricar',
    description: 'Produzimos os componentes em inox previstos no projeto aprovado.',
  },
  {
    id: 'install',
    title: 'Instalar',
    description: 'Montamos e integramos a solução dentro do escopo contratado.',
  },
  {
    id: 'follow',
    title: 'Acompanhar',
    description: 'Verificamos o que foi entregue e orientamos os cuidados posteriores.',
  },
]

const maintenanceProcess: readonly ProcessStep[] = [
  {
    id: 'understand',
    title: 'Entender',
    description: 'Identificamos o equipamento, o sintoma e a criticidade informada.',
  },
  {
    id: 'survey',
    title: 'Levantar',
    description: 'Verificamos condições de acesso, estado aparente e histórico disponível.',
  },
  {
    id: 'define',
    title: 'Definir',
    description: 'Organizamos diagnóstico, peças, intervenções e limites da proposta.',
  },
  {
    id: 'fabricate',
    title: 'Reparar ou substituir',
    description: 'Executamos a correção ou a troca dos componentes previstos no escopo.',
  },
  {
    id: 'install',
    title: 'Restabelecer',
    description: 'Remontamos, testamos e devolvemos o equipamento à operação.',
  },
  {
    id: 'follow',
    title: 'Acompanhar',
    description: 'Registramos o serviço e orientamos a próxima revisão, quando aplicável.',
  },
]

const cncProcess: readonly ProcessStep[] = [
  {
    id: 'understand',
    title: 'Entender',
    description: 'Analisamos os arquivos, as quantidades e o resultado esperado.',
  },
  {
    id: 'survey',
    title: 'Levantar',
    description: 'Conferimos requisitos de material, tolerância e acabamento.',
  },
  {
    id: 'define',
    title: 'Definir',
    description: 'Detalhamos o escopo técnico e os limites da fabricação.',
  },
  {
    id: 'fabricate',
    title: 'Fabricar',
    description: 'Executamos corte, conformação e acabamento previstos na proposta.',
  },
  {
    id: 'install',
    title: 'Entregar',
    description: 'Conferimos dimensões e acabamento antes da liberação das peças.',
  },
  {
    id: 'follow',
    title: 'Acompanhar',
    description: 'Verificamos a aplicação e registramos observações para lotes futuros.',
  },
]

const reformProcess: readonly ProcessStep[] = [
  commonProcess[0],
  commonProcess[1],
  commonProcess[2],
  {
    id: 'fabricate',
    title: 'Fabricar ou reparar',
    description: 'Produzimos novos componentes ou recuperamos os existentes conforme o escopo.',
  },
  {
    id: 'install',
    title: 'Instalar',
    description: 'Montamos e integramos as alterações dentro do escopo contratado.',
  },
  {
    id: 'follow',
    title: 'Acompanhar',
    description: 'Verificamos o resultado e orientamos os cuidados posteriores.',
  },
]

export function processForService(slug: string): readonly ProcessStep[] {
  switch (slug) {
    case 'manutencao':
      return maintenanceProcess
    case 'projeto-tecnico-e-fabricacao-cnc':
      return cncProcess
    case 'reformas-e-modernizacoes':
      return reformProcess
    default:
      return commonProcess
  }
}
