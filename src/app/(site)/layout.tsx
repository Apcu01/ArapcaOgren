import Header, { Footer } from '@/components/Header';
import Shortcuts from '@/components/Shortcuts';
import Tour from '@/components/Tour';
import { BadgeWatcher } from '@/components/Badges';
import { OfflineBanner, OfflineDialog } from '@/components/Offline';
import { latestNewsId } from '@/lib/news';

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  // Başlıktaki Yenilikler noktası için yalnızca en yeni yazının numarası gömülür
  const news = await latestNewsId();
  return (
    <>
      <OfflineBanner />
      <Header news={news} />
      <main id="app" className="flex-1">{children}</main>
      <Footer />
      <Shortcuts />
      <BadgeWatcher />
      <OfflineDialog />
      <Tour />
    </>
  );
}
