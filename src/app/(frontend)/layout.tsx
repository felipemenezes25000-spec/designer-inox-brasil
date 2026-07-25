import type { Metadata, Viewport } from 'next'
import type { ReactElement, ReactNode } from 'react'

import { FloatingWhatsApp } from '@/components/conversion/FloatingWhatsApp'
import { SiteShell } from '@/components/layout/SiteShell'
import { getPublicContentRepository } from '@/modules/content/public/composition-root'
import {
  buildFooterNavigation,
  buildSiteNavigation,
} from '@/modules/site/navigation/build-site-navigation'
import { deferToRuntime } from '@/modules/site/runtime'
import { bodyFont, headingFont } from '@/styles/fonts'
import '@/styles/globals.css'

/**
 * Metadados globais.
 *
 * `metadataBase` sai de `NEXT_PUBLIC_SITE_URL`; sem ele o Next emite URLs
 * relativas em Open Graph, que redes sociais não resolvem. A indexação é
 * controlada por `INDEX_PUBLIC_SITE` e permanece desligada até haver conteúdo
 * publicado e domínio confirmado.
 */
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://127.0.0.1:3000'
const indexable = process.env.INDEX_PUBLIC_SITE === 'true'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Designer Inox Brasil | Soluções industriais completas em inox',
    template: '%s | Designer Inox Brasil',
  },
  description:
    'Projeto técnico, fabricação, instalação e integração de soluções profissionais em aço inox.',
  applicationName: 'Designer Inox Brasil',
  robots: indexable ? { index: true, follow: true } : { index: false, follow: false },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Designer Inox Brasil',
    images: [{ url: '/brand/lockup-negative.png', width: 1200, height: 320 }],
  },
  twitter: { card: 'summary_large_image' },
}

export const viewport: Viewport = {
  themeColor: '#0D1218',
  width: 'device-width',
  initialScale: 1,
  // `maximumScale` e `userScalable` não são declarados: limitar zoom viola o
  // critério 1.4.4 da WCAG.
}

export default async function FrontendLayout({
  children,
}: {
  children: ReactNode
}): Promise<ReactElement> {
  await deferToRuntime()
  const repository = getPublicContentRepository()

  const [navigation, footer, services, projects, articles] = await Promise.all([
    repository.getNavigation(),
    repository.getFooter(),
    repository.listServices(),
    repository.listProjects(),
    repository.listArticles(),
  ])

  return (
    <html lang="pt-BR" className={`${headingFont.variable} ${bodyFont.variable}`}>
      <body>
        <SiteShell
          navigation={buildSiteNavigation({
            navigation,
            services,
            hasProjects: projects.length > 0,
            hasArticles: articles.length > 0,
          })}
          footer={buildFooterNavigation(footer)}
        >
          {children}
        </SiteShell>
        <FloatingWhatsApp context="general" />
      </body>
    </html>
  )
}
