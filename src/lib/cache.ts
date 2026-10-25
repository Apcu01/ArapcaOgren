import 'server-only';

/* Sık okunan ve seyrek değişen veriler (dersler, ses eşlemesi, anlatım sesleri) için süreç içi önbellek.
   Uzak veritabanına her istekte gidilmez. Yönetim panelindeki değişiklikler invalidate ile anında yansır;
   komut satırı betiklerinin (seed, ses üretimi) yaptığı değişiklikler en geç TTL süresi sonunda görünür. */
type Entry = { at: number; v: Promise<unknown> };
const g = globalThis as unknown as { __arbCache?: Map<string, Entry> };
const store = (g.__arbCache ??= new Map());

export const CACHE_TTL = 5 * 60_000;

export function cached<T>(key: string, fn: () => Promise<T>, ttl = CACHE_TTL): Promise<T> {
  const hit = store.get(key);
  if (hit && Date.now() - hit.at < ttl) return hit.v as Promise<T>;
  const v = fn();
  store.set(key, { at: Date.now(), v });
  // Hatalı sonuç önbellekte kalmasın
  v.catch(() => { if (store.get(key)?.v === v) store.delete(key); });
  return v;
}

/** Verilen öneklerle başlayan kayıtları siler; önek verilmezse hepsini */
export function invalidate(...prefixes: string[]) {
  for (const k of [...store.keys()]) if (!prefixes.length || prefixes.some((p) => k.startsWith(p))) store.delete(k);
}
