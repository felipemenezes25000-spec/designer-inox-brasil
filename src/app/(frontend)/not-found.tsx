import type { ReactElement } from 'react'

import { renderGeneralPage } from './_render/general-page'

/**
 * Página 404.
 *
 * Reusa o conteúdo semeado `nao-encontrada`, que já traz `noIndex` e lista as
 * sete soluções como rotas de recuperação, em vez de deixar o visitante sem
 * saída.
 */
export default function NotFound(): Promise<ReactElement> {
  return renderGeneralPage('nao-encontrada')
}
