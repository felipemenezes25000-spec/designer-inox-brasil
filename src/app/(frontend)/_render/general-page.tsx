import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import type { ReactElement } from 'react'

import { WhatsAppLink } from '@/components/conversion/WhatsAppLink'
import { PageHero } from '@/components/sections/PageHero'
import { PageSections } from '@/components/sections/PageSections'
import { ButtonLink } from '@/components/ui/Button'
import { getPublicContentRepository } from '@/modules/content/public/composition-root'
import { deferToRuntime } from '@/modules/site/runtime'

/**
 * Renderizador das páginas gerais (home, empresa, hubs, orçamento, 404).
 *
 * O CTA secundário do hero é decidido aqui, não no conteúdo: ele aponta para
 * projetos quando existe ao menos um projeto aprovado e, caso contrário, para
 * o hub de soluções. Amarrar essa decisão ao dado — e não a uma cópia fixa —
 * é o que faz o botão trocar sozinho quando o Plano 03 publicar o primeiro
 * projeto.
 */

export async function generatePageMetadata(slug: string, canonical: string): Promise<Metadata> {
  await deferToRuntime()
  const page = await getPublicContentRepository().getPageBySlug(slug)
  if (!page) return { title: 'Página não encontrada' }

  return {
    title: { absolute: page.seo.title },
    description: page.seo.description,
    alternates: { canonical },
    robots: page.seo.noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      title: page.seo.title,
      description: page.seo.description,
      url: canonical,
      type: 'website',
    },
  }
}

export async function renderGeneralPage(slug: string): Promise<ReactElement> {
  await deferToRuntime()
  const repository = getPublicContentRepository()
  const page = await repository.getPageBySlug(slug)

  if (!page) notFound()

  const [services, segments, projects] = await Promise.all([
    repository.listServices(),
    repository.listSegments(),
    repository.listProjects(),
  ])

  const hasProjects = projects.length > 0
  const isHome = page.kind === 'home'

  return (
    <>
      <PageHero
        eyebrow={page.hero.eyebrow}
        heading={page.hero.heading}
        summary={page.hero.summary}
        microcopy={page.hero.microcopy}
        media={page.hero.media}
        actions={
          <>
            <WhatsAppLink context="general" size="lg">
              Solicitar orçamento
            </WhatsAppLink>
            {isHome ? (
              <ButtonLink
                href={hasProjects ? '/projetos' : '/solucoes-em-inox'}
                variant="secondary"
                size="lg"
              >
                {hasProjects ? 'Ver projetos realizados' : 'Conhecer nossas soluções'}
              </ButtonLink>
            ) : (
              <ButtonLink href="/solucoes-em-inox" variant="secondary" size="lg">
                Conhecer nossas soluções
              </ButtonLink>
            )}
          </>
        }
      />

      <PageSections blocks={page.blocks} services={services} segments={segments} />
    </>
  )
}
