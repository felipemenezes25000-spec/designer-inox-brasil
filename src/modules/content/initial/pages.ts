import type { PublicPage } from '@/modules/content/public/types'

import { globalFaqs } from './faqs'
import { MEDIA_EQUIPMENT, MEDIA_INDUSTRIAL_KITCHEN, MEDIA_KITCHEN, MEDIA_WELDING } from './media'
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
    heading: 'Soluções industriais completas em aço inox, do projeto à instalação.',
    intro:
      'Projetamos, fabricamos, instalamos e mantemos cozinhas industriais, equipamentos, mobiliários, coifas, estruturas e sistemas integrados para operações profissionais.',
    hero: {
      eyebrow: 'Designer Inox Brasil',
      heading: 'Soluções industriais completas em aço inox, do projeto à instalação.',
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
      { type: 'clients', clientSlugs: [] },
      { type: 'testimonials', testimonialIds: [] },
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
        body: 'Descreva a necessidade e receba uma avaliação inicial sobre escopo, etapas e caminhos possíveis. Atendimento em Brasília, Distrito Federal e região.',
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
        'Empresa sediada em Brasília, especializada em projeto, fabricação e instalação de soluções em aço inox. Atendimento em Brasília, Distrito Federal e região.',
      microcopy: null,
      media: MEDIA_WELDING,
    },
    blocks: [
      {
        type: 'richText',
        heading: 'Quem somos',
        paragraphs: [
          'A Designer Inox Brasil é uma empresa sediada em Brasília, especializada em projeto, fabricação e instalação de soluções em aço inox para operações profissionais. Nossa estrutura reúne desenvolvimento técnico, fabricação sob medida e equipes de instalação.',
          'Atuamos em cozinhas industriais, equipamentos sob medida, coifas e sistemas de exaustão, estruturas integradas, corte CNC, reformas e manutenção — sete frentes de solução coordenadas conforme a necessidade de cada operação.',
        ],
      },
      {
        type: 'richText',
        heading: 'Como trabalhamos',
        paragraphs: [
          'Cada projeto segue seis etapas: entendimento da necessidade, levantamento das condições reais, definição técnica do escopo, fabricação em aço inox, instalação e acompanhamento posterior.',
          'Cada etapa tem limites explícitos. "Operação pronta" significa a solução em aço inox fabricada, instalada, integrada e testada dentro do escopo contratado — não inclui automaticamente obra civil, alimentação elétrica externa, gás, licenciamento, aprovações públicas ou serviços de terceiros não descritos na proposta.',
        ],
      },
      { type: 'process', steps: commonProcess },
      {
        type: 'richText',
        heading: 'Onde estamos e onde atuamos',
        paragraphs: [
          'Endereço: SIA Trecho 3, Lote 1250 — Brasília/DF, CEP 71200-030.',
          'Atendimento presencial e instalação em Brasília, Distrito Federal e entorno. Projetos em Goiás, Minas Gerais, São Paulo e outras localidades sujeitos à avaliação técnica de viabilidade.',
          'Horário de funcionamento: segunda a sexta, das 8h às 18h; sábados, das 8h às 12h.',
          'Telefone e WhatsApp: +55 61 99683-1052 · E-mail: contato@designerinox.com.br',
        ],
      },
      { type: 'services', serviceSlugs: ALL_SERVICE_SLUGS },
      {
        type: 'finalCta',
        heading: 'Converse com a equipe',
        body: 'Apresente a operação e a necessidade para organizarmos os próximos passos. Atendimento em Brasília, DF e região.',
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
      media: MEDIA_EQUIPMENT,
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
      'Entenda como cada tipo de operação influencia a definição de estruturas, equipamentos e sistemas em inox.',
    hero: {
      eyebrow: 'Segmentos',
      heading: 'Soluções em inox para diferentes operações profissionais.',
      summary:
        'Entenda como cada tipo de operação influencia a definição de estruturas, equipamentos e sistemas em inox.',
      microcopy: null,
      media: MEDIA_INDUSTRIAL_KITCHEN,
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
    title: 'Solicitar avaliação',
    heading: 'Solicite uma avaliação inicial.',
    intro: 'O WhatsApp é o canal disponível para iniciar a avaliação. Descreva a necessidade e a equipe organiza os próximos passos.',
    hero: {
      eyebrow: 'Avaliação',
      heading: 'Solicite uma avaliação inicial.',
      summary:
        'O WhatsApp é o canal disponível para iniciar a avaliação. Descreva a necessidade e a equipe organiza os próximos passos.',
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
          'Nenhum prazo, valor ou visita é confirmado nesta etapa. O retorno inicial serve para entender a necessidade e definir quais levantamentos são necessários.',
          'As informações que você preencher são utilizadas apenas para montar a mensagem que será aberta no WhatsApp. Este site não armazena dados pessoais nem utiliza cookies de rastreamento.',
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
