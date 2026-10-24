import { eq } from 'drizzle-orm';
import { db, schema } from '@/db';

// Ses kaydını oynat; her yeni yüklemede numara değiştiği için kalıcı olarak önbelleğe alınabilir
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id <= 0) return new Response('Bulunamadı', { status: 404 });
  const [a] = await db.select({ mime: schema.audio.mime, data: schema.audio.data }).from(schema.audio).where(eq(schema.audio.id, id)).limit(1);
  if (!a) return new Response('Bulunamadı', { status: 404 });
  return new Response(new Uint8Array(a.data), {
    headers: { 'Content-Type': a.mime, 'Content-Length': String(a.data.length), 'Cache-Control': 'public, max-age=31536000, immutable' }
  });
}
