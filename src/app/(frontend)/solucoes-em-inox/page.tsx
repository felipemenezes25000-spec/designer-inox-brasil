import { generatePageMetadata, renderGeneralPage } from '../_render/general-page'

export const generateMetadata = () => generatePageMetadata('solucoes-em-inox', '/solucoes-em-inox')

export default function Page() {
  return renderGeneralPage('solucoes-em-inox')
}
