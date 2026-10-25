import type { Metadata, Viewport } from 'next';
import { cookies } from 'next/headers';
import './globals.css';
import { AppProvider } from '@/components/AppProvider';
import { parseSettings, SETTINGS_COOKIE, settingsClasses, THEME_COLOR, type Settings } from '@/lib/settings';
import ServiceWorker from '@/components/ServiceWorker';
import { getAudioMap } from '@/lib/audio';
import { getSessionUser } from '@/lib/auth';
import { getMistakes } from '@/lib/mistakes';
import { getUserProgress } from '@/lib/progress';
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

// Tarayıcı çubuğunun rengi seçili temaya uyar; sistem temasında cihazın tercihine göre seçilir
export async function generateViewport(): Promise<Viewport> {
  const { theme } = await readSettings();
  if (theme === 'system') {
    return {
      colorScheme: 'dark light',
      themeColor: [{ media: '(prefers-color-scheme: dark)', color: THEME_COLOR.dark }, { media: '(prefers-color-scheme: light)', color: THEME_COLOR.light }]
    };
  }
  return { themeColor: THEME_COLOR[theme], colorScheme: theme };
}

async function readSettings(): Promise<Settings> {
  return parseSettings((await cookies()).get(SETTINGS_COOKIE)?.value);
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [user, settings, audios] = await Promise.all([getSessionUser(), readSettings(), getAudioMap()]);
  const [initial, mistakes] = user ? await Promise.all([getUserProgress(user.id), getMistakes(user.id)]) : [null, null];
  const bodyCls = ['bg-bg text-ink font-sans min-h-screen flex flex-col', ...settingsClasses(settings)].join(' ');
  return (
    <html lang="tr" data-theme={settings.theme}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className={bodyCls}>
        <a href="#app" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-acc focus:text-onacc">İçeriğe geç</a>
        <AppProvider key={user?.id ?? 'guest'} user={user} initial={initial} initialSettings={settings} initialMistakes={mistakes} audios={audios}>
          {children}
        </AppProvider>
        <ServiceWorker />
      </body>
    </html>
  );
}
