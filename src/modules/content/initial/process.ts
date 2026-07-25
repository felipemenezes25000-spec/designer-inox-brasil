import type { ProcessStep } from '@/modules/content/public/types'

/**
 * As seis etapas do processo, comuns a todas as páginas de solução.
 *
 * A cópia é descritiva de propósito: nenhuma etapa promete prazo, valor,
 * visita gratuita ou resultado. "Dentro do escopo contratado" e "previsto na
 * proposta" são condicionantes explícitos exigidos pela especificação §3.
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
    description: 'Testamos o que foi entregue e orientamos a continuidade de manutenção.',
  },
]
