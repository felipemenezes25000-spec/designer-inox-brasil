import type { PublicService } from '@/modules/content/public/types'
import type { ServiceWhatsAppContext } from '@/modules/whatsapp/contexts'

import { serviceFaqs } from './faqs'
import {
  MEDIA_EQUIPMENT,
  MEDIA_HOOD,
  MEDIA_INDUSTRIAL_KITCHEN,
  MEDIA_KITCHEN,
  MEDIA_MODERN_KITCHEN,
  MEDIA_PLASMA,
  MEDIA_WELDING,
  MEDIA_WORKSHOP,
} from './media'
import { processForService } from './process'

/**
 * As sete soluções iniciais.
 *
 * Cópia literal do contrato fechado do plano. Cada `seo.description` é
 * exclusiva e escrita à mão — derivá-la do resumo do hero produziria textos
 * quase idênticos, que os buscadores tratam como duplicados.
 *
 * Os entregáveis são sempre condicionados ("quando contratado", "previstos na
 * proposta"): nada aqui promete item, prazo ou resultado não confirmado.
 */

type ServiceSeed = Omit<PublicService, 'id' | 'process' | 'faqs' | 'updatedAt'>

const UPDATED_AT = '2026-07-25T00:00:00.000Z'

const seeds: readonly ServiceSeed[] = [
  {
    slug: 'cozinhas-industriais',
    title: 'Cozinhas industriais completas em aço inox',
    eyebrow: 'Cozinhas completas',
    summary:
      'Projeto aplicado, fabricação, instalação e integração de estruturas e equipamentos para cozinhas profissionais.',
    needs: [
      'implantação de uma operação nova',
      'reorganização de fluxo e áreas de trabalho',
      'integração de estruturas, equipamentos e sistemas associados',
    ],
    deliverables: [
      'levantamento e definição do escopo',
      'projeto técnico aplicado quando contratado',
      'fabricação e instalação dos itens aprovados',
      'integração e testes previstos na proposta',
    ],
    relatedServiceSlugs: [
      'equipamentos-em-inox',
      'coifas-ventilacao-e-exaustao',
      'sistemas-integrados-em-inox',
    ],
    heroMedia: MEDIA_KITCHEN,
    whatsappContext: 'kitchen',
    seo: {
      title: 'Cozinhas industriais completas em aço inox | Designer Inox Brasil',
      description:
        'Planejamento, fabricação e instalação de cozinhas industriais em inox, com equipamentos e sistemas integrados conforme o escopo aprovado.',
    },
  },
  {
    slug: 'equipamentos-em-inox',
    title: 'Equipamentos e mobiliário em inox sob medida',
    eyebrow: 'Equipamentos sob medida',
    summary:
      'Fabricação dimensionada para o espaço, o fluxo de trabalho e o uso profissional informado pelo cliente.',
    needs: [
      'mobiliário fora de medidas padronizadas',
      'equipamento adequado ao espaço e ao uso informado',
      'substituição ou ampliação de item existente',
    ],
    deliverables: [
      'levantamento de medidas e interferências',
      'detalhamento do item aprovado',
      'fabricação em inox',
      'instalação quando incluída no escopo',
    ],
    relatedServiceSlugs: [
      'cozinhas-industriais',
      'projeto-tecnico-e-fabricacao-cnc',
      'manutencao',
    ],
    heroMedia: MEDIA_EQUIPMENT,
    whatsappContext: 'equipment',
    seo: {
      title: 'Equipamentos e mobiliário em inox sob medida | Designer Inox Brasil',
      description:
        'Equipamentos em aço inox sob medida, do levantamento e detalhamento à fabricação e instalação previstas na proposta aprovada.',
    },
  },
  {
    slug: 'coifas-ventilacao-e-exaustao',
    title: 'Coifas, ventilação e exaustão industrial',
    eyebrow: 'Exaustão',
    summary:
      'Avaliação e integração de coifas, dutos, filtragem, captação e renovação de ar para ambientes profissionais.',
    needs: [
      'captação de vapores, calor e contaminantes do processo',
      'renovação ou movimentação de ar',
      'adequação de coifas, dutos e componentes existentes',
    ],
    deliverables: [
      'avaliação do ambiente e dos equipamentos informados',
      'definição de coifas, dutos, filtragem e insuflamento aplicáveis',
      'fabricação e montagem do escopo aprovado',
      'testes funcionais previstos na proposta',
    ],
    relatedServiceSlugs: [
      'cozinhas-industriais',
      'sistemas-integrados-em-inox',
      'manutencao',
    ],
    heroMedia: MEDIA_HOOD,
    whatsappContext: 'ventilation',
    seo: {
      title: 'Coifas, ventilação e exaustão industrial | Designer Inox Brasil',
      description:
        'Coifas, dutos, filtragem, insuflamento e exaustão para operações profissionais, definidos após avaliação do ambiente e do processo.',
    },
  },
  {
    slug: 'sistemas-integrados-em-inox',
    title: 'Sistemas integrados a estruturas e equipamentos em inox',
    eyebrow: 'Automação e sistemas',
    summary:
      'Refrigeração, aquecimento, sensores, comandos e automação incorporados ao escopo em aço inox.',
    needs: [
      'refrigeração incorporada a equipamentos ou estruturas',
      'aquecimento controlado',
      'sensores, comandos e automação da solução contratada',
    ],
    deliverables: [
      'definição das interfaces do sistema',
      'integração de componentes e infraestrutura prevista',
      'montagem, configuração e testes do escopo',
      'orientação operacional da entrega',
    ],
    relatedServiceSlugs: ['equipamentos-em-inox', 'cozinhas-industriais', 'manutencao'],
    heroMedia: MEDIA_INDUSTRIAL_KITCHEN,
    whatsappContext: 'integrated-systems',
    seo: {
      title: 'Sistemas integrados a estruturas e equipamentos em inox | Designer Inox Brasil',
      description:
        'Refrigeração, aquecimento, sensores, comandos e automação integrados a estruturas e equipamentos em inox conforme a solução contratada.',
    },
  },
  {
    slug: 'projeto-tecnico-e-fabricacao-cnc',
    title: 'Projeto técnico aplicado e fabricação com corte a plasma CNC',
    eyebrow: 'Projeto e corte CNC',
    summary:
      'Levantamento, desenvolvimento técnico, corte de chapas e fabricação associados à necessidade apresentada.',
    needs: [
      'transformação de medidas ou desenhos em peças fabricáveis',
      'corte de chapas para lote ou componente sob medida',
      'apoio técnico associado à fabricação contratada',
    ],
    deliverables: [
      'conferência dos arquivos e requisitos recebidos',
      'detalhamento técnico dentro do escopo',
      'corte a plasma CNC',
      'acabamento e fabricação complementar quando contratados',
    ],
    relatedServiceSlugs: [
      'equipamentos-em-inox',
      'cozinhas-industriais',
      'reformas-e-modernizacoes',
    ],
    heroMedia: MEDIA_PLASMA,
    whatsappContext: 'cnc',
    seo: {
      title: 'Projeto técnico aplicado e fabricação com corte a plasma CNC | Designer Inox Brasil',
      description:
        'Projeto técnico aplicado, detalhamento e corte a plasma CNC para peças e conjuntos em inox, com fabricação complementar quando contratada.',
    },
  },
  {
    slug: 'reformas-e-modernizacoes',
    title: 'Reformas e modernizações de estruturas industriais em inox',
    eyebrow: 'Reformas',
    summary:
      'Recuperação, ampliação e reconfiguração de instalações e equipamentos existentes após avaliação.',
    needs: [
      'recuperação de estrutura ou equipamento existente',
      'mudança de layout, capacidade ou forma de uso',
      'integração de novos componentes à instalação atual',
    ],
    deliverables: [
      'diagnóstico inicial do estado aparente',
      'definição do que será preservado, removido ou substituído',
      'fabricação e montagem das alterações aprovadas',
      'testes do escopo modificado',
    ],
    relatedServiceSlugs: [
      'equipamentos-em-inox',
      'sistemas-integrados-em-inox',
      'manutencao',
    ],
    heroMedia: MEDIA_MODERN_KITCHEN,
    whatsappContext: 'renovation',
    seo: {
      title: 'Reformas e modernizações de estruturas industriais em inox | Designer Inox Brasil',
      description:
        'Reformas e modernizações em estruturas e equipamentos de inox, com diagnóstico inicial, fabricação, montagem e testes do escopo aprovado.',
    },
  },
  {
    slug: 'manutencao',
    title: 'Manutenção de estruturas e equipamentos industriais em inox',
    eyebrow: 'Manutenção',
    summary:
      'Atendimento preventivo, corretivo e contratos definidos conforme quantidade, condição e criticidade informadas.',
    needs: [
      'falha observada em equipamento ou estrutura',
      'rotina preventiva planejada',
      'avaliação de contrato para múltiplas unidades ou ativos',
    ],
    deliverables: [
      'triagem e levantamento inicial',
      'diagnóstico dentro das condições acessíveis',
      'proposta corretiva, preventiva ou contratual',
      'registro do serviço executado quando contratado',
    ],
    relatedServiceSlugs: [
      'equipamentos-em-inox',
      'coifas-ventilacao-e-exaustao',
      'sistemas-integrados-em-inox',
    ],
    heroMedia: MEDIA_WORKSHOP,
    whatsappContext: 'maintenance',
    seo: {
      title: 'Manutenção de estruturas e equipamentos industriais em inox | Designer Inox Brasil',
      description:
        'Manutenção preventiva e corretiva de estruturas, equipamentos e sistemas em inox, iniciada por triagem e diagnóstico das condições acessíveis.',
    },
  },
]

export const initialServices: readonly PublicService[] = seeds.map((seed) => ({
  ...seed,
  id: `service-${seed.slug}`,
  process: processForService(seed.slug),
  faqs: serviceFaqs[seed.slug] ?? [],
  updatedAt: UPDATED_AT,
}))

export const SERVICE_CONTEXT_BY_SLUG: Record<string, ServiceWhatsAppContext> =
  Object.fromEntries(initialServices.map((service) => [service.slug, service.whatsappContext]))
