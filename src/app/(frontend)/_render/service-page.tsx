import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import type { ReactElement } from 'react'

import { WhatsAppLink } from '@/components/conversion/WhatsAppLink'
import { Breadcrumb } from '@/components/sections/Breadcrumb'
import { PageHero } from '@/components/sections/PageHero'
import {
  CheckList,
  FaqAccordion,
  FinalCta,
  ProcessTimeline,
  Section,
  ServiceGrid,
} from '@/components/sections/PageSections'
import { ButtonLink } from '@/components/ui/Button'
import { getPublicContentRepository } from '@/modules/content/public/composition-root'
import { deferToRuntime } from '@/modules/site/runtime'
import styles from '@/components/sections/sections.module.css'

/**
 * Renderizador único das sete páginas de solução.
 *
 * As rotas são sete módulos explícitos, e não um segmento dinâmico: os slugs
 * ficam na raiz (`/cozinhas-industriais`), onde um catch-all capturaria
 * também `/empresa`, `/segmentos` e `/orcamento`. Explícito é o que mantém o
 * roteamento previsível e o 404 correto.
 */

export async function generateServiceMetadata(slug: string): Promise<Metadata> {
  await deferToRuntime()
  const service = await getPublicContentRepository().getServiceBySlug(slug)
  if (!service) return { title: 'Página não encontrada' }

  return {
    title: { absolute: service.seo.title },
    description: service.seo.description,
    alternates: { canonical: `/${service.slug}` },
    openGraph: {
      title: service.seo.title,
      description: service.seo.description,
      url: `/${service.slug}`,
      type: 'website',
    },
  }
}

export async function renderServicePage(slug: string): Promise<ReactElement> {
  await deferToRuntime()
  const repository = getPublicContentRepository()
  const service = await repository.getServiceBySlug(slug)

  if (!service) notFound()

  const allServices = await repository.listServices()
  const related = service.relatedServiceSlugs
    .map((relatedSlug) => allServices.find((item) => item.slug === relatedSlug))
    .filter((item): item is NonNullable<typeof item> => Boolean(item))

  return (
    <>
      <Breadcrumb
        items={[
          { label: 'Início', href: '/' },
          { label: 'Soluções', href: '/solucoes-em-inox' },
          { label: service.title },
        ]}
      />

      <PageHero
        eyebrow={service.eyebrow}
        heading={service.title}
        summary={service.summary}
        media={service.heroMedia}
        actions={
          <>
            <WhatsAppLink context={service.whatsappContext} size="lg" />
            <ButtonLink href="/orcamento" variant="secondary" size="lg">
              Enviar formulário detalhado
            </ButtonLink>
          </>
        }
      />

      <Section title="Necessidades atendidas">
        <div className={styles.twoColumn}>
          <CheckList items={service.needs} />
          <div>
            <h3 className={styles.processTitle}>Entregáveis possíveis</h3>
            <p className={styles.cardBody} style={{ marginBlockEnd: 'var(--space-sm)' }}>
              Os itens abaixo entram no escopo quando descritos e aprovados na proposta.
            </p>
            <CheckList items={service.deliverables} />
          </div>
        </div>
      </Section>

      <Section
        title="Como o trabalho acontece"
        body="Seis etapas que organizam o escopo, do primeiro contato ao acompanhamento posterior."
      >
        <ProcessTimeline steps={service.process} />
      </Section>

      {related.length > 0 ? (
        <Section
          title="Soluções relacionadas"
          body="Escopos que costumam ser avaliados junto com esta solução."
        >
          <ServiceGrid services={related} />
        </Section>
      ) : null}

      {service.faqs.length > 0 ? (
        <Section title="Perguntas frequentes">
          <FaqAccordion faqs={service.faqs} />
        </Section>
      ) : null}

      <FinalCta
        heading="Vamos avaliar o seu caso"
        body="Descreva a operação e a necessidade para organizarmos escopo, etapas e próximos passos."
        whatsappContext={service.whatsappContext}
      />
    </>
  )
}
