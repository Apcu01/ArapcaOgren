'use client';

/* Canlı yarışma bitince öğrencinin telefonunda yanlışları: tek dokunuşla Hatalarım'a eklenir ya da hemen yeniden çözülür.
   Yarışmadaki yanlışlar başka bir yere kaydedilmez; öğrenci eklemezse ekranı kapatınca kaybolur. */
import Link from 'next/link';
import { useState } from 'react';
import type { ActView } from '@/lib/text';
import { LIVE_TOPIC, reviewQuestion, type ReviewItem } from '@/lib/live-report';
import { useApp } from '../AppProvider';
import { I, Raw } from '../icons';
import Player, { usePreloadPlayer } from '../LazyPlayer';
import { OptText } from './shared';

export default function LiveReview({ review, topic, title }: { review: ReviewItem[]; topic: string | null; title: string }) {
  const { addMistakes, user } = useApp();
  const [added, setAdded] = useState(false);
  const [playing, setPlaying] = useState<{ act: ActView; nonce: number } | null>(null);
  const tid = topic || LIVE_TOPIC;
  usePreloadPlayer();

  if (!review.length) {
    return (
      <div className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-okbg border border-okln text-okt font-semibold">
        <Raw html={I.check(18)} /> Bütün soruları doğru bildin!
      </div>
    );
  }

  function add() {
    addMistakes(tid, review.map(reviewQuestion));
    setAdded(true);
  }
  function retry() {
    const items = review.map((r) => ({ ...reviewQuestion(r), _topic: tid }));
    setPlaying({ act: { id: 'canli-tekrar', type: 'test', title: 'Yanlışlarını tekrar çöz', desc: '', items, count: items.length, meta: items.length + ' soru', mins: 3 }, nonce: Date.now() });
  }

  return (
    <section aria-labelledby="yanlislarin" className="w-full flex flex-col gap-3 text-left">
      <h2 id="yanlislarin" className="m-0 text-xl font-bold text-center">Yanlışların <span className="text-sm font-semibold text-faint">· {review.length} soru</span></h2>
      <ul className="m-0 p-0 list-none flex flex-col gap-2">
        {review.map((r, i) => (
          <li key={i} className="px-4 py-3 rounded-2xl bg-s3 border border-line2 flex flex-col gap-1.5">
            <span className="flex items-baseline justify-between gap-3">
              {r.side === 'ar'
                ? <span lang="ar" dir="rtl" className="ar text-[26px] leading-[1.4] text-ink">{r.prompt}</span>
                : <span className="font-bold text-ink">{r.prompt}</span>}
              {r.side === 'ar' && r.promptTl && <span className="tl text-sm text-mute">{r.promptTl}</span>}
            </span>
            <span className="text-sm text-okt flex items-center gap-2 flex-wrap">Doğrusu: <OptText text={r.options[r.correct]} /></span>
            <span className="text-sm text-mute flex items-center gap-2 flex-wrap">
              {r.choice == null ? 'Bu soruyu boş bıraktın.' : <>Senin cevabın: <span className="text-bad"><OptText text={r.options[r.choice]} /></span></>}
            </span>
          </li>
        ))}
      </ul>
      <div className="grid gap-2 min-[420px]:grid-cols-2">
        <button type="button" onClick={retry} className="h-12 px-4 rounded-xl bg-acc text-onacc font-bold inline-flex items-center justify-center gap-2">
          <Raw html={I.refresh(17)} /> Tekrar çöz
        </button>
        {added ? (
          <Link href="/hatalarim" className="h-12 px-4 rounded-xl border border-okln bg-okbg text-okt font-semibold inline-flex items-center justify-center gap-2 hover:text-okt">
            <Raw html={I.check(17)} /> Eklendi · Hatalarım
          </Link>
        ) : (
          <button type="button" onClick={add} className="h-12 px-4 rounded-xl border border-line3 bg-s2 text-ink font-semibold inline-flex items-center justify-center gap-2 hover:border-lineh">
            <Raw html={I.plus(17)} /> Hatalarım&apos;a ekle
          </button>
        )}
      </div>
      <p className="m-0 text-xs text-faint text-center">
        {added
          ? 'Hatalarım sayfasında bu soruları istediğin zaman çalışabilirsin; doğru cevapladığın soru listeden düşer.'
          : user ? 'Eklersen bu sorular hesabına kaydedilir.' : 'Eklersen bu sorular bu tarayıcıda saklanır; hesap açarsan her cihazda seninle olur.'}
      </p>
      {playing && (
        <Player key={playing.nonce} practice topic={{ id: tid, name: title, words: [] }} act={playing.act} list={[playing.act]}
          onClose={() => setPlaying(null)} onSwitch={() => setPlaying(null)} />
      )}
    </section>
  );
}
