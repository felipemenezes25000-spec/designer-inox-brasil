import type { Metadata } from 'next'

import { generateServiceMetadata, renderServicePage } from '../_render/service-page'

const SLUG = 'projeto-tecnico-e-fabricacao-cnc'

export const generateMetadata = (): Promise<Metadata> => generateServiceMetadata(SLUG)

export default function Page() {
  return renderServicePage(SLUG)
}
