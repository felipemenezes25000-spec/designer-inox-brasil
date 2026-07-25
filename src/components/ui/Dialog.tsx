'use client'

import { useEffect, useId, useRef, type ReactElement, type ReactNode, type RefObject } from 'react'

import styles from './Dialog.module.css'

export type DialogProps = {
  open: boolean
  title: string
  onClose(): void
  children: ReactNode
  initialFocusRef?: RefObject<HTMLElement | null>
  closeLabel?: string
}

/**
 * Diálogo modal sobre o `<dialog>` nativo.
 *
 * `showModal()` entrega, pelo navegador, prisão de foco, camada superior,
 * fechamento por `Esc` e inertização do restante da página. Reimplementar
 * isso em JavaScript é a origem clássica de armadilhas de foco quebradas —
 * aqui o comportamento vem da plataforma.
 *
 * O que o componente ainda precisa fazer:
 *   - devolver o foco ao elemento que abriu, porque o retorno nativo não é
 *     garantido quando o acionador é desmontado ou re-renderizado;
 *   - traduzir o evento `cancel` (Esc) em `onClose`, para que o estado do
 *     React não fique dessincronizado do DOM.
 */
export function Dialog({
  open,
  title,
  onClose,
  children,
  initialFocusRef,
  closeLabel = 'Fechar',
}: DialogProps): ReactElement {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const previouslyFocused = useRef<HTMLElement | null>(null)
  const titleId = useId()

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (open && !dialog.open) {
      previouslyFocused.current = document.activeElement as HTMLElement | null
      dialog.showModal()
      initialFocusRef?.current?.focus()
    }

    if (!open && dialog.open) {
      dialog.close()
    }
  }, [open, initialFocusRef])

  useEffect(() => {
    if (open) return
    // Devolve o foco só depois do fechamento, para não competir com a
    // movimentação de foco que o próprio navegador faz ao fechar o modal.
    previouslyFocused.current?.focus()
    previouslyFocused.current = null
  }, [open])

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-labelledby={titleId}
      onCancel={(event) => {
        // Sem `preventDefault` o navegador fecha o elemento sem avisar o
        // React, deixando `open` verdadeiro e o diálogo invisível.
        event.preventDefault()
        onClose()
      }}
      onClose={() => {
        if (open) onClose()
      }}
    >
      <div className={styles.header}>
        <h2 className={styles.title} id={titleId}>
          {title}
        </h2>
        <button type="button" className={styles.close} onClick={onClose} aria-label={closeLabel}>
          <span aria-hidden="true">×</span>
        </button>
      </div>
      <div className={styles.body}>{children}</div>
    </dialog>
  )
}
