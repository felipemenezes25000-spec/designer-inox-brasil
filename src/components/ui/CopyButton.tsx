'use client'

import { useEffect, useRef, useState, type ReactElement } from 'react'

import { Button } from './Button'
import styles from './CopyButton.module.css'

export type CopyButtonProps = {
  value: string
  label: string
  copiedLabel?: string
  failureLabel?: string
}

const FEEDBACK_DURATION_MS = 4000

/**
 * Copia um valor para a área de transferência e anuncia o resultado.
 *
 * O anúncio vai para uma região `aria-live="polite"` que **não contém o valor
 * copiado**: o protocolo do lead é dado do titular e não deve ser lido em voz
 * alta por um leitor de tela em ambiente compartilhado, nem ficar no DOM
 * fora do campo que já o exibe.
 *
 * O rótulo visível do botão não muda para "Copiado": trocar o nome acessível
 * de um controle logo após o clique faz alguns leitores de tela reanunciarem
 * o botão como se fosse outro elemento.
 */
export function CopyButton({
  value,
  label,
  copiedLabel = 'Copiado',
  failureLabel = 'Não foi possível copiar. Selecione e copie manualmente.',
}: CopyButtonProps): ReactElement {
  const [status, setStatus] = useState<'idle' | 'copied' | 'failed'>('idle')
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (timeout.current) clearTimeout(timeout.current)
    }
  }, [])

  const announce = (next: 'copied' | 'failed') => {
    setStatus(next)
    if (timeout.current) clearTimeout(timeout.current)
    timeout.current = setTimeout(() => setStatus('idle'), FEEDBACK_DURATION_MS)
  }

  return (
    <span className={styles.wrapper}>
      <Button
        variant="secondary"
        size="sm"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(value)
            announce('copied')
          } catch {
            announce('failed')
          }
        }}
      >
        {label}
      </Button>

      <span className={styles.feedback} role="status" aria-live="polite">
        {status === 'copied' ? copiedLabel : null}
        {status === 'failed' ? failureLabel : null}
      </span>
    </span>
  )
}
