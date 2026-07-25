'use client'

import { useId, useRef, type ReactElement } from 'react'

import styles from './FilePicker.module.css'

/** Formatos aceitos no lançamento. Ativos, executáveis, compactados e CAD ficam fora. */
export const ACCEPTED_FILE_TYPES = '.jpg,.jpeg,.png,.webp,.pdf' as const
export const MAX_FILES = 10

export type FilePickerProps = {
  id: string
  label: string
  accept?: typeof ACCEPTED_FILE_TYPES
  maxFiles?: typeof MAX_FILES
  hint?: string
  disabled?: boolean
  onSelect(files: readonly File[]): void
}

/**
 * Seleção de arquivos, sem envio.
 *
 * Este componente é deliberadamente burro: não faz upload, não persiste e não
 * decide se um arquivo é aceitável. Validação de MIME declarado, MIME
 * detectado, assinatura, tamanho por arquivo e total do envio pertence ao
 * servidor (Plano 04) — uma checagem só no cliente seria contornável.
 *
 * O valor do `<input>` é limpo após entregar a seleção para que escolher o
 * mesmo arquivo duas vezes seguidas continue disparando `change`.
 */
export function FilePicker({
  id,
  label,
  accept = ACCEPTED_FILE_TYPES,
  maxFiles = MAX_FILES,
  hint,
  disabled = false,
  onSelect,
}: FilePickerProps): ReactElement {
  const inputRef = useRef<HTMLInputElement>(null)
  const hintId = useId()

  return (
    <div className={styles.picker}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>

      <input
        ref={inputRef}
        className={styles.input}
        id={id}
        type="file"
        multiple
        accept={accept}
        disabled={disabled}
        aria-describedby={hint ? hintId : undefined}
        onChange={(event) => {
          const selected = Array.from(event.target.files ?? []).slice(0, maxFiles)
          onSelect(selected)
          if (inputRef.current) inputRef.current.value = ''
        }}
      />

      {hint ? (
        <span className={styles.hint} id={hintId}>
          {hint}
        </span>
      ) : null}
    </div>
  )
}
