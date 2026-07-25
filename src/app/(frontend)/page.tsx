import { generatePageMetadata, renderGeneralPage } from './_render/general-page'

export const generateMetadata = () => generatePageMetadata('home', '/')

export default function HomePage() {
  return renderGeneralPage('home')
}
