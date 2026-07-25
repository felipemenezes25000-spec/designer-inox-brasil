import { generatePageMetadata, renderGeneralPage } from '../_render/general-page'

export const generateMetadata = () => generatePageMetadata('orcamento', '/orcamento')

export default function Page() {
  return renderGeneralPage('orcamento')
}
