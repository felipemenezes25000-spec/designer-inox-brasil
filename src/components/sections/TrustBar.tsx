import type { ReactElement, ReactNode } from 'react'

import { Container } from '@/components/ui/Container'
import styles from './sections.module.css'

/**
 * Faixa de capacidades exibida logo após o hero da home.
 *
 * O conteúdo espelha as capacidades **já confirmadas** na especificação §4.1
 * (projeto, fabricação, instalação e suporte) — não são fatos novos, métricas
 * ou promessas. A cópia mantém o tom condicional do produto ("quando previstas
 * na proposta"), então nada aqui compromete a regra anti-invenção. Quando o
 * Plano 03 abrir o CMS, estes itens podem migrar para conteúdo editável.
 */

type Capability = {
  title: string
  body: string
  icon: ReactNode
}

const iconProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  focusable: false,
}

const CAPABILITIES: readonly Capability[] = [
  {
    title: 'Projeto técnico',
    body: 'Soluções desenvolvidas a partir do espaço, do fluxo e da necessidade da operação.',
    icon: (
      <svg {...iconProps}>
        <path d="M4 20 L20 20 L4 4 Z" />
        <path d="M4 11 h3.5 M4 15 h7" />
      </svg>
    ),
  },
  {
    title: 'Fabricação sob medida',
    body: 'Estruturas e equipamentos em inox produzidos conforme as dimensões do projeto.',
    icon: (
      <svg {...iconProps}>
        <path d="M3 17 L10 17 L14 7 L21 7" />
        <circle cx="3" cy="17" r="1.1" />
        <circle cx="21" cy="7" r="1.1" />
      </svg>
    ),
  },
  {
    title: 'Instalação especializada',
    body: 'Montagem e integração executadas dentro do escopo aprovado.',
    icon: (
      <svg {...iconProps}>
        <path d="M12 3 L19 7 V15 L12 19 L5 15 V7 Z" />
        <circle cx="12" cy="11" r="3" />
      </svg>
    ),
  },
  {
    title: 'Suporte pós-entrega',
    body: 'Orientação, ajustes e manutenção quando previstos na proposta.',
    icon: (
      <svg {...iconProps}>
        <path d="M12 3 L19 6 V11 C19 16 12 21 12 21 C12 21 5 16 5 11 V6 Z" />
        <path d="M9 11 l2 2 l4 -4" />
      </svg>
    ),
  },
]

export function TrustBar(): ReactElement {
  return (
    <section className={styles.trustBand} aria-label="O que a Designer Inox executa">
      <Container>
        <ul className={styles.trustGrid}>
          {CAPABILITIES.map((capability) => (
            <li key={capability.title} className={styles.trustItem}>
              <span className={styles.trustIcon} aria-hidden="true">
                {capability.icon}
              </span>
              <div>
                {/* Rótulo, não cabeçalho: manter o outline do documento com um
                    único H1 e sem quatro H2 competindo logo abaixo do hero. */}
                <p className={styles.trustItemTitle}>{capability.title}</p>
                <p className={styles.trustItemBody}>{capability.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
