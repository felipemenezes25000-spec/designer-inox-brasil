import type { Metadata, Viewport } from 'next'
import type { ReactElement, ReactNode } from 'react'

import { SiteShell } from '@/components/layout/SiteShell'
import { FOUNDATION_FOOTER, FOUNDATION_NAVIGATION } from '@/config/foundation-navigation'
import { bodyFont, headingFont } from '@/styles/fonts'
import '@/styles/globals.css'

/**
 * Metadados mínimos e verdadeiros.
 *
 * Sem `metadataBase`, sem Open Graph e sem dados estruturados nesta fase: o
 * domínio de produção ainda não foi confirmado, e declarar uma URL canônica
 * inventada produziria metadado falso. Isso entra no Plano 02, junto com o
 * conteúdo real.
 */
export const metadata: Metadata = {
  title: 'Designer Inox Brasil',
  description:
    'Soluções industriais completas em aço inox: projeto técnico, fabricação, instalação, ' +
    'integração e manutenção para operações profissionais.',
  applicationName: 'Designer Inox Brasil',
  robots: {
    // A liberação para indexação depende de conteúdo publicado e do domínio
    // real; até lá o site permanece fora dos buscadores.
    index: false,
    follow: false,
  },
}

export const viewport: Viewport = {
  themeColor: '#0D1218',
  width: 'device-width',
  initialScale: 1,
  // `maximumScale` e `userScalable` não são declarados de propósito: limitar
  // o zoom viola o critério 1.4.4 da WCAG.
}

export default function FrontendLayout({ children }: { children: ReactNode }): ReactElement {
  return (
    <html lang="pt-BR" className={`${headingFont.variable} ${bodyFont.variable}`}>
      <body>
        <SiteShell navigation={FOUNDATION_NAVIGATION} footer={FOUNDATION_FOOTER}>
          {children}
        </SiteShell>
      </body>
    </html>
  )
}
