/**
 * Conteúdo institucional — todos os dados vêm do site original da
 * Designer Inox Brasil. Nada aqui é inventado.
 */

export const CONTACT = {
  name: "Designer Inox Brasil",
  legalName: "Edclei da Silva Guimarães",
  cnpj: "39.597.817/0001-24",
  phoneLabel: "(61) 99602-4701",
  phoneRaw: "+5561996024701",
  whatsapp: "https://wa.me/5561996024701",
  email: "contato@designerinoxbrasil.com.br",
  hours: "Segunda a sexta, 8h às 18h",
  area: "Brasília / DF e entorno",
  instagram: "https://www.instagram.com/designerinoxbrasil",
} as const;

export const NAV_LINKS = [
  { href: "#solucoes", label: "Soluções" },
  { href: "#segmentos", label: "Segmentos" },
  { href: "#clientes", label: "Clientes" },
  { href: "#metodo", label: "Método" },
  { href: "#duvidas", label: "Dúvidas" },
] as const;

export const FRONTS = [
  {
    id: "01",
    title: "Implantar e fabricar",
    count: "4 serviços",
    summary: "Projeto técnico, fabricação e instalação.",
    items: ["Cozinhas industriais", "Equipamentos sob medida", "Projeto e corte CNC", "Reformas"],
  },
  {
    id: "02",
    title: "Controlar ar e exaustão",
    count: "2 serviços",
    summary: "Captação, condução, filtragem e segurança contra incêndio.",
    items: ["Exaustão e coifas", "Sistema saponificante"],
  },
  {
    id: "03",
    title: "Integrar frio, calor e comando",
    count: "5 serviços",
    summary: "Refrigeração, aquecimento, CO₂ e automação elétrica.",
    items: [
      "Refrigeração",
      "Aquecimento",
      "Sistemas de CO₂",
      "Quadros e automação",
      "Sistemas integrados",
    ],
  },
  {
    id: "04",
    title: "Reformar e manter",
    count: "2 serviços",
    summary: "Manutenção preventiva, corretiva e modernizações.",
    items: ["Manutenção industrial", "Equipamentos hospitalares"],
  },
] as const;

export const SEGMENTS = [
  {
    id: "01",
    title: "Restaurantes e cozinhas profissionais",
    text: "Operações que coordenam preparo, cocção, higienização, circulação e atendimento no mesmo espaço.",
  },
  {
    id: "02",
    title: "Hotelaria e alimentação coletiva",
    text: "Produção recorrente, múltiplos pontos de serviço e necessidade de padronizar a operação.",
  },
  {
    id: "03",
    title: "Produção e varejo de alimentos",
    text: "Operações que combinam fabricação, armazenamento, exposição e atendimento.",
  },
  {
    id: "04",
    title: "Saúde e ambientes hospitalares",
    text: "Exigência sanitária alta, acesso restrito e continuidade que não admite improviso.",
  },
] as const;

export const CLIENTS = [
  "McDonald's",
  "Hospital Anchieta",
  "Embaixada dos Estados Unidos",
  "Rede Santa Lúcia",
  "Via Engenharia",
  "Rede Big Box",
  "Bali Park",
  "JC Gontijo",
] as const;

export const CLIENT_CONTEXTS = [
  { title: "Saúde", text: "Ambientes com exigência sanitária e continuidade crítica." },
  { title: "Institucional e diplomático", text: "Operações com protocolo próprio de acesso e execução." },
  { title: "Redes e varejo alimentar", text: "Múltiplas unidades e padronização entre lojas." },
  { title: "Restaurantes", text: "Cozinhas profissionais com volume e fluxo contínuo." },
  { title: "Hotelaria e alimentação coletiva", text: "Produção recorrente e vários pontos de serviço." },
  { title: "Engenharia e construção", text: "Fornecimento e instalação dentro de obras coordenadas." },
] as const;

export const METHOD = [
  { id: "01", title: "Entender", text: "Operação, espaço e necessidade." },
  { id: "02", title: "Levantar", text: "Medidas, acesso e interferências." },
  { id: "03", title: "Definir", text: "Escopo, material e interfaces." },
  { id: "04", title: "Fabricar", text: "Corte, conformação e acabamento." },
  { id: "05", title: "Instalar", text: "Montagem e integração previstas." },
  { id: "06", title: "Acompanhar", text: "Testes e orientação pós-entrega." },
] as const;

export const FAQ = [
  {
    q: "A Designer Inox trabalha apenas com fabricação?",
    a: "Não. O escopo pode reunir projeto técnico aplicado, fabricação, instalação, sistemas de refrigeração, aquecimento, exaustão, CO₂, automação elétrica e manutenção, conforme a necessidade e a proposta aprovada.",
  },
  {
    q: "É possível solicitar uma solução completa para uma operação nova?",
    a: "Sim. O atendimento inicial organiza espaço, uso, equipamentos e sistemas envolvidos para definir quais etapas devem entrar no escopo.",
  },
  {
    q: "Vocês atendem contrato de manutenção para redes com várias unidades?",
    a: "Sim. O formato depende da quantidade de ativos, da dispersão das unidades, da criticidade e da frequência definida na proposta.",
  },
  {
    q: "O que devo enviar para receber uma avaliação melhor?",
    a: "Cidade, tipo de operação, fotos gerais e dos pontos críticos, medidas disponíveis e uma descrição do que precisa mudar. Projetos complexos podem exigir levantamento técnico no local.",
  },
] as const;

export const SCENARIOS = [
  { id: "A", label: "Implantar ou ampliar uma operação" },
  { id: "B", label: "Fabricar algo sob medida" },
  { id: "C", label: "Corrigir falha, reformar ou manter" },
  { id: "D", label: "Preciso de orientação" },
] as const;

export function whatsappLink(message: string) {
  return `${CONTACT.whatsapp}?text=${encodeURIComponent(message)}`;
}
