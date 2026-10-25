'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { PresenceSnapshot } from '@/lib/presence';
import { Card } from './ui';

/** Şu an sitede olanlar: 20 saniyede bir yenilenir */
export default function LivePresence({ initial }: { initial: PresenceSnapshot }) {
  const [s, setS] = useState(initial);
  const [at, setAt] = useState(() => new Date());

  useEffect(() => {
    const load = async () => {
      if (document.visibilityState !== 'visible') return;
      const r = await fetch('/api/admin/presence', { cache: 'no-store' }).catch(() => null);
      if (r?.ok) { setS(await r.json()); setAt(new Date()); }
    };
    const t = setInterval(load, 20_000);
    return () => clearInterval(t);
  }, []);

  return <Live s={s} at={at} />;
}

const PAGES: Record<string, string> = { '/': 'Ana sayfa', '/sozluk': 'Sözlük', '/kelime-bul': 'Kelime bul', '/alfabe': 'Alfabe', '/ilerleme': 'İlerlemem', '/hatalarim': 'Hatalarım', '/giris': 'Giriş', '/kayit': 'Kayıt', '/hesap': 'Hesabım' };
/** Sayfa adresini okunur ada çevirir: /konu?id=renkler -> Ders: renkler */
function label(p: string) {
  const [path, query = ''] = p.split('?');
  const params = new URLSearchParams(query);
  if (path === '/konu') return 'Ders: ' + (params.get('id') || '');
  if (path === '/kelime-bul' && params.get('q')) return 'Kelime bul: ' + params.get('q');
  return PAGES[path] || decodeURIComponent(path);
}

function Live({ s, at }: { s: PresenceSnapshot; at: Date }) {
  return (
    <Card
      title={<span className="flex items-center gap-2"><span className="relative flex w-2.5 h-2.5"><span className="absolute inline-flex w-full h-full rounded-full bg-ok opacity-60 animate-ping" /><span className="relative inline-flex w-2.5 h-2.5 rounded-full bg-ok" /></span>Şu an sitede</span>}
      right={<span className="text-xs text-faint">{at.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })} itibarıyla · 20 sn'de bir yenilenir</span>}
    >
      <div className="flex flex-wrap items-end gap-x-8 gap-y-3">
        <div className="flex flex-col"><span className="text-[44px] font-bold leading-none">{s.online}</span><span className="text-sm text-mute2 mt-1">kişi (son 2 dakika)</span></div>
        <div className="flex flex-col"><span className="text-xl font-bold">{s.members}</span><span className="text-xs text-mute2">üye</span></div>
        <div className="flex flex-col"><span className="text-xl font-bold">{s.guests}</span><span className="text-xs text-mute2">misafir</span></div>
        <div className="flex flex-col"><span className="text-xl font-bold">{s.mobile}</span><span className="text-xs text-mute2">telefondan</span></div>
        <div className="flex flex-col"><span className="text-xl font-bold">{s.last30}</span><span className="text-xs text-mute2">son 30 dakikada</span></div>
      </div>
      {s.online > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-bold tracking-[.08em] uppercase text-lab">Baktıkları sayfalar</span>
            {s.pages.map((p) => (
              <div key={p.path} className="flex items-center justify-between gap-3 text-sm">
                <Link href={p.path} className="truncate text-soft hover:text-ink">{label(p.path)}</Link><span className="text-faint tabular-nums">{p.n}</span>
              </div>
            ))}
          </div>
          {s.people.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-bold tracking-[.08em] uppercase text-lab">Sitedeki üyeler</span>
              {s.people.map((p) => (
                <div key={p.id} className="flex items-center justify-between gap-3 text-sm">
                  <Link href={`/admin/kullanicilar/${p.id}`} className="truncate text-soft hover:text-ink">{p.name}</Link>
                  <span className="text-faint text-xs truncate">{label(p.path)} · {p.mins} dk</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      <p className="m-0 text-xs text-faint">Açık ve görünür her sekme dakikada bir sinyal gönderir; yönetim sayfaları sayılmaz. Veriler sunucu belleğinde tutulur, sunucu yeniden başlarsa birkaç dakikada yeniden dolar.</p>
    </Card>
  );
}
