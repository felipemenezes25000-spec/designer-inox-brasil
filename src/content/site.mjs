/**
 * Configuração global do site.
 *
 * Tudo que aparece em mais de uma página mora aqui: marca, contato, navegação,
 * clientes e o catálogo de fotos. Os templates leem deste arquivo, então mudar
 * um telefone ou um item de menu é uma edição só — não 23.
 */

export const site = {
  name: 'Designer Inox Brasil',
  legalName: 'Designer Inox Brasil',
  tagline: 'Engenharia aplicada em aço inox',
  origin: 'https://designer-inox-cinematic.vercel.app',
  locale: 'pt-BR',
  city: 'Brasília',
  state: 'DF',
  region: 'Brasília / DF e entorno',
  description:
    'Projeto técnico, fabricação, instalação, automação, refrigeração, exaustão e manutenção em aço inox para cozinhas industriais, hospitais e operações profissionais.',
}

export const contact = {
  whatsappNumber: '5561996024701',
  whatsappDisplay: '(61) 99602-4701',
  phone: '(61) 99602-4701',
  email: 'contato@designerinoxbrasil.com.br',
  instagram: 'designerinoxbrasil',
  instagramUrl: 'https://www.instagram.com/designerinoxbrasil',
  hours: 'Segunda a sexta, 8h às 18h',
  emergency: 'Operação parada: sinalize no início da mensagem',
}

export const company = {
  legalName: 'Edclei da Silva Guimarães',
  cnpj: '39.597.817/0001-24',
  address: 'Samambaia Sul, Brasília/DF',
}

/** Monta o link do WhatsApp com uma mensagem pré-preenchida e codificada. */
export const whatsapp = (message = 'Olá, encontrei a Designer Inox Brasil pelo site e gostaria de solicitar uma avaliação. Minha necessidade é:') =>
  `https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(message)}`

export const nav = [
  { label: 'Serviços', href: '/servicos/' },
  { label: 'Segmentos', href: '/segmentos/' },
  { label: 'Clientes', href: '/clientes/' },
  { label: 'Empresa', href: '/empresa/' },
]

/**
 * Clientes informados pela direção da empresa em 29/07/2026.
 *
 * Agrupados por setor porque a lista crua não comunica nada: ver "hospitais",
 * "embaixadas" e "redes de varejo" como blocos é o que sustenta a alegação de
 * que a operação atende criticidade alta.
 *
 * DUAS INTERPRETAÇÕES FORAM FEITAS SOBRE A LISTA ORIGINAL — CONFIRMAR:
 *
 * 1. "Hot Cozinha Industrial Ltda. (Stutz Soluções em Alimentação)" e
 *    "Stutz Soluções em Alimentação" vieram como linhas separadas. Tratadas
 *    como a mesma empresa, já que a primeira linha declara a equivalência.
 *
 * 2. "JC Engenharia" e "JC Goltigio" vieram como linhas separadas. Tratadas
 *    como a mesma empresa e grafadas "JC Gontijo" — "Goltigio" não
 *    corresponde a nenhuma razão social conhecida, e a JC Gontijo é uma
 *    construtora de Brasília que aparece no mesmo contexto de Via Engenharia.
 *    Se forem duas empresas distintas, adicionar a segunda aqui.
 *
 * Das 25 linhas informadas, restaram 23 organizações distintas.
 */
export const clientGroups = [
  {
    sector: 'Saúde',
    note: 'Ambientes com exigência sanitária e continuidade crítica.',
    accent: 'mint',
    clients: ['Hospital Santa Rosa (MT)', 'Hospital Anchieta', 'Hospital Santa Marta', 'Rede Santa Lúcia'],
  },
  {
    sector: 'Institucional e diplomático',
    note: 'Operações com protocolo próprio de acesso e execução.',
    accent: 'teal',
    clients: ['Embaixada dos Estados Unidos', 'Embaixada da Argentina', 'Restaurante Comunitário'],
  },
  {
    sector: 'Redes e varejo alimentar',
    note: 'Múltiplas unidades e padronização entre lojas.',
    accent: 'ice',
    clients: ['McDonald’s', 'Rede Big Box', 'Rede Ultra Box', 'Rede Super Adega', 'Frango no Pote', 'Pamonharia Pamonha da Roça'],
  },
  {
    sector: 'Restaurantes',
    note: 'Cozinhas profissionais com volume e fluxo contínuo.',
    accent: 'ember',
    clients: [
      'Restaurante Grande Muralha',
      'Restaurante El Fuego',
      'Restaurante El Mano',
      'Restaurante Nino',
      'Restaurante Marino',
    ],
  },
  {
    sector: 'Hotelaria, lazer e alimentação coletiva',
    note: 'Produção recorrente e vários pontos de serviço.',
    accent: 'steel',
    clients: ['Bali Park', 'Hot Cozinha Industrial (Stutz Soluções em Alimentação)'],
  },
  {
    sector: 'Engenharia e construção',
    note: 'Fornecimento e instalação dentro de obras coordenadas.',
    accent: 'volt',
    clients: ['Via Engenharia', 'JC Gontijo', 'Tecnicall Engenharia'],
  },
]

export const clientCount = clientGroups.reduce((total, group) => total + group.clients.length, 0)

/**
 * Catálogo das fotos ilustrativas.
 *
 * `alt` vem do manifesto de proveniência. Toda foto é de banco licenciado e
 * aparece rotulada como ilustrativa — nenhuma é apresentada como obra, equipe
 * ou cliente da empresa.
 */
export const photos = {
  kitchen: { alt: 'Cozinha profissional com bancadas e equipamentos em aço inoxidável', credit: 'Bruno Makori' },
  welding: { alt: 'Profissional executando soldagem em estrutura metálica industrial', credit: 'JL Photographie' },
  plasma: { alt: 'Corte de chapa metálica por plasma em ambiente fabril', credit: 'Ana Victoria Valverde' },
  hood: { alt: 'Cozinha comercial com superfícies e equipamentos em aço inoxidável', credit: 'Skylar Kang' },
  equipment: { alt: 'Cozinha industrial equipada com panelas e utensílios em aço inoxidável', credit: 'Özkan Keklik' },
  buffet: { alt: 'Buffet de hotel com iluminação moderna e montagem gastronômica', credit: 'Hongyue Stone-Jon Lee' },
  'food-factory': { alt: 'Interior de planta moderna de produção de alimentos com maquinário industrial', credit: 'Adrien Olichon' },
  workshop: { alt: 'Artesão utilizando esmerilhadeira com faíscas em oficina metalúrgica', credit: 'Swastik Arora' },
  'modern-kitchen': { alt: 'Interior de cozinha industrial moderna com equipamentos em aço inoxidável', credit: 'Alina Okan' },
  'industrial-kitchen': { alt: 'Cozinha industrial bem equipada com panelas suspensas e utensílios', credit: 'Elif' },
}

export const legalNotice =
  'As fotografias deste site são imagens ilustrativas de banco licenciado (Pexels License). Não representam obras executadas, equipe, instalações ou clientes da Designer Inox Brasil.'
