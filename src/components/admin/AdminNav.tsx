'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const ITEMS: [string, string][] = [
  ['/admin', 'Genel bakış'],
  ['/admin/kullanicilar', 'Kullanıcılar'],
  ['/admin/dersler', 'Dersler ve etkinlikler'],
  ['/admin/sesler', 'Sesler'],
  ['/admin/bildirimler', 'Bildirimler']
];

export default function AdminNav({ openReports = 0 }: { openReports?: number }) {
  const path = usePathname() || '';
  return (
    <nav aria-label="Yönetim menüsü" className="flex flex-wrap gap-2">
      {ITEMS.map(([h, l]) => {
        const active = h === '/admin' ? path === '/admin' : path.startsWith(h);
        return (
          <Link key={h} href={h} aria-current={active ? 'page' : undefined}
            className={`h-11 px-[18px] rounded-full font-semibold text-sm border inline-flex items-center ${active ? 'bg-acc text-onacc border-acc hover:text-onacc' : 'bg-s2 text-soft border-line2 hover:border-lineh hover:text-ink'}`}>
            {l}
            {h === '/admin/bildirimler' && openReports > 0 && <span className={`ml-2 min-w-[20px] h-5 px-1.5 rounded-full text-[11px] font-bold inline-flex items-center justify-center ${active ? 'bg-onacc text-acc' : 'bg-badbg border border-badln text-bad'}`}>{openReports}</span>}
          </Link>
        );
      })}
    </nav>
  );
}
