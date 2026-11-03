import { z } from 'zod';
import { fail, ok, parse } from '@/lib/api';
import { getSessionUser } from '@/lib/auth';
import { addTask, classRole, deleteClass, deleteTask, getClass, memberIds, removeMember, renameClass, renewCode } from '@/lib/classes';
import { leagueBoard } from '@/lib/xp';

type Ctx = { params: Promise<{ id: string }> };
const classId = (s: string) => { const n = Number(s); return Number.isInteger(n) && n > 0 ? n : null; };

// Sınıf sayfası: ödevler ve durumları, öğrenciler ve sınıf ligi
export async function GET(_req: Request, { params }: Ctx) {
  const user = await getSessionUser();
  if (!user) return fail('Giriş yapmalısın.', 401);
  const id = classId((await params).id);
  const c = id ? await getClass(user.id, id) : null;
  if (!c) return fail('Sınıf bulunamadı.', 404);
  const league = await leagueBoard(user.id, c.members.map((m) => m.userId), 200);
  return Response.json({ class: c, league }, { headers: { 'Cache-Control': 'private, no-store' } });
}

const day = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const Body = z.discriminatedUnion('action', [
  z.object({ action: z.literal('rename'), name: z.string().trim().min(1).max(80) }),
  z.object({ action: z.literal('renew') }),
  z.object({ action: z.literal('delete') }),
  z.object({ action: z.literal('remove'), userId: z.number().int().positive() }),
  z.object({ action: z.literal('task'), kind: z.enum(['topic', 'reading', 'list']), ref: z.string().min(1).max(64), due: day.nullable().optional() }),
  z.object({ action: z.literal('untask'), taskId: z.number().int().positive() }),
  // Öğrenci: sınıftan ayrıl
  z.object({ action: z.literal('leave') })
]);

export async function POST(req: Request, { params }: Ctx) {
  const user = await getSessionUser();
  if (!user) return fail('Giriş yapmalısın.', 401);
  const id = classId((await params).id);
  const role = id ? await classRole(user.id, id) : null;
  if (!id || !role) return fail('Sınıf bulunamadı.', 404);
  const p = await parse(req, Body);
  if ('res' in p) return p.res;
  const b = p.data;
  if (b.action === 'leave') {
    if (role !== 'member') return fail('Öğretmen sınıftan ayrılamaz; sınıfı silebilirsin.');
    await removeMember(id, user.id);
    return ok();
  }
  if (role !== 'owner') return fail('Bunu yalnızca sınıfın öğretmeni yapabilir.', 403);
  switch (b.action) {
    case 'rename': return (await renameClass(user.id, id, b.name)) ? ok() : fail('Sınıf bulunamadı.', 404);
    case 'renew': { const code = await renewCode(user.id, id); return code ? ok({ code }) : fail('Sınıf bulunamadı.', 404); }
    case 'delete': return (await deleteClass(user.id, id)) ? ok() : fail('Sınıf bulunamadı.', 404);
    case 'remove':
      if (!(await memberIds(id)).includes(b.userId)) return fail('Bu öğrenci sınıfta değil.', 404);
      await removeMember(id, b.userId);
      return ok();
    case 'task': {
      const r = await addTask(user.id, id, b.kind, b.ref, b.due ?? null);
      return 'error' in r ? fail(r.error!) : ok(r);
    }
    case 'untask':
      await deleteTask(id, b.taskId);
      return ok();
  }
}
