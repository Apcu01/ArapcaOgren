import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { db, schema } from '@/db';
import { getSessionUser } from '@/lib/auth';
import { fail, ok, parse } from '@/lib/api';
import { limitCheck, recordAttempt } from '@/lib/ratelimit';
import { REPORT_REASONS, type ReportReason } from '@/lib/report';
import type { ReportContext } from '@/lib/types';

const s = z.string().max(2000).optional();
const Body = z.object({
  topicId: z.string().min(1).max(64),
  kind: z.enum(['question', 'word', 'section']),
  reason: z.enum(Object.keys(REPORT_REASONS) as [ReportReason, ...ReportReason[]]),
  message: z.string().trim().max(1000).optional(),
  anonId: z.string().max(64).nullable().optional(),
  context: z.object({
    label: z.string().max(300),
    section: z.string().max(300).optional(),
    act: z.string().max(191).optional(),
    // Bildirildiği andaki içerik; yönetici sonradan değişmiş olsa da neyin bildirildiğini görür
    question: z.record(z.string(), z.unknown()).optional(),
    word: z.object({ ar: z.string().max(500), tr: z.string().max(500), tl: s, en: s, note: s }).optional()
  })
});

export async function POST(req: Request) {
  const blocked = await limitCheck('report', req, null);
  if (blocked) return blocked;
  const p = await parse(req, Body);
  if ('res' in p) return p.res;
  const b = p.data;
  if (JSON.stringify(b.context).length > 20000) return fail('Bildirim çok uzun.');
  const [topic] = await db.select({ id: schema.topics.id }).from(schema.topics).where(eq(schema.topics.id, b.topicId)).limit(1);
  if (!topic) return fail('Ders bulunamadı.', 404);
  const user = await getSessionUser();
  await db.insert(schema.reports).values({
    topicId: b.topicId,
    kind: b.kind,
    reason: b.reason,
    message: b.message || null,
    context: b.context as ReportContext,
    userId: user?.id ?? null,
    anonId: user ? null : b.anonId ?? null
  });
  await recordAttempt('report', req, null, true);
  return ok();
}
