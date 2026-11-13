'use client';

/* Hareke koy: listedeki harekeli kelimelerin harekeleri silinir, kullanıcı geri koyar.
   İlk cevaplar kelimenin öğrenilme durumuna sayılır. Harekesiz yazılmış kelimeler sorulmaz. */
import { useMemo, useState } from 'react';
import HarakatPractice, { type HResult } from '../../HarakatPractice';
import { GameOver } from '../parts';
import type { ModeProps } from '../StudyShell';
import { askedCount } from '@/lib/harakat';
import { HARAKAT_MIN_LETTERS, shuffle } from '@/lib/text';

export default function ListHarakat({ items, study }: ModeProps) {
  const usable = useMemo(() => items.filter((x) => askedCount(x.ar) >= HARAKAT_MIN_LETTERS), [items]);
  const [run, setRun] = useState(0);
  const [deck, setDeck] = useState(() => shuffle(usable));
  const [done, setDone] = useState<HResult | null>(null);
  const [prog, setProg] = useState({ d: 0, t: usable.length });

  if (!usable.length) return <p className="m-0 p-6 rounded-2xl bg-s1 border border-line text-mute text-center">Bu listedeki kelimeler harekesiz yazılmış. Hareke koyma için kelimelerin Arapçası harekeli olmalı (düzenle sayfasından ekleyebilirsin).</p>;
  if (done) {
    return (
      <GameOver title="Hareke koyma bitti" value={`${done.right} / ${done.total}`} onAgain={() => { setDone(null); setDeck(shuffle(usable)); setRun((r) => r + 1); }}>
        <p className="m-0 text-mute">İlk denemede bütün harekelerini doğru koyduğun kelimeler.{usable.length < items.length ? ` Harekesiz yazılmış ${items.length - usable.length} kelime sorulmadı.` : ''}</p>
      </GameOver>
    );
  }
  return (
    <div className="max-w-[720px] w-full mx-auto flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between text-sm text-mute"><span>Hareke koy</span><span>{Math.min(prog.d + 1, prog.t)} / {prog.t}</span></div>
        <div className="h-2 rounded-full bg-track overflow-hidden"><div className="h-full rounded-full bg-acc transition-all duration-300" style={{ width: Math.round((prog.d / Math.max(1, prog.t)) * 100) + '%' }} /></div>
      </div>
      <HarakatPractice key={run} items={deck.map((x) => ({ id: x.id, ar: x.ar, tl: x.tl, tr: x.tr }))}
        onProgress={(d, t) => setProg({ d, t })} onAnswer={(it, ok) => study.answer(it.id as number, ok)} onFinish={(r) => { study.flush(); setDone(r); }} />
    </div>
  );
}
