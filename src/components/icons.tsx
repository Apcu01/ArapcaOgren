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
  menu: (s?: number) => svg('<path d="M4 7h16M4 12h16M4 17h16"/>', s || 18),
  sun: (s?: number) => svg('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>', s || 18),
  moon: (s?: number) => svg('<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>', s || 18),
  monitor: (s?: number) => svg('<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>', s || 18),
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
  edit: (s?: number) => svg('<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="m13.5 6.5 4 4"/>', s || 18),
  phone: (s?: number) => svg('<rect x="6" y="2" width="12" height="20" rx="3"/><path d="M11 18h2"/>', s || 18),
  share: (s?: number) => svg('<path d="M12 3v12M8 7l4-4 4 4"/><path d="M6 11H5v10h14V11h-1"/>', s || 18),
  addBox: (s?: number) => svg('<rect x="3" y="3" width="18" height="18" rx="4"/><path d="M12 8v8M8 12h8"/>', s || 18),
  // Kelime listesi çalışma modları
  cards: (s?: number) => svg('<rect x="3" y="6" width="14" height="12" rx="2"/><path d="M7 3h12a2 2 0 0 1 2 2v10"/>', s || 20),
  learn: (s?: number) => svg('<path d="M20 12a8 8 0 1 1-3-6.2"/><path d="M20 4v5h-5"/><path d="m9 12 2 2 4-4"/>', s || 20),
  test: (s?: number) => svg('<path d="M6 3h9l4 4v14H6z"/><path d="M15 3v4h4M9 12h6M9 16h4"/>', s || 20),
  pairs: (s?: number) => svg('<rect x="3" y="4" width="11" height="7" rx="2"/><rect x="10" y="13" width="11" height="7" rx="2"/><path d="M6 7.5h5M13 16.5h5"/>', s || 20),
  rocket: (s?: number) => svg('<path d="M14 4c3-1 5-1 6 0 1 1 1 3 0 6l-6 6-6-6z"/><circle cx="15" cy="9" r="1.5"/><path d="M8 10 5 10 3 13l4 1M14 16v3l-3 2-1-4M5 19l2-2"/>', s || 20),
  blocks: (s?: number) => svg('<rect x="3" y="3" width="8" height="8" rx="1.5"/><rect x="13" y="3" width="8" height="8" rx="1.5"/><rect x="3" y="13" width="8" height="8" rx="1.5"/><rect x="13" y="13" width="8" height="8" rx="1.5" fill="currentColor"/>', s || 20),
  gem: (s?: number) => svg('<path d="M6 3h12l4 6-10 12L2 9z"/><path d="M2 9h20M9 3 7 9l5 12 5-12-2-6"/>', s || 20),
  star: (s?: number) => svg('<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>', s || 18),
  starFill: (s?: number) => svg('<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z" fill="currentColor"/>', s || 18),
  shuffle: (s?: number) => svg('<path d="M3 7h3c5 0 7 10 12 10h3M18 14l3 3-3 3M3 17h3c1.5 0 2.7-.9 3.7-2.2M13.3 9.2C14.3 7.9 15.5 7 17 7h4M18 4l3 3-3 3"/>', s || 18),
  play: (s?: number) => svg('<path d="M7 4v16l13-8z" fill="currentColor"/>', s || 18),
  list: (s?: number) => svg('<path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r="1" fill="currentColor"/><circle cx="4.5" cy="12" r="1" fill="currentColor"/><circle cx="4.5" cy="18" r="1" fill="currentColor"/>', s || 18),
  chart: (s?: number) => svg('<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>', s || 18),
  heart: (s?: number) => svg('<path d="M12 20s-8-4.6-8-10.2A4.6 4.6 0 0 1 12 7a4.6 4.6 0 0 1 8 2.8C20 15.4 12 20 12 20z" fill="currentColor"/>', s || 18)
};

/** Yerleşimi etkilemeyen (display: contents) ham HTML sarmalayıcı */
export function Raw({ html, className, as: Tag = 'span' }: { html: string; className?: string; as?: 'span' | 'div' | 'p' }) {
  if (className) return <Tag className={className} dangerouslySetInnerHTML={{ __html: html }} />;
  return <span style={{ display: 'contents' }} dangerouslySetInnerHTML={{ __html: html }} />;
}

export function Ic({ name, size }: { name: keyof typeof I; size?: number }) {
  return <Raw html={I[name](size)} />;
}
