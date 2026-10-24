import { eq } from 'drizzle-orm';
import { db, schema } from '@/db';

// Ders anlatımı sesi. Uzun kayıtlarda ileri-geri sarma için Range isteklerini destekler.
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id <= 0) return new Response('Bulunamadı', { status: 404 });
  const [a] = await db.select({ mime: schema.narrationAudio.mime, data: schema.narrationAudio.data }).from(schema.narrationAudio).where(eq(schema.narrationAudio.id, id)).limit(1);
  if (!a) return new Response('Bulunamadı', { status: 404 });
  const total = a.data.length;
  const base = { 'Content-Type': a.mime, 'Accept-Ranges': 'bytes', 'Cache-Control': 'public, max-age=31536000, immutable' };
  const m = req.headers.get('range')?.match(/^bytes=(\d*)-(\d*)$/);
  if (m) {
    let start = m[1] ? Number(m[1]) : total - Number(m[2]);
    let end = m[1] && m[2] ? Number(m[2]) : total - 1;
    if (!m[1]) end = total - 1;
    start = Math.max(0, start); end = Math.min(total - 1, end);
    if (start > end) return new Response(null, { status: 416, headers: { 'Content-Range': `bytes */${total}` } });
    return new Response(new Uint8Array(a.data.subarray(start, end + 1)), {
      status: 206,
      headers: { ...base, 'Content-Range': `bytes ${start}-${end}/${total}`, 'Content-Length': String(end - start + 1) }
    });
  }
  return new Response(new Uint8Array(a.data), { headers: { ...base, 'Content-Length': String(total) } });
}
