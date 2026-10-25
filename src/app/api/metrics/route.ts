import { sql } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '@/db';
import { ok, parse } from '@/lib/api';
import { METRICS } from '@/lib/metrics';

// İstemci sayaçları biriktirip toplu gönderir; tek istekte bir sayaç için en fazla 500 (kötüye kullanıma karşı)
const Body = z.object({ counts: z.partialRecord(z.enum(METRICS), z.number().int().min(1).max(500)) });

export async function POST(req: Request) {
  const p = await parse(req, Body);
  if ('res' in p) return p.res;
  const rows = Object.entries(p.data.counts).map(([metric, n]) => sql`(DATE_FORMAT(CURDATE(), '%Y-%m-%d'), ${metric}, ${n})`);
  // Gün, olay tablosuyla aynı saat diliminde olsun diye veritabanının tarihinden alınır
  if (rows.length) await db.execute(sql`INSERT INTO daily_metrics (day, metric, n) VALUES ${sql.join(rows, sql`, `)} ON DUPLICATE KEY UPDATE n = n + VALUES(n)`);
  return ok();
}
