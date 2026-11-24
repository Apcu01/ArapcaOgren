'use client';

/* Zıt ve eş anlamlılar: kelimeleri çiftler hâlinde öğrenme (eşleştirme oyunları ve sınırsız pratik) */
import { useState } from 'react';
import type { ActView } from '@/lib/text';
import { ANTONYMS, DRILLS, pairItems, SYNONYMS, type WordPair } from '@/lib/drills';
import { useApp } from './AppProvider';
import { I, Raw } from './icons';
import Player, { usePreloadPlayer } from './LazyPlayer';
import type { PTopic } from './Player';

const TOPIC: PTopic = { id: 'zitlar', name: DRILLS.zitlar.name, words: [] };
type Kind = 'zit' | 'es' | 'pratik';
const ACTS: Record<Kind, { title: string; desc: string; icon: keyof typeof I }> = {
  zit: { title: 'Zıtları eşleştir', desc: 'Her kelimeyi zıt anlamlısıyla eşleştir (10 çift).', icon: 'pairs' },
  es: { title: 'Eş anlamlıları eşleştir', desc: 'Aynı anlama gelen kelimeleri eşleştir (10 çift).', icon: 'pairs' },
  pratik: { title: 'Sınırsız pratik', desc: 'Zıt ya da eş anlamlısını bul; sorular her seferinde değişir. 60 saniye modu da var.', icon: 'rocket' }
};

/** Her açılışta yeni çiftler seçilir */
function actOf(k: Kind): ActView {
  if (k === 'pratik') return { id: 'pratik', type: 'endless', title: ACTS.pratik.title, desc: '', items: null, count: 0, meta: 'Sınırsız', mins: 5 };
  const items = pairItems(k, 10);
  return { id: k === 'zit' ? 'zit-eslestir' : 'es-eslestir', type: 'match', title: ACTS[k].title, desc: '', items, count: items.length, meta: items.length + ' çift', mins: 3 };
}

export default function PairsView() {
  usePreloadPlayer();
  const { tx, actState } = useApp();
  const [playing, setPlaying] = useState<{ act: ActView; nonce: number } | null>(null);
  const open = (k: Kind) => setPlaying({ act: actOf(k), nonce: Date.now() });
  const kindOf = (a: ActView): Kind => (a.id === 'zit-eslestir' ? 'zit' : a.id === 'es-eslestir' ? 'es' : 'pratik');

  const table = (title: string, sub: string, list: WordPair[], sign: string) => (
    <section className="flex flex-col gap-3">
      <div className="flex flex-col gap-0.5">
        <h2 className="m-0 text-2xl font-bold">{title} <span className="text-sm font-semibold text-faint">· {list.length} çift</span></h2>
        <span className="text-sm text-mute2">{sub}</span>
      </div>
      <div className="grid gap-2 [grid-template-columns:repeat(auto-fill,minmax(320px,1fr))]">
        {list.map(([a, at, b, bt]) => (
          <div key={a + b} className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 p-2 rounded-2xl bg-s1 border border-line">
            {([[a, at], [b, bt]] as const).map(([w, t], i) => (
              <button key={w} type="button" data-say={w} aria-label={`${t}: dinle`} className={`cat px-3 py-2 rounded-xl bg-s3 border border-line2 flex flex-col items-center gap-0.5 text-ink ${i ? 'order-3' : 'order-1'}`}>
                <Raw html={tx.ar(w, 'text-[24px] leading-tight')} />
                <span className="text-xs text-mute2">{t}</span>
              </button>
            ))}
            <span className="order-2 text-acct font-bold text-lg" aria-hidden="true">{sign}</span>
          </div>
        ))}
      </div>
    </section>
  );

  return (
    <div className="max-w-[1100px] mx-auto px-4 sm:px-6 pt-10 pb-20 flex flex-col gap-10">
      <div className="flex flex-col gap-3 max-w-[760px]">
        <span className="text-[13px] font-semibold tracking-[.12em] uppercase text-lab">Kelime çalışması</span>
        <h1 className="m-0 text-[34px] sm:text-[44px] font-bold tracking-tight leading-tight">Zıt ve eş anlamlılar</h1>
        <p className="m-0 text-mute text-lg leading-relaxed">Kelimeleri çiftler hâlinde öğrenmek akılda tutmayı kolaylaştırır: <Raw html={tx.ar('كَبِير')} /> büyük ise <Raw html={tx.ar('صَغِير')} /> küçük. Kelimelere dokunup dinle, sonra oyunlarla pekiştir.</p>
      </div>

      <section className="grid gap-3 sm:grid-cols-3" aria-label="Alıştırmalar">
        {(Object.keys(ACTS) as Kind[]).map((k) => {
          const st = actState(TOPIC.id, k === 'zit' ? 'zit-eslestir' : k === 'es' ? 'es-eslestir' : 'pratik');
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

      {table('Zıt anlamlılar', 'Biri ötekinin tersini söyler.', ANTONYMS, '↔')}
      {table('Eş anlamlılar', 'İkisi de aynı ya da çok yakın anlama gelir; biri daha resmî ya da daha yaygın olabilir.', SYNONYMS, '=')}

      {playing && (
        <Player key={playing.act.id + playing.nonce} topic={TOPIC} act={playing.act} list={[playing.act]}
          onClose={() => setPlaying(null)} onSwitch={(a) => setPlaying({ act: a.type === 'endless' ? a : actOf(kindOf(a)), nonce: Date.now() })} />
      )}
    </div>
  );
}
