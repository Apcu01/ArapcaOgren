'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { I, Raw } from '../icons';

const ITEMS: [string, string, keyof typeof I][] = [
  ['/admin', 'Genel bakış', 'chart'],
  ['/admin/kullanicilar', 'Kullanıcılar', 'user'],
  ['/admin/dersler', 'Dersler ve etkinlikler', 'book'],
  ['/admin/sesler', 'Sesler', 'speaker'],
  ['/admin/kelime-aramalari', 'Kelime aramaları', 'search'],
  ['/admin/listeler', 'Kelime listeleri', 'list'],
  ['/admin/bildirimler', 'Bildirimler', 'flag']
];

/** Geniş ekranda solda dikey yan menü, telefonda yatay kaydırılan şerit */
export default function AdminNav({ openReports = 0 }: { openReports?: number }) {
  const path = usePathname() || '';
  // Telefonda yatay şeritte seçili sekme görünür alana gelsin
  const nav = useRef<HTMLElement>(null);
  useEffect(() => { nav.current?.querySelector('[aria-current="page"]')?.scrollIntoView({ block: 'nearest', inline: 'center' }); }, [path]);
  return (
    <nav ref={nav} aria-label="Yönetim menüsü" className="flex lg:flex-col gap-1 overflow-x-auto no-scrollbar -mx-4 px-4 lg:mx-0 lg:px-0">
      {ITEMS.map(([h, l, icon]) => {
        const active = h === '/admin' ? path === '/admin' : path.startsWith(h);
        return (
          <Link key={h} href={h} aria-current={active ? 'page' : undefined}
            className={`shrink-0 h-11 px-3.5 rounded-xl font-semibold text-sm inline-flex items-center gap-3 whitespace-nowrap border ${active ? 'bg-acc text-onacc border-acc hover:text-onacc' : 'text-soft border-transparent hover:bg-s2 hover:text-ink lg:hover:border-line2 max-lg:bg-s2 max-lg:border-line2'}`}>
            <Raw html={I[icon](17)} className="hidden lg:inline-flex" />
            <span className="lg:flex-1">{l}</span>
            {h === '/admin/bildirimler' && openReports > 0 && <span className={`min-w-[20px] h-5 px-1.5 rounded-full text-[11px] font-bold inline-flex items-center justify-center ${active ? 'bg-onacc text-acc' : 'bg-badbg border border-badln text-bad'}`}>{openReports}</span>}
          </Link>
        );
      })}
    </nav>
  );
}
