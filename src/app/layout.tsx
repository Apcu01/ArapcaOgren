import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AppProvider } from '@/components/AppProvider';
import NavProgress from '@/components/NavProgress';
import ServiceWorker from '@/components/ServiceWorker';
import { getAudioMap } from '@/lib/audio';
import { SETTINGS_COOKIE, THEME_COLOR } from '@/lib/settings';
import { SITE_DESC, SITE_NAME, siteOrigin } from '@/lib/site';

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin()),
  title: { default: `${SITE_NAME} | Arapça Öğren`, template: `%s | ${SITE_NAME}` },
  description: SITE_DESC,
  applicationName: SITE_NAME,
  keywords: ['Arapça öğren', 'Arapça dersleri', 'Arapça dilbilgisi', 'Arapça kelimeler', 'Arapça saatler', 'Arapça zamirler', 'Arap alfabesi'],
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    siteName: SITE_NAME,
    title: `${SITE_NAME} | Arapça Öğren`,
    description: SITE_DESC,
    images: [{ url: '/og', width: 1200, height: 630, alt: SITE_NAME }]
  },
  twitter: { card: 'summary_large_image', title: `${SITE_NAME} | Arapça Öğren`, description: SITE_DESC, images: ['/og'] },
  appleWebApp: { capable: true, title: SITE_NAME, statusBarStyle: 'black-translucent' },
  formatDetection: { telephone: false }
};

// Tarayıcı çubuğu rengi cihazın temasına göre; kullanıcı ayarı seçtiyse sayfa açılınca istemci günceller
export const viewport: Viewport = {
  colorScheme: 'dark light',
  themeColor: [{ media: '(prefers-color-scheme: dark)', color: THEME_COLOR.dark }, { media: '(prefers-color-scheme: light)', color: THEME_COLOR.light }]
};

// Sayfalar önceden hazırlanır ve en geç saatte bir yenilenir; yönetim panelindeki değişiklikler hemen yenilenir
export const revalidate = 3600;

// Görünüm ayarlarını (tema, yazı boyutu, okunuş, İngilizce) sayfa çizilmeden önce çerezden uygular: renk ya da düzen sıçraması olmaz
const SETTINGS_SCRIPT = `(function(){try{var m=document.cookie.match(/(?:^|; )${SETTINGS_COOKIE}=([^;]*)/);if(!m)return;var s=JSON.parse(decodeURIComponent(m[1]));var b=document.body;if(['dark','light','system'].indexOf(s.theme)>=0)document.documentElement.setAttribute('data-theme',s.theme);if(s.tl===false)b.classList.add('no-tl');if(s.en===false)b.classList.add('no-en');if(s.arSize===1||s.arSize===2)b.classList.add('ar-'+s.arSize)}catch(e){}})()`;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const audios = await getAudioMap();
  return (
    <html lang="tr" data-theme="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-bg text-ink font-sans min-h-screen flex flex-col" suppressHydrationWarning>
        <script dangerouslySetInnerHTML={{ __html: SETTINGS_SCRIPT }} />
        <a href="#app" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-acc focus:text-onacc">İçeriğe geç</a>
        <AppProvider audios={audios}>
          {children}
        </AppProvider>
        <NavProgress />
        <ServiceWorker />
      </body>
    </html>
  );
}
