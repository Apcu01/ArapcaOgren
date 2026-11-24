'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ALPHABET_TOPIC as T, HARAKAT, LETTERS } from '@/lib/alphabet';
import { actsOf, type ActView } from '@/lib/text';
import { useApp } from './AppProvider';
import { I, Raw } from './icons';
import LetterTrace from './LetterTrace';
import Player, { usePreloadPlayer } from './LazyPlayer';
import type { PTopic } from './Player';
import { DIGIT_TR, DIGIT_WORDS, DRILLS, SOUND_GROUPS, toArDigits } from '@/lib/drills';

/** Alfabe sayfasındaki ek alıştırmalar: sınırsız pratik olarak açılır, ilerlemesi kendi adıyla tutulur */
const drillAct = (id: 'sesler' | 'rakamlar'): ActView => ({ id: 'pratik', type: 'endless', title: id === 'sesler' ? 'Dinleyerek ayırt et' : 'Okuma ve dinleme', desc: '', items: null, count: 0, meta: 'Sınırsız', mins: 5 });

const Z = '‍'; // birleşik biçimleri göstermek için sıfır genişlikli birleştirici
const forms = (c: string, j: boolean) => (j ? [c, c + Z, Z + c + Z, Z + c] : [c, c, Z + c, Z + c]);
const EXTRA: [string, string, string][] = [
  ['ة', 'Tâ merbûta', 'Kelime sonunda, çoğunlukla dişil isimlerde. Durakta "e/a", devam ederken "t" okunur: مَدْرَسَة medrese(t).'],
  ['ء', 'Hemze', 'Kısa bir kesilme sesi: سَأَلَ se-e-le. Elif, vav ya da ye üstünde ya da tek başına yazılır: أ إ ؤ ئ ء.'],
  ['ى', 'Elif maksûra', 'Noktasız ye biçiminde yazılan uzun â: عَلَى alâ, إِلَى ilâ.']
];

export default function AlphabetView() {
  usePreloadPlayer();
  const { tx, actState } = useApp();
  const list = useMemo(() => actsOf({ ...T, autoListen: true }), []);
  const [playing, setPlaying] = useState<{ act: ActView; nonce: number; topic: PTopic } | null>(null);
  const open = (a: ActView) => setPlaying({ act: a, nonce: Date.now(), topic: T });
  const openDrill = (id: 'sesler' | 'rakamlar', a: ActView = drillAct(id)) => setPlaying({ act: a, nonce: Date.now(), topic: { id, name: DRILLS[id].name, words: [] } });
  const drillBtn = (id: 'sesler' | 'rakamlar', label: string) => {
    const st = actState(id, 'pratik');
    return (
      <button type="button" onClick={() => openDrill(id)} className="h-11 px-5 rounded-xl bg-acc text-onacc font-bold inline-flex items-center gap-2">
        {label}{st ? ' · %' + Math.round(st.best * 100) : ''} <Raw html={I.arrow()} />
      </button>
    );
  };

  return (
    <div className="max-w-[1240px] mx-auto px-4 sm:px-6 pt-10 pb-20 flex flex-col gap-10">
      <div className="flex flex-wrap gap-8 items-end justify-between">
        <div className="flex flex-col gap-3 max-w-[700px]">
          <span className="text-[13px] font-semibold tracking-[.12em] uppercase text-lab">Alfabe</span>
          <h1 className="m-0 text-[36px] sm:text-[44px] font-bold tracking-tight leading-tight">28 harf, 4 biçim</h1>
          <p className="m-0 text-mute text-lg leading-relaxed">Arapça sağdan sola yazılır ve harfler kelimedeki yerine göre (tek başına, başta, ortada, sonda) biçim değiştirir. Harfe dokun, adını dinle. Sesli harfler çoğunlukla harf olarak değil, <b className="text-ink">hareke</b> denen işaretlerle gösterilir.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {list.map((a) => {
            const s = actState(T.id, a.id);
            return (
              <button key={a.id} type="button" onClick={() => open(a)} className={`h-11 px-4 rounded-full border text-sm font-semibold ${s && s.done ? 'bg-okbg text-okt border-okln' : 'bg-s2 text-soft border-line2 hover:border-lineh'}`}>
                {a.title}{s ? ' · %' + Math.round(s.best * 100) : ''}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex gap-3 p-4 sm:p-5 rounded-2xl bg-progbg/60 border border-progln max-w-[900px]">
        <span className="text-prog shrink-0 mt-0.5"><Raw html={I.bulb(20)} /></span>
        <p className="m-0 text-[15.5px] leading-relaxed text-prose"><b className="text-prog">Püf noktası:</b> Birçok harf aynı gövdeyi paylaşır, farkı noktalar yaratır: ب ت ث ن ي (başta hepsi ـبـ gibi görünür). Önce gövdeyi, sonra noktanın yerini ve sayısını öğren. Bitişmeyen altı harf: <Raw html={tx.ar('ا د ذ ر ز و')} /> Bunlardan sonra kelime içinde boşluk varmış gibi görünür.</p>
      </div>

      <section className="grid gap-3 [grid-template-columns:repeat(auto-fill,minmax(220px,1fr))]">
        {LETTERS.map((l) => {
          const f = forms(l[0], l[5]);
          return (
            <button key={l[0]} type="button" data-say={l[2]} aria-label={`${l[1]} harfini dinle`} className="cat text-left p-5 rounded-[18px] bg-s3 border border-line flex flex-col gap-3 text-ink">
              <span className="flex items-start justify-between gap-3 w-full">
                <span className="flex flex-col"><span className="text-xl font-bold">{l[1]}</span><span className="text-sm text-acct font-semibold">{l[3]}</span></span>
                <span className="font-ar text-[56px] leading-none text-ink" lang="ar">{l[0]}</span>
              </span>
              <span className="grid grid-cols-4 gap-1 w-full rounded-xl bg-s1 border border-line p-2 text-center" dir="ltr">
                {['Tek', 'Başta', 'Ortada', 'Sonda'].map((h, i) => (
                  <span key={h} className="flex flex-col"><span className="font-ar text-[26px] leading-[1.5] text-accs" lang="ar">{f[i]}</span><span className="text-[10px] uppercase tracking-wider text-faint">{h}</span></span>
                ))}
              </span>
              <Raw className="text-[13px] leading-relaxed text-mute2" html={tx.text(l[4])} />
              {!l[5] && <span className="self-start px-2 py-0.5 rounded-full bg-s5 border border-line2 text-[11px] font-bold text-soft">Sonraki harfe bitişmez</span>}
            </button>
          );
        })}
      </section>

      <LetterTrace />

      <section id="benzer-sesler" className="scroll-mt-6 flex flex-col gap-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-1.5 max-w-[760px]">
            <h2 className="m-0 text-2xl font-bold">Benzer sesler</h2>
            <p className="m-0 text-mute leading-relaxed">Türkçede olmayan ya da birbirine çok yakın sesler. Her çiftte kelimeler yalnızca bu seste ayrılır ve anlamları bambaşkadır. Kelimelere dokunup dinle, farkı duyunca alıştırmada kulağını dene.</p>
          </div>
          {drillBtn('sesler', 'Benzer sesler pratiği')}
        </div>
        <div className="grid gap-3 [grid-template-columns:repeat(auto-fill,minmax(300px,1fr))]">
          {SOUND_GROUPS.map((g) => (
            <div key={g.id} className="p-5 rounded-2xl bg-s1 border border-line flex flex-col gap-3">
              <span className="flex items-center justify-between gap-3">
                <Raw className="font-bold" html={tx.text(g.title)} />
                {g.letters.length > 0 && <span className="font-ar text-[30px] leading-none text-acct" lang="ar" dir="rtl">{g.letters.join(' ')}</span>}
              </span>
              <Raw as="p" className="m-0 text-[13px] text-mute2 leading-relaxed" html={tx.text(g.hint)} />
              <div className="flex flex-col gap-1.5">
                {g.pairs.map(([a, at, b, bt]) => (
                  <div key={a + b} className="grid grid-cols-2 gap-1.5">
                    {([[a, at], [b, bt]] as const).map(([w, t]) => (
                      <button key={w} type="button" data-say={w} aria-label={`${t} kelimesini dinle`} className="cat px-3 py-2 rounded-xl bg-s3 border border-line2 text-left flex items-center justify-between gap-2 text-ink">
                        <span className="text-xs text-mute2 leading-tight">{t}</span>
                        <Raw html={tx.ar(w, 'text-[24px] leading-tight')} />
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="rakamlar" className="scroll-mt-6 flex flex-col gap-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-1.5 max-w-[760px]">
            <h2 className="m-0 text-2xl font-bold">Arapça rakamlar</h2>
            <p className="m-0 text-mute leading-relaxed">Arap ülkelerinde fiyatlarda, plakalarda ve telefon numaralarında bu rakamlar kullanılır. Yazı sağdan sola gitse de sayılar <b className="text-ink">soldan sağa</b> yazılır ve okunur: <Raw html={tx.ar(toArDigits(2026))} /> = 2026. Alıştırmada rakam okuma, rakamla yazma, sayı, fiyat ve telefon numarası dinleme soruları gelir.</p>
          </div>
          {drillBtn('rakamlar', 'Rakam ve sayı pratiği')}
        </div>
        <div className="grid gap-2 grid-cols-2 sm:grid-cols-5" dir="ltr">
          {DIGIT_WORDS.map((w, i) => (
            <button key={i} type="button" data-say={w} aria-label={`${DIGIT_TR[i]}: dinle`} className="cat p-4 rounded-2xl bg-s3 border border-line flex items-center justify-between gap-3 text-ink">
              <span className="flex flex-col items-start"><span className="text-2xl font-bold tabular-nums">{i}</span><span className="text-xs text-mute2">{DIGIT_TR[i]}</span></span>
              <span className="flex flex-col items-end gap-1"><span className="font-ar text-[40px] leading-none text-acct" lang="ar">{toArDigits(i)}</span><Raw html={tx.ar(w, 'text-[15px] text-soft')} /></span>
            </button>
          ))}
        </div>
        <p className="m-0 text-sm text-mute2">Karışanlar: <Raw html={tx.ar('٢ ٣')} /> (2 ve 3), <Raw html={tx.ar('٤ ٦')} /> (4 ve 6), <Raw html={tx.ar('٧ ٨')} /> (7 ve 8). <Raw html={tx.ar('٥')} /> beştir; sıfır ise küçük bir noktadır: <Raw html={tx.ar('٠')} />.</p>
      </section>

      <Link href="/alfabe/klavye" className="cat flex flex-wrap items-center gap-5 p-6 rounded-[20px] bg-s4 border border-line3 text-ink hover:text-ink">
        <span className="w-14 h-14 shrink-0 rounded-2xl bg-chip border border-chipln text-acct flex items-center justify-center font-ar text-[28px]" aria-hidden="true">ش</span>
        <span className="flex-1 min-w-[220px] flex flex-col gap-1">
          <span className="text-xl font-bold">Arapça klavye</span>
          <span className="text-sm text-mute2 leading-relaxed">Bilgisayarda Arapça yazmayı öğren: tuşların yerini harf harf çalış, hızını ve doğruluğunu ölç. Klavyene Arapça eklemesen de çalışır.</span>
        </span>
        <span className="inline-flex items-center gap-2 font-bold text-acct">Başla <Raw html={I.arrow()} /></span>
      </Link>

      <section className="flex flex-col gap-4">
        <h2 className="m-0 text-2xl font-bold">Ek harfler ve işaretler</h2>
        <div className="grid gap-3 md:grid-cols-3">
          {EXTRA.map(([c, n, d]) => (
            <div key={c} className="p-5 rounded-2xl bg-s1 border border-line flex gap-4 items-start">
              <span className="font-ar text-[44px] leading-none text-acct">{c}</span>
              <span className="flex flex-col gap-1"><span className="font-bold">{n}</span><Raw className="text-sm text-mute2 leading-relaxed" html={tx.text(d)} /></span>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="m-0 text-2xl font-bold">Harekeler (sesli harf işaretleri)</h2>
        <p className="m-0 text-mute max-w-[780px] leading-relaxed">Gazete ve kitaplarda harekeler çoğunlukla yazılmaz; okuyucu kelimeyi tanıdığı için okur. Öğrenirken ise harekeli metin çok önemlidir. Sağ üstteki ayarlardan harekeleri gizleyip kendini deneyebilirsin.</p>
        <div className="grid gap-3 [grid-template-columns:repeat(auto-fill,minmax(250px,1fr))]">
          {HARAKAT.map(([c, n, tl, d]) => (
            <button key={c} type="button" data-say={c} className="cat text-left p-5 rounded-2xl bg-s3 border border-line flex gap-4 items-center text-ink">
              <span className="font-ar text-[44px] leading-none text-ink w-16 text-center" lang="ar" dir="rtl">{c}</span>
              <span className="flex flex-col gap-0.5"><span className="font-bold">{n}</span><span className="text-sm text-acct font-semibold">{tl}</span><Raw className="text-[13px] text-mute2 leading-relaxed" html={tx.text(d)} /></span>
            </button>
          ))}
        </div>
      </section>

      {playing && (
        <Player key={playing.act.id + playing.nonce} topic={playing.topic} act={playing.act} list={playing.topic.id === T.id ? list : [playing.act]}
          onClose={() => setPlaying(null)} onSwitch={(a) => (playing.topic.id === T.id ? open(a) : openDrill(playing.topic.id as 'sesler' | 'rakamlar', a))} />
      )}
    </div>
  );
}
