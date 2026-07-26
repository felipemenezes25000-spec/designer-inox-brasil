import type {
  PublicArticle,
  PublicClient,
  PublicLegalDocument,
  PublicNavigation,
  PublicProject,
  PublicRedirect,
  PublicTestimonial,
} from '@/modules/content/public/types'

export { globalFaqs, segmentFaqs, serviceFaqs } from './faqs'
export {
  initialMedia,
  MEDIA_BUFFET,
  MEDIA_EQUIPMENT,
  MEDIA_FOOD_FACTORY,
  MEDIA_HOOD,
  MEDIA_INDUSTRIAL_KITCHEN,
  MEDIA_KITCHEN,
  MEDIA_MODERN_KITCHEN,
  MEDIA_PLASMA,
  MEDIA_WELDING,
  MEDIA_WORKSHOP,
} from './media'
export { initialPages } from './pages'
export { commonProcess, processForService } from './process'
export { initialSegments } from './segments'
export { initialServices, SERVICE_CONTEXT_BY_SLUG } from './services'
export { initialFooter, initialSiteSettings } from './settings'

const UPDATED_AT = '2026-07-25T00:00:00.000Z'

export const initialClients: readonly PublicClient[] = [
  {
    id: 'client-restaurante-villa',
    slug: 'restaurante-villa',
    name: 'Restaurante Villa Toscana',
    logo: null,
    summary: 'Rede de restaurantes italianos com três unidades no DF.',
    updatedAt: UPDATED_AT,
  },
  {
    id: 'client-hotel-imperial',
    slug: 'hotel-imperial',
    name: 'Hotel Imperial Brasília',
    logo: null,
    summary: 'Hotel com operação de buffet e cozinha central para 400 refeições/dia.',
    updatedAt: UPDATED_AT,
  },
  {
    id: 'client-padaria-trigal',
    slug: 'padaria-trigal',
    name: 'Padaria Trigal',
    logo: null,
    summary: 'Produção artesanal e varejo com atendimento em loja e delivery.',
    updatedAt: UPDATED_AT,
  },
  {
    id: 'client-nutriserv',
    slug: 'nutriserv',
    name: 'NutriServ Refeições',
    logo: null,
    summary: 'Alimentação coletiva corporativa com cinco unidades.',
    updatedAt: UPDATED_AT,
  },
  {
    id: 'client-frigobras',
    slug: 'frigobras',
    name: 'FrigoBras Alimentos',
    logo: null,
    summary: 'Processamento e distribuição de carnes com câmaras frigoríficas.',
    updatedAt: UPDATED_AT,
  },
  {
    id: 'client-sabor-grill',
    slug: 'sabor-grill',
    name: 'Sabor & Grill Churrascaria',
    logo: null,
    summary: 'Churrascaria com operação de rodízio e buffet de saladas.',
    updatedAt: UPDATED_AT,
  },
]

export const initialTestimonials: readonly PublicTestimonial[] = [
  {
    id: 'testimonial-1',
    client: { slug: 'restaurante-villa', name: 'Restaurante Villa Toscana' },
    name: 'Carlos Mendes',
    role: 'Sócio-proprietário',
    text: 'A equipe entendeu o fluxo da cozinha antes de propor qualquer coisa. O projeto final integrou bancadas, coifas e refrigeração de um jeito que simplificou a operação inteira.',
    updatedAt: UPDATED_AT,
  },
  {
    id: 'testimonial-2',
    client: { slug: 'hotel-imperial', name: 'Hotel Imperial Brasília' },
    name: 'Fernanda Rocha',
    role: 'Gerente de operações',
    text: 'Precisávamos reformar a cozinha central sem parar o hotel. Eles dividiram em etapas, mantiveram o cronograma e entregaram tudo funcionando no prazo combinado.',
    updatedAt: UPDATED_AT,
  },
  {
    id: 'testimonial-3',
    client: { slug: 'padaria-trigal', name: 'Padaria Trigal' },
    name: 'Roberto Alves',
    role: 'Proprietário',
    text: 'Eram só duas bancadas sob medida, mas o levantamento pegou interferências que eu nem sabia que tinha. Resultado: encaixou perfeito e não precisou de adaptação depois.',
    updatedAt: UPDATED_AT,
  },
  {
    id: 'testimonial-4',
    client: { slug: 'nutriserv', name: 'NutriServ Refeições' },
    name: 'Ana Paula Silveira',
    role: 'Diretora técnica',
    text: 'A manutenção preventiva reduziu nossas paradas não programadas. O contrato é claro sobre o que está coberto e o atendimento é rápido quando precisamos.',
    updatedAt: UPDATED_AT,
  },
]

export const initialProjects: readonly PublicProject[] = []
export const initialArticles: readonly PublicArticle[] = []

export const initialLegalDocuments: readonly PublicLegalDocument[] = [
  {
    type: 'privacy',
    title: 'Política de Privacidade',
    version: '1.0.0',
    effectiveAt: '2026-07-25',
    body: [
      {
        heading: 'Introdução',
        paragraphs: [
          'A Designer Inox Brasil respeita a privacidade de todos os visitantes do site e usuários dos nossos serviços. Esta política descreve como coletamos, usamos e protegemos suas informações pessoais.',
        ],
      },
      {
        heading: 'Dados coletados',
        paragraphs: [
          'Podemos coletar informações fornecidas voluntariamente por você, como nome, e-mail, telefone e detalhes do projeto ao solicitar um orçamento ou entrar em contato pelo WhatsApp.',
          'Dados de navegação, como endereço IP, tipo de navegador e páginas visitadas, podem ser coletados automaticamente para fins analíticos e de melhoria do site.',
        ],
      },
      {
        heading: 'Uso das informações',
        paragraphs: [
          'As informações coletadas são utilizadas exclusivamente para responder a solicitações de orçamento, fornecer suporte técnico, melhorar nossos serviços e cumprir obrigações legais.',
          'Não compartilhamos, vendemos ou transferimos suas informações pessoais a terceiros, exceto quando exigido por lei ou necessário para a prestação do serviço contratado.',
        ],
      },
      {
        heading: 'Cookies',
        paragraphs: [
          'Este site utiliza apenas cookies essenciais para o funcionamento correto das páginas, como sessão e preferências de navegação. Nenhum cookie de análise, publicidade ou rastreamento de terceiros é utilizado.',
        ],
      },
      {
        heading: 'Seus direitos',
        paragraphs: [
          'Você tem o direito de acessar, corrigir, excluir ou solicitar a portabilidade dos seus dados pessoais a qualquer momento, conforme previsto na Lei Geral de Proteção de Dados (LGPD). Para exercer esses direitos, entre em contato pelo e-mail contato@designerinox.com.br.',
        ],
      },
      {
        heading: 'Alterações nesta política',
        paragraphs: [
          'Esta política pode ser atualizada periodicamente. A versão vigente estará sempre disponível nesta página, com a data de entrada em vigor indicada acima.',
        ],
      },
    ],
    seo: {
      title: 'Política de Privacidade | Designer Inox Brasil',
      description:
        'Saiba como a Designer Inox Brasil coleta, utiliza e protege suas informações pessoais.',
    },
    updatedAt: UPDATED_AT,
  },
  {
    type: 'terms',
    title: 'Termos de Uso',
    version: '1.0.0',
    effectiveAt: '2026-07-25',
    body: [
      {
        heading: 'Aceitação dos termos',
        paragraphs: [
          'Ao acessar e utilizar o site da Designer Inox Brasil, você concorda com os presentes Termos de Uso. Caso não concorde com qualquer disposição, recomendamos que interrompa o uso do site.',
        ],
      },
      {
        heading: 'Uso do site',
        paragraphs: [
          'O conteúdo deste site, incluindo textos, imagens, logotipos e materiais gráficos, é de propriedade da Designer Inox Brasil ou licenciado por terceiros e está protegido por leis de propriedade intelectual.',
          'É permitido o uso pessoal e não comercial do conteúdo para fins de consulta. Reprodução, distribuição ou modificação sem autorização prévia por escrito é proibida.',
        ],
      },
      {
        heading: 'Solicitações de orçamento',
        paragraphs: [
          'As informações apresentadas no site, incluindo descrições de serviços, processos e soluções, têm caráter informativo e não constituem oferta vinculante ou proposta comercial.',
          'Orçamentos e propostas formais são elaborados individualmente após análise das condições específicas de cada projeto, conforme o escopo aprovado por ambas as partes.',
        ],
      },
      {
        heading: 'Imagens ilustrativas',
        paragraphs: [
          'As imagens identificadas como "Imagem ilustrativa" são fotos de banco de imagens licenciadas e não representam projetos, instalações, equipe ou clientes da Designer Inox Brasil.',
        ],
      },
      {
        heading: 'Limitação de responsabilidade',
        paragraphs: [
          'A Designer Inox Brasil não se responsabiliza por danos diretos ou indiretos decorrentes do uso ou da impossibilidade de uso do site, incluindo indisponibilidade temporária, erros de conteúdo ou incompatibilidade técnica.',
        ],
      },
      {
        heading: 'Legislação aplicável',
        paragraphs: [
          'Estes Termos de Uso são regidos pela legislação brasileira. Qualquer disputa será resolvida no foro da comarca de Brasília, Distrito Federal.',
        ],
      },
    ],
    seo: {
      title: 'Termos de Uso | Designer Inox Brasil',
      description:
        'Termos e condições de uso do site da Designer Inox Brasil.',
    },
    updatedAt: UPDATED_AT,
  },
]

export const initialRedirects: readonly PublicRedirect[] = []

export const initialNavigation: PublicNavigation = {
  solutionGroups: [
    { label: 'Construir', serviceSlugs: ['cozinhas-industriais'] },
    {
      label: 'Fabricar',
      serviceSlugs: ['equipamentos-em-inox', 'projeto-tecnico-e-fabricacao-cnc'],
    },
    {
      label: 'Integrar',
      serviceSlugs: ['coifas-ventilacao-e-exaustao', 'sistemas-integrados-em-inox'],
    },
    { label: 'Transformar', serviceSlugs: ['reformas-e-modernizacoes'] },
    { label: 'Manter', serviceSlugs: ['manutencao'] },
  ],
  projectsLabel: 'Projetos',
  articlesLabel: 'Conteúdos',
  segmentsLabel: 'Segmentos',
  maintenanceLabel: null,
  companyLabel: 'Empresa',
  quoteLabel: 'Solicitar avaliação',
}
