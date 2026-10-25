import Link from 'next/link';
import { Bar, Card, Stat, ago, pct, scoreColor } from '@/components/admin/ui';
import { getHardestQuestions, getStats } from '@/lib/stats';

export const metadata = { title: 'Genel bakış' };

export default async function AdminHome() {
  const [s, hardQ] = await Promise.all([getStats(), getHardestQuestions(10)]);
  const { totals: t, ev } = s;
  const maxDay = Math.max(1, ...s.days.map((d) => Math.max(d.views, d.activities)));
  const maxTopic = Math.max(1, ...s.topTopics.map((x) => x.n));
  const maxType = Math.max(1, ...s.typeDist.map((x) => x.n));
  const maxPage = Math.max(1, ...s.topPages.map((x) => x.n));
  const dayLabel = (d: string) => new Date(d + 'T12:00:00Z').toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="m-0 text-[32px] sm:text-[40px] font-bold tracking-tight leading-tight">Genel bakış</h1>
        <p className="m-0 text-mute">Ziyaret ve etkinlik sayıları misafirleri de kapsar; ilerleme sayıları yalnızca hesabı olan kullanıcılarındır.</p>
      </div>

      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        <Stat label="Kullanıcı" value={t.users} sub={`Son 7 gün: +${t.new7} · son 30 gün: +${t.new30}`} />
        <Stat label="Aktif kullanıcı (7 gün)" value={t.active7} sub={`${t.admins} yönetici`} />
        <Stat label="Ziyaretçi (7 gün)" value={ev.visitors7} sub={`Bugün: ${ev.visitorsToday}`} />
        <Stat label="Sayfa görüntüleme (7 gün)" value={ev.views7} sub={`Bugün: ${ev.viewsToday} · 30 gün: ${ev.views30}`} />
        <Stat label="Bitirilen etkinlik" value={ev.activities} sub={`Son 7 gün: ${ev.activities7} · misafir: ${ev.guestActivities}`} />
        <Stat label="Ortalama başarı" value={ev.activities ? <span className={scoreColor(ev.avgScore)}>{pct(ev.avgScore)}</span> : '-'} sub="Tüm etkinlik denemeleri" />
        <Stat label="Okunan konu" value={ev.lessons} sub={`Hesaplı: ${t.lessonsRead} · tamamlanan etkinlik: ${t.actsDone}`} />
        <Stat label="İçerik" value={`${t.published} / ${t.topics}`} sub={`Yayında / toplam ders · ${t.acts} etkinlik`} />
      </div>

      <Card title="Son 14 gün" right={<span className="flex gap-4 text-xs text-mute"><span className="inline-flex items-center gap-1.5"><i className="w-3 h-3 rounded-sm bg-acc inline-block" /> Görüntüleme</span><span className="inline-flex items-center gap-1.5"><i className="w-3 h-3 rounded-sm bg-ok inline-block" /> Etkinlik</span></span>}>
        <div className="overflow-x-auto">
          <div className="min-w-[560px] h-[200px] flex items-end gap-2" role="img" aria-label="Son 14 günün görüntüleme ve etkinlik sayıları">
            {s.days.map((d) => (
              <div key={d.d} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end" title={`${dayLabel(d.d)}: ${d.views} görüntüleme, ${d.activities} etkinlik, ${d.visitors} ziyaretçi`}>
                <div className="w-full flex items-end justify-center gap-[3px] flex-1">
                  <div className="w-[42%] rounded-t-md bg-acc" style={{ height: `${(d.views / maxDay) * 100}%`, minHeight: d.views ? 3 : 0 }} />
                  <div className="w-[42%] rounded-t-md bg-ok" style={{ height: `${(d.activities / maxDay) * 100}%`, minHeight: d.activities ? 3 : 0 }} />
                </div>
                <span className="text-[10px] text-faint whitespace-nowrap">{dayLabel(d.d)}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="En çok çalışılan dersler (30 gün)">
          {!s.topTopics.length && <p className="m-0 text-sm text-faint">Henüz etkinlik bitirilmedi.</p>}
          {s.topTopics.map((x) => (
            <div key={x.topicId} className="flex items-center gap-3 text-sm">
              <span className="w-[38%] truncate text-soft">{x.name}</span>
              <Bar value={x.n} max={maxTopic} />
              <span className="w-24 text-right text-mute">{x.n} · <span className={scoreColor(x.avg)}>{pct(x.avg)}</span></span>
            </div>
          ))}
        </Card>
        <Card title="En çok zorlanılan etkinlikler" right={<span className="text-xs text-faint">en az 3 deneme</span>}>
          {!s.hardest.length && <p className="m-0 text-sm text-faint">Yeterli veri yok.</p>}
          {s.hardest.map((x, i) => (
            <div key={i} className="flex items-center justify-between gap-3 text-sm border-b border-line4 pb-2 last:border-0">
              <span className="min-w-0 flex flex-col"><span className="text-ink truncate">{x.title}</span><span className="text-xs text-faint">{x.topicName}{x.type ? ' · ' + x.type : ''} · {x.n} deneme</span></span>
              <b className={scoreColor(x.avg)}>{pct(x.avg)}</b>
            </div>
          ))}
        </Card>
        <Card title="Etkinlik türlerine göre">
          {!s.typeDist.length && <p className="m-0 text-sm text-faint">Henüz veri yok.</p>}
          {s.typeDist.map((x) => (
            <div key={x.label} className="flex items-center gap-3 text-sm">
              <span className="w-[38%] truncate text-soft">{x.label}</span>
              <Bar value={x.n} max={maxType} color="rgb(var(--c-ok))" />
              <span className="w-12 text-right text-mute">{x.n}</span>
            </div>
          ))}
        </Card>
        <Card title="En çok ziyaret edilen sayfalar (30 gün)">
          {!s.topPages.length && <p className="m-0 text-sm text-faint">Henüz veri yok.</p>}
          {s.topPages.map((x) => (
            <div key={x.path} className="flex items-center gap-3 text-sm">
              <span className="w-[38%] truncate text-soft font-mono text-xs">{x.path}</span>
              <Bar value={x.n} max={maxPage} color="rgb(var(--c-acct))" />
              <span className="w-12 text-right text-mute">{x.n}</span>
            </div>
          ))}
        </Card>
      </div>

      <Card title="En çok yanlış yapılan sorular" right={<span className="text-xs text-faint">ilk denemede doğru oranı · en az 5 deneme</span>}>
        {!hardQ.length && <p className="m-0 text-sm text-faint">Yeterli veri yok. Sorular cevaplandıkça burada görünecek.</p>}
        {hardQ.map((x, i) => (
          <Link key={i} href={`/admin/dersler/${x.topicId}`} className="flex items-center justify-between gap-3 text-sm border-b border-line4 pb-2 last:border-0 text-ink hover:text-ink">
            <span className="min-w-0 flex flex-col"><span className="truncate">{x.label}</span><span className="text-xs text-faint">{x.topicName}{x.title ? ' · ' + x.title : ''} · {x.attempts} deneme</span></span>
            <b className={scoreColor(x.rate)}>{pct(x.rate)}</b>
          </Link>
        ))}
      </Card>

      <Card title="Son kayıt olanlar" right={<Link href="/admin/kullanicilar" className="text-sm">Tüm kullanıcılar →</Link>}>
        {!s.recent.length && <p className="m-0 text-sm text-faint">Henüz kullanıcı yok.</p>}
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {s.recent.map((u) => (
            <Link key={u.id} href={`/admin/kullanicilar/${u.id}`} className="flex items-center gap-3 p-3 rounded-xl bg-s3 border border-line text-ink hover:text-ink hover:border-lineh">
              <span className="w-10 h-10 shrink-0 rounded-full bg-chip border border-line3 flex items-center justify-center font-semibold">{(u.name.trim()[0] || '?').toLocaleUpperCase('tr')}</span>
              <span className="min-w-0 flex flex-col"><span className="font-semibold truncate">{u.name}</span><span className="text-xs text-faint truncate">{u.email} · {ago(u.createdAt)}</span></span>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
}
