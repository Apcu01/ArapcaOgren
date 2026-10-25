import Link from 'next/link';
import { notFound } from 'next/navigation';
import { eq, sql } from 'drizzle-orm';
import { db, schema } from '@/db';
import { Card, Stat, ago, dt, pct, scoreColor } from '@/components/admin/ui';
import UserActions from '@/components/admin/UserActions';
import { getSessionUser } from '@/lib/auth';
import { ALPHABET_TOPIC } from '@/lib/alphabet';
import { getUserProgress } from '@/lib/progress';
import { getUserEvents } from '@/lib/stats';
import { actsOf, streakOf, TYPE } from '@/lib/text';
import { getTopics } from '@/lib/topics';

export const metadata = { title: 'Kullanıcı' };

export default async function UserDetail({ params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();
  const [[u], me] = await Promise.all([db.select().from(schema.users).where(eq(schema.users.id, id)), getSessionUser()]);
  if (!u) notFound();
  const [prog, topics, events, [sess]] = await Promise.all([
    getUserProgress(id),
    getTopics({ all: true }),
    getUserEvents(id),
    db.select({ n: sql<number>`count(*)` }).from(schema.sessions).where(sql`${schema.sessions.userId} = ${id} AND ${schema.sessions.expiresAt} > NOW()`)
  ]);
  const alpha = { ...ALPHABET_TOPIC, autoListen: true, n: 0, level: '', published: true };
  const all = [...topics.map((t) => ({ t, acts: actsOf(t) })), { t: alpha, acts: actsOf(alpha) }];
  const nameOf = (tid: string | null) => all.find((x) => x.t.id === tid)?.t.name || tid || '-';
  const actTitle = (tid: string | null, key: string | null) => all.find((x) => x.t.id === tid)?.acts.find((a) => a.id === key)?.title || key || '';

  const recs = Object.values(prog.progress).flatMap((p) => Object.values(p.acts));
  const avg = recs.length ? recs.reduce((s, a) => s + a.best, 0) / recs.length : null;
  const lessons = Object.values(prog.progress).filter((p) => p.lesson).length;
  const done = recs.filter((a) => a.done).length;

  return (
    <div className="flex flex-col gap-6">
      <Link href="/admin/kullanicilar" className="self-start text-sm text-mute hover:text-ink">← Kullanıcılar</Link>
      <div className="flex flex-wrap items-center gap-5 justify-between">
        <div className="flex items-center gap-4 min-w-0">
          <span className="w-16 h-16 shrink-0 rounded-full bg-chip border border-line3 flex items-center justify-center font-bold text-2xl">{(u.name.trim()[0] || '?').toLocaleUpperCase('tr')}</span>
          <div className="flex flex-col gap-1 min-w-0">
            <h1 className="m-0 text-[28px] sm:text-[34px] font-bold tracking-tight leading-tight truncate">{u.name}</h1>
            <p className="m-0 text-mute truncate">{u.email} · {u.role === 'admin' ? 'Yönetici' : 'Kullanıcı'}</p>
            <p className="m-0 text-xs text-faint">Kayıt: {dt(u.createdAt, true)} · Son görülme: {ago(u.lastSeenAt)} · Açık oturum: {Number(sess.n)}</p>
          </div>
        </div>
        <UserActions id={u.id} role={u.role} self={me?.id === u.id} />
      </div>

      <div className="grid gap-3 grid-cols-2 lg:grid-cols-5">
        <Stat label="Okunan konu" value={lessons} />
        <Stat label="Tamamlanan etkinlik" value={done} sub={`${recs.length} denenen`} />
        <Stat label="Ortalama en iyi skor" value={avg == null ? '-' : <span className={scoreColor(avg)}>{pct(avg)}</span>} />
        <Stat label="Seri" value={`${streakOf(prog.days)} gün`} />
        <Stat label="Çalışılan gün" value={prog.days.length} sub={prog.last ? `Son ders: ${nameOf(prog.last)}` : undefined} />
      </div>

      <Card title="Derslere göre ilerleme">
        <div className="flex flex-col gap-3">
          {all.map(({ t, acts }) => {
            const p = prog.progress[t.id];
            if (!p && t.id === 'alfabe') return null;
            const doneN = acts.filter((a) => p?.acts[a.id]?.done).length;
            const pc = Math.round(((doneN + (p?.lesson ? 1 : 0)) / (acts.length + 1)) * 100);
            return (
              <div key={t.id} className="p-4 rounded-2xl bg-s3 border border-line flex flex-col gap-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="font-semibold">{t.id === 'alfabe' ? 'Alfabe' : `${t.n}. ${t.name}`} <span className="text-xs text-faint font-normal">{p?.lesson ? '· konu okundu' : t.id === 'alfabe' ? '' : '· konu okunmadı'}</span></span>
                  <span className="flex items-center gap-3 flex-[0_1_240px] min-w-[180px]">
                    <span className="flex-1 h-2 rounded-full bg-line overflow-hidden"><span className="block h-full rounded-full" style={{ width: pc + '%', background: pc === 100 ? 'rgb(var(--c-ok))' : 'rgb(var(--c-acc))' }} /></span>
                    <span className="text-sm font-semibold w-11 text-right">%{pc}</span>
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {acts.map((a) => {
                    const s = p?.acts[a.id];
                    const cls = s && s.done ? 'bg-okbg text-okt border-okln' : s ? 'bg-progbg text-prog border-progln' : 'bg-s0 text-dim border-edge';
                    return <span key={a.id} className={`px-2.5 py-1 rounded-full border text-xs font-semibold ${cls}`} title={`${a.title}${s ? ` · ${s.tries} deneme · son: ${pct(s.last)}` : ''}`}>{TYPE[a.type].label}{s ? ' · %' + Math.round(s.best * 100) : ''}</span>;
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Card title="Son hareketler">
        {!events.length && <p className="m-0 text-sm text-faint">Henüz kayıtlı hareket yok.</p>}
        <div className="flex flex-col">
          {events.map((e) => (
            <div key={e.id} className="flex flex-wrap items-center justify-between gap-3 py-2.5 border-b border-line4 last:border-0 text-sm">
              <span className="text-soft">
                {e.type === 'activity' ? <>Etkinlik: <b className="text-ink">{actTitle(e.topicId, e.actKey)}</b> <span className="text-faint">({nameOf(e.topicId)})</span></> : <>Konuyu okudu: <b className="text-ink">{nameOf(e.topicId)}</b></>}
              </span>
              <span className="flex items-center gap-3">
                {e.score != null && <b className={scoreColor(e.score)}>{pct(e.score)}</b>}
                <span className="text-xs text-faint whitespace-nowrap">{dt(e.createdAt, true)}</span>
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
