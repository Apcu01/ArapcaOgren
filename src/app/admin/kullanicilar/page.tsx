import Link from 'next/link';
import { Card, ago, dt, pct, scoreColor } from '@/components/admin/ui';
import { getUsers } from '@/lib/stats';

export const metadata = { title: 'Kullanıcılar' };

export default async function UsersPage({ searchParams }: { searchParams: Promise<{ q?: string; s?: string }> }) {
  const sp = await searchParams;
  const q = (sp.q || '').trim().slice(0, 100);
  const page = Math.max(1, Number(sp.s) || 1);
  const per = 30;
  const { rows, total } = await getUsers(q, page, per);
  const pages = Math.max(1, Math.ceil(total / per));
  const link = (p: number) => `/admin/kullanicilar?${new URLSearchParams({ ...(q ? { q } : {}), ...(p > 1 ? { s: String(p) } : {}) })}`;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="m-0 text-[32px] sm:text-[40px] font-bold tracking-tight leading-tight">Kullanıcılar</h1>
          <p className="m-0 text-mute">{total} kullanıcı{q ? ` · "${q}" araması` : ''}</p>
        </div>
        <form className="flex gap-2 flex-[0_1_420px]" action="/admin/kullanicilar">
          <label className="flex-1 flex items-center px-4 h-11 rounded-xl bg-s2 border border-line2 focus-within:border-lineh">
            <span className="sr-only">Ad ya da e-posta ara</span>
            <input name="q" defaultValue={q} placeholder="Ad ya da e-posta ara" className="flex-1 min-w-0 bg-transparent border-0 outline-none text-ink text-sm placeholder:text-faint" />
          </label>
          <button type="submit" className="h-11 px-4 rounded-xl bg-acc text-onacc font-bold text-sm">Ara</button>
        </form>
      </div>
      <Card>
        <div className="overflow-x-auto -mx-1">
          <table className="lt min-w-[860px]">
            <thead>
              <tr><th>Kullanıcı</th><th>Rol</th><th>Kayıt</th><th>Son görülme</th><th>Okunan konu</th><th>Tamamlanan</th><th>Ort. skor</th><th>Çalışılan gün</th></tr>
            </thead>
            <tbody>
              {!rows.length && <tr><td colSpan={8} className="text-center text-faint py-8">Kullanıcı bulunamadı.</td></tr>}
              {rows.map((u) => (
                <tr key={u.id}>
                  <td>
                    <Link href={`/admin/kullanicilar/${u.id}`} className="flex items-center gap-3 text-ink hover:text-ink">
                      <span className="w-9 h-9 shrink-0 rounded-full bg-chip border border-line3 flex items-center justify-center font-semibold text-sm">{(u.name.trim()[0] || '?').toLocaleUpperCase('tr')}</span>
                      <span className="flex flex-col min-w-0"><span className="font-semibold truncate max-w-[220px]">{u.name}</span><span className="text-xs text-faint truncate max-w-[220px]">{u.email}</span></span>
                    </Link>
                  </td>
                  <td>{u.role === 'admin' ? <span className="px-2.5 py-1 rounded-full bg-progbg border border-progln text-prog text-xs font-bold">Yönetici</span> : <span className="text-mute2 text-sm">Kullanıcı</span>}</td>
                  <td className="whitespace-nowrap text-sm">{dt(u.createdAt)}</td>
                  <td className="whitespace-nowrap text-sm">{ago(u.lastSeenAt)}</td>
                  <td>{u.lessons}</td>
                  <td>{u.actsDone} <span className="text-faint text-xs">/ {u.tried} denenen</span></td>
                  <td>{u.avg == null ? '-' : <b className={scoreColor(u.avg)}>{pct(u.avg)}</b>}</td>
                  <td>{u.days}</td>
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
