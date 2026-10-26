'use client';

/* Kartlar: çevrilebilir kartlar. İlerleme takibi açıkken "Biliyorum / Hâlâ öğreniyorum" ile ayrılır ve kelime durumuna sayılır */
import { useEffect, useRef, useState } from 'react';
import { useApp } from '../../AppProvider';
import { I, Raw } from '../../icons';
import { Face } from '../parts';
import type { ModeProps } from '../StudyShell';
import { pickDir, type ListItem, type Side } from '@/lib/study';
import { shuffle } from '@/lib/text';

type Card = { item: ListItem; front: Side };

export default function Flashcards({ list, items, opts, study }: ModeProps) {
  const { speak } = useApp();
  const make = (src: ListItem[], mix: boolean) => (mix ? shuffle(src) : src).map((item) => ({ item, front: pickDir(opts.dir) }));
  const [shuffled, setShuffled] = useState(false);
  const [track, setTrack] = useState(true);
  const [deck, setDeck] = useState<Card[]>(() => make(items, false));
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState<number[]>([]);
  const [learning, setLearning] = useState<number[]>([]);
  const [auto, setAuto] = useState(false);
  const [anim, setAnim] = useState<'' | 'left' | 'right'>('');
  const done = i >= deck.length;
  const card = deck[Math.min(i, deck.length - 1)];
  const starred = list.items.find((x) => x.id === card?.item.id)?.starred ?? false;

  const go = (d: 1 | -1) => { setFlipped(false); setI((x) => Math.max(0, Math.min(deck.length, x + d))); };
  // Kart kayarken gelen ikinci dokunuş aynı kartı tekrar saymasın
  const moving = useRef(false);
  const sort = (ok: boolean) => {
    if (done || moving.current) return;
    moving.current = true;
    study.answer(card.item.id, ok);
    (ok ? setKnown : setLearning)((a) => [...a, card.item.id]);
    setAnim(ok ? 'right' : 'left');
    setTimeout(() => { moving.current = false; setAnim(''); setFlipped(false); setI((x) => x + 1); }, 220);
  };
  const restart = (src: ListItem[]) => { setDeck(make(src, shuffled)); setI(0); setFlipped(false); setKnown([]); setLearning([]); };

  // Otomatik oynatma: 3 sn ön yüz, 3 sn arka yüz
  useEffect(() => {
    if (!auto || done) return;
    const t = setTimeout(() => {
      if (!flipped) setFlipped(true);
      else if (track) sort(true);
      else go(1);
    }, 3000);
    return () => clearTimeout(t);
  });
  useEffect(() => { if (done) setAuto(false); }, [done]);

  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).closest('input,textarea,select')) return;
      if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'ArrowDown') { e.preventDefault(); setFlipped((f) => !f); }
      else if (e.key === 'ArrowRight') track ? sort(true) : go(1);
      else if (e.key === 'ArrowLeft') track ? sort(false) : go(-1);
    };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  });

  // Kaydırma: sağa biliyorum (ya da sonraki), sola öğreniyorum (ya da önceki)
  const touch = useRef<{ x: number; y: number } | null>(null);
  const onStart = (e: React.TouchEvent) => { touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; };
  const onEnd = (e: React.TouchEvent) => {
    const s = touch.current;
    touch.current = null;
    if (!s) return;
    const dx = e.changedTouches[0].clientX - s.x, dy = e.changedTouches[0].clientY - s.y;
    if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy)) return;
    if (track) sort(dx > 0); else go(dx > 0 ? 1 : -1);
  };

  if (done) {
    const left = deck.filter((c) => learning.includes(c.item.id)).map((c) => c.item);
    return (
      <div className="pop flex flex-col items-center text-center gap-5 py-10">
        <h2 className="m-0 text-[28px] font-bold">{track ? (left.length ? 'Güzel gidiyorsun!' : 'Hepsini biliyorsun!') : 'Kartlar bitti'}</h2>
        {track && (
          <div className="flex gap-3">
            <span className="px-4 py-2 rounded-xl bg-okbg border border-okln text-okt font-bold">Biliyorum: {known.length}</span>
            <span className="px-4 py-2 rounded-xl bg-s2 border border-prog text-prog font-bold">Öğreniyorum: {learning.length}</span>
          </div>
        )}
        <div className="flex gap-3 flex-wrap justify-center">
          {track && left.length > 0 && <button type="button" onClick={() => restart(left)} className="h-12 px-5 rounded-xl bg-acc text-onacc font-bold">{left.length} kelimeyi tekrar çalış</button>}
          <button type="button" onClick={() => restart(items)} className="h-12 px-5 rounded-xl border border-line3 bg-s2 text-ink font-semibold hover:border-lineh">Baştan başla</button>
        </div>
      </div>
    );
  }

  const back: Side = card.front === 'ar' ? 'tr' : 'ar';
  return (
    <div className="flex flex-col gap-5 items-center">
      <div className="w-full flex items-center justify-between gap-3 text-sm text-mute">
        <span className="font-semibold">{i + 1} / {deck.length}</span>
        {track && <span><span className="text-prog font-bold">{learning.length}</span> öğreniyorum · <span className="text-okt font-bold">{known.length}</span> biliyorum</span>}
      </div>
      <div className="w-full h-1.5 rounded-full bg-track overflow-hidden"><div className="h-full bg-acc transition-all" style={{ width: (i / deck.length) * 100 + '%' }} /></div>

      <div className={`flip w-full max-w-[760px] ${flipped ? 'is-flipped' : ''} transition-transform duration-200 ${anim === 'right' ? 'translate-x-10 opacity-0' : anim === 'left' ? '-translate-x-10 opacity-0' : ''}`}
        onTouchStart={onStart} onTouchEnd={onEnd}>
        <div className="flip-inner">
          {(['front', 'back'] as const).map((f) => {
            const side = f === 'front' ? card.front : back;
            return (
              <div key={f} role="button" tabIndex={f === 'front' ? 0 : -1} aria-label={flipped ? 'Kartı çevir: ön yüz' : 'Kartı çevir: arka yüz'}
                onClick={(e) => { if (!(e.target as HTMLElement).closest('button')) setFlipped(!flipped); }}
                onKeyDown={(e) => { if (e.key === 'Enter') setFlipped(!flipped); }}
                className={`flip-face ${f === 'back' ? 'flip-back' : 'relative'} min-h-[320px] sm:min-h-[380px] p-8 rounded-[24px] bg-s4 border border-line3 shadow-xl flex items-center justify-center text-center cursor-pointer select-none`}>
                <span className="absolute top-4 left-5 text-xs font-bold tracking-[.1em] uppercase text-lab">{side === 'ar' ? 'Arapça' : 'Türkçe'}</span>
                <span className="absolute top-2.5 right-3 flex gap-1">
                  <button type="button" onClick={() => speak(card.item.ar)} aria-label="Sesli dinle" className="w-10 h-10 rounded-full text-mute hover:text-ink flex items-center justify-center"><Raw html={I.speaker(18)} /></button>
                  <button type="button" onClick={() => study.star(list.items.find((x) => x.id === card.item.id) ?? card.item)} aria-pressed={starred} aria-label={starred ? 'Yıldızı kaldır' : 'Yıldızla'}
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${starred ? 'text-acct' : 'text-mute hover:text-ink'}`}><Raw html={starred ? I.starFill(18) : I.star(18)} /></button>
                </span>
                <span className="flex flex-col items-center gap-3">
                  <Face item={card.item} side={side} size="lg" />
                  {side === 'tr' && card.item.note && <span className="text-sm text-mute">{card.item.note}</span>}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      <p className="m-0 text-xs text-faint text-center">Çevirmek için karta dokun ya da boşluk tuşuna bas.{track ? ' Sağa kaydır: biliyorum, sola: öğreniyorum.' : ''}</p>

      {/* Telefonda ana düğmeler üstte tam genişlik, oynat / karıştır / takip altta */}
      <div className="w-full flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1">
          <button type="button" onClick={() => setAuto(!auto)} aria-pressed={auto} aria-label={auto ? 'Otomatik oynatmayı durdur' : 'Otomatik oynat'}
            className={`w-11 h-11 rounded-full border flex items-center justify-center ${auto ? 'bg-acc text-onacc border-acc' : 'bg-chip border-line3 text-ink hover:border-lineh'}`}><Raw html={auto ? I.pause(16) : I.play(16)} /></button>
          <button type="button" onClick={() => { const s = !shuffled; setShuffled(s); setDeck(make(items, s)); setI(0); setFlipped(false); setKnown([]); setLearning([]); }} aria-pressed={shuffled} aria-label="Karıştır"
            className={`w-11 h-11 rounded-full border flex items-center justify-center ${shuffled ? 'bg-acc text-onacc border-acc' : 'bg-chip border-line3 text-ink hover:border-lineh'}`}><Raw html={I.shuffle(17)} /></button>
        </div>
        {track ? (
          <div className="order-first sm:order-none w-full sm:w-auto grid grid-cols-2 gap-3">
            <button type="button" onClick={() => sort(false)} className="h-12 px-4 sm:px-5 rounded-xl bg-s2 border border-prog text-prog font-bold inline-flex items-center justify-center gap-2"><Raw html={I.x(16)} /> Öğreniyorum</button>
            <button type="button" onClick={() => sort(true)} className="h-12 px-4 sm:px-5 rounded-xl bg-okbg border border-okln text-okt font-bold inline-flex items-center justify-center gap-2"><Raw html={I.check(16)} /> Biliyorum</button>
          </div>
        ) : (
          <div className="order-first sm:order-none w-full sm:w-auto flex justify-center gap-3">
            <button type="button" onClick={() => go(-1)} disabled={i === 0} aria-label="Önceki kart" className="w-12 h-12 rounded-full bg-chip border border-line3 text-ink flex items-center justify-center disabled:opacity-40"><Raw html={I.back(18)} /></button>
            <button type="button" onClick={() => go(1)} aria-label="Sonraki kart" className="w-12 h-12 rounded-full bg-chip border border-line3 text-ink flex items-center justify-center"><Raw html={I.arrow(18)} /></button>
          </div>
        )}
        <label className="flex items-center gap-2 text-sm text-soft cursor-pointer">
          <input type="checkbox" checked={track} onChange={(e) => setTrack(e.target.checked)} className="w-5 h-5 accent-acc" />
          İlerlemeyi takip et
        </label>
      </div>
    </div>
  );
}
