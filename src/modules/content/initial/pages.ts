import type { PublicPage } from '@/modules/content/public/types'

import { globalFaqs } from './faqs'
import { MEDIA_KITCHEN, MEDIA_WELDING } from './media'
import { commonProcess } from './process'

const UPDATED_AT = '2026-07-25T00:00:00.000Z'

const ALL_SERVICE_SLUGS = [
  'cozinhas-industriais',
  'equipamentos-em-inox',
  'coifas-ventilacao-e-exaustao',
  'sistemas-integrados-em-inox',
  'projeto-tecnico-e-fabricacao-cnc',
  'reformas-e-modernizacoes',
  'manutencao',
] as const

const ALL_SEGMENT_SLUGS = [
  'restaurantes-e-cozinhas-profissionais',
  'hotelaria-e-alimentacao-coletiva',
  'producao-e-varejo-de-alimentos',
] as const

/**
 * Páginas gerais.
 *
 * Os blocos `clients`, `testimonials` e `latestArticles` existem no contrato
 * mas não são semeados: sem material aprovado, a seção não é renderizada. Um
 * bloco vazio é diferente de um bloco ausente — o primeiro produziria um
 * cabeçalho de seção sem conteúdo.
 */
export const initialPages: readonly PublicPage[] = [
  {
    id: 'page-home',
    slug: 'home',
    kind: 'home',
    title: 'Início',
    heading: 'Soluções industriais completas em aço inox, do espaço vazio à operação pronta.',
    intro:
      'Projetamos, fabricamos, instalamos e mantemos cozinhas industriais, equipamentos, mobiliários, coifas, estruturas e sistemas integrados para operações profissionais.',
    hero: {
      eyebrow: 'Designer Inox Brasil',
      heading: 'Soluções industriais completas em aço inox, do espaço vazio à operação pronta.',
      summary:
        'Projeto técnico, fabricação, instalação, refrigeração, ventilação, exaustão, aquecimento, automação, reformas e manutenção coordenados conforme a necessidade da operação.',
      microcopy:
        'Envie fotos, medidas ou plantas. Projetos complexos podem exigir levantamento técnico.',
      media: MEDIA_KITCHEN,
    },
    blocks: [
      {
        type: 'journeyRouter',
        items: [
          {
            title: 'Construir do zero',
            body: 'Planejamento, fabricação e instalação de cozinhas, ambientes e estruturas industriais em inox.',
            href: '/cozinhas-industriais',
          },
          {
            title: 'Fabricar e integrar',
            body: 'Equipamentos, mobiliário, coifas e sistemas associados, dimensionados para o uso profissional.',
            href: '/equipamentos-em-inox',
          },
          {
            title: 'Reformar e manter',
            body: 'Adequações, modernizações e continuidade para estruturas e equipamentos existentes.',
            href: '/manutencao',
          },
        ],
      },
      { type: 'services', serviceSlugs: ALL_SERVICE_SLUGS },
      { type: 'process', steps: commonProcess },
      { type: 'segments', segmentSlugs: ALL_SEGMENT_SLUGS },
      {
        type: 'richText',
        heading: 'Por que o aço inox exige decisão técnica',
        paragraphs: [
          'A escolha da solução não depende apenas da aparência. Uso, temperatura, umidade, limpeza, carga, circulação e integração com outros sistemas influenciam projeto, fabricação e manutenção. Por isso, cada orçamento começa pela operação que a estrutura ou o equipamento precisa sustentar.',
        ],
      },
      { type: 'faq', faqs: globalFaqs },
      {
        type: 'finalCta',
        heading: 'Vamos avaliar a sua operação',
        body: 'Descreva a necessidade e receba uma avaliação inicial sobre escopo, etapas e caminhos possíveis.',
        whatsappContext: 'general',
      },
    ],
    seo: {
      title: 'Designer Inox Brasil | Soluções industriais completas em inox',
      description:
        'Projeto técnico, fabricação, instalação e integração de soluções profissionais em aço inox.',
    },
    updatedAt: UPDATED_AT,
  },
  {
    id: 'page-empresa',
    slug: 'empresa',
    kind: 'company',
    title: 'Empresa',
    heading: 'Uma solução coordenada para operações profissionais em inox.',
    intro:
      'Integramos levantamento, definição técnica, fabricação, instalação e acompanhamento dentro do escopo aprovado.',
    hero: {
      eyebrow: 'Empresa',
      heading: 'Uma solução coordenada para operações profissionais em inox.',
      summary:
        'Integramos levantamento, definição técnica, fabricação, instalação e acompanhamento dentro do escopo aprovado.',
      microcopy: null,
      media: MEDIA_WELDING,
    },
    blocks: [
      {
        type: 'richText',
        heading: 'Como trabalhamos',
        paragraphs: [
          'A Designer Inox Brasil reúne, em uma trajetória única, o entendimento da necessidade, o levantamento das condições reais, a definição técnica do escopo, a fabricação em aço inox, a instalação e o acompanhamento posterior.',
          'Cada etapa tem limites explícitos. "Operação pronta" significa a solução em aço inox fabricada, instalada, integrada e testada dentro do escopo contratado — não inclui automaticamente obra civil, alimentação elétrica externa, gás, licenciamento, aprovações públicas ou serviços de terceiros não descritos na proposta.',
        ],
      },
      { type: 'process', steps: commonProcess },
      { type: 'services', serviceSlugs: ALL_SERVICE_SLUGS },
      {
        type: 'finalCta',
        heading: 'Converse com a equipe',
        body: 'Apresente a operação e a necessidade para organizarmos os próximos passos.',
        whatsappContext: 'general',
      },
    ],
    seo: {
      title: 'Empresa | Designer Inox Brasil',
      description:
        'Conheça a abordagem coordenada da Designer Inox Brasil para soluções profissionais em aço inox.',
    },
    updatedAt: UPDATED_AT,
  },
  {
    id: 'page-solucoes',
    slug: 'solucoes-em-inox',
    kind: 'solutionsHub',
    title: 'Soluções em inox',
    heading: 'Soluções em inox organizadas pela necessidade da sua operação.',
    intro: 'Escolha pela necessidade da operação e avance para uma avaliação inicial pelo WhatsApp.',
    hero: {
      eyebrow: 'Soluções',
      heading: 'Soluções em inox organizadas pela necessidade da sua operação.',
      summary:
        'Escolha pela necessidade da operação e avance para uma avaliação inicial pelo WhatsApp.',
      microcopy: null,
      media: null,
    },
    blocks: [
      { type: 'services', serviceSlugs: ALL_SERVICE_SLUGS },
      { type: 'process', steps: commonProcess },
      {
        type: 'finalCta',
        heading: 'Não sabe por onde começar?',
        body: 'Descreva a operação e a necessidade. A partir disso organizamos quais soluções fazem sentido avaliar.',
        whatsappContext: 'general',
      },
    ],
    seo: {
      title: 'Soluções em aço inox | Designer Inox Brasil',
      description:
        'Encontre soluções em cozinhas industriais, equipamentos, exaustão, sistemas integrados, CNC, reformas e manutenção.',
    },
    updatedAt: UPDATED_AT,
  },
  {
    id: 'page-segmentos',
    slug: 'segmentos',
    kind: 'segmentsHub',
    title: 'Segmentos',
    heading: 'Soluções em inox para diferentes operações profissionais.',
    intro:
      'Cada operação combina espaço, fluxo, temperatura, limpeza, carga e continuidade de forma diferente.',
    hero: {
      eyebrow: 'Segmentos',
      heading: 'Soluções em inox para diferentes operações profissionais.',
      summary:
        'Cada operação combina espaço, fluxo, temperatura, limpeza, carga e continuidade de forma diferente.',
      microcopy: null,
      media: null,
    },
    blocks: [
      { type: 'segments', segmentSlugs: ALL_SEGMENT_SLUGS },
      {
        type: 'finalCta',
        heading: 'Seu segmento não está listado?',
        body: 'Operações profissionais que usam estruturas e equipamentos em inox também podem ser avaliadas.',
        whatsappContext: 'general',
      },
    ],
    seo: {
      title: 'Segmentos atendidos | Designer Inox Brasil',
      description:
        'Soluções profissionais em aço inox para alimentação, hotelaria, produção e varejo de alimentos.',
    },
    updatedAt: UPDATED_AT,
  },
  {
    id: 'page-orcamento',
    slug: 'orcamento',
    kind: 'quote',
    title: 'Solicitar orçamento',
    heading: 'Solicite uma avaliação inicial.',
    intro: 'Enquanto o formulário estiver fechado, o WhatsApp é o canal disponível para a avaliação inicial.',
    hero: {
      eyebrow: 'Orçamento',
      heading: 'Solicite uma avaliação inicial.',
      summary:
        'Enquanto o formulário estiver fechado, o WhatsApp é o canal disponível para a avaliação inicial.',
      microcopy:
        'Tenha em mãos cidade e UF, tipo de operação, descrição da necessidade e, se possível, fotos, medidas ou plantas.',
      media: null,
    },
    blocks: [
      {
        type: 'richText',
        heading: 'O que informar na primeira mensagem',
        paragraphs: [
          'Cidade e UF, tipo de operação, o que precisa ser feito e as condições já conhecidas. Fotos, medidas e plantas ajudam, mas não são obrigatórias para iniciar a conversa.',
          'Nenhum prazo, valor ou visita é confirmado nesta etapa. O retorno inicial serve para entender a necessidade e definir quais levantamentos são precisos.',
        ],
      },
      {
        type: 'finalCta',
        heading: 'Iniciar avaliação pelo WhatsApp',
        body: 'O canal está disponível para descrever a necessidade e organizar os próximos passos.',
        whatsappContext: 'general',
      },
    ],
    seo: {
      title: 'Solicite uma avaliação | Designer Inox Brasil',
      description:
        'Inicie uma conversa sobre projeto, fabricação, instalação, integração, reforma ou manutenção em aço inox.',
    },
    updatedAt: UPDATED_AT,
  },
  {
    id: 'page-404',
    slug: 'nao-encontrada',
    kind: 'notFound',
    title: 'Página não encontrada',
    heading: 'Esta página não foi encontrada.',
    intro: 'O endereço pode ter mudado ou o conteúdo pode não estar publicado.',
    hero: {
      eyebrow: 'Erro 404',
      heading: 'Esta página não foi encontrada.',
      summary: 'O endereço pode ter mudado ou o conteúdo pode não estar publicado.',
      microcopy: null,
      media: null,
    },
    blocks: [
      { type: 'services', serviceSlugs: ALL_SERVICE_SLUGS },
      {
        type: 'finalCta',
        heading: 'Precisa de ajuda para encontrar algo?',
        body: 'Descreva o que procura e indicamos a solução correspondente.',
        whatsappContext: 'general',
      },
    ],
    seo: {
      title: 'Página não encontrada | Designer Inox Brasil',
      description: 'O endereço acessado não corresponde a uma página publicada.',
      noIndex: true,
    },
    updatedAt: UPDATED_AT,
  },
]
