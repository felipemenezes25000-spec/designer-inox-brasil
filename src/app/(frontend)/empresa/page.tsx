import { generatePageMetadata, renderGeneralPage } from '../_render/general-page'

export const generateMetadata = () => generatePageMetadata('empresa', '/empresa')

export default function Page() {
  return renderGeneralPage('empresa')
}
