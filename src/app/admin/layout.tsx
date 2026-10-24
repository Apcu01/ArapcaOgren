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
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 pt-8 pb-20 flex flex-col gap-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex flex-col gap-1.5">
              <span className="text-[13px] font-semibold tracking-[.12em] uppercase text-lab">Yönetim paneli</span>
              <span className="text-sm text-faint">Yalnızca yöneticiler görebilir.</span>
            </div>
            <AdminNav openReports={n} />
          </div>
          {children}
        </div>
      </main>
      <Footer />
    </>
  );
}
