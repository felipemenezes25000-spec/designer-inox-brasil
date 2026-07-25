import type { PublicFooter, PublicSiteSettings } from '@/modules/content/public/types'

/**
 * Configurações do site.
 *
 * Os campos nulos e vazios são deliberados, não pendências de código. Razão
 * social, CNPJ, endereço, e-mail, horários, áreas atendidas e redes sociais
 * ainda não foram confirmados pelo proprietário.
 *
 * Nulo significa "não renderizar": a seção some, o dado estruturado omite a
 * propriedade e nenhum fato substituto é criado. Preencher com valor
 * inventado publicaria informação falsa sobre uma empresa real — é o que a
 * especificação §4.2 e §22 proíbem.
 */
export const initialSiteSettings: PublicSiteSettings = {
  brandName: 'Designer Inox Brasil',
  phoneDisplay: '+55 61 99683-1052',
  whatsappDigits: '5561996831052',
  email: null,
  address: null,
  geo: null,
  areaServed: [],
  businessHours: [],
  socialLinks: [],
}

export const initialFooter: PublicFooter = {
  primary: [
    { label: 'Soluções em inox', href: '/solucoes-em-inox' },
    { label: 'Segmentos', href: '/segmentos' },
    { label: 'Manutenção', href: '/manutencao' },
    { label: 'Empresa', href: '/empresa' },
    { label: 'Solicitar orçamento', href: '/orcamento' },
  ],
  // Vazio até o Plano 03 publicar os documentos aprovados.
  legal: [],
  social: [],
  cookiePreferencesLabel: 'Preferências de cookies',
}
