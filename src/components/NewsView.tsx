'use client';

/* Yenilikler: siteye eklenenlerin duyuruları. Sayfa açılınca en yeni yazı "görüldü" sayılır ve başlıktaki nokta kalkar;
   son ziyaretten sonra eklenen yazılarda "Yeni" etiketi görünür. */
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { NEWS_SEEN_EVENT, NEWS_SEEN_KEY, newsHtml, type NewsItem } from '@/lib/news-shared';
import { useApp } from './AppProvider';
import { I, Raw } from './icons';
import { OPEN_TOUR } from './Tour';

// Sunucu ve tarayıcı aynı günü yazsın (sunucunun saat dilimi farklı olabilir)
const day = (at: number) => new Date(at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Istanbul' });

export default function NewsView({ list }: { list: NewsItem[] }) {
  const { tx } = useApp();
  const latest = list.reduce((m, x) => Math.max(m, x.id), 0);
  // Bu ziyaretten önce görülen son yazı: ondan yeni olanlar "Yeni" etiketi alır
  const [before, setBefore] = useState<number | null>(null);
  // İlk okunan değer saklanır: efekt yeniden çalışınca (geliştirmede iki kez) az önce yazılan değer okunup etiketler kaybolmasın
  const first = useRef<number | null>(null);
  useEffect(() => {
    if (first.current === null) {
      try { const v = localStorage.getItem(NEWS_SEEN_KEY); first.current = v == null ? -1 : Number(v) || 0; } catch { first.current = -1; }
    }
    try { if (latest > Number(localStorage.getItem(NEWS_SEEN_KEY) || 0)) localStorage.setItem(NEWS_SEEN_KEY, String(latest)); } catch { /* depolama kapalı */ }
    setBefore(first.current);
    window.dispatchEvent(new Event(NEWS_SEEN_EVENT));
  }, [latest]);

  return (
    <div className="max-w-[820px] mx-auto px-4 sm:px-6 pt-10 pb-20 flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <span className="text-[13px] font-semibold tracking-[.12em] uppercase text-lab">Yenilikler</span>
        <h1 className="m-0 text-[36px] sm:text-[44px] font-bold tracking-tight leading-tight">Sitede neler yeni?</h1>
        <p className="m-0 text-mute text-lg leading-relaxed">Eklenen dersler, alıştırmalar ve özellikler burada duyurulur. Başlıktaki <Raw html={I.sparkle(17)} className="inline-flex align-[-3px] text-acct" /> simgesinde nokta varsa son ziyaretinden sonra yeni bir şey eklenmiş demektir.</p>
        <button type="button" onClick={() => window.dispatchEvent(new Event(OPEN_TOUR))}
          className="self-start mt-1 h-11 px-4 rounded-xl border border-line3 bg-s2 text-soft font-semibold inline-flex items-center gap-2 hover:text-ink hover:border-lineh">
          <Raw html={I.bulb(17)} /> Siteyi tanı
        </button>
      </div>

      {!list.length && <p className="m-0 p-8 rounded-[20px] border border-dashed border-line3 text-center text-mute">Henüz duyuru yok.</p>}

      <ol className="m-0 p-0 list-none flex flex-col gap-4">
        {list.map((n) => {
          const fresh = before !== null && before !== -1 && n.id > before;
          return (
            <li key={n.id}>
              <article className="p-6 rounded-[20px] bg-s3 border border-line2 flex flex-col gap-3">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <time dateTime={new Date(n.at).toISOString()} className="text-sm text-faint">{day(n.at)}</time>
                  {fresh && <span className="px-2.5 py-0.5 rounded-full bg-chip border border-chipln text-acct text-xs font-bold">Yeni</span>}
                </div>
                <h2 className="m-0 text-xl sm:text-2xl font-bold leading-snug">{n.title}</h2>
                {n.body && <Raw as="p" className="m-0 text-soft leading-relaxed whitespace-pre-line" html={newsHtml(n.body, tx)} />}
                {n.link && (
                  <Link href={n.link} className="self-start h-11 px-4 rounded-xl bg-acc text-onacc font-bold inline-flex items-center gap-2 hover:text-onacc">
                    Göz at <Raw html={I.arrow()} />
                  </Link>
                )}
              </article>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
