import { cloneElement, type ReactElement } from 'react'

import styles from './Field.module.css'

type ControlProps = {
  id?: string
  'aria-describedby'?: string
  'aria-invalid'?: boolean
  required?: boolean
}

export type FieldProps = {
  id: string
  label: string
  hint?: string
  error?: string
  required?: boolean
  children: ReactElement<ControlProps>
}

/**
 * Rótulo persistente, dica e erro associados a um controle.
 *
 * O rótulo é sempre visível — não é placeholder. Placeholder desaparece ao
 * digitar, o que faz o usuário perder a referência do que preencher, e não é
 * anunciado de forma confiável por todos os leitores de tela.
 *
 * `aria-describedby` concatena dica e erro na ordem de leitura, e
 * `aria-invalid` só aparece quando existe erro: marcar um campo válido como
 * inválido faria o leitor de tela anunciar um problema inexistente.
 */
export function Field({
  id,
  label,
  hint,
  error,
  required = false,
  children,
}: FieldProps): ReactElement {
  const hintId = hint ? `${id}-hint` : null
  const errorId = error ? `${id}-error` : null
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined

  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id}>
        {label}
        {required ? (
          <span className={styles.requiredMark} aria-hidden="true">
            *
          </span>
        ) : null}
      </label>

      {hint ? (
        <span className={styles.hint} id={hintId ?? undefined}>
          {hint}
        </span>
      ) : null}

      <div className={styles.control}>
        {cloneElement(children, {
          id,
          required: required || children.props.required,
          'aria-describedby': describedBy,
          'aria-invalid': error ? true : undefined,
        })}
      </div>

      {error ? (
        <span className={styles.error} id={errorId ?? undefined} role="alert">
          <span className={styles.errorIcon} aria-hidden="true">
            !
          </span>
          {error}
        </span>
      ) : null}
    </div>
  )
}
