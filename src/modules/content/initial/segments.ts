import type { PublicSegment } from '@/modules/content/public/types'

import { segmentFaqs } from './faqs'
import { MEDIA_KITCHEN } from './media'

/**
 * Os três segmentos iniciais.
 *
 * Os "pontos de atenção" descrevem condições operacionais — fluxo, calor,
 * carga, continuidade — e nunca alegações regulatórias. Afirmar conformidade
 * com norma sanitária ou técnica exigiria documentação e revisão que não
 * existem, e a especificação §9.3 proíbe explicitamente.
 */

const UPDATED_AT = '2026-07-25T00:00:00.000Z'

type SegmentSeed = Omit<PublicSegment, 'id' | 'faqs' | 'whatsappContext' | 'updatedAt' | 'seo'> & {
  seoTitle: string
}

const seeds: readonly SegmentSeed[] = [
  {
    slug: 'restaurantes-e-cozinhas-profissionais',
    title: 'Inox para restaurantes e cozinhas profissionais',
    summary:
      'Operações que precisam coordenar preparo, cocção, higienização, circulação, armazenamento e atendimento.',
    operationalContext:
      'Em restaurantes e cozinhas profissionais, o mesmo espaço precisa sustentar preparo, cocção, higienização e circulação de pessoas ao mesmo tempo. A definição das estruturas e dos equipamentos parte do fluxo real da operação, e não de um layout padrão.',
    carePoints: [
      'fluxo entre etapas',
      'calor e umidade',
      'limpeza e acesso',
      'continuidade do serviço',
    ],
    serviceSlugs: [
      'cozinhas-industriais',
      'equipamentos-em-inox',
      'coifas-ventilacao-e-exaustao',
      'sistemas-integrados-em-inox',
      'manutencao',
    ],
    heroMedia: MEDIA_KITCHEN,
    seoTitle: 'Inox para restaurantes e cozinhas profissionais | Designer Inox',
  },
  {
    slug: 'hotelaria-e-alimentacao-coletiva',
    title: 'Inox para hotelaria e alimentação coletiva',
    summary:
      'Ambientes com produção recorrente, múltiplos pontos de serviço e necessidade de padronizar a operação.',
    operationalContext:
      'Hotelaria e alimentação coletiva combinam produção recorrente com vários pontos de serviço. Padronizar estruturas e equipamentos reduz variação entre turnos e simplifica o planejamento de manutenção.',
    carePoints: [
      'volume e horários de pico',
      'deslocamento interno',
      'interfaces entre áreas',
      'planejamento de manutenção',
    ],
    serviceSlugs: [
      'cozinhas-industriais',
      'equipamentos-em-inox',
      'coifas-ventilacao-e-exaustao',
      'sistemas-integrados-em-inox',
      'reformas-e-modernizacoes',
      'manutencao',
    ],
    heroMedia: MEDIA_KITCHEN,
    seoTitle: 'Inox para hotelaria e alimentação coletiva | Designer Inox',
  },
  {
    slug: 'producao-e-varejo-de-alimentos',
    title: 'Inox para produção e varejo de alimentos',
    summary:
      'Produção, apoio e exposição de alimentos em operações que combinam fabricação, armazenamento e atendimento.',
    operationalContext:
      'Produção e varejo de alimentos reúnem fabricação, armazenamento e atendimento no mesmo conjunto. A sequência do processo e a movimentação de carga orientam onde cada estrutura e equipamento faz sentido.',
    carePoints: [
      'sequência do processo',
      'temperatura e umidade',
      'carga e movimentação',
      'expansão futura',
    ],
    serviceSlugs: [
      'equipamentos-em-inox',
      'sistemas-integrados-em-inox',
      'projeto-tecnico-e-fabricacao-cnc',
      'reformas-e-modernizacoes',
      'manutencao',
    ],
    heroMedia: MEDIA_KITCHEN,
    seoTitle: 'Inox para produção e varejo de alimentos | Designer Inox',
  },
]

export const initialSegments: readonly PublicSegment[] = seeds.map(({ seoTitle, ...seed }) => ({
  ...seed,
  id: `segment-${seed.slug}`,
  whatsappContext: 'general',
  faqs: segmentFaqs(seed.slug),
  updatedAt: UPDATED_AT,
  seo: {
    title: seoTitle,
    description: `${seed.summary} Conheça as soluções relacionadas da Designer Inox Brasil.`,
  },
}))
