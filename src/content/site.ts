/**
 * Configuração global do site.
 *
 * Tudo que aparece em mais de uma página mora aqui: marca, contato, navegação,
 * clientes e o catálogo de fotos. Os templates leem deste arquivo, então mudar
 * um telefone ou um item de menu é uma edição só — não 23.
 */

import type { ClientGroup, ContactScenario, FaqItem, PhotoEntry } from './types'

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
export const whatsapp = (message: string = 'Olá, encontrei a Designer Inox Brasil pelo site e gostaria de solicitar uma avaliação. Minha necessidade é:') =>
  `https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(message)}`

export const nav = [
  { label: 'Serviços', href: '/servicos/' },
  { label: 'Segmentos', href: '/segmentos/' },
  { label: 'Clientes', href: '/clientes/' },
  { label: 'Empresa', href: '/empresa/' },
]

/**
 * Cenários de contato rápido usados no CTA final (home) e em /orcamento/.
 *
 * Único lugar que os define — FinalCta.tsx e a rota /orcamento/ importam
 * daqui para não divergir.
 */
export const contactScenarios: ContactScenario[] = [
  { id: 'A', label: 'Implantar ou ampliar uma operação' },
  { id: 'B', label: 'Fabricar algo sob medida' },
  { id: 'C', label: 'Corrigir falha, reformar ou manter' },
  { id: 'D', label: 'Preciso de orientação' },
]

/** Perguntas da home. As específicas de cada serviço moram em services.ts. */
export const homeFaq: FaqItem[] = [
  {
    q: 'A Designer Inox trabalha apenas com fabricação?',
    a: 'Não. O escopo pode reunir projeto técnico aplicado, fabricação, instalação, sistemas de refrigeração, aquecimento, exaustão, CO₂, automação elétrica e manutenção, conforme a necessidade e a proposta aprovada.',
  },
  {
    q: 'É possível solicitar uma solução completa para uma operação nova?',
    a: 'Sim. O atendimento inicial organiza espaço, uso, equipamentos e sistemas envolvidos para definir quais etapas devem entrar no escopo.',
  },
  {
    q: 'Vocês atendem contrato de manutenção para redes com várias unidades?',
    a: 'Sim. O formato depende da quantidade de ativos, da dispersão das unidades, da criticidade e da frequência definida na proposta.',
  },
  {
    q: 'O que devo enviar para receber uma avaliação melhor?',
    a: 'Cidade, tipo de operação, fotos gerais e dos pontos críticos, medidas disponíveis e uma descrição do que precisa mudar. Projetos complexos podem exigir levantamento técnico no local.',
  },
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
export const clientGroups: ClientGroup[] = [
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
 * Catálogo das fotos.
 *
 * `alt` vem do manifesto de proveniência. Fotos com `own: true` são obras reais
 * da Designer Inox Brasil e aparecem legendadas como "Projeto Designer Inox",
 * sem o aviso de imagem ilustrativa. As demais são de banco licenciado (Pexels)
 * e continuam rotuladas como ilustrativas — nunca apresentadas como obra da
 * empresa. Ver [[feedback-visual-identity]].
 */
export const photos: Record<string, PhotoEntry> = {
  // ── Banco licenciado (ilustrativas) ─────────────────────────────────────
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

  // ── Obras reais da Designer Inox Brasil ─────────────────────────────────
  'real-cozinha-industrial': { alt: 'Cozinha industrial em operação com fogões, panelas e bancadas em aço inox', credit: 'Designer Inox Brasil', own: true },
  'real-cozinha-inox': { alt: 'Bancadas e equipamentos em aço inox montados em cozinha industrial', credit: 'Designer Inox Brasil', own: true },
  'real-fogao-industrial': { alt: 'Fogão industrial de seis bocas fabricado em aço inox', credit: 'Designer Inox Brasil', own: true },
  'real-estufa': { alt: 'Estufa aquecida em aço inox com queimadores para linha de cocção', credit: 'Designer Inox Brasil', own: true },
  'real-coifa-operacao': { alt: 'Coifa em aço inox sobre linha de cocção em cozinha industrial em operação', credit: 'Designer Inox Brasil', own: true },
  'real-coifa-churrasqueira': { alt: 'Coifa em aço inox para churrasqueira com acabamento polido', credit: 'Designer Inox Brasil', own: true },
  'real-exaustao-predial': { alt: 'Rede de dutos de exaustão industrial instalada em fachada de edifício', credit: 'Designer Inox Brasil', own: true },
  'real-exaustao-equipe': { alt: 'Técnico da Designer Inox instalando sistema de exaustão em cobertura', credit: 'Designer Inox Brasil', own: true },
  'real-saponificacao': { alt: 'Sistema saponificante para exaustão em aço inox com rolos filtrantes', credit: 'Designer Inox Brasil', own: true },
  'real-saponificacao-detalhe': { alt: 'Detalhe dos rolos filtrantes de um sistema saponificante em aço inox', credit: 'Designer Inox Brasil', own: true },
  'real-carrinho-inox': { alt: 'Carro de serviço em aço inox com três prateleiras e rodízios', credit: 'Designer Inox Brasil', own: true },
  'real-pia-inox': { alt: 'Cuba e bancada em aço inox com ponto de água para operação profissional', credit: 'Designer Inox Brasil', own: true },
  'real-copa-bancada': { alt: 'Copa com bancada e armários em aço inox instalados em ambiente acabado', credit: 'Designer Inox Brasil', own: true },
  'real-hospital-cme': { alt: 'Suportes e cestos em aço inox para central de material esterilizado', credit: 'Designer Inox Brasil', own: true },
  'real-hospital-prateleiras': { alt: 'Prateleiras em aço inox com pacotes cirúrgicos em ambiente hospitalar', credit: 'Designer Inox Brasil', own: true },
  'real-balcao-refrigerado': { alt: 'Balcão refrigerado em aço inox para exposição de alimentos', credit: 'Designer Inox Brasil', own: true },
  'real-varejo-expositor': { alt: 'Expositor giratório em aço inox para frutas em supermercado', credit: 'Designer Inox Brasil', own: true },
  'real-varejo-ilha': { alt: 'Ilha de hortifruti em aço inox instalada em supermercado', credit: 'Designer Inox Brasil', own: true },
}

export const legalNotice =
  'As fotografias legendadas como “Projeto Designer Inox” retratam trabalhos executados pela empresa. As imagens ilustrativas de banco licenciado (Pexels License), sinalizadas como tal, servem apenas de contexto e não representam obras, equipe ou clientes da Designer Inox Brasil.'
