import 'server-only';

/* Şu an sitede kimler var: açık sekmeler dakikada bir sinyal gönderir, sunucu bellekte tutar.
   Veritabanına yazılmaz; sunucu yeniden başlarsa birkaç dakika içinde yeniden dolar.
   Not: site birden fazla sunucu kopyasında çalışırsa her kopya kendi ziyaretçilerini görür. */
type Visitor = { userId: number | null; name: string | null; path: string; mobile: boolean; at: number; first: number };

const g = globalThis as unknown as { __arbPresence?: Map<string, Visitor> };
const store = (g.__arbPresence ??= new Map());

/** Bu süre içinde sinyal gönderen "şu an sitede" sayılır (sekmeler dakikada bir gönderir) */
export const ONLINE_MS = 2 * 60_000;
const KEEP_MS = 30 * 60_000;

export function touch(id: string, v: Omit<Visitor, 'at' | 'first'>) {
  const now = Date.now();
  const old = store.get(id);
  store.set(id, { ...v, at: now, first: old && now - old.at < KEEP_MS ? old.first : now });
  // Ara sıra eski kayıtları temizle
  if (Math.random() < 0.05) for (const [k, x] of store) if (now - x.at > KEEP_MS) store.delete(k);
}

export function snapshot() {
  const now = Date.now();
  const all = [...store.values()].filter((x) => now - x.at <= KEEP_MS);
  const online = all.filter((x) => now - x.at <= ONLINE_MS);
  const pages = new Map<string, number>();
  for (const x of online) pages.set(x.path, (pages.get(x.path) || 0) + 1);
  return {
    online: online.length,
    members: online.filter((x) => x.userId).length,
    guests: online.filter((x) => !x.userId).length,
    mobile: online.filter((x) => x.mobile).length,
    last30: all.length,
    pages: [...pages].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([path, n]) => ({ path, n })),
    people: online.filter((x) => x.userId).slice(0, 20).map((x) => ({ id: x.userId!, name: x.name || 'Üye', path: x.path, mins: Math.max(1, Math.round((now - x.first) / 60_000)) }))
  };
}
export type PresenceSnapshot = ReturnType<typeof snapshot>;
