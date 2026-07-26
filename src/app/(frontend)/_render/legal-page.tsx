import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Fragment, type ReactElement, type ReactNode } from 'react'

import { Breadcrumb } from '@/components/sections/Breadcrumb'
import { Section } from '@/components/sections/PageSections'
import { Container } from '@/components/ui/Container'
import { getPublicContentRepository } from '@/modules/content/public/composition-root'
import type { PublicLegalDocument } from '@/modules/content/public/types'
import { deferToRuntime } from '@/modules/site/runtime'
import styles from '@/components/sections/sections.module.css'

const EMAIL_RE = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g

function linkEmails(text: string): ReactNode {
  const parts = text.split(EMAIL_RE)
  if (parts.length === 1) return text
  return parts.map((part, i) =>
    EMAIL_RE.test(part) ? (
      <a key={i} href={`mailto:${part}`}>{part}</a>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  )
}

export async function generateLegalMetadata(
  type: PublicLegalDocument['type'],
  canonical: string,
): Promise<Metadata> {
  await deferToRuntime()
  const document = await getPublicContentRepository().getLegalDocument(type)
  if (!document) return { title: 'Página não encontrada' }

  return {
    title: { absolute: document.seo.title },
    description: document.seo.description,
    alternates: { canonical },
    robots: { index: true, follow: true },
  }
}

export async function renderLegalPage(
  type: PublicLegalDocument['type'],
): Promise<ReactElement> {
  await deferToRuntime()
  const document = await getPublicContentRepository().getLegalDocument(type)

  if (!document) notFound()

  return (
    <>
      <Breadcrumb
        items={[
          { label: 'Início', href: '/' },
          { label: document.title },
        ]}
      />

      <Container as="article">
        <div className={styles.section}>
          <h1 className="text-title">{document.title}</h1>
          <p className={styles.sectionBody} style={{ marginBlockStart: 'var(--space-xs)' }}>
            Versão {document.version} — em vigor desde{' '}
            {new Date(document.effectiveAt).toLocaleDateString('pt-BR')}
          </p>
        </div>

        {document.body.map((section) => (
          <Section key={section.heading} title={section.heading} headingLevel={2}>
            <div className={styles.sectionBody} style={{ maxWidth: '72ch' }}>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 32)}>{linkEmails(paragraph)}</p>
              ))}
            </div>
          </Section>
        ))}
      </Container>
    </>
  )
}
