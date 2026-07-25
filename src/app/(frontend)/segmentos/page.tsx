import { generatePageMetadata, renderGeneralPage } from '../_render/general-page'

export const generateMetadata = () => generatePageMetadata('segmentos', '/segmentos')

export default function SegmentsHubPage() {
  return renderGeneralPage('segmentos')
}
