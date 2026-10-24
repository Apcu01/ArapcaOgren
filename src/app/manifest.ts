import type { MetadataRoute } from 'next';
import { SITE_DESC, SITE_NAME } from '@/lib/site';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} | Arapça Öğren`,
    short_name: SITE_NAME,
    description: SITE_DESC,
    lang: 'tr',
    dir: 'ltr',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#0E0B09',
    theme_color: '#0E0B09',
    categories: ['education'],
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
    ],
    shortcuts: [
      { name: 'Hatalarım', url: '/hatalarim', icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }] },
      { name: 'Sözlük', url: '/sozluk', icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }] },
      { name: 'Alfabe', url: '/alfabe', icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }] }
    ]
  };
}
