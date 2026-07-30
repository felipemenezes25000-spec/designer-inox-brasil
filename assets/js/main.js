/**
 * Comportamento do site. Sem dependências, sem build.
 *
 * Três responsabilidades: menu mobile acessível, revelação em scroll e a
 * montagem da mensagem de WhatsApp a partir do formulário.
 */
;(() => {
  'use strict'
  document.documentElement.classList.add('js')

  // ── Menu mobile ─────────────────────────────────────────────────────────
  const menuButton = document.querySelector('[data-menu-button]')
  const menu = document.querySelector('[data-menu]')

  if (menuButton && menu) {
    const setOpen = open => {
      menu.classList.toggle('open', open)
      menuButton.setAttribute('aria-expanded', String(open))
      menuButton.setAttribute('aria-label', open ? 'Fechar navegação' : 'Abrir navegação')
      document.body.classList.toggle('menu-open', open)
    }

    const isOpen = () => menuButton.getAttribute('aria-expanded') === 'true'

    menuButton.addEventListener('click', () => setOpen(!isOpen()))

    // Fechar ao navegar mantém o comportamento previsível em âncoras da própria
    // página, onde nenhuma navegação de documento acontece para limpar o estado.
    menu.addEventListener('click', event => {
      if (event.target.closest('a')) setOpen(false)
    })

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && isOpen()) {
        setOpen(false)
        // Devolver o foco ao gatilho evita que o teclado fique preso no
        // conteúdo que acabou de sair da tela.
        menuButton.focus()
      }
    })

    // Passar do breakpoint com o menu aberto deixaria body.menu-open travando
    // o scroll de um layout que já não tem menu sobreposto.
    const desktop = window.matchMedia('(min-width: 1081px)')
    const syncViewport = event => {
      if (event.matches && isOpen()) setOpen(false)
    }
    if (desktop.addEventListener) desktop.addEventListener('change', syncViewport)
    else desktop.addListener(syncViewport)
  }

  // ── Revelação em scroll ─────────────────────────────────────────────────
  const revealTargets = document.querySelectorAll('.reveal')
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (!revealTargets.length) {
    // nada a fazer
  } else if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealTargets.forEach(el => el.classList.add('is-visible'))
  } else {
    const observer = new IntersectionObserver(
      (entries, self) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('is-visible')
          self.unobserve(entry.target)
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    )
    revealTargets.forEach(el => observer.observe(el))
  }

  // ── Formulário → WhatsApp ───────────────────────────────────────────────
  const form = document.querySelector('[data-quote-form]')

  if (form) {
    const status = form.querySelector('[data-form-status]')
    const phone = form.dataset.phone || '5561996831052'

    const setStatus = (message, state) => {
      if (!status) return
      status.textContent = message
      if (state) status.dataset.state = state
      else delete status.dataset.state
    }

    form.addEventListener('submit', event => {
      event.preventDefault()

      // O form tem novalidate para o navegador não bloquear o submit antes de
      // chegarmos aqui; reportValidity() reativa a UI nativa sob nosso controle.
      if (!form.reportValidity()) {
        setStatus('Preencha os campos obrigatórios para continuar.', 'error')
        return
      }

      const data = new FormData(form)
      const value = key => String(data.get(key) || '').trim()

      const lines = ['Olá, encontrei a Designer Inox Brasil pelo site e gostaria de solicitar uma avaliação.', '']

      const nome = value('nome')
      if (nome) lines.push(`Nome: ${nome}`)
      lines.push(`Cidade/UF: ${value('cidade')}`)
      lines.push(`Tipo de operação: ${value('operacao')}`)

      const servico = value('servico')
      if (servico) lines.push(`Serviço de interesse: ${servico}`)

      lines.push('', 'Necessidade:', value('necessidade'))

      const prioridade = value('prioridade')
      if (prioridade) lines.push('', `Prioridade: ${prioridade}`)

      lines.push('', 'Posso enviar fotos, medidas ou plantas na conversa.')

      const url = `https://wa.me/${phone}?text=${encodeURIComponent(lines.join('\n'))}`
      const opened = window.open(url, '_blank', 'noopener,noreferrer')

      if (opened) {
        setStatus('Abrindo o WhatsApp com a sua mensagem…')
      } else {
        // Pop-up bloqueado: o link abaixo continua clicável, então o usuário
        // não fica sem caminho.
        setStatus('O navegador bloqueou a janela. Use o botão "Abrir WhatsApp sem o formulário" ao lado.', 'error')
      }
    })
  }

  // ── Ano corrente no rodapé ──────────────────────────────────────────────
  document.querySelectorAll('[data-year]').forEach(el => {
    el.textContent = String(new Date().getFullYear())
  })
})()
