import type { Metadata } from 'next'

import { generateServiceMetadata, renderServicePage } from '../_render/service-page'

const SLUG = 'reformas-e-modernizacoes'

export const generateMetadata = (): Promise<Metadata> => generateServiceMetadata(SLUG)

export default function Page() {
  return renderServicePage(SLUG)
}
