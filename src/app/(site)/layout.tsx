import Header, { Footer } from '@/components/Header';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main id="app" className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
