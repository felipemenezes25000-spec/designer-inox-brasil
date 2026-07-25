import { connection } from 'next/server'

/**
 * Adia a renderização para o runtime da requisição.
 *
 * O plano proíbe que `next build` consulte conteúdo, banco, Payload ou
 * storage — e o repositório local reforça isso lançando
 * `LOCAL_PUBLIC_CONTENT_FORBIDDEN_IN_PRODUCTION`. Sem esta chamada, o Next
 * tenta pré-renderizar as páginas durante o build e esbarra na guarda.
 *
 * `connection()` sinaliza ao Next que a saída depende da requisição, o que
 * tira a rota da geração estática sem exigir `force-dynamic` global. O cache
 * público entra por cima disso, com tags e expiração, no Task 11.
 */
export async function deferToRuntime(): Promise<void> {
  await connection()
}
