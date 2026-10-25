'use client';

import { useState } from 'react';
import type { DayStat } from '@/lib/stats';
import { Card } from './ui';

type Key = Exclude<keyof DayStat, 'd'>;
// Grafikte seçilebilen ölçüler; renkler tema değişkenlerinden
const METRICS: { k: Key; label: string; color: string }[] = [
  { k: 'visitors', label: 'Siteye giren kişi', color: 'rgb(var(--c-acc))' },
  { k: 'lessons', label: 'Okunan konu', color: 'rgb(var(--c-prog))' },
  { k: 'activities', label: 'Yapılan etkinlik', color: 'rgb(var(--c-ok))' },
  { k: 'lessonListens', label: 'Dinlenen ders', color: 'rgb(var(--c-acct))' },
  { k: 'wordListens', label: 'Dinlenen kelime', color: 'rgb(var(--c-lab))' },
  { k: 'lookups', label: 'Kelime bul araması', color: 'rgb(var(--c-accs))' },
  { k: 'correct', label: 'Doğru cevap', color: 'rgb(var(--c-okt))' },
  { k: 'wrong', label: 'Yanlış cevap', color: 'rgb(var(--c-bad))' },
  { k: 'views', label: 'Sayfa görüntüleme', color: 'rgb(var(--c-mute))' }
];

const dayLabel = (d: string) => new Date(d + 'T12:00:00Z').toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });

export default function DailyChart({ days }: { days: DayStat[] }) {
  const [sel, setSel] = useState<Key>('visitors');
  const [table, setTable] = useState(false);
  const metric = METRICS.find((m) => m.k === sel)!;
  const max = Math.max(1, ...days.map((d) => d[sel]));
  const total = (k: Key) => days.reduce((s, d) => s + d[k], 0);

  return (
    <Card title="Son 14 gün" right={
      <button type="button" onClick={() => setTable(!table)} className="h-9 px-3 rounded-lg border border-line3 bg-s2 text-soft text-xs font-semibold hover:border-lineh hover:text-ink">
        {table ? 'Grafik olarak göster' : 'Tablo olarak göster'}
      </button>
    }>
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Gösterilecek ölçü">
        {METRICS.map((m) => (
          <button key={m.k} type="button" role="radio" aria-checked={sel === m.k} onClick={() => { setSel(m.k); setTable(false); }}
            className={`h-9 px-3 rounded-full border text-xs font-semibold inline-flex items-center gap-2 ${sel === m.k && !table ? 'bg-s5 border-lineh text-ink' : 'bg-s2 border-line2 text-soft hover:border-lineh'}`}>
            <i className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: m.color }} />
            {m.label}<span className="text-faint tabular-nums">{total(m.k)}</span>
          </button>
        ))}
      </div>

      {table ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse min-w-[760px]">
            <thead>
              <tr className="text-left text-xs text-lab uppercase tracking-[.06em]">
                <th className="py-2 pr-3 font-bold">Gün</th>
                {METRICS.map((m) => <th key={m.k} className="py-2 px-2 font-bold text-right whitespace-nowrap">{m.label}</th>)}
              </tr>
            </thead>
            <tbody>
              {[...days].reverse().map((d) => (
                <tr key={d.d} className="border-t border-line4">
                  <td className="py-2 pr-3 text-soft whitespace-nowrap">{dayLabel(d.d)}</td>
                  {METRICS.map((m) => <td key={m.k} className={`py-2 px-2 text-right tabular-nums ${d[m.k] ? 'text-ink' : 'text-faint'}`}>{d[m.k]}</td>)}
                </tr>
              ))}
              <tr className="border-t-2 border-line3 font-bold">
                <td className="py-2 pr-3">Toplam</td>
                {METRICS.map((m) => <td key={m.k} className="py-2 px-2 text-right tabular-nums">{total(m.k)}</td>)}
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div className="min-w-[640px] h-[220px] flex items-end gap-2" role="img" aria-label={`Son 14 gün: ${metric.label}`}>
            {days.map((d) => {
              const v = d[sel];
              return (
                <div key={d.d} className="flex-1 h-full flex flex-col items-center justify-end gap-1" title={`${dayLabel(d.d)}: ${v} ${metric.label.toLocaleLowerCase('tr')}`}>
                  <div className="w-full flex-1 flex flex-col items-center justify-end gap-0.5">
                    {v > 0 && <span className="text-[11px] font-semibold tabular-nums leading-none text-ink">{v}</span>}
                    <div className="w-[60%] rounded-t-md" style={{ background: metric.color, height: `calc((100% - 16px) * ${v / max})`, minHeight: v ? 3 : 0 }} />
                  </div>
                  <span className="text-[10px] text-faint whitespace-nowrap">{dayLabel(d.d)}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
      <p className="m-0 text-xs text-faint">Dinlenen ders: bir dersin anlatımı sayfada ilk kez başlatıldığında sayılır. Dinlenen kelime: her ses çalma. Doğru ve yanlış: etkinliklerde verilen her cevap. Dinleme, kelime bul ve doğru/yanlış sayıları bu özellik eklendiğinden beri tutulmaktadır.</p>
    </Card>
  );
}
