import { describe, expect, test } from 'vitest'

import {
  PUBLIC_ROUTE_CATALOG,
  SERVICE_ROUTES,
  isPublicRoute,
  publicRoutePaths,
} from '@/modules/site/routing/public-routes'
import { WHATSAPP_CONTEXTS } from '@/modules/whatsapp/contexts'

describe('catálogo de rotas públicas', () => {
  test('cada contexto de serviço tem exatamente uma rota', () => {
    expect(SERVICE_ROUTES).toEqual({
      kitchen: '/cozinhas-industriais',
      equipment: '/equipamentos-em-inox',
      ventilation: '/coifas-ventilacao-e-exaustao',
      'integrated-systems': '/sistemas-integrados-em-inox',
      cnc: '/projeto-tecnico-e-fabricacao-cnc',
      renovation: '/reformas-e-modernizacoes',
      maintenance: '/manutencao',
    })
  })

  test('nenhuma rota, rótulo ou descrição menciona proteção contra incêndio', () => {
    const serialized = JSON.stringify(PUBLIC_ROUTE_CATALOG)

    expect(serialized).not.toMatch(/incêndio/i)
    expect(serialized).not.toMatch(/incendio/i)
    expect(serialized).not.toMatch(/sprinkler/i)
  })

  test('o catálogo cobre exatamente as rotas iniciais da especificação', () => {
    expect(publicRoutePaths()).toEqual([
      '/',
      '/empresa',
      '/solucoes-em-inox',
      '/cozinhas-industriais',
      '/equipamentos-em-inox',
      '/coifas-ventilacao-e-exaustao',
      '/sistemas-integrados-em-inox',
      '/projeto-tecnico-e-fabricacao-cnc',
      '/reformas-e-modernizacoes',
      '/manutencao',
      '/segmentos',
      '/segmentos/[slug]',
      '/projetos',
      '/projetos/[slug]',
      '/orcamento',
      '/politica-de-privacidade',
      '/termos-de-uso',
    ])
  })

  test('não existe rota de blog na fundação do site público', () => {
    expect(publicRoutePaths().some((path) => path.startsWith('/blog'))).toBe(false)
    expect(publicRoutePaths().some((path) => path.includes('artigo'))).toBe(false)
  })

  test('rotas condicionais são marcadas como tal e não entram no sitemap sem conteúdo', () => {
    const conditional = PUBLIC_ROUTE_CATALOG.filter((route) => route.conditional).map(
      (route) => route.path,
    )

    // Projetos e segmentos individuais dependem de conteúdo aprovado.
    expect(conditional).toContain('/projetos')
    expect(conditional).toContain('/projetos/[slug]')
    expect(conditional).toContain('/segmentos/[slug]')
    // Documentos legais dependem de publicação aprovada no Plano 03.
    expect(conditional).toContain('/politica-de-privacidade')
    expect(conditional).toContain('/termos-de-uso')
  })

  test('isPublicRoute reconhece rotas estáticas e recusa desconhecidas', () => {
    expect(isPublicRoute('/manutencao')).toBe(true)
    expect(isPublicRoute('/')).toBe(true)
    expect(isPublicRoute('/blog')).toBe(false)
    expect(isPublicRoute('/protecao-contra-incendio')).toBe(false)
  })

  test('todo contexto de WhatsApp que não é geral nem de projeto tem rota de serviço', () => {
    const serviceContexts = WHATSAPP_CONTEXTS.filter(
      (context) => context !== 'general' && context !== 'project',
    )

    expect(Object.keys(SERVICE_ROUTES).sort()).toEqual([...serviceContexts].sort())
  })
})
