'use client';

import { useEffect, useRef, useState } from 'react';
import { SITE_NAME } from '@/lib/site';
import { useApp } from './AppProvider';
import { I, Raw } from './icons';

type Props = { topicName: string; topicAr: string; topicId: string; score: number; acts: number; congrats?: boolean; onClose: () => void };

const W = 1200, H = 630;

async function draw(canvas: HTMLCanvasElement, p: Props, name: string | null, harakat: (s: string) => string) {
  const ctx = canvas.getContext('2d')!;
  await Promise.all([
    document.fonts.load('800 64px Manrope'), document.fonts.load('600 28px Manrope'),
    document.fonts.load(`700 84px "Noto Sans Arabic"`, p.topicAr)
  ]).catch(() => null);
  const logo = new Image();
  logo.src = '/logo.svg';
  await logo.decode().catch(() => null);

  // Zemin ve kart
  ctx.fillStyle = '#0E0B09'; ctx.fillRect(0, 0, W, H);
  const r = 36, x0 = 48, y0 = 48, w = W - 96, h = H - 96;
  ctx.fillStyle = '#18120E'; ctx.strokeStyle = '#4A3424'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.roundRect(x0, y0, w, h, r); ctx.fill(); ctx.stroke();

  // Üst satır: logo ve site adı
  if (logo.complete && logo.naturalWidth) ctx.drawImage(logo, 96, 92, 72, 72);
  ctx.fillStyle = '#F2E8DC'; ctx.font = '800 34px Manrope, sans-serif'; ctx.textBaseline = 'middle';
  ctx.fillText(SITE_NAME, 184, 128);
  ctx.fillStyle = '#C08A55'; ctx.font = '700 22px Manrope, sans-serif';
  ctx.textAlign = 'right'; ctx.fillText('DERS TAMAMLANDI', W - 96, 128); ctx.textAlign = 'left';

  // Ders adı (Türkçe) ve Arapçası
  ctx.fillStyle = '#F2E8DC'; ctx.font = '800 68px Manrope, sans-serif';
  ctx.fillText(p.topicName, 96, 262);
  ctx.fillStyle = '#B8A595'; ctx.font = '600 30px Manrope, sans-serif';
  ctx.fillText(name ? `${name} bu dersi bitirdi` : 'Bu dersi bitirdim', 96, 326);
  ctx.save();
  ctx.direction = 'rtl'; ctx.textAlign = 'right';
  ctx.fillStyle = '#D9A066'; ctx.font = '700 84px "Noto Sans Arabic", sans-serif';
  ctx.fillText(harakat(p.topicAr), W - 96, 262);
  ctx.restore();

  // Alt bilgiler
  const box = (x: number, label: string, value: string) => {
    ctx.fillStyle = '#221A14'; ctx.strokeStyle = '#33271E'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.roundRect(x, 400, 320, 118, 22); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#A8958A'; ctx.font = '600 22px Manrope, sans-serif'; ctx.fillText(label, x + 26, 438);
    ctx.fillStyle = '#F2E8DC'; ctx.font = '800 42px Manrope, sans-serif'; ctx.fillText(value, x + 26, 486);
  };
  box(96, 'Ortalama başarı', '%' + Math.round(p.score * 100));
  box(440, 'Tamamlanan etkinlik', String(p.acts));
  box(784, 'Tarih', new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' }));
}

export default function ShareCard(p: Props) {
  const { user, tx } = useApp();
  const ref = useRef<HTMLCanvasElement>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [canShare, setCanShare] = useState(false);
  const file = `arapcaogren-${p.topicId}.png`;

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    draw(c, p, user?.name ?? null, tx.showAr).then(() => {
      setUrl(c.toDataURL('image/png'));
      c.toBlob((b) => { if (b && navigator.canShare?.({ files: [new File([b], file, { type: 'image/png' })] })) setCanShare(true); });
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function share() {
    ref.current?.toBlob(async (b) => {
      if (!b) return;
      try {
        await navigator.share({ files: [new File([b], file, { type: 'image/png' })], title: `${p.topicName} dersini tamamladım`, text: `${SITE_NAME} ile ${p.topicName} dersini tamamladım. ${location.origin}` });
      } catch { /* kullanıcı vazgeçti */ }
    }, 'image/png');
  }

  return (
    <div className="fixed inset-0 z-[85] bg-bg/90 backdrop-blur flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Paylaşım kartı" onClick={p.onClose}>
      <div className="w-full max-w-[760px] p-5 sm:p-6 rounded-[22px] bg-s4 border border-line3 flex flex-col gap-5" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="m-0 text-2xl font-bold">{p.congrats ? 'Tebrikler, dersi tamamladın!' : 'Paylaşım kartı'}</h2>
            <p className="m-0 text-sm text-mute">Kartı indirip istediğin yerde paylaşabilirsin.</p>
          </div>
          <button type="button" onClick={p.onClose} aria-label="Kapat" className="w-10 h-10 shrink-0 rounded-full bg-chip border border-line3 text-ink flex items-center justify-center hover:border-lineh" dangerouslySetInnerHTML={{ __html: I.x(16) }} />
        </div>
        <canvas ref={ref} width={W} height={H} className="hidden" />
        <div className="rounded-xl overflow-hidden border border-line2 bg-bg aspect-[1200/630]">
          {url ? <img src={url} alt={`${p.topicName} dersi tamamlandı kartı`} className="w-full h-full object-contain" /> : <div className="w-full h-full flex items-center justify-center text-faint text-sm">Kart hazırlanıyor</div>}
        </div>
        <div className="flex flex-wrap gap-2 justify-end">
          {canShare && <button type="button" onClick={share} className="h-11 px-5 rounded-xl border border-line3 bg-s2 text-soft font-semibold hover:border-lineh">Paylaş</button>}
          <a href={url || '#'} download={file} aria-disabled={!url} className="h-11 px-5 rounded-xl bg-acc text-onacc font-bold inline-flex items-center gap-2 hover:text-onacc">
            İndir <Raw html={I.arrow(16)} />
          </a>
        </div>
      </div>
    </div>
  );
}
