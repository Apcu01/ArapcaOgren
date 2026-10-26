import { getWordIndex } from '@/lib/words';
import { normAr, searchKey } from '@/lib/text';
import { phonKeys } from '@/lib/translit';
import { throttle } from '@/lib/throttle';

const arKey = (s: string) => normAr(s).replace(/\s+/g, '');

/* Liste düzenleyicide kelime önerisi: derslerdeki ve yerleşik sözlükteki kelimeler (yapay zekâ kullanılmaz, ücretsiz).
   Arapça, okunuş (ketebe) ya da Türkçe anlam (yazmak) ile aranabilir. */
export async function GET(req: Request) {
  const limited = throttle('lookup', req);
  if (limited) return limited;
  const q = (new URL(req.url).searchParams.get('q') || '').trim().slice(0, 40);
  if (!q) return Response.json({ items: [] });
  const words = await getWordIndex();
  const hits: { ar: string; tl: string; tr: string; rank: number }[] = [];
  if (/[؀-ۿ]/.test(q)) {
    const k = arKey(q);
    for (const w of words) {
      const a = arKey(w.ar);
      if (a === k) hits.push({ ...w, rank: 0 });
      else if (a.startsWith(k)) hits.push({ ...w, rank: 1 });
    }
  } else {
    const pk = phonKeys(q);
    const sk = searchKey(q);
    for (const w of words) {
      if (pk.length && phonKeys(w.tl).some((x) => pk.includes(x))) { hits.push({ ...w, rank: 0 }); continue; }
      const means = w.tr.split(/[,;/(]/).map(searchKey);
      if (sk.length >= 2 && means.includes(sk)) hits.push({ ...w, rank: 1 });
      else if (sk.length >= 3 && (means.some((m) => m.startsWith(sk)) || searchKey(w.tl).startsWith(sk))) hits.push({ ...w, rank: 2 });
    }
  }
  hits.sort((a, b) => a.rank - b.rank || a.tl.length - b.tl.length);
  return Response.json({ items: hits.slice(0, 6).map(({ ar, tl, tr }) => ({ ar, tl, tr })) }, { headers: { 'Cache-Control': 'public, max-age=3600' } });
}
