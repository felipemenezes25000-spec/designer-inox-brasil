import { generateLegalMetadata, renderLegalPage } from '../_render/legal-page'

export const generateMetadata = () =>
  generateLegalMetadata('terms', '/termos-de-uso')

export default function Page() {
  return renderLegalPage('terms')
}
