import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Designer Inox Brasil',
    short_name: 'Designer Inox',
    description:
      'Soluções industriais completas em aço inox: projeto técnico, fabricação, instalação, integração e manutenção.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0D1218',
    theme_color: '#0D1218',
    lang: 'pt-BR',
    icons: [
      { src: '/brand/icon-32.png', sizes: '32x32', type: 'image/png' },
      { src: '/brand/icon-180.png', sizes: '180x180', type: 'image/png' },
    ],
  }
}
