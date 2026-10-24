// Eski sitedeki ikonlar; HTML dizesi olarak da (zengin içerik için) kullanılabilir
const svg = (d: string, size = 18, sw = 2) =>
  `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;

export const I = {
  flame: (s?: number) => svg('<path d="M12 2c1 4 5 5 5 10a5 5 0 0 1-10 0c0-3 2-4 2-7 2 1 3 2 3 4"/>', s || 16),
  search: (s?: number) => svg('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>', s || 20),
  arrow: (s?: number) => svg('<path d="M5 12h14M13 6l6 6-6 6"/>', s || 18, 2.2),
  back: (s?: number) => svg('<path d="M19 12H5M11 6l-6 6 6 6"/>', s || 16, 2.2),
  clock: (s?: number) => svg('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>', s || 15),
  speaker: (s?: number) => svg('<path d="M11 5 6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/>', s || 18),
  mic: (s?: number) => svg('<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3M8 21h8"/>', s || 18),
  check: (s?: number) => svg('<path d="m5 12 5 5L20 7"/>', s || 18, 2.4),
  x: (s?: number) => svg('<path d="M6 6l12 12M18 6 6 18"/>', s || 18, 2.4),
  gear: (s?: number) => svg('<path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/>', s || 20),
  bulb: (s?: number) => svg('<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-4 10.5c.8.8 1.5 1.7 1.5 2.5h5c0-.8.7-1.7 1.5-2.5A6 6 0 0 0 12 3z"/>', s || 18),
  alert: (s?: number) => svg('<path d="M12 9v4M12 17h.01"/><path d="M10.3 3.9 2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/>', s || 18),
  flag: (s?: number) => svg('<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>', s || 18),
  book: (s?: number) => svg('<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 19V5"/>', s || 18),
  refresh: (s?: number) => svg('<path d="M3 12a9 9 0 0 1 15.5-6.3L21 8M21 3v5h-5M21 12a9 9 0 0 1-15.5 6.3L3 16M3 21v-5h5"/>', s || 18),
  flipI: (s?: number) => svg('<path d="M12 3v18M8 7H4v10h4M16 7h4v10h-4"/>', s || 18),
  user: (s?: number) => svg('<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>', s || 18),
  logout: (s?: number) => svg('<path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 17l-5-5 5-5M5 12h11"/>', s || 18),
  shield: (s?: number) => svg('<path d="M12 3 4 6v6c0 4.5 3.4 8.2 8 9 4.6-.8 8-4.5 8-9V6z"/>', s || 18),
  plus: (s?: number) => svg('<path d="M12 5v14M5 12h14"/>', s || 18, 2.2),
  trash: (s?: number) => svg('<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>', s || 18),
  up: (s?: number) => svg('<path d="m6 15 6-6 6 6"/>', s || 18, 2.2),
  down: (s?: number) => svg('<path d="m6 9 6 6 6-6"/>', s || 18, 2.2),
  pause: (s?: number) => svg('<path d="M8 5v14M16 5v14"/>', s || 20, 3),
  playS: (s?: number) => svg('<path d="M8 5v14l11-7z" fill="currentColor"/>', s || 20),
  prev: (s?: number) => svg('<path d="M6 5v14M18 6l-9 6 9 6z" fill="currentColor"/>', s || 18),
  next: (s?: number) => svg('<path d="M18 5v14M6 6l9 6-9 6z" fill="currentColor"/>', s || 18),
  headphones: (s?: number) => svg('<path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="3" y="14" width="5" height="7" rx="2"/><rect x="16" y="14" width="5" height="7" rx="2"/>', s || 20),
  edit: (s?: number) => svg('<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="m13.5 6.5 4 4"/>', s || 18)
};

/** Yerleşimi etkilemeyen (display: contents) ham HTML sarmalayıcı */
export function Raw({ html, className, as: Tag = 'span' }: { html: string; className?: string; as?: 'span' | 'div' | 'p' }) {
  if (className) return <Tag className={className} dangerouslySetInnerHTML={{ __html: html }} />;
  return <span style={{ display: 'contents' }} dangerouslySetInnerHTML={{ __html: html }} />;
}

export function Ic({ name, size }: { name: keyof typeof I; size?: number }) {
  return <Raw html={I[name](size)} />;
}
