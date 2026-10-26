import Link from 'next/link';
import { desc, sql } from 'drizzle-orm';
import { db, schema } from '@/db';
import { Ar } from '@/components/AppProvider';
import LookupsView from '@/components/admin/LookupsView';
import { Bar, Card, Stat, ago, dt } from '@/components/admin/ui';
import { LOOKUP_DAILY_LIMIT, LOOKUP_MODEL } from '@/lib/lookup';
import { lookupStats, SOURCE_LABEL } from '@/lib/lookup-stats';

export const metadata = { title: 'Kelime aramaları' };

const TONE: Record<string, string> = {
  lesson: 'bg-okbg border-okln text-okt', lexicon: 'bg-okbg border-okln text-okt', cache: 'bg-progbg border-progln text-prog',
  ai: 'bg-progbg border-progln text-prog', login: 'bg-badbg border-badln text-bad', none: 'bg-badbg border-badln text-bad', error: 'bg-badbg border-badln text-bad'
};
const Badge = ({ s, near }: { s: string; near?: boolean }) => (
  <span className={`px-2 py-0.5 rounded-full border text-[11px] font-bold whitespace-nowrap ${TONE[s] || 'bg-s2 border-line3 text-soft'}`}>{SOURCE_LABEL[s] || s}{near ? ' · yakın' : ''}</span>
);

export default async function LookupsPage({ searchParams }: { searchParams: Promise<{ t?: string; q?: string }> }) {
  const sp = await searchParams;
  const tab = sp.t === 'ai' ? 'ai' : 'all';
  const q = (sp.q || '').trim().slice(0, 60);
  const tabs = (
    <nav aria-label="Görünüm" className="flex gap-1 p-1 rounded-xl bg-s2 border border-line3 self-start">
      {([['all', 'Tüm aramalar'], ['ai', 'Yapay zekâ önbelleği']] as const).map(([k, l]) => (
        <Link key={k} href={k === 'all' ? '/admin/kelime-aramalari' : '/admin/kelime-aramalari?t=ai'} aria-current={tab === k ? 'page' : undefined}
          className={`h-9 px-4 rounded-lg text-[13px] font-semibold inline-flex items-center ${tab === k ? 'bg-acc text-onacc hover:text-onacc' : 'text-soft hover:text-ink'}`}>{l}</Link>
      ))}
    </nav>
  );

  if (tab === 'ai') {
    const [rows, [tot], [lex]] = await Promise.all([
      db.select().from(schema.lookups).orderBy(desc(schema.lookups.lastAt)).limit(300),
      db.select({
        n: sql<number>`COUNT(*)`,
        hits: sql<number>`COALESCE(SUM(hits), 0)`,
        cost: sql<number>`COALESCE(SUM(cost), 0)`,
        today: sql<number>`COALESCE(SUM(created_at >= UTC_DATE()), 0)`,
        month: sql<number>`COALESCE(SUM(CASE WHEN created_at >= DATE_FORMAT(UTC_DATE(), '%Y-%m-01') THEN cost ELSE 0 END), 0)`
      }).from(schema.lookups),
      db.select({ n: sql<number>`COUNT(*)` }).from(schema.lexicon)
    ]);
    return (
      <div className="flex flex-col gap-5">
        {tabs}
        <LookupsView
          model={LOOKUP_MODEL}
          dailyLimit={LOOKUP_DAILY_LIMIT}
          lexiconSize={Number(lex.n)}
          totals={{ n: Number(tot.n), hits: Number(tot.hits), cost: Number(tot.cost), today: Number(tot.today), month: Number(tot.month) }}
          rows={rows.map((r) => ({ id: r.id, query: r.query, result: r.result, hits: r.hits, cost: r.cost, createdAt: r.createdAt.toISOString(), lastAt: r.lastAt.toISOString() }))}
        />
      </div>
    );
  }

  const s = await lookupStats(q);
  const srcTotal = Object.values(s.bySource).reduce((a, b) => a + b, 0);
  return (
    <div className="flex flex-col gap-6">
      {tabs}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="m-0 text-3xl font-bold tracking-tight">Kelime aramaları</h1>
          <p className="m-0 text-mute max-w-[760px]">"Kelime bul" sayfasında yapılan bütün aramalar ve nereden bulundukları. Ücretsiz kaynaklarda (dersler ve yerleşik sözlük) bulunamayanlar, sözlüğe eklenecek kelimeler için iyi bir liste.</p>
        </div>
        <form className="flex gap-2 flex-[0_1_380px]" action="/admin/kelime-aramalari">
          <label className="flex-1 flex items-center px-4 h-11 rounded-xl bg-s2 border border-line2 focus-within:border-lineh">
            <span className="sr-only">Aramalarda ara</span>
            <input name="q" defaultValue={q} placeholder="Aranan kelime ya da anlam" className="flex-1 min-w-0 bg-transparent border-0 outline-none text-ink text-sm placeholder:text-faint" />
          </label>
          <button type="submit" className="h-11 px-4 rounded-xl bg-acc text-onacc font-bold text-sm">Ara</button>
        </form>
      </div>

      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        <Stat label="Toplam arama" value={s.totals.n} sub={`bugün ${s.totals.today} · son 7 gün ${s.totals.week}`} />
        <Stat label="Farklı kelime" value={s.totals.words} sub="aynı kelimenin farklı yazımları bir sayılır" />
        <Stat label="Arayan üye" value={s.totals.members} />
        <Stat label="Arayan misafir" value={s.totals.guests} sub="tarayıcıya göre" />
      </div>

      <Card title="Nereden bulundu">
        {!srcTotal && <p className="m-0 text-sm text-faint">Henüz arama yok.</p>}
        <div className="flex flex-col gap-2.5">
          {Object.keys(SOURCE_LABEL).filter((k) => s.bySource[k]).map((k) => (
            <div key={k} className="grid grid-cols-[170px_1fr_90px] items-center gap-3 text-sm">
              <Badge s={k} />
              <Bar value={s.bySource[k]} max={srcTotal} />
              <span className="text-right text-soft">{s.bySource[k]} <span className="text-faint">· %{Math.round((s.bySource[k] / srcTotal) * 100)}</span></span>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="En çok arananlar (30 gün)">
          {!s.top.length && <p className="m-0 text-sm text-faint">Kayıt yok.</p>}
          <div className="flex flex-col">
            {s.top.map((r) => (
              <div key={r.qkey} className="flex items-center justify-between gap-3 py-2 border-b border-line4 last:border-0 text-sm">
                <span className="flex flex-col min-w-0">
                  <span className="font-semibold text-ink truncate">{r.query}{r.variants > 1 && <span className="text-xs text-faint font-normal"> (+{r.variants - 1} farklı yazım)</span>}</span>
                  <span className="text-xs text-mute truncate">{r.tr || 'bulunamadı'}</span>
                </span>
                <span className="flex items-center gap-3 shrink-0">{r.ar && <Ar t={r.ar} className="text-[18px] text-ink" />}<b className="w-8 text-right">{r.n}</b></span>
              </div>
            ))}
          </div>
        </Card>
        <Card title="Ücretsiz kaynaklarda bulunamayanlar">
          <p className="m-0 -mt-1 mb-2 text-xs text-faint">Derslerde ve yerleşik sözlükte olmayan aramalar. Sık aranıyorsa yerleşik sözlüğe (<code>scripts/lexicon-data.ts</code>) eklemek yapay zekâ maliyetini düşürür ve misafirlere de sonuç gösterir.</p>
          {!s.missing.length && <p className="m-0 text-sm text-faint">Kayıt yok.</p>}
          <div className="flex flex-col">
            {s.missing.map((r) => (
              <div key={r.qkey} className="flex items-center justify-between gap-3 py-2 border-b border-line4 last:border-0 text-sm">
                <span className="flex flex-col min-w-0">
                  <span className="font-semibold text-ink truncate">{r.query}</span>
                  <span className="text-xs text-mute truncate">{r.found ? `Yapay zekâ: ${r.tr}` : 'Hiç bulunamadı'} · {ago(r.lastAt)}</span>
                </span>
                <span className="flex items-center gap-3 shrink-0">{r.ar && <Ar t={r.ar} className="text-[18px] text-ink" />}<b className="w-8 text-right">{r.n}</b></span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card title={`Son aramalar${q ? ` · "${q}"` : ''}`}>
        <div className="overflow-x-auto -mx-1">
          <table className="lt min-w-[760px]">
            <thead><tr><th>Zaman</th><th>Aranan</th><th>Kaynak</th><th>Sonuç</th><th>Arayan</th></tr></thead>
            <tbody>
              {!s.recent.length && <tr><td colSpan={5} className="text-center text-faint py-8">Kayıt yok.</td></tr>}
              {s.recent.map((r) => (
                <tr key={r.id}>
                  <td className="whitespace-nowrap text-sm">{dt(r.createdAt, true)}</td>
                  <td className="font-semibold">{r.query}</td>
                  <td><Badge s={r.source} near={r.near} /></td>
                  <td className="text-sm">{r.ar ? <span className="inline-flex items-center gap-2"><Ar t={r.ar} className="text-[18px] text-ink" /><span className="text-mute">{r.tr}</span></span> : <span className="text-faint">-</span>}</td>
                  <td className="text-sm">{r.userId ? <Link href={`/admin/kullanicilar/${r.userId}`}>{r.userName}</Link> : <span className="text-faint">Misafir</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
