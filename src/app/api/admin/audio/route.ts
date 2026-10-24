import { eq } from 'drizzle-orm';
import { db, schema } from '@/db';
import { adminOrFail } from '@/lib/admin';
import { fail, ok } from '@/lib/api';
import { AUDIO_MAX_BYTES, AUDIO_MIMES } from '@/lib/audio';
import { audioKey, isAr } from '@/lib/text';

// Ses yükle (dosya ya da tarayıcıda kaydedilmiş ses). Aynı metnin eski kaydı yenisiyle değişir.
export async function POST(req: Request) {
  const a = await adminOrFail();
  if ('res' in a) return a.res;
  let form: FormData;
  try { form = await req.formData(); } catch { return fail('Geçersiz istek.'); }
  const text = String(form.get('text') || '').trim().slice(0, 500);
  const file = form.get('file');
  if (!text || !isAr(text)) return fail('Sesin ait olduğu Arapça metni yaz.');
  if (!(file instanceof File)) return fail('Bir ses dosyası seç.');
  const mime = (file.type || '').split(';')[0].toLowerCase();
  if (!AUDIO_MIMES.includes(mime)) return fail('Desteklenmeyen dosya türü. MP3, OGG, WEBM, WAV ya da M4A yükle.');
  if (file.size > AUDIO_MAX_BYTES) return fail('Dosya en fazla 2 MB olabilir.');
  if (file.size < 200) return fail('Ses dosyası boş görünüyor.');
  const key = audioKey(text);
  if (!key) return fail('Arapça metin geçersiz.');
  const data = Buffer.from(await file.arrayBuffer());
  const id = await db.transaction(async (tx) => {
    await tx.delete(schema.audio).where(eq(schema.audio.textKey, key));
    const [r] = await tx.insert(schema.audio).values({ textKey: key, text, mime, size: data.length, data }).$returningId();
    return r.id;
  });
  return ok({ id, textKey: key });
}
