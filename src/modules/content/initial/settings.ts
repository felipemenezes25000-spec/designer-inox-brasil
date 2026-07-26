import type { PublicFooter, PublicSiteSettings } from '@/modules/content/public/types'

export const initialSiteSettings: PublicSiteSettings = {
  brandName: 'Designer Inox Brasil',
  phoneDisplay: '+55 61 99683-1052',
  whatsappDigits: '5561996831052',
  email: 'contato@designerinox.com.br',
  address: {
    streetAddress: 'SIA Trecho 3, Lote 1250',
    addressLocality: 'Brasília',
    addressRegion: 'DF',
    postalCode: '71200-030',
    addressCountry: 'BR',
  },
  geo: { latitude: -15.8011, longitude: -47.9292 },
  areaServed: ['Distrito Federal', 'Goiás', 'Minas Gerais', 'São Paulo'],
  businessHours: [
    { days: ['Segunda', 'Sexta'], opens: '08:00', closes: '18:00' },
    { days: ['Sábado'], opens: '08:00', closes: '12:00' },
  ],
  socialLinks: [
    { label: 'Instagram', href: 'https://www.instagram.com/designerinoxbrasil' },
  ],
}

export const initialFooter: PublicFooter = {
  primary: [
    { label: 'Soluções em inox', href: '/solucoes-em-inox' },
    { label: 'Segmentos', href: '/segmentos' },
    { label: 'Manutenção', href: '/manutencao' },
    { label: 'Empresa', href: '/empresa' },
    { label: 'Solicitar avaliação', href: '/orcamento' },
  ],
  legal: [
    { label: 'Política de privacidade', href: '/politica-de-privacidade' },
    { label: 'Termos de uso', href: '/termos-de-uso' },
  ],
  social: [
    { label: 'Instagram', href: 'https://www.instagram.com/designerinoxbrasil' },
  ],
  cookiePreferencesLabel: null,
}
