import { generateLegalMetadata, renderLegalPage } from '../_render/legal-page'

export const generateMetadata = () =>
  generateLegalMetadata('privacy', '/politica-de-privacidade')

export default function Page() {
  return renderLegalPage('privacy')
}
