import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Ar } from '@/components/AppProvider';
import ListActions from '@/components/admin/ListActions';
import { Card, Stat, ago, dt } from '@/components/admin/ui';
import { adminList } from '@/lib/admin-lists';
import { fmtTime, statusOf, type Status } from '@/lib/study';

export const metadata = { title: 'Kelime listesi' };

const STATE: Record<Status, string> = { new: 'Çalışılmamış', learning: 'Öğreniliyor', learned: 'Öğrenildi' };

export default async function AdminListDetail({ params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id <= 0) notFound();
  const l = await adminList(id);
  if (!l) notFound();
  const learned = l.items.filter((x) => statusOf(x) === 'learned').length;
  const learning = l.items.filter((x) => statusOf(x) === 'learning').length;
  const answers = l.items.reduce((n, x) => n + x.correct + x.wrong, 0);
  const correct = l.items.reduce((n, x) => n + x.correct, 0);
  const best = [
    l.best.match != null && `Eşleştir: ${fmtTime(l.best.match)}`,
    l.best.blast != null && `Blast: ${l.best.blast}`,
    l.best.blocks != null && `Bloklar: ${l.best.blocks}`,
    l.best.charms != null && `Tılsım: ${l.best.charms}`
  ].filter(Boolean).join(' · ');

  return (
    <div className="flex flex-col gap-6">
      <Link href="/admin/listeler" className="self-start text-sm text-mute hover:text-ink">← Kelime listeleri</Link>
      <div className="flex flex-wrap items-start gap-5 justify-between">
        <div className="flex flex-col gap-1.5 min-w-0">
          <h1 className="m-0 text-[28px] sm:text-[34px] font-bold tracking-tight leading-tight break-words">{l.title}</h1>
          <p className="m-0 text-mute">
            Sahibi: <Link href={`/admin/kullanicilar/${l.userId}`}>{l.userName}</Link> <span className="text-faint">({l.userEmail})</span>
          </p>
          {l.description && <p className="m-0 text-sm text-soft">{l.description}</p>}
          {l.sourceId && <p className="m-0 text-sm text-mute">Kopya: <Link href={`/admin/listeler/${l.sourceId}`}>{l.sourceTitle}</Link> ({l.sourceOwner}) · değişiklikler en son {l.syncedAt ? dt(l.syncedAt, true) : '-'} gözden geçirildi</p>}
          <p className="m-0 text-xs text-faint">Oluşturma: {dt(l.createdAt, true)} · Son düzenleme: {dt(l.updatedAt, true)} · Son çalışma: {l.studiedAt ? ago(l.studiedAt) : '-'}</p>
        </div>
        <ListActions id={l.id} shared={!!l.shareToken} />
      </div>

      <div className="grid gap-3 grid-cols-2 lg:grid-cols-5">
        <Stat label="Kelime" value={l.items.length} />
        <Stat label="Öğrenilen" value={learned} sub={`${learning} devam ediyor`} />
        <Stat label="Cevap" value={answers} sub={answers ? `%${Math.round((correct / answers) * 100)} doğru` : undefined} />
        <Stat label="Paylaşım" value={l.shareToken ? 'Açık' : 'Kapalı'} sub={l.shareToken ? <Link href={`/liste/${l.shareToken}`}>Bağlantıyı aç</Link> : undefined} />
        <Stat label="Kopyalanma" value={l.copies} sub={best || undefined} />
      </div>

      <Card title={`Kelimeler (${l.items.length})`}>
        <div className="overflow-x-auto -mx-1">
          <table className="lt min-w-[760px]">
            <thead><tr><th>#</th><th>Arapça</th><th>Okunuş</th><th>Anlam</th><th>Durum</th><th>Doğru / yanlış</th><th>Yıldız</th></tr></thead>
            <tbody>
              {!l.items.length && <tr><td colSpan={7} className="text-center text-faint py-8">Listede kelime yok.</td></tr>}
              {l.items.map((it, i) => {
                const s = statusOf(it);
                return (
                  <tr key={it.id}>
                    <td className="text-faint text-sm">{i + 1}</td>
                    <td><Ar t={it.ar} className="text-[22px] text-ink" /></td>
                    <td className="text-sm">{it.tl || '-'}</td>
                    <td className="text-sm">{it.tr}{it.note && <span className="block text-xs text-faint">{it.note}</span>}</td>
                    <td><span className={`text-xs font-semibold ${s === 'learned' ? 'text-okt' : s === 'learning' ? 'text-prog' : 'text-faint'}`}>{STATE[s]}</span></td>
                    <td className="text-sm">{it.correct} / {it.wrong}</td>
                    <td>{it.starred ? '★' : ''}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {l.copiesOf.length > 0 && (
        <Card title={`Bu listeden alınan kopyalar (${l.copiesOf.length})`}>
          <div className="flex flex-col">
            {l.copiesOf.map((c) => (
              <div key={c.id} className="flex flex-wrap items-center justify-between gap-3 py-2.5 border-b border-line4 last:border-0 text-sm">
                <span className="text-soft">
                  <Link href={`/admin/kullanicilar/${c.userId}`}>{c.userName}</Link> <span className="text-faint">({c.userEmail})</span>
                  {' · '}<Link href={`/admin/listeler/${c.id}`}>{c.title}</Link>
                </span>
                <span className="flex items-center gap-3 text-xs text-faint whitespace-nowrap">
                  <span>{c.count} kelime · {c.learned} öğrenildi · {c.answers} cevap</span>
                  <span>{dt(c.createdAt, true)}</span>
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
