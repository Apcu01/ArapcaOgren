'use client';

/* Son bir yılın çalışma takvimi: her kare bir gün, renk o gün okunan ders ve bitirilen etkinlik sayısı */
import { useEffect, useMemo, useRef } from 'react';
import { dayKey } from '@/lib/text';

const MONTHS = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
const DAYS = ['Pzt', '', 'Çar', '', 'Cum', '', ''];
const LEVEL_CLS = ['bg-line', 'bg-acc/30', 'bg-acc/55', 'bg-acc/80', 'bg-acc'];
const level = (n: number) => (n <= 0 ? 0 : n === 1 ? 1 : n <= 3 ? 2 : n <= 6 ? 3 : 4);
const fmt = (d: Date) => d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });

export default function StudyCalendar({ days, counts }: { days: string[]; counts?: Record<string, number> }) {
  const scroller = useRef<HTMLDivElement>(null);

  const data = useMemo(() => {
    // Eski kayıtlarda sayı yok: çalışılan gün en az 1 sayılır
    const n = (k: string) => counts?.[k] ?? (days.includes(k) ? 1 : 0);
    const today = new Date();
    today.setHours(12, 0, 0, 0);
    const start = new Date(today);
    start.setDate(start.getDate() - 364 - ((start.getDay() + 6) % 7)); // 53 hafta önceki pazartesi
    const weeks: { date: Date; key: string; n: number; future: boolean }[][] = [];
    for (const d = new Date(start); d <= today || weeks[weeks.length - 1]?.length < 7; d.setDate(d.getDate() + 1)) {
      if (!weeks.length || weeks[weeks.length - 1].length === 7) weeks.push([]);
      const key = dayKey(d);
      weeks[weeks.length - 1].push({ date: new Date(d), key, n: d <= today ? n(key) : 0, future: d > today });
    }
    const cells = weeks.flat().filter((c) => !c.future);
    const active = cells.filter((c) => c.n > 0);
    let best = 0, run = 0;
    for (const c of cells) { run = c.n > 0 ? run + 1 : 0; best = Math.max(best, run); }
    const total = active.reduce((s, c) => s + c.n, 0);
    // Ay etiketi: ayın ilk günü hangi haftadaysa o sütunun üstünde
    const months = weeks.map((w, i) => {
      const first = w.find((c) => c.date.getDate() === 1);
      return first && i > 0 ? MONTHS[first.date.getMonth()] : '';
    });
    return { weeks, months, activeDays: active.length, total, best };
  }, [days, counts]);

  useEffect(() => {
    // Telefonda en yeni haftalar görünsün
    const el = scroller.current;
    if (el) el.scrollLeft = el.scrollWidth;
  }, []);

  const stats: [string, string][] = [
    ['Çalışılan gün', String(data.activeDays)],
    ['Toplam çalışma', String(data.total)],
    ['En uzun seri', data.best + ' gün']
  ];

  return (
    <section className="p-5 sm:p-6 rounded-[18px] bg-s3 border border-line flex flex-col gap-5" aria-labelledby="takvim-h">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 id="takvim-h" className="m-0 text-xl font-bold">Çalışma takvimi</h2>
          <span className="text-sm text-mute2">Son bir yıl. Her kare bir gün; renk koyulaştıkça o gün daha çok ders ve etkinlik bitirmişsin.</span>
        </div>
        <div className="flex gap-5">
          {stats.map(([l, v]) => <div key={l} className="flex flex-col"><span className="text-xs text-mute2">{l}</span><span className="text-lg font-bold">{v}</span></div>)}
        </div>
      </div>
      <div ref={scroller} className="overflow-x-auto pb-1">
        <div className="inline-flex gap-1.5" role="img" aria-label={`Son bir yılda ${data.activeDays} gün çalıştın, toplam ${data.total} çalışma.`}>
          <div className="grid gap-[3px] [grid-template-rows:14px_repeat(7,12px)]">
            <span />
            {DAYS.map((d, i) => <span key={i} className="text-[10px] leading-[12px] text-faint">{d}</span>)}
          </div>
          <div className="grid gap-[3px] [grid-auto-flow:column] [grid-auto-columns:12px] [grid-template-rows:14px_repeat(7,12px)]">
          {data.weeks.map((w, wi) => (
            <div key={wi} className="contents">
              <span className="w-0 text-[10px] leading-[14px] text-faint whitespace-nowrap">{data.months[wi]}</span>
              {w.map((c) => (
                <span key={c.key} title={c.future ? undefined : `${fmt(c.date)}: ${c.n ? c.n + ' çalışma' : 'çalışma yok'}`}
                  className={`w-3 h-3 rounded-[3px] ${c.future ? 'opacity-0' : LEVEL_CLS[level(c.n)]}`} />
              ))}
            </div>
          ))}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-end gap-1.5 text-[11px] text-faint" aria-hidden="true">
        Az {LEVEL_CLS.map((c) => <span key={c} className={`w-3 h-3 rounded-[3px] ${c}`} />)} Çok
      </div>
    </section>
  );
}
