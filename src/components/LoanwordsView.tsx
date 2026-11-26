'use client';

/* Türkçedeki Arapça kelimeler: "bunları zaten biliyorsun". Anlamı aynı kalanlar, anlamı değişenler (yalancı eşler)
   ve Arapça çoğul biçimiyle geçenler; eşleştirme oyunu ve "anlamı aynı mı?" sınırsız pratiği */
import { useMemo, useState } from 'react';
import type { ActView } from '@/lib/text';
import { isAr, normAr, searchKey } from '@/lib/text';
import { DRILLS } from '@/lib/drills';
import { LOAN_GROUPS, loanPairs, LOANWORDS, type Loan } from '@/lib/loanwords';
import { SayBtn, useApp } from './AppProvider';
import { I, Raw } from './icons';
import Player, { usePreloadPlayer } from './LazyPlayer';
import type { PTopic } from './Player';

const TOPIC: PTopic = { id: 'turkce', name: DRILLS.turkce.name, words: [] };
type Kind = 'eslestir' | 'pratik';
const ACTS: Record<Kind, { title: string; desc: string; icon: keyof typeof I }> = {
  eslestir: { title: 'Aslıyla eşleştir', desc: 'Arapça kelimeyi Türkçedeki karşılığıyla eşleştir (10 çift, her seferinde başka kelimeler).', icon: 'pairs' },
  pratik: { title: 'Anlamı aynı mı, farklı mı?', desc: 'Türkçedeki kelime Arapçada da aynı anlama mı gelir? Arapça aslını ve anlamını bul. Sorular bitmez; 60 saniye modu da var.', icon: 'rocket' }
};
const FILTERS = [['all', 'Hepsi'], ['same', 'Aynı anlamda'], ['diff', 'Anlamı farklı']] as const;
type Filter = (typeof FILTERS)[number][0];

function actOf(k: Kind): ActView {
  if (k === 'pratik') return { id: 'pratik', type: 'endless', title: ACTS.pratik.title, desc: '', items: null, count: 0, meta: 'Sınırsız', mins: 5 };
  const items = loanPairs(10);
  return { id: 'eslestir', type: 'match', title: ACTS.eslestir.title, desc: '', items, count: items.length, meta: items.length + ' çift', mins: 3 };
}

export default function LoanwordsView() {
  usePreloadPlayer();
  const { tx, actState } = useApp();
  const [playing, setPlaying] = useState<{ act: ActView; nonce: number } | null>(null);
  const [filter, setFilter] = useState<Filter>('all');
  const [q, setQ] = useState('');
  const open = (k: Kind) => setPlaying({ act: actOf(k), nonce: Date.now() });

  const counts = { all: LOANWORDS.length, same: LOANWORDS.filter((w) => w.same).length, diff: LOANWORDS.filter((w) => !w.same).length };
  const shown = useMemo(() => {
    const s = q.trim(), qt = searchKey(s), qa = isAr(s) ? normAr(s) : '';
    return LOANWORDS.filter((w) => (filter === 'all' || (filter === 'same') === w.same) &&
      (!s || (!!qt && searchKey(w.tr + ' ' + w.mean + ' ' + w.tl).includes(qt)) || (!!qa && normAr(w.ar).includes(qa))));
  }, [filter, q]);

  const card = (w: Loan) => (
    <div key={w.ar} className="p-4 rounded-2xl bg-s3 border border-line2 flex flex-col gap-2 min-w-0">
      <div className="flex items-start justify-between gap-3">
        <span className="flex flex-col min-w-0">
          <span className="text-lg font-bold text-ink leading-tight">{w.tr}</span>
          <span className={`text-xs font-semibold ${w.same ? 'text-okt' : 'text-prog'}`}>{w.same ? 'Aynı anlamda' : 'Anlamı farklı'}</span>
        </span>
        <SayBtn text={w.ar} size={16} cls="w-9 h-9" />
      </div>
      <span className="flex items-baseline justify-between gap-3 flex-wrap">
        <Raw html={tx.ar(w.ar, 'text-[28px] leading-[1.35]')} />
        <span className="tl text-sm text-mute">{w.tl}</span>
      </span>
      <span className="text-sm text-soft">Arapçada: <b className="text-ink">{w.mean}</b>{w.sg && <> · tekili <Raw html={tx.ar(w.sg, 'text-lg')} /></>}</span>
      {w.note && <Raw as="p" className="m-0 text-sm text-mute2 leading-relaxed" html={tx.text(w.note)} />}
    </div>
  );

  return (
    <div className="max-w-[1100px] mx-auto px-4 sm:px-6 pt-10 pb-20 flex flex-col gap-10">
      <div className="flex flex-col gap-3 max-w-[780px]">
        <span className="text-[13px] font-semibold tracking-[.12em] uppercase text-lab">Kelime çalışması</span>
        <h1 className="m-0 text-[34px] sm:text-[44px] font-bold tracking-tight leading-tight">Türkçedeki Arapça kelimeler</h1>
        <p className="m-0 text-mute text-lg leading-relaxed">
          Arapçaya sıfırdan başlamıyorsun: kitap, saat, hayat, dünya gibi her gün kullandığın kelimeler Arapçadan gelir.
          Buradaki {counts.all} kelimenin {counts.same} tanesi Arapçada da aynı anlamda. {counts.diff} tanesinin anlamı ise değişmiş: Arapçada <Raw html={tx.ar('صَدِيق')} /> arkadaş, <Raw html={tx.ar('مَكْتَب')} /> büro demektir. Konuşurken bunlara dikkat et.
        </p>
      </div>

      <section className="grid gap-3 sm:grid-cols-2" aria-label="Alıştırmalar">
        {(Object.keys(ACTS) as Kind[]).map((k) => {
          const st = actState(TOPIC.id, k);
          return (
            <button key={k} type="button" onClick={() => open(k)} className="cat text-left p-6 rounded-[20px] bg-s4 border border-line3 flex flex-col gap-3 text-ink">
              <span className="w-12 h-12 rounded-xl bg-chip border border-chipln text-acct flex items-center justify-center"><Raw html={I[ACTS[k].icon](22)} /></span>
              <span className="text-xl font-bold">{ACTS[k].title}</span>
              <span className="text-sm text-mute2 leading-relaxed">{ACTS[k].desc}</span>
              <span className={`text-xs font-semibold ${st?.done ? 'text-okt' : 'text-faint'}`}>{st ? `En iyi: %${Math.round(st.best * 100)}` : 'Başlanmadı'}</span>
            </button>
          );
        })}
      </section>

      <div className="flex flex-wrap items-center gap-3">
        <label className="flex-[1_1_280px] flex items-center gap-3 px-[18px] h-[52px] rounded-[14px] bg-s2 border border-line2 text-faint focus-within:border-lineh">
          <Raw html={I.search()} /><span className="sr-only">Kelime ara</span>
          <input value={q} onChange={(e) => setQ(e.target.value)} type="search" autoComplete="off" placeholder="Ara: saat, sevgi, مدرسة" className="flex-1 min-w-0 bg-transparent border-0 outline-none text-ink font-medium text-base placeholder:text-faint" />
        </label>
        <div role="radiogroup" aria-label="Kelimeleri süz" className="flex flex-wrap gap-2">
          {FILTERS.map(([k, l]) => (
            <button key={k} type="button" role="radio" aria-checked={filter === k} onClick={() => setFilter(k)}
              className={`h-10 px-4 rounded-full text-sm font-semibold border ${filter === k ? 'bg-acc text-onacc border-acc' : 'bg-s2 text-soft border-line2 hover:border-lineh'}`}>
              {l} <span className="opacity-70">{counts[k]}</span>
            </button>
          ))}
        </div>
      </div>

      {!shown.length && <p className="m-0 p-8 rounded-[20px] border border-dashed border-line3 text-center text-mute">Bu aramayla eşleşen kelime yok.</p>}
      {LOAN_GROUPS.map((gr) => {
        const list = shown.filter((w) => w.g === gr.id);
        if (!list.length) return null;
        return (
          <section key={gr.id} aria-labelledby={'grup-' + gr.id} className="flex flex-col gap-3">
            <div className="flex flex-col gap-0.5">
              <h2 id={'grup-' + gr.id} className="m-0 text-2xl font-bold">{gr.title} <span className="text-sm font-semibold text-faint">· {list.length} kelime</span></h2>
              <span className="text-sm text-mute2">{gr.sub}</span>
            </div>
            <div className="grid gap-3 [grid-template-columns:repeat(auto-fill,minmax(250px,1fr))]">{list.map(card)}</div>
          </section>
        );
      })}

      {playing && (
        <Player key={playing.act.id + playing.nonce} topic={TOPIC} act={playing.act} list={[playing.act]}
          onClose={() => setPlaying(null)} onSwitch={(a) => setPlaying({ act: a.type === 'endless' ? a : actOf('eslestir'), nonce: Date.now() })} />
      )}
    </div>
  );
}
