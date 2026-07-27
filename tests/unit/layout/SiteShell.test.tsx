import { describe, expect, test } from 'vitest'

import { MAIN_CONTENT_ID, SiteShell } from '@/components/layout/SiteShell'
import type { FooterNavigation, SiteNavigation } from '@/components/layout/navigation'
import { FOUNDATION_FOOTER, FOUNDATION_NAVIGATION } from '@/config/foundation-navigation'
import { renderWithProviders, screen, within } from '../../helpers/render'

const navigationWithoutProjects: SiteNavigation = FOUNDATION_NAVIGATION
const footerWithoutProjects: FooterNavigation = FOUNDATION_FOOTER

const renderShell = (overrides: Partial<Parameters<typeof SiteShell>[0]> = {}) =>
  renderWithProviders(
    <SiteShell
      navigation={navigationWithoutProjects}
      footer={footerWithoutProjects}
      {...overrides}
    >
      <h1>Página de fundação</h1>
    </SiteShell>,
  )

describe('SiteShell', () => {
  test('a marca liga para a página inicial com nome acessível da empresa', () => {
    renderShell()
    const brandLink = screen.getByRole('link', {
      name: 'Designer Inox Brasil, página inicial',
    })

    expect(brandLink).toHaveAttribute('href', '/')
  })

  test('o skip link aponta para o conteúdo principal e o alvo existe', () => {
    const { container } = renderShell()

    expect(screen.getByRole('link', { name: /Ir para o conteúdo principal/ })).toHaveAttribute(
      'href',
      `#${MAIN_CONTENT_ID}`,
    )

    const main = container.querySelector('main')
    expect(main).toHaveAttribute('id', MAIN_CONTENT_ID)
    // `tabIndex={-1}` é o que permite ao main receber foco programático
    // depois que o skip link é acionado.
    expect(main).toHaveAttribute('tabindex', '-1')
  })

  test('o skip link é o primeiro elemento focável do documento', () => {
    const { container } = renderShell()
    const focusable = container.querySelectorAll('a[href], button, [tabindex]:not([tabindex="-1"])')

    expect(focusable[0]).toHaveTextContent('Ir para o conteúdo principal')
  })

  test('navegação e rodapé têm nomes acessíveis distintos', () => {
    renderShell()
    const navigations = screen.getAllByRole('navigation')
    const names = navigations.map((nav) => nav.getAttribute('aria-label'))

    expect(names).toContain('Navegação principal')
    expect(names).toContain('Navegação do rodapé')
    expect(names).toContain('Documentos legais')
    expect(new Set(names).size).toBe(names.length)
  })

  test('o CTA de avaliação está presente', () => {
    renderShell()
    expect(screen.getAllByRole('link', { name: 'Solicitar avaliação' }).length).toBeGreaterThan(0)
  })

  test('não renderiza Projetos quando a navegação não o fornece', () => {
    renderShell()

    expect(screen.queryByRole('link', { name: 'Projetos' })).toBeNull()
    expect(screen.queryByText(/Ver projetos realizados/)).toBeNull()
  })

  test('não publica blog, clientes nem depoimentos na fundação', () => {
    renderShell()

    for (const forbidden of [/blog/i, /clientes/i, /depoimentos/i]) {
      expect(screen.queryByText(forbidden)).toBeNull()
    }
  })

  test('não inventa dado empresarial ausente no rodapé', () => {
    renderShell()

    for (const forbidden of [/CNPJ/i, /horário/i, /em breve/i]) {
      expect(screen.queryByText(forbidden)).toBeNull()
    }
  })

  test('o botão flutuante do WhatsApp só aparece quando fornecido', () => {
    renderShell()
    expect(screen.queryByRole('link', { name: 'Falar no WhatsApp' })).toBeNull()

    renderShell({
      whatsapp: { href: 'https://wa.me/5561996831052', label: 'Falar no WhatsApp' },
    })
    const float = screen.getByRole('link', { name: 'Falar no WhatsApp' })
    expect(float).toHaveAttribute('rel', 'noopener noreferrer')
    expect(float).toHaveAttribute('href', 'https://wa.me/5561996831052')
  })

  test('o mega menu de soluções expõe as seis rotas confirmadas', () => {
    renderShell()
    const [primaryNav] = screen.getAllByRole('navigation', { name: 'Navegação principal' })

    for (const href of [
      '/cozinhas-industriais',
      '/equipamentos-em-inox',
      '/coifas-ventilacao-e-exaustao',
      '/sistemas-integrados-em-inox',
      '/projeto-tecnico-e-fabricacao-cnc',
      '/reformas-e-modernizacoes',
    ]) {
      expect(within(primaryNav).getAllByRole('link').some((l) => l.getAttribute('href') === href))
        .toBe(true)
    }
  })

  test('proteção contra incêndio está integralmente ausente', () => {
    const { container } = renderShell()
    const markup = container.innerHTML.toLowerCase()

    for (const forbidden of ['incêndio', 'incendio', 'sprinkler', 'combate a fogo']) {
      expect(markup).not.toContain(forbidden)
    }
  })
})
