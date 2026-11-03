'use client';

/* Dikte: listedeki kelimeler dinletilir, kullanıcı duyduğunu yazar. İlk cevaplar kelimenin öğrenilme durumuna sayılır. */
import { useState } from 'react';
import Dictation, { type DictResult } from '../../Dictation';
import { Ar } from '../../AppProvider';
import { GameOver } from '../parts';
import type { ModeProps } from '../StudyShell';
import { shuffle } from '@/lib/text';

export default function ListDictation({ items, study }: ModeProps) {
  const [run, setRun] = useState(0);
  const [deck, setDeck] = useState(() => shuffle(items));
  const [done, setDone] = useState<DictResult | null>(null);
  const [prog, setProg] = useState({ d: 0, t: items.length });

  if (done) {
    return (
      <GameOver title="Dikte bitti" value={`${done.right} / ${done.total}`} onAgain={() => { setDone(null); setDeck(shuffle(items)); setRun((r) => r + 1); }}>
        <p className="m-0 text-mute">İlk denemede doğru yazdıkların. Neredeyse doğru yazılanlar da doğru sayılır.</p>
        {done.wrong.length > 0 && (
          <div className="w-full max-w-[520px] flex flex-col gap-2 text-left">
            <span className="text-sm font-semibold text-lab">Tekrar çalışman gerekenler</span>
            {done.wrong.map((w) => (
              <div key={String(w.id)} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-s2 border border-line2">
                <span className="flex flex-col min-w-0"><span className="font-semibold text-ink">{w.tr}</span>{w.tl && <span className="tl text-xs text-faint">{w.tl}</span>}<span className="text-xs text-mute">Senin yazdığın: <span dir="auto">{w.given || 'boş'}</span></span></span>
                <Ar t={w.ar} className="text-[26px] text-ink" />
              </div>
            ))}
          </div>
        )}
      </GameOver>
    );
  }
  return (
    <div className="max-w-[640px] w-full mx-auto flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between text-sm text-mute"><span>Dikte</span><span>{Math.min(prog.d + 1, prog.t)} / {prog.t}</span></div>
        <div className="h-2 rounded-full bg-track overflow-hidden"><div className="h-full rounded-full bg-acc transition-all duration-300" style={{ width: Math.round((prog.d / Math.max(1, prog.t)) * 100) + '%' }} /></div>
      </div>
      <Dictation
        key={run}
        items={deck.map((x) => ({ id: x.id, ar: x.ar, tl: x.tl, tr: x.tr }))}
        onProgress={(d, t) => setProg({ d, t })}
        onAnswer={(it, ok) => study.answer(it.id as number, ok)}
        onFinish={(r) => { study.flush(); setDone(r); }}
      />
    </div>
  );
}
