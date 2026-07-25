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
  Section,
  ServiceGrid,
} from '@/components/sections/PageSections'
import { ButtonLink } from '@/components/ui/Button'
import { getPublicContentRepository } from '@/modules/content/public/composition-root'
import { deferToRuntime } from '@/modules/site/runtime'
import styles from '@/components/sections/sections.module.css'

type Params = { params: Promise<{ slug: string }> }

/**
 * `generateStaticParams` retorna vazio de propósito.
 *
 * O build nunca consulta conteúdo, banco ou storage — requisito explícito do
 * plano. Com `dynamicParams`, cada segmento é renderizado sob demanda no
 * primeiro acesso e servido do cache depois disso.
 */
export const dynamicParams = true

/**
 * Rota dinâmica, sem `generateStaticParams`.
 *
 * O plano previa `generateStaticParams` retornando `[]` para documentar que o
 * build não consulta conteúdo. Na prática isso não funciona: a simples
 * presença da função faz o Next classificar a rota como gerada
 * estaticamente, e o `connection()` de `deferToRuntime` passa a ser uso
 * dinâmico proibido — a página respondia 500 com `DYNAMIC_SERVER_USAGE` em
 * produção, reproduzido localmente. `force-dynamic` junto da função não
 * resolve; a classificação continua SSG.
 *
 * `deferToRuntime` já garante sozinho o requisito real: nenhuma leitura de
 * conteúdo durante o build. O cache público entra por cima no Task 11.
 */
export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  await deferToRuntime()
  const { slug } = await params
  const segment = await getPublicContentRepository().getSegmentBySlug(slug)
  if (!segment) return { title: 'Página não encontrada' }

  return {
    title: { absolute: segment.seo.title },
    description: segment.seo.description,
    alternates: { canonical: `/segmentos/${segment.slug}` },
    openGraph: {
      title: segment.seo.title,
      description: segment.seo.description,
      url: `/segmentos/${segment.slug}`,
      type: 'website',
    },
  }
}

export default async function SegmentPage({ params }: Params): Promise<ReactElement> {
  await deferToRuntime()
  const { slug } = await params
  const repository = getPublicContentRepository()
  const segment = await repository.getSegmentBySlug(slug)

  if (!segment) notFound()

  const allServices = await repository.listServices()
  const services = segment.serviceSlugs
    .map((serviceSlug) => allServices.find((service) => service.slug === serviceSlug))
    .filter((service): service is NonNullable<typeof service> => Boolean(service))

  return (
    <>
      <Breadcrumb
        items={[
          { label: 'Início', href: '/' },
          { label: 'Segmentos', href: '/segmentos' },
          { label: segment.title },
        ]}
      />

      <PageHero
        eyebrow="Segmento"
        heading={segment.title}
        summary={segment.summary}
        media={segment.heroMedia}
        actions={
          <>
            <WhatsAppLink context={segment.whatsappContext} size="lg" />
            <ButtonLink href="/solucoes-em-inox" variant="secondary" size="lg">
              Ver todas as soluções
            </ButtonLink>
          </>
        }
      />

      <Section title="Contexto operacional">
        <div className={styles.twoColumn}>
          <p className={styles.sectionBody}>{segment.operationalContext}</p>
          <div>
            <h3 className={styles.processTitle}>Pontos de atenção</h3>
            <p className={styles.cardBody} style={{ marginBlockEnd: 'var(--space-sm)' }}>
              Condições que costumam influenciar o escopo neste tipo de operação.
            </p>
            <CheckList items={segment.carePoints} />
          </div>
        </div>
      </Section>

      {services.length > 0 ? (
        <Section
          title="Soluções aplicáveis"
          body="Somente os serviços relacionados à necessidade e aprovados na proposta são coordenados na entrega."
        >
          <ServiceGrid services={services} />
        </Section>
      ) : null}

      {segment.faqs.length > 0 ? (
        <Section title="Perguntas frequentes">
          <FaqAccordion faqs={segment.faqs} />
        </Section>
      ) : null}

      <FinalCta
        heading="Avaliar a sua operação"
        body="Descreva o espaço, o fluxo e a necessidade para organizarmos o escopo inicial."
        whatsappContext={segment.whatsappContext}
      />
    </>
  )
}
