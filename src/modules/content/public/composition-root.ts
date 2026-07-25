import { createLocalPublicContentRepository } from './local-repository'
import type { PublicContentRepository } from './repository'

/**
 * Ponto único de binding do conteúdo público.
 *
 * **Este é o único arquivo que o Plano 03 modifica** para trocar o adapter
 * local pelo `PayloadPublicContentRepository`. Nenhuma página, componente ou
 * rota conhece a implementação — todas dependem apenas da interface.
 *
 * A instância é memoizada porque o adapter guarda estado de conexão e cache;
 * criar um por requisição desperdiçaria pool de banco no Plano 03.
 */
let instance: PublicContentRepository | null = null

export function getPublicContentRepository(): PublicContentRepository {
  instance ??= createLocalPublicContentRepository()
  return instance
}

/** Somente para testes: descarta a instância memoizada. */
export function resetPublicContentRepository(): void {
  instance = null
}
