'use client';

import { useMemo, useState } from 'react';
import { ALPHABET_TOPIC as T, HARAKAT, LETTERS } from '@/lib/alphabet';
import { actsOf, type ActView } from '@/lib/text';
import { useApp } from './AppProvider';
import { I, Raw } from './icons';
import Player from './Player';

const Z = '‍'; // birleşik biçimleri göstermek için sıfır genişlikli birleştirici
const forms = (c: string, j: boolean) => (j ? [c, c + Z, Z + c + Z, Z + c] : [c, c, Z + c, Z + c]);
const EXTRA: [string, string, string][] = [
  ['ة', 'Tâ merbûta', 'Kelime sonunda, çoğunlukla dişil isimlerde. Durakta "e/a", devam ederken "t" okunur: مَدْرَسَة medrese(t).'],
  ['ء', 'Hemze', 'Kısa bir kesilme sesi: سَأَلَ se-e-le. Elif, vav ya da ye üstünde ya da tek başına yazılır: أ إ ؤ ئ ء.'],
  ['ى', 'Elif maksûra', 'Noktasız ye biçiminde yazılan uzun â: عَلَى alâ, إِلَى ilâ.']
];

export default function AlphabetView() {
  const { tx, actState } = useApp();
  const list = useMemo(() => actsOf({ ...T, autoListen: true }), []);
  const [playing, setPlaying] = useState<{ act: ActView; nonce: number } | null>(null);
  const open = (a: ActView) => setPlaying({ act: a, nonce: Date.now() });

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
        <p className="m-0 text-[15.5px] leading-relaxed text-[#D8C9BA]"><b className="text-prog">Püf noktası:</b> Birçok harf aynı gövdeyi paylaşır, farkı noktalar yaratır: ب ت ث ن ي (başta hepsi ـبـ gibi görünür). Önce gövdeyi, sonra noktanın yerini ve sayısını öğren. Bitişmeyen altı harf: <Raw html={tx.ar('ا د ذ ر ز و')} /> Bunlardan sonra kelime içinde boşluk varmış gibi görünür.</p>
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
        <Player key={playing.act.id + playing.nonce} topic={T} act={playing.act} list={list} onClose={() => setPlaying(null)} onSwitch={open} />
      )}
    </div>
  );
}
