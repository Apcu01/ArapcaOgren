import type { Metadata } from 'next';
import Header, { Footer } from '@/components/Header';
import AdminNav from '@/components/admin/AdminNav';
import { count, eq } from 'drizzle-orm';
import { db, schema } from '@/db';
import { requireAdmin } from '@/lib/auth';

export const metadata: Metadata = { title: { default: 'Yönetim paneli', template: '%s | Yönetim | ArapcaOgren' }, robots: { index: false } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  const [{ n }] = await db.select({ n: count() }).from(schema.reports).where(eq(schema.reports.status, 'open'));
  return (
    <>
      <Header />
      <main id="app" className="flex-1">
        {/* Geniş ekranda solda yapışkan yan menü, telefonda üstte yatay menü */}
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 pt-8 pb-20 grid gap-6 lg:gap-8 lg:grid-cols-[236px_minmax(0,1fr)] items-start">
          <aside className="flex flex-col gap-4 lg:sticky lg:top-6 min-w-0">
            <div className="flex flex-col gap-1 lg:px-1">
              <span className="text-[13px] font-semibold tracking-[.12em] uppercase text-lab">Yönetim paneli</span>
              <span className="text-xs text-faint">Yalnızca yöneticiler görebilir.</span>
            </div>
            <AdminNav openReports={n} />
          </aside>
          <div className="min-w-0 flex flex-col gap-8">{children}</div>
        </div>
      </main>
      <Footer />
    </>
  );
}
