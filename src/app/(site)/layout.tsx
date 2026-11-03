import Header, { Footer } from '@/components/Header';
import Shortcuts from '@/components/Shortcuts';
import { BadgeWatcher } from '@/components/Badges';
import { OfflineBanner, OfflineDialog } from '@/components/Offline';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <OfflineBanner />
      <Header />
      <main id="app" className="flex-1">{children}</main>
      <Footer />
      <Shortcuts />
      <BadgeWatcher />
      <OfflineDialog />
    </>
  );
}
