import Link from 'next/link';
import { Card, Stat, ago, dt } from '@/components/admin/ui';
import { adminLists, type ListFilter } from '@/lib/admin-lists';

export const metadata = { title: 'Kelime listeleri' };

const FILTERS: [ListFilter, string][] = [['all', 'Tümü'], ['shared', 'Paylaşılanlar'], ['copies', 'Kopyalar']];

export default async function AdminListsPage({ searchParams }: { searchParams: Promise<{ q?: string; f?: string; s?: string }> }) {
  const sp = await searchParams;
  const q = (sp.q || '').trim().slice(0, 100);
  const filter: ListFilter = sp.f === 'shared' || sp.f === 'copies' ? sp.f : 'all';
  const page = Math.max(1, Number(sp.s) || 1);
  const per = 30;
  const { rows, total, summary } = await adminLists(q, filter, page, per);
  const pages = Math.max(1, Math.ceil(total / per));
  const link = (p: number, f: ListFilter = filter) => `/admin/listeler?${new URLSearchParams({ ...(q ? { q } : {}), ...(f !== 'all' ? { f } : {}), ...(p > 1 ? { s: String(p) } : {}) })}`;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="m-0 text-[32px] sm:text-[40px] font-bold tracking-tight leading-tight">Kelime listeleri</h1>
          <p className="m-0 text-mute">Üyelerin oluşturduğu listeler{q ? ` · "${q}" araması` : ''}</p>
        </div>
        <form className="flex gap-2 flex-[0_1_420px]" action="/admin/listeler">
          {filter !== 'all' && <input type="hidden" name="f" value={filter} />}
          <label className="flex-1 flex items-center px-4 h-11 rounded-xl bg-s2 border border-line2 focus-within:border-lineh">
            <span className="sr-only">Liste adı, üye adı ya da e-posta ara</span>
            <input name="q" defaultValue={q} placeholder="Liste adı, üye adı ya da e-posta" className="flex-1 min-w-0 bg-transparent border-0 outline-none text-ink text-sm placeholder:text-faint" />
          </label>
          <button type="submit" className="h-11 px-4 rounded-xl bg-acc text-onacc font-bold text-sm">Ara</button>
        </form>
      </div>

      <div className="grid gap-3 grid-cols-2 lg:grid-cols-5">
        <Stat label="Liste" value={summary.lists} />
        <Stat label="Liste oluşturan üye" value={summary.owners} />
        <Stat label="Toplam kelime" value={summary.words} />
        <Stat label="Paylaşılan" value={summary.shared} />
        <Stat label="Kopyalanmış liste" value={summary.copies} />
      </div>

      <Card right={
        <nav aria-label="Süzgeç" className="flex gap-1 p-1 rounded-xl bg-s2 border border-line3">
          {FILTERS.map(([f, l]) => (
            <Link key={f} href={link(1, f)} aria-current={f === filter ? 'page' : undefined}
              className={`h-8 px-3 rounded-lg text-[13px] font-semibold inline-flex items-center ${f === filter ? 'bg-acc text-onacc hover:text-onacc' : 'text-soft hover:text-ink'}`}>{l}</Link>
          ))}
        </nav>
      } title={`${total} liste`}>
        <div className="overflow-x-auto -mx-1">
          <table className="lt min-w-[900px]">
            <thead>
              <tr><th>Liste</th><th>Sahibi</th><th>Kelime</th><th>Öğrenilen</th><th>Cevap</th><th>Paylaşım</th><th>Oluşturma</th><th>Son çalışma</th></tr>
            </thead>
            <tbody>
              {!rows.length && <tr><td colSpan={8} className="text-center text-faint py-8">Liste bulunamadı.</td></tr>}
              {rows.map((l) => (
                <tr key={l.id}>
                  <td>
                    <Link href={`/admin/listeler/${l.id}`} className="flex flex-col min-w-0 text-ink hover:text-ink">
                      <span className="font-semibold truncate max-w-[240px]">{l.title}</span>
                      {l.sourceId && <span className="text-xs text-faint truncate max-w-[240px]">Kopya: {l.sourceTitle} ({l.sourceOwner})</span>}
                    </Link>
                  </td>
                  <td>
                    <Link href={`/admin/kullanicilar/${l.userId}`} className="flex flex-col min-w-0 text-ink hover:text-ink">
                      <span className="text-sm font-semibold truncate max-w-[200px]">{l.userName}</span>
                      <span className="text-xs text-faint truncate max-w-[200px]">{l.userEmail}</span>
                    </Link>
                  </td>
                  <td>{l.count}</td>
                  <td>{l.learned}{l.count ? <span className="text-faint text-xs"> · %{Math.round((l.learned / l.count) * 100)}</span> : null}</td>
                  <td>{l.answers}</td>
                  <td>{l.shared ? <span className="px-2.5 py-1 rounded-full bg-okbg border border-okln text-okt text-xs font-bold">Açık{l.copies ? ` · ${l.copies} kopya` : ''}</span> : <span className="text-mute2 text-sm">{l.copies ? `Kapalı · ${l.copies} kopya` : 'Kapalı'}</span>}</td>
                  <td className="whitespace-nowrap text-sm">{dt(l.createdAt)}</td>
                  <td className="whitespace-nowrap text-sm">{l.studiedAt ? ago(l.studiedAt) : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {pages > 1 && (
          <div className="flex items-center justify-between gap-3 text-sm">
            {page > 1 ? <Link href={link(page - 1)}>← Önceki</Link> : <span />}
            <span className="text-faint">Sayfa {page} / {pages}</span>
            {page < pages ? <Link href={link(page + 1)}>Sonraki →</Link> : <span />}
          </div>
        )}
      </Card>
    </div>
  );
}
