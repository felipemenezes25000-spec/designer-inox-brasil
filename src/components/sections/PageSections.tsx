import Link from 'next/link'
import type { ReactElement, ReactNode } from 'react'

import { WhatsAppLink } from '@/components/conversion/WhatsAppLink'
import { ButtonLink } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { QUOTE_PATH, quoteCtaLabel } from '@/config/lead-form'
import type {
  ProcessStep,
  PublicClient,
  PublicFaq,
  PublicPageBlock,
  PublicSegment,
  PublicService,
  PublicTestimonial,
} from '@/modules/content/public/types'
import type { WhatsAppContext } from '@/modules/whatsapp/contexts'
import styles from './sections.module.css'

/* ------------------------------------------------------------------ shell */

export function Section({
  id,
  title,
  body,
  children,
  headingLevel = 2,
}: {
  id?: string
  title?: string
  body?: string
  children: ReactNode
  headingLevel?: 2 | 3
}): ReactElement {
  const Heading = `h${headingLevel}` as 'h2' | 'h3'

  return (
    <Container as="section" id={id} className={styles.section}>
      {title ? (
        <div className={styles.sectionHead}>
          <Heading className={`text-title ${styles.sectionTitle}`}>{title}</Heading>
          {body ? <p className={styles.sectionBody}>{body}</p> : null}
        </div>
      ) : null}
      {children}
    </Container>
  )
}

/* --------------------------------------------------------------- listagens */

export function CheckList({ items }: { items: readonly string[] }): ReactElement {
  return (
    <ul className={styles.checkList}>
      {items.map((item) => (
        <li key={item} className={styles.checkItem}>
          {item}
        </li>
      ))}
    </ul>
  )
}

export function ServiceGrid({ services }: { services: readonly PublicService[] }): ReactElement {
  return (
    <ul className={styles.cardGrid}>
      {services.map((service) => {
        const titleId = `card-title-${service.slug}`
        return (
          <li key={service.slug}>
            <Link className={styles.card} href={`/${service.slug}`} aria-labelledby={titleId}>
              <span className={styles.cardEyebrow} aria-hidden="true">{service.eyebrow}</span>
              <h3 className={styles.cardTitle} id={titleId}>{service.title}</h3>
              <p className={styles.cardBody}>{service.summary}</p>
              <span className={styles.cardCue} aria-hidden="true">
                Ver solução →
              </span>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

export function SegmentGrid({ segments }: { segments: readonly PublicSegment[] }): ReactElement {
  return (
    <ul className={styles.cardGrid}>
      {segments.map((segment) => (
        <li key={segment.slug}>
          <Link className={styles.card} href={`/segmentos/${segment.slug}`}>
            <h3 className={styles.cardTitle}>{segment.title}</h3>
            <p className={styles.cardBody}>{segment.summary}</p>
            <span className={styles.cardCue} aria-hidden="true">
              Ver segmento →
            </span>
          </Link>
        </li>
      ))}
    </ul>
  )
}

export function ProcessTimeline({ steps }: { steps: readonly ProcessStep[] }): ReactElement {
  return (
    <ol className={styles.processList}>
      {steps.map((step) => (
        <li key={step.id} className={styles.processStep}>
          <h3 className={styles.processTitle}>{step.title}</h3>
          <p className={styles.cardBody}>{step.description}</p>
        </li>
      ))}
    </ol>
  )
}

export function ClientBar({ clients }: { clients: readonly PublicClient[] }): ReactElement {
  return (
    <ul className={styles.clientGrid}>
      {clients.map((client) => (
        <li key={client.slug} className={styles.clientItem}>
          <span className={styles.clientName}>{client.name}</span>
          {client.summary ? <span className={styles.clientSummary}>{client.summary}</span> : null}
        </li>
      ))}
    </ul>
  )
}

export function TestimonialGrid({
  testimonials,
}: {
  testimonials: readonly PublicTestimonial[]
}): ReactElement {
  return (
    <ul className={styles.testimonialGrid}>
      {testimonials.map((testimonial) => (
        <li key={testimonial.id} className={styles.testimonialCard}>
          <blockquote className={styles.testimonialQuote}>
            <p>{testimonial.text}</p>
          </blockquote>
          <div className={styles.testimonialAuthor}>
            <span className={styles.testimonialName}>{testimonial.name}</span>
            {testimonial.role || testimonial.client ? (
              <span className={styles.testimonialRole}>
                {[testimonial.role, testimonial.client?.name].filter(Boolean).join(' — ')}
              </span>
            ) : null}
          </div>
        </li>
      ))}
    </ul>
  )
}

/**
 * FAQ em `<details>` nativo.
 *
 * Expansão, foco e teclado vêm da plataforma. Reimplementar acordeão com
 * `div` e `onClick` custaria `aria-expanded`, `aria-controls`, gestão de foco
 * e suporte a busca no navegador — tudo já resolvido pelo elemento nativo.
 */
export function FaqAccordion({ faqs }: { faqs: readonly PublicFaq[] }): ReactElement {
  return (
    <div className={styles.faqList}>
      {faqs.map((faq) => (
        <details key={faq.id} className={styles.faqItem} name="faq">
          <summary className={styles.faqSummary}>{faq.question}</summary>
          <p className={styles.faqAnswer}>{faq.answer}</p>
        </details>
      ))}
    </div>
  )
}

/**
 * CTA secundário de orçamento — gated e ciente da rota atual.
 *
 * Não se renderiza quando já estamos em `/orcamento`: isso elimina o botão que
 * recarregava a própria página. O rótulo e o destino vêm do gate único em
 * `config/lead-form`, então o botão nunca promete um formulário fechado.
 */
export function QuoteCta({
  currentPath,
  size = 'lg',
}: {
  currentPath?: string
  size?: 'sm' | 'md' | 'lg'
}): ReactElement | null {
  if (currentPath === QUOTE_PATH) return null

  return (
    <ButtonLink href={QUOTE_PATH} variant="secondary" size={size}>
      {quoteCtaLabel}
    </ButtonLink>
  )
}

export function FinalCta({
  heading,
  body,
  whatsappContext,
  currentPath,
}: {
  heading: string
  body: string
  whatsappContext: WhatsAppContext
  currentPath?: string
}): ReactElement {
  return (
    <Container as="section" className={styles.section}>
      <div className={styles.finalCta}>
        <h2 className="text-title">{heading}</h2>
        <p className={styles.finalCtaBody}>{body}</p>
        <div className={styles.finalCtaActions}>
          <WhatsAppLink context={whatsappContext} size="lg" />
          <QuoteCta currentPath={currentPath} />
        </div>
      </div>
    </Container>
  )
}

/* --------------------------------------------------------- renderizador */

export type PageSectionsProps = {
  blocks: readonly PublicPageBlock[]
  services: readonly PublicService[]
  segments: readonly PublicSegment[]
  clients: readonly PublicClient[]
  testimonials: readonly PublicTestimonial[]
  /** Rota canônica da página atual, usada para gating do CTA de orçamento. */
  currentPath?: string
}

/**
 * Traduz blocos de conteúdo em seções.
 *
 * Blocos que referenciam coleções vazias **não renderizam nada** — nem título
 * de seção, nem estado vazio. Um cabeçalho "Nossos clientes" sem clientes
 * comunicaria ausência de prova social de forma pior do que a omissão.
 */
export function PageSections({
  blocks,
  services,
  segments,
  clients,
  testimonials,
  currentPath,
}: PageSectionsProps): ReactElement {
  const serviceBySlug = new Map(services.map((service) => [service.slug, service]))
  const segmentBySlug = new Map(segments.map((segment) => [segment.slug, segment]))

  return (
    <>
      {blocks.map((block, index) => {
        const key = `${block.type}-${index}`

        switch (block.type) {
          case 'richText':
            return (
              <Section key={key} title={block.heading}>
                <div className={styles.sectionBody} style={{ maxWidth: '72ch' }}>
                  {block.paragraphs.map((paragraph) => (
                    <p key={paragraph.slice(0, 32)}>{paragraph}</p>
                  ))}
                </div>
              </Section>
            )

          case 'journeyRouter':
            return (
              <Section key={key} title="Por onde a sua operação começa">
                <ul className={styles.cardGrid}>
                  {block.items.map((item) => (
                    <li key={item.href}>
                      <Link className={styles.card} href={item.href}>
                        <h3 className={styles.cardTitle}>{item.title}</h3>
                        <p className={styles.cardBody}>{item.body}</p>
                        <span className={styles.cardCue} aria-hidden="true">
                          Ver caminho →
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </Section>
            )

          case 'process':
            return (
              <Section
                key={key}
                title="Como o trabalho acontece"
                body="Seis etapas que organizam o escopo, do primeiro contato ao acompanhamento posterior."
              >
                <ProcessTimeline steps={block.steps} />
              </Section>
            )

          case 'services': {
            const items = block.serviceSlugs
              .map((slug) => serviceBySlug.get(slug))
              .filter((service): service is PublicService => Boolean(service))
            if (items.length === 0) return null

            return (
              <Section
                key={key}
                id="solucoes"
                title="Soluções em aço inox"
                body="Escolha pela necessidade da operação."
              >
                <ServiceGrid services={items} />
              </Section>
            )
          }

          case 'segments': {
            const items = block.segmentSlugs
              .map((slug) => segmentBySlug.get(slug))
              .filter((segment): segment is PublicSegment => Boolean(segment))
            if (items.length === 0) return null

            return (
              <Section
                key={key}
                title="Segmentos atendidos"
                body="Conheça os perfis operacionais que orientam a definição das soluções."
              >
                <SegmentGrid segments={items} />
              </Section>
            )
          }

          case 'faq': {
            if (block.faqs.length === 0) return null
            return (
              <Section key={key} title="Perguntas frequentes">
                <FaqAccordion faqs={block.faqs} />
              </Section>
            )
          }

          case 'finalCta':
            return (
              <FinalCta
                key={key}
                heading={block.heading}
                body={block.body}
                whatsappContext={block.whatsappContext}
                currentPath={currentPath}
              />
            )

          case 'clients': {
            if (clients.length === 0) return null
            return (
              <Section
                key={key}
                title="Clientes que confiam na Designer Inox"
                body="Operações de diferentes portes e segmentos."
              >
                <ClientBar clients={clients} />
              </Section>
            )
          }

          case 'testimonials': {
            if (testimonials.length === 0) return null
            return (
              <Section
                key={key}
                title="O que nossos clientes dizem"
                body="Depoimentos de quem já trabalhou com a gente."
              >
                <TestimonialGrid testimonials={testimonials} />
              </Section>
            )
          }

          case 'latestArticles':
            return null

          default:
            return null
        }
      })}
    </>
  )
}
