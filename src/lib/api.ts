import 'server-only';
import { NextResponse } from 'next/server';
import type { z } from 'zod';

export const ok = (data: unknown = { ok: true }, status = 200) => NextResponse.json(data, { status });
export const fail = (error: string, status = 400) => NextResponse.json({ error }, { status });

/** JSON gövdesini şemaya göre doğrular; hata varsa ilk mesajı döndürür */
export async function parse<T extends z.ZodType>(req: Request, schema: T): Promise<{ data: z.infer<T> } | { res: NextResponse }> {
  let body: unknown;
  try { body = await req.json(); } catch { return { res: fail('Geçersiz istek.') }; }
  const r = schema.safeParse(body);
  if (!r.success) return { res: fail(r.error.issues[0]?.message || 'Geçersiz veri.') };
  return { data: r.data };
}
