import { z } from 'zod';
import { adminOrFail } from '@/lib/admin';
import { fail, ok, parse } from '@/lib/api';
import { audioCost, deleteReading, draftReading, generateAudio, missingAudio, moveReading, saveReading, setPublished } from '@/lib/reading-admin';
import { firstIssue, ReadingZ } from '@/lib/reading-schema';
import { getReading } from '@/lib/reading-store';
import { READING_LEVELS } from '@/lib/readings';

const slug = z.string().min(1).max(64);
const Body = z.discriminatedUnion('action', [
  z.object({ action: z.literal('save'), isNew: z.boolean(), reading: z.unknown() }),
  z.object({ action: z.literal('publish'), slug, on: z.boolean() }),
  z.object({ action: z.literal('delete'), slug }),
  z.object({ action: z.literal('move'), slug, dir: z.union([z.literal(-1), z.literal(1)]) }),
  z.object({ action: z.literal('audio'), slug, dry: z.boolean().optional() }),
  z.object({ action: z.literal('draft'), theme: z.string().trim().min(3, 'Konuyu yaz.').max(200), level: z.enum(READING_LEVELS), topic: z.string().max(64).nullable(), count: z.number().int().min(4).max(14) })
]);

// Okuma metinleri yönetimi: kaydet, yayınla, sırala, sil, sesleri üret, yapay zekâ taslağı
export async function POST(req: Request) {
  const a = await adminOrFail();
  if ('res' in a) return a.res;
  const p = await parse(req, Body);
  if ('res' in p) return p.res;
  const b = p.data;
  switch (b.action) {
    case 'save': {
      const r = ReadingZ.safeParse(b.reading);
      if (!r.success) return fail(firstIssue(r.error));
      const res = await saveReading(r.data, b.isNew);
      if ('error' in res) return fail(res.error!);
      const missing = await missingAudio(r.data);
      return ok({ slug: res.slug, missing: missing.length, cost: audioCost(missing) });
    }
    case 'publish': return (await setPublished(b.slug, b.on)) ? ok() : fail('Metin bulunamadı.', 404);
    case 'delete': return (await deleteReading(b.slug)) ? ok() : fail('Metin bulunamadı.', 404);
    case 'move': return ok({ moved: await moveReading(b.slug, b.dir) });
    case 'audio': {
      if (b.dry) {
        const r = await getReading(b.slug, { all: true });
        if (!r) return fail('Metin bulunamadı.', 404);
        const missing = await missingAudio(r);
        return ok({ missing: missing.length, cost: audioCost(missing) });
      }
      const r = await generateAudio(b.slug);
      return 'error' in r ? fail(r.error!) : ok(r);
    }
    case 'draft': {
      const r = await draftReading(b);
      return 'error' in r ? fail(r.error!, 502) : ok(r);
    }
  }
}
