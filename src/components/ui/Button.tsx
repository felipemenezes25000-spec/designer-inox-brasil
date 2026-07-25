import Link from 'next/link'
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactElement } from 'react'

import styles from './Button.module.css'

export type ButtonVariant = 'primary' | 'secondary' | 'text' | 'whatsapp'
export type ButtonSize = 'sm' | 'md' | 'lg'

type SharedProps = {
  variant?: ButtonVariant
  size?: ButtonSize
  block?: boolean
}

function classesFor({ variant = 'primary', size = 'md', block }: SharedProps, extra?: string) {
  return [styles.base, styles[variant], styles[size], block ? styles.block : null, extra]
    .filter(Boolean)
    .join(' ')
}

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  SharedProps & {
    loading?: boolean
    loadingLabel?: string
  }

/**
 * Botão de ação.
 *
 * Em estado de carregamento usa `aria-disabled` em vez de `disabled`: um
 * elemento `disabled` sai da ordem de tabulação, e perder o foco no meio de
 * um envio desorienta quem navega por teclado. O clique é bloqueado no
 * manipulador, não pela desabilitação nativa.
 */
export function Button({
  variant = 'primary',
  size = 'md',
  block,
  loading = false,
  loadingLabel = 'Enviando',
  className,
  children,
  type = 'button',
  onClick,
  ...rest
}: ButtonProps): ReactElement {
  return (
    <button
      {...rest}
      type={type}
      className={classesFor({ variant, size, block }, [loading ? styles.loading : null, className]
        .filter(Boolean)
        .join(' '))}
      aria-disabled={loading || rest.disabled ? true : undefined}
      aria-busy={loading || undefined}
      onClick={(event) => {
        if (loading) {
          event.preventDefault()
          return
        }
        onClick?.(event)
      }}
    >
      {loading ? (
        <>
          <span className={styles.spinner} aria-hidden="true" />
          <span>{loadingLabel}</span>
        </>
      ) : (
        children
      )}
    </button>
  )
}

export type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> &
  SharedProps & {
    href: string
    external?: boolean
  }

/**
 * Link com aparência de botão.
 *
 * É uma âncora, não um `<button>` com navegação programática: leitores de
 * tela anunciam o papel correto e o usuário mantém abrir em nova aba, copiar
 * endereço e voltar.
 *
 * Rotas internas passam por `next/link` para navegação no cliente e prefetch;
 * destinos externos e âncoras de fragmento usam `<a>` puro, onde o roteador
 * não tem o que fazer.
 */
export function ButtonLink({
  variant = 'primary',
  size = 'md',
  block,
  external = false,
  className,
  children,
  href,
  ...rest
}: ButtonLinkProps): ReactElement {
  const classes = classesFor({ variant, size, block }, className)
  const isInternal = !external && href.startsWith('/')

  if (isInternal) {
    return (
      <Link {...rest} href={href} className={classes}>
        {children}
      </Link>
    )
  }

  return (
    <a
      {...rest}
      href={href}
      className={classes}
      // `noopener` evita que o destino acesse `window.opener`; `noreferrer`
      // impede o vazamento da URL de origem.
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {children}
    </a>
  )
}
