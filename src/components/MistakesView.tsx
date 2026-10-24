'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { Question } from '@/lib/types';
import type { MistakeItem } from '@/lib/qkey';
import { esc, type ActView, type TextFns } from '@/lib/text';
import { clockSVG } from '@/lib/clock';
import { useApp } from './AppProvider';
import { I, Raw } from './icons';
import Player from './Player';

const PRACTICE_SIZE = 15;

function promptHtml(q: Question, tx: TextFns) {
  if (q.t === 'listen') return tx.ar(q.ar || '', 'text-2xl');
  if (q.t === 'fill') return tx.ar(q.s || '', 'text-2xl');
  if (q.t === 'order') return esc(q.tr);
  if (q.t === 'tf') return tx.auto(q.s || q.q, 'text-2xl');
  return tx.text(q.q || '') + (q.ar ? ' ' + tx.ar(q.ar, 'text-2xl') : '');
}
const rightOf = (q: Question) => (q.t === 'tf' ? (q.a ? 'Doğru' : 'Yanlış') : q.t === 'order' ? (q.w || []).join(' ') : String(q.a ?? ''));

export default function MistakesView({ topics }: { topics: { id: string; name: string; n: number }[] }) {
  const { tx, mistakes, removeMistake, clearMistakes, user } = useApp();
  const [playing, setPlaying] = useState<{ act: ActView; nonce: number } | null>(null);
  const nameOf = (id: string) => (id === 'alfabe' ? 'Alfabe' : topics.find((t) => t.id === id)?.name || id);
  const orderOf = (id: string) => (id === 'alfabe' ? 0 : topics.find((t) => t.id === id)?.n ?? 999);

  const groups = useMemo(() => {
    const m = new Map<string, MistakeItem[]>();
    for (const it of mistakes) m.set(it.topicId, [...(m.get(it.topicId) || []), it]);
    return [...m.entries()].sort((a, b) => orderOf(a[0]) - orderOf(b[0]));
  }, [mistakes]); // eslint-disable-line react-hooks/exhaustive-deps

  function practice(list: MistakeItem[]) {
    // En çok yanlış yapılan ve en yeni hatalar önce
    const chosen = [...list].sort((a, b) => b.count - a.count || b.at - a.at).slice(0, PRACTICE_SIZE);
    const items = chosen.map((m) => ({ ...m.question, _topic: m.topicId }));
    const act: ActView = { id: 'hatalar', type: 'test', title: 'Hatalarımı çalış', desc: '', items, count: items.length, meta: items.length + ' soru', mins: 5 };
    setPlaying({ act, nonce: Date.now() });
  }

  return (
    <div className="max-w-[1100px] mx-auto px-4 sm:px-6 pt-10 pb-20 flex flex-col gap-8">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div className="flex flex-col gap-3 max-w-[680px]">
          <span className="text-[13px] font-semibold tracking-[.12em] uppercase text-lab">Hatalarım</span>
          <h1 className="m-0 text-[36px] sm:text-[44px] font-bold tracking-tight leading-tight">Yanlışlarından öğren</h1>
          <p className="m-0 text-mute text-lg leading-relaxed">
            Etkinliklerde yanlış yaptığın sorular burada toplanır. Çalışırken doğru cevapladığın soru listeden kendiliğinden düşer.
            {!user && <> İlerlemen gibi bu liste de bu tarayıcıda saklanır; <Link href="/kayit">hesap açarsan</Link> her cihazda seninle olur.</>}
          </p>
        </div>
        {mistakes.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => practice(mistakes)} className="h-12 px-6 rounded-xl bg-acc text-onacc font-bold inline-flex items-center gap-2">
              Hepsini çalış ({Math.min(PRACTICE_SIZE, mistakes.length)} soru) <Raw html={I.arrow()} />
            </button>
            <button type="button" onClick={() => { if (confirm('Tüm hata listesi silinsin mi?')) clearMistakes(); }} className="h-12 px-5 rounded-xl border border-line3 bg-s2 text-soft font-semibold hover:border-lineh">Listeyi temizle</button>
          </div>
        )}
      </div>

      {!mistakes.length && (
        <div className="p-10 rounded-[20px] border border-dashed border-line3 text-center flex flex-col gap-3 items-center">
          <span className="text-okt"><Raw html={I.check(32)} /></span>
          <p className="m-0 text-lg font-bold">Şu an çalışman gereken bir hata yok.</p>
          <p className="m-0 text-mute">Etkinliklerde yanlış yaptığın sorular burada birikecek.</p>
          <Link href="/" className="mt-2 inline-flex items-center gap-2 px-5 h-[46px] rounded-xl bg-acc text-onacc font-bold hover:text-onacc">Derslere git <Raw html={I.arrow()} /></Link>
        </div>
      )}

      {groups.map(([tid, list]) => (
        <section key={tid} className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="m-0 text-xl font-bold">{nameOf(tid)} <span className="text-sm font-semibold text-faint">· {list.length} hata</span></h2>
            <button type="button" onClick={() => practice(list)} className="h-10 px-4 rounded-xl border border-line3 bg-s2 text-soft text-sm font-semibold hover:border-lineh hover:text-ink">Bu dersin hatalarını çalış</button>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {list.map((m) => (
              <div key={m.mkey} className="p-5 rounded-2xl bg-s3 border border-line2 flex flex-col gap-2">
                <div className="flex items-start justify-between gap-3">
                  <Raw as="div" className="text-ink font-semibold leading-relaxed" html={promptHtml(m.question, tx)} />
                  <button type="button" onClick={() => removeMistake(m.mkey)} aria-label="Listeden çıkar" title="Listeden çıkar"
                    className="w-8 h-8 shrink-0 rounded-lg border border-line3 text-faint inline-flex items-center justify-center hover:text-ink hover:border-lineh" dangerouslySetInnerHTML={{ __html: I.x(14) }} />
                </div>
                {m.question.clock && <div className="self-start"><Raw html={clockSVG(m.question.clock, 110)} /></div>}
                <div className="text-sm text-okt">Doğru: <Raw html={tx.auto(rightOf(m.question), 'text-xl')} /></div>
                {m.question.why && <Raw as="div" className="text-sm text-mute leading-relaxed" html={tx.text(m.question.why)} />}
                <span className="text-xs text-faint">{m.count} kez yanlış</span>
              </div>
            ))}
          </div>
        </section>
      ))}

      {playing && (
        <Player key={playing.nonce} practice topic={{ id: 'hatalar', name: 'Hatalarım', words: [] }} act={playing.act} list={[playing.act]} onClose={() => setPlaying(null)} onSwitch={() => setPlaying(null)} />
      )}
    </div>
  );
}
