import { useRef, useState } from 'react'
import { describe, expect, test, vi } from 'vitest'

import { Button, ButtonLink } from '@/components/ui/Button'
import { CopyButton } from '@/components/ui/CopyButton'
import { Dialog } from '@/components/ui/Dialog'
import { Field } from '@/components/ui/Field'
import { FilePicker } from '@/components/ui/FilePicker'
import { FoldLine } from '@/components/ui/FoldLine'
import { SkipLink } from '@/components/ui/SkipLink'
import { renderWithProviders, screen, userEvent, waitFor } from '../../helpers/render'

describe('Button', () => {
  test('renderiza um <button> com type="button" por padrão', () => {
    renderWithProviders(<Button>Salvar</Button>)
    const button = screen.getByRole('button', { name: 'Salvar' })

    expect(button.tagName).toBe('BUTTON')
    expect(button).toHaveAttribute('type', 'button')
  })

  test('respeita disabled e o expõe também por aria-disabled', () => {
    renderWithProviders(<Button disabled>Enviar</Button>)
    const button = screen.getByRole('button', { name: 'Enviar' })

    expect(button).toBeDisabled()
    expect(button).toHaveAttribute('aria-disabled', 'true')
  })

  test('em carregamento permanece focável e bloqueia o clique', async () => {
    const onClick = vi.fn()
    renderWithProviders(
      <Button loading onClick={onClick}>
        Enviar
      </Button>,
    )

    const button = screen.getByRole('button')
    // aria-disabled em vez de disabled: um elemento disabled sai da ordem de
    // tabulação e o foco se perde no meio do envio.
    expect(button).not.toBeDisabled()
    expect(button).toHaveAttribute('aria-disabled', 'true')
    expect(button).toHaveAttribute('aria-busy', 'true')

    await userEvent.click(button)
    expect(onClick).not.toHaveBeenCalled()
  })

  test('a variante WhatsApp é a única verde e aplica a classe correspondente', () => {
    renderWithProviders(<Button variant="whatsapp">Falar no WhatsApp</Button>)
    expect(screen.getByRole('button').className).toMatch(/whatsapp/)

    renderWithProviders(<Button variant="primary">Solicitar</Button>)
    expect(screen.getByRole('button', { name: 'Solicitar' }).className).not.toMatch(/whatsapp/)
  })
})

describe('ButtonLink', () => {
  test('renderiza uma âncora navegável, não um botão', () => {
    renderWithProviders(<ButtonLink href="/orcamento">Solicitar orçamento</ButtonLink>)
    const link = screen.getByRole('link', { name: 'Solicitar orçamento' })

    expect(link.tagName).toBe('A')
    expect(link).toHaveAttribute('href', '/orcamento')
    expect(link).not.toHaveAttribute('target')
  })

  test('link externo abre em nova aba com rel de segurança', () => {
    renderWithProviders(
      <ButtonLink href="https://wa.me/5561996831052" external variant="whatsapp">
        Falar no WhatsApp
      </ButtonLink>,
    )
    const link = screen.getByRole('link')

    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })
})

describe('SkipLink e FoldLine', () => {
  test('o skip link aponta para o alvo e é focável', () => {
    renderWithProviders(<SkipLink targetId="main-content" />)
    const link = screen.getByRole('link', { name: 'Ir para o conteúdo principal' })

    expect(link).toHaveAttribute('href', '#main-content')
  })

  test('a linha de dobra é decorativa e fica fora da árvore de acessibilidade', () => {
    const { container } = renderWithProviders(<FoldLine />)
    const svg = container.querySelector('svg')

    expect(svg).toHaveAttribute('aria-hidden', 'true')
    expect(svg).toHaveAttribute('focusable', 'false')
  })
})

describe('Field', () => {
  test('associa rótulo, dica e erro ao controle', () => {
    renderWithProviders(
      <Field
        id="cidade"
        label="Cidade e UF"
        hint="Exemplo: Brasília, DF"
        error="Informe a cidade e a UF."
        required
      >
        <input type="text" />
      </Field>,
    )

    const input = screen.getByLabelText(/Cidade e UF/)
    expect(input).toHaveAttribute('aria-describedby', 'cidade-hint cidade-error')
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input).toBeRequired()
    expect(screen.getByRole('alert')).toHaveTextContent('Informe a cidade e a UF.')
  })

  test('sem erro não marca aria-invalid', () => {
    renderWithProviders(
      <Field id="empresa" label="Empresa" hint="Opcional">
        <input type="text" />
      </Field>,
    )

    const input = screen.getByLabelText('Empresa')
    expect(input).not.toHaveAttribute('aria-invalid')
    expect(input).toHaveAttribute('aria-describedby', 'empresa-hint')
  })

  test('o rótulo é persistente, não placeholder', () => {
    renderWithProviders(
      <Field id="nome" label="Nome">
        <input type="text" />
      </Field>,
    )

    expect(screen.getByText('Nome').tagName).toBe('LABEL')
    expect(screen.getByLabelText('Nome')).not.toHaveAttribute('placeholder')
  })
})

describe('FilePicker', () => {
  test('aceita apenas os formatos contratados e permite múltiplos arquivos', () => {
    renderWithProviders(
      <FilePicker id="anexos" label="Anexos" onSelect={() => {}} hint="Até 10 arquivos" />,
    )

    const input = screen.getByLabelText('Anexos')
    expect(input).toHaveAttribute('accept', '.jpg,.jpeg,.png,.webp,.pdf')
    expect(input).toHaveAttribute('multiple')
  })

  test('entrega a seleção e limpa o valor para permitir reescolher o mesmo arquivo', async () => {
    const onSelect = vi.fn()
    renderWithProviders(<FilePicker id="anexos" label="Anexos" onSelect={onSelect} />)

    const input = screen.getByLabelText('Anexos') as HTMLInputElement
    const file = new File(['conteudo'], 'planta.pdf', { type: 'application/pdf' })
    await userEvent.upload(input, file)

    expect(onSelect).toHaveBeenCalledTimes(1)
    expect(onSelect.mock.calls[0][0].map((f: File) => f.name)).toEqual(['planta.pdf'])
    expect(input.value).toBe('')
  })

  test('desabilitado não aceita seleção', () => {
    renderWithProviders(<FilePicker id="anexos" label="Anexos" disabled onSelect={() => {}} />)
    expect(screen.getByLabelText('Anexos')).toBeDisabled()
  })
})

function DialogHarness() {
  const [open, setOpen] = useState(false)
  const firstFieldRef = useRef<HTMLInputElement>(null)

  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Abrir menu
      </button>
      <Dialog
        open={open}
        title="Navegação"
        onClose={() => setOpen(false)}
        initialFocusRef={firstFieldRef}
      >
        <input ref={firstFieldRef} type="text" aria-label="Buscar" />
      </Dialog>
    </>
  )
}

describe('Dialog', () => {
  test('abre com showModal, foca o alvo inicial e devolve o foco ao acionador', async () => {
    // jsdom não implementa showModal/close nativos.
    HTMLDialogElement.prototype.showModal = vi.fn(function (this: HTMLDialogElement) {
      this.open = true
    })
    HTMLDialogElement.prototype.close = vi.fn(function (this: HTMLDialogElement) {
      this.open = false
    })

    renderWithProviders(<DialogHarness />)
    const trigger = screen.getByRole('button', { name: 'Abrir menu' })

    trigger.focus()
    await userEvent.click(trigger)

    expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled()
    await waitFor(() => expect(screen.getByLabelText('Buscar')).toHaveFocus())

    await userEvent.click(screen.getByRole('button', { name: 'Fechar' }))
    await waitFor(() => expect(trigger).toHaveFocus())
  })

  test('o título do diálogo é o nome acessível', () => {
    HTMLDialogElement.prototype.showModal = vi.fn(function (this: HTMLDialogElement) {
      this.open = true
    })
    HTMLDialogElement.prototype.close = vi.fn()

    const { container } = renderWithProviders(
      <Dialog open title="Navegação" onClose={() => {}}>
        <p>conteúdo</p>
      </Dialog>,
    )

    const dialog = container.querySelector('dialog')!
    const labelledBy = dialog.getAttribute('aria-labelledby')
    expect(document.getElementById(labelledBy!)).toHaveTextContent('Navegação')
  })
})

describe('CopyButton', () => {
  test('anuncia "Copiado" sem expor o valor copiado', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.assign(navigator, { clipboard: { writeText } })

    const protocolo = 'DI-9F3A-77KQ'
    renderWithProviders(<CopyButton value={protocolo} label="Copiar protocolo" />)

    await userEvent.click(screen.getByRole('button', { name: 'Copiar protocolo' }))

    expect(writeText).toHaveBeenCalledWith(protocolo)

    const status = await screen.findByRole('status')
    expect(status).toHaveTextContent('Copiado')
    // O protocolo é dado do titular: não pode ser lido em voz alta por um
    // leitor de tela nem duplicado no DOM fora do campo que já o exibe.
    expect(status).not.toHaveTextContent(protocolo)
  })

  test('falha da Clipboard API vira orientação acionável, não silêncio', async () => {
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockRejectedValue(new Error('negado')) },
    })

    renderWithProviders(<CopyButton value="DI-9F3A-77KQ" label="Copiar protocolo" />)
    await userEvent.click(screen.getByRole('button'))

    expect(await screen.findByRole('status')).toHaveTextContent(/copie manualmente/i)
  })

  test('o rótulo do botão não muda depois do clique', async () => {
    Object.assign(navigator, { clipboard: { writeText: vi.fn().mockResolvedValue(undefined) } })

    renderWithProviders(<CopyButton value="X" label="Copiar protocolo" />)
    const button = screen.getByRole('button', { name: 'Copiar protocolo' })
    await userEvent.click(button)

    // Trocar o nome acessível logo após o clique faz alguns leitores de tela
    // reanunciarem o controle como se fosse outro elemento.
    expect(button).toHaveAccessibleName('Copiar protocolo')
  })
})
