'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { LookupResult } from '@/lib/types';
import { useApp } from '../AppProvider';
import { Raw } from '../icons';
import { Card, Stat, ago, dt } from './ui';

type Row = { id: number; query: string; result: LookupResult; hits: number; cost: number; createdAt: string; lastAt: string };
type Totals = { n: number; hits: number; cost: number; today: number; month: number };

const usd = (v: number) => (v < 0.01 ? v.toFixed(4) : v.toFixed(2)) + ' $';

export default function LookupsView({ rows, totals, model, dailyLimit, lexiconSize }: { rows: Row[]; totals: Totals; model: string; dailyLimit: number; lexiconSize: number }) {
  const { tx, toast } = useApp();
  const router = useRouter();
  const [q, setQ] = useState('');
  const [busy, setBusy] = useState<number | null>(null);
  const shown = rows.filter((r) => !q.trim() || r.query.toLocaleLowerCase('tr').includes(q.trim().toLocaleLowerCase('tr')) || r.result.results.some((x) => x.tr.includes(q) || x.ar.includes(q)));
  const saved = totals.hits - totals.n; // önbellekten karşılanan aramalar

  async function remove(id: number) {
    if (!confirm('Bu sonuç önbellekten silinsin mi? Aynı kelime tekrar sorulunca yapay zekâdan yeniden alınır.')) return;
    setBusy(id);
    const r = await fetch('/api/admin/lookups', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) }).catch(() => null);
    setBusy(null);
    if (!r?.ok) { toast('Silinemedi.'); return; }
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="m-0 text-3xl font-bold tracking-tight">Kelime aramaları</h1>
        <p className="m-0 text-mute">"Kelime bul" sayfasında yapay zekâya sorulan kelimeler. Model: <code className="text-soft">{model}</code> · günlük tavan: {dailyLimit} yeni arama. Derslerdeki kelimeler ve yerleşik sözlükteki {lexiconSize} kelime yapay zekâya gitmez ve burada görünmez (sözlük: <code className="text-soft">scripts/lexicon-data.ts</code>, yükleme: <code className="text-soft">npm run db:lexicon</code>).</p>
      </div>
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        <Stat label="Yapay zekâya sorulan" value={totals.n} sub={`bugün ${totals.today}`} />
        <Stat label="Önbellekten karşılanan" value={Math.max(0, saved)} sub="ücretsiz tekrar aramalar" />
        <Stat label="Toplam maliyet" value={usd(totals.cost)} sub={totals.n ? `arama başı ${usd(totals.cost / totals.n)}` : undefined} />
        <Stat label="Bu ay" value={usd(totals.month)} />
      </div>
      <Card title="Aramalar" right={
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ara" className="h-10 px-3 rounded-xl bg-s2 border border-line2 text-ink text-sm outline-none focus:border-lineh" />
      }>
        {!shown.length && <p className="m-0 text-mute">Henüz arama yok.</p>}
        <div className="flex flex-col">
          {shown.map((r) => (
            <div key={r.id} className="flex flex-wrap items-start gap-x-6 gap-y-2 py-3 border-b border-line4 last:border-b-0">
              <div className="w-[160px] shrink-0 flex flex-col">
                <span className="font-bold text-ink" dir="auto">{r.query}</span>
                <span className="text-xs text-faint" title={dt(r.createdAt, true)}>{r.hits} kez · son {ago(r.lastAt)}</span>
              </div>
              <div className="flex-1 min-w-[240px] flex flex-col gap-1">
                {r.result.results.length
                  ? r.result.results.map((x, i) => (
                    <span key={i} className="flex flex-wrap items-center gap-2 text-sm">
                      <Raw html={tx.ar(x.ar, 'text-[20px] text-ink')} /><span className="text-soft">{x.tr}</span><span className="text-faint">{x.tl}</span>
                    </span>
                  ))
                  : <span className="text-sm text-mute">Sonuç bulunamadı</span>}
                {r.result.note && <span className="text-xs text-mute2">{r.result.note}</span>}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-faint tabular-nums">{usd(r.cost)}</span>
                <button type="button" disabled={busy === r.id} onClick={() => remove(r.id)} className="h-9 px-3 rounded-lg border border-badln text-bad text-xs font-semibold hover:bg-badbg disabled:opacity-60">Sil</button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
