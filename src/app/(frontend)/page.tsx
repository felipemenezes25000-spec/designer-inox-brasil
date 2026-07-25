import type { ReactElement } from 'react'

import { ButtonLink } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { FOUNDATION_NAVIGATION } from '@/config/foundation-navigation'
import styles from './page.module.css'

/**
 * Página de fundação.
 *
 * Publica exclusivamente conteúdo já aprovado na especificação: identificação,
 * H1, subtítulo, microtexto e os CTAs vindos da navegação. Nenhum cliente,
 * número, certificação, endereço ou projeto aparece aqui — eles dependem de
 * comprovação que ainda não existe.
 *
 * O CTA secundário aponta para o hub de soluções, e não para "Ver projetos
 * realizados", porque ainda não há projeto aprovado (especificação §8.1).
 */
export default function HomePage(): ReactElement {
  return (
    <Container as="section" className={styles.hero}>
      <span className={`text-eyebrow ${styles.eyebrow}`}>Designer Inox Brasil</span>

      <h1 className={`text-display ${styles.title}`}>
        Soluções industriais completas em aço inox, do espaço vazio à operação pronta.
      </h1>

      <p className={`text-lead ${styles.subtitle}`}>
        Projetamos, fabricamos, instalamos e mantemos cozinhas industriais, equipamentos,
        mobiliários, coifas, estruturas e sistemas integrados para operações profissionais.
      </p>

      <div className={styles.actions}>
        <ButtonLink href={FOUNDATION_NAVIGATION.cta.href} variant="primary" size="lg">
          {FOUNDATION_NAVIGATION.cta.label}
        </ButtonLink>
        <ButtonLink href="/solucoes-em-inox" variant="secondary" size="lg">
          Conhecer nossas soluções
        </ButtonLink>
      </div>

      <p className={styles.microcopy}>
        Envie fotos, medidas ou plantas. Projetos complexos podem exigir levantamento técnico.
      </p>
    </Container>
  )
}
