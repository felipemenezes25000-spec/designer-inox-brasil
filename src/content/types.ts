/** Codifica a natureza térmica/elétrica do item na cor de acento. */
export type Accent = "steel" | "mint" | "volt" | "ember" | "teal" | "ice";

export interface FaqItem {
  q: string;
  a: string;
}

/** Uma linha de equipamento dentro de um serviço (ex.: os quatro tipos de equipamento hospitalar fabricado). */
export interface ServiceSpecialty {
  name: string;
  desc: string;
}

export interface Service {
  slug: string;
  category: string;
  accent: Accent;
  title: string;
  /** Só `manutencao` e `equipamentos-hospitalares`: título de SEO diferente do título de exibição. */
  seoTitle?: string;
  navTitle: string;
  short: string;
  meta: string;
  lead: string;
  /** Presente na maioria dos serviços; os que ainda não têm foto real usam `illustration`. */
  photo?: string;
  /** Só serviços sem foto real ainda: nome da ilustração a usar no lugar. */
  illustration?: string;
  gallery: string[];
  when: string[];
  deliverables: string[];
  decisions: string[];
  faq: FaqItem[];
  related: string[];
  /** Só `sistemas-integrados-em-inox`: slugs dos demais serviços que ele agrega. */
  hub?: string[];
  /** Só serviços com linha de equipamentos declarada. */
  specialties?: ServiceSpecialty[];
}

export interface ServiceCategory {
  id: string;
  label: string;
  note: string;
}

export interface SegmentPressure {
  label: string;
  note: string;
}

export interface Segment {
  slug: string;
  accent: Accent;
  title: string;
  navTitle: string;
  short: string;
  meta: string;
  lead: string;
  photo: string;
  pressures: SegmentPressure[];
  priorities: string[];
  services: string[];
}

export interface PhotoEntry {
  alt: string;
  credit: string;
  /** `true` = obra real da empresa; muda a legenda e remove o aviso de ilustrativa. */
  own?: boolean;
}

export interface ClientGroup {
  sector: string;
  note: string;
  accent: Accent;
  clients: string[];
}

/** Um atalho de contato rápido (ex.: "Preciso de orientação") usado no CTA final e em /orcamento/. */
export interface ContactScenario {
  id: string;
  label: string;
}
