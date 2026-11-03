'use client';

/* Sınıf sayfası. Öğretmen: katılma kodu ve karekod, ödev verme, kimin bitirdiği, öğrenciler.
   Öğrenci: ödevleri ve kendi durumu. İkisi de: sınıfın haftalık ligi. */
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useApp } from '../AppProvider';
import { I, Raw } from '../icons';
import { LeagueTable } from '../LeagueView';
import { jsonFetch } from '../lists/useList';
import { Loading } from '../lists/parts';
import QrCode from '../live/QrCode';
import { ClassLogin } from './ClassesView';
import { TASK_KIND, type ClassDetail, type ClassTask, type TaskKind, type TaskStatus } from '@/lib/class-shared';
import { trDay, type LeagueBoard } from '@/lib/league';
import type { ListSummary } from '@/lib/study';

type Opt = { id: string; name: string };
const fmtDue = (d: string) => new Date(d + 'T12:00:00Z').toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', timeZone: 'UTC' });

function StatusPill({ s }: { s?: TaskStatus }) {
  if (!s || !s.started) return <span className="px-2.5 py-1 rounded-full text-xs font-bold border bg-s0 text-dim border-edge">Başlanmadı</span>;
  if (s.done) return <span className="px-2.5 py-1 rounded-full text-xs font-bold border bg-okbg text-okt border-okln">Tamamlandı</span>;
  return <span className="px-2.5 py-1 rounded-full text-xs font-bold border bg-progbg text-prog border-progln">%{s.pct}</span>;
}

export default function ClassView({ id, topics, readings }: { id: number; topics: Opt[]; readings: Opt[] }) {
  const { user, session, toast } = useApp();
  const router = useRouter();
  const [data, setData] = useState<{ class: ClassDetail; league: LeagueBoard } | null>(null);
  const [missing, setMissing] = useState(false);

  const load = useCallback(async () => {
    const r = await jsonFetch<{ class: ClassDetail; league: LeagueBoard }>(`/api/classes/${id}`);
    if (r.ok) setData(r.data); else setMissing(true);
  }, [id]);
  useEffect(() => { if (session === 'ready' && user) void load(); }, [session, user, load]);

  const act = useCallback(async (body: Record<string, unknown>, msg?: string) => {
    const r = await jsonFetch<Record<string, unknown>>(`/api/classes/${id}`, { method: 'POST', body: JSON.stringify(body) });
    if (!r.ok) { toast(r.error); return null; }
    if (msg) toast(msg);
    await load();
    return r.data;
  }, [id, load, toast]);

  if (session === 'loading') return <Loading />;
  if (!user) return <ClassLogin next={`/siniflar/${id}`} />;
  if (missing) {
    return (
      <div className="max-w-[560px] mx-auto px-4 py-16 flex flex-col items-center text-center gap-4">
        <h1 className="m-0 text-[28px] font-bold">Sınıf bulunamadı</h1>
        <p className="m-0 text-mute">Bu sınıf silinmiş ya da üyesi değilsin.</p>
        <Link href="/siniflar" className="h-11 px-5 rounded-xl bg-acc text-onacc font-bold inline-flex items-center hover:text-onacc">Sınıflarıma dön</Link>
      </div>
    );
  }
  if (!data) return <Loading />;
  const c = data.class;

  return (
    <div className="max-w-[1100px] mx-auto px-4 sm:px-6 pt-8 pb-20 flex flex-col gap-8">
      <Link href="/siniflar" className="self-start inline-flex items-center gap-2 text-sm text-mute hover:text-ink"><Raw html={I.back()} /> Sınıflarım</Link>
      <header className="flex flex-col gap-2">
        <span className="text-[13px] font-semibold tracking-[.12em] uppercase text-lab">{c.isOwner ? 'Öğretmeni olduğun sınıf' : 'Sınıf'}</span>
        <h1 className="m-0 text-[32px] sm:text-[42px] leading-tight font-bold tracking-tight">{c.name}</h1>
        <p className="m-0 text-mute">{c.isOwner ? `${c.members.length} öğrenci · ${c.tasks.length} ödev` : `Öğretmen: ${c.owner} · ${c.members.length} öğrenci`}</p>
      </header>

      {c.isOwner && c.code && <Invite code={c.code} onRenew={() => act({ action: 'renew' }, 'Yeni kod oluşturuldu. Eski kod artık çalışmaz.')} empty={!c.members.length} />}

      <section className="flex flex-col gap-4" aria-labelledby="odevler">
        <h2 id="odevler" className="m-0 text-[24px] font-bold">Ödevler</h2>
        {c.isOwner && <NewTask topics={topics} readings={readings} onAdd={(body) => act({ action: 'task', ...body }, 'Ödev verildi.')} />}
        {!c.tasks.length && <p className="m-0 p-6 rounded-2xl bg-s1 border border-line text-center text-mute">{c.isOwner ? 'Henüz ödev vermedin. Yukarıdan bir ders, okuma metni ya da kelime listesi seç.' : 'Öğretmenin henüz ödev vermedi.'}</p>}
        <div className="flex flex-col gap-3">
          {c.tasks.map((t) => <TaskCard key={t.id} t={t} c={c} onDelete={() => { if (confirm(`"${t.title}" ödevi kaldırılsın mı?`)) void act({ action: 'untask', taskId: t.id }, 'Ödev kaldırıldı.'); }} />)}
        </div>
      </section>

      <section className="flex flex-col gap-3" aria-labelledby="sinif-ligi">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="sinif-ligi" className="m-0 text-[24px] font-bold inline-flex items-center gap-2"><Raw html={I.trophy(22)} /> Sınıfın haftalık ligi</h2>
          <span className="text-sm text-mute">{data.league.daysLeft === 0 ? 'Bugün bitiyor' : `Bitmesine ${data.league.daysLeft} gün`} · <Link href="/lig">Genel lig</Link></span>
        </div>
        <LeagueTable rows={data.league.rows} me={c.isOwner ? null : data.league.me} empty="Bu hafta sınıftan henüz kimse puan almadı." />
      </section>

      <section className="flex flex-col gap-3" aria-labelledby="ogrenciler">
        <h2 id="ogrenciler" className="m-0 text-[24px] font-bold">Öğrenciler <span className="text-base font-semibold text-faint">{c.members.length}</span></h2>
        {!c.members.length ? <p className="m-0 text-mute">Henüz katılan yok.</p> : (
          <ul className="m-0 p-0 list-none grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {c.members.map((m) => (
              <li key={m.userId} className={`flex items-center gap-3 px-4 h-12 rounded-xl border ${m.userId === c.me ? 'bg-chip border-acc' : 'bg-s2 border-line2'}`}>
                <span className="w-7 h-7 shrink-0 rounded-full bg-s4 text-soft text-xs font-bold inline-flex items-center justify-center">{(m.name.trim()[0] || '?').toLocaleUpperCase('tr')}</span>
                <span className="flex-1 min-w-0 truncate text-ink font-medium">{m.name}</span>
                {c.isOwner && (
                  <button type="button" onClick={() => { if (confirm(`${m.name} sınıftan çıkarılsın mı?`)) void act({ action: 'remove', userId: m.userId }, 'Öğrenci sınıftan çıkarıldı.'); }}
                    aria-label={`${m.name}: sınıftan çıkar`} title="Sınıftan çıkar" className="w-8 h-8 rounded-lg text-faint hover:text-bad inline-flex items-center justify-center"><Raw html={I.x(14)} /></button>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      {c.isOwner ? (
        <Settings name={c.name} onRename={(name) => act({ action: 'rename', name }, 'Sınıfın adı değişti.')}
          onDelete={async () => { if (!confirm('Sınıf silinecek: öğrenciler, ödevler ve sınıf ligi kaybolur. Öğrencilerin kendi ilerlemesi silinmez. Emin misin?')) return; if (await act({ action: 'delete' })) { toast('Sınıf silindi.'); router.push('/siniflar'); } }} />
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl border border-line">
          <span className="text-sm text-mute">Sınıftan ayrılırsan ödevleri ve sınıf ligini görmezsin. Kendi ilerlemen silinmez.</span>
          <button type="button" onClick={async () => { if (!confirm('Sınıftan ayrılmak istiyor musun?')) return; if (await act({ action: 'leave' })) { toast('Sınıftan ayrıldın.'); router.push('/siniflar'); } }}
            className="h-11 px-5 rounded-xl border border-badln text-bad font-semibold hover:bg-badbg">Sınıftan ayrıl</button>
        </div>
      )}
    </div>
  );
}

/* ---------- Katılma kodu ve bağlantı ---------- */
function Invite({ code, onRenew, empty }: { code: string; onRenew: () => void; empty: boolean }) {
  const { toast } = useApp();
  const [qr, setQr] = useState(empty);
  const [origin, setOrigin] = useState('');
  useEffect(() => setOrigin(location.origin), []);
  const link = `${origin}/sinif/katil?kod=${code}`;
  async function copy() {
    try { await navigator.clipboard.writeText(link); toast('Katılma bağlantısı kopyalandı.'); } catch { toast(link); }
  }
  return (
    <section className="flex flex-wrap gap-6 items-center p-5 sm:p-6 rounded-[22px] bg-s3 border border-line" aria-label="Sınıfa katılma">
      <div className="flex-1 min-w-[240px] flex flex-col gap-3">
        <span className="text-sm text-mute">Öğrencilerin <b className="text-ink">Sınıflarım</b> sayfasına bu kodu yazarak ya da bağlantıyla katılır.</span>
        <span className="font-mono text-[40px] sm:text-[48px] font-bold tracking-[.25em] text-acct leading-none">{code}</span>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={copy} className="h-10 px-4 rounded-xl bg-acc text-onacc text-sm font-bold inline-flex items-center gap-2"><Raw html={I.share(15)} /> Bağlantıyı kopyala</button>
          <button type="button" onClick={() => setQr(!qr)} aria-pressed={qr} className="h-10 px-4 rounded-xl border border-line3 bg-s2 text-soft text-sm font-semibold hover:text-ink">{qr ? 'Karekodu gizle' : 'Karekod göster'}</button>
          <button type="button" onClick={() => { if (confirm('Yeni kod oluşturulursa eski kod ve bağlantı çalışmaz. Sınıftakiler sınıfta kalır.')) onRenew(); }} className="h-10 px-4 rounded-xl text-soft text-sm font-semibold hover:text-ink inline-flex items-center gap-2"><Raw html={I.refresh(15)} /> Yeni kod</button>
        </div>
      </div>
      {qr && origin && <QrCode text={link} size={200} label={`Sınıfa katılma karekodu: ${code}`} />}
    </section>
  );
}

/* ---------- Ödev verme ---------- */
function NewTask({ topics, readings, onAdd }: { topics: Opt[]; readings: Opt[]; onAdd: (b: { kind: TaskKind; ref: string; due: string | null }) => Promise<unknown> }) {
  const [kind, setKind] = useState<TaskKind>('topic');
  const [ref, setRef] = useState('');
  const [due, setDue] = useState('');
  const [lists, setLists] = useState<Opt[] | null>(null);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    if (kind !== 'list' || lists) return;
    jsonFetch<{ lists: ListSummary[] }>('/api/lists').then((r) => setLists(r.ok ? r.data.lists.filter((l) => l.count > 0).map((l) => ({ id: String(l.id), name: `${l.title} (${l.count} kelime)` })) : []));
  }, [kind, lists]);
  useEffect(() => setRef(''), [kind]);
  const opts = kind === 'topic' ? topics : kind === 'reading' ? readings : lists || [];
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!ref) return;
    setBusy(true);
    await onAdd({ kind, ref, due: due || null });
    setBusy(false);
    setRef(''); setDue('');
  }
  return (
    <form onSubmit={submit} className="flex flex-col gap-3 p-5 rounded-2xl bg-s3 border border-line">
      <span className="font-bold">Yeni ödev</span>
      <div role="radiogroup" aria-label="Ödev türü" className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-s2 border border-line3 max-w-[460px]">
        {(Object.keys(TASK_KIND) as TaskKind[]).map((k) => (
          <button key={k} type="button" role="radio" aria-checked={kind === k} onClick={() => setKind(k)}
            className={`h-9 rounded-lg text-[13px] font-semibold ${kind === k ? 'bg-acc text-onacc' : 'text-soft hover:text-ink'}`}>{TASK_KIND[k]}</button>
        ))}
      </div>
      <div className="flex flex-wrap gap-3 items-end">
        <label className="flex-1 min-w-[220px] flex flex-col gap-1.5">
          <span className="text-sm text-mute">{TASK_KIND[kind]}</span>
          <select value={ref} onChange={(e) => setRef(e.target.value)} className="h-11 px-3 rounded-xl bg-s2 border border-line3 text-ink outline-none focus:border-acc">
            <option value="" className="bg-s2">{kind === 'list' && !lists ? 'Listeler yükleniyor' : 'Seç'}</option>
            {opts.map((o) => <option key={o.id} value={o.id} className="bg-s2">{o.name}</option>)}
          </select>
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm text-mute">Son gün (isteğe bağlı)</span>
          <input type="date" value={due} min={trDay()} onChange={(e) => setDue(e.target.value)} className="h-11 px-3 rounded-xl bg-s2 border border-line3 text-ink outline-none focus:border-acc" />
        </label>
        <button type="submit" disabled={!ref || busy} className="h-11 px-5 rounded-xl bg-acc text-onacc font-bold disabled:opacity-50">{busy ? 'Veriliyor' : 'Ödev ver'}</button>
      </div>
      {kind === 'list' && lists && !lists.length && <p className="m-0 text-sm text-faint">Kelimesi olan bir listen yok. <Link href="/listelerim/yeni">Liste oluştur</Link> ya da <Link href="/hazir-listeler">hazır listelerden</Link> birini kopyala.</p>}
      {kind === 'list' && <p className="m-0 text-xs text-faint">Listenin paylaşım bağlantısı açılır; öğrenciler listeyi kendi hesaplarına kopyalayıp çalışır. Öğrenilen kelime oranı burada görünür.</p>}
    </form>
  );
}

/* ---------- Ödev kartı ---------- */
function TaskCard({ t, c, onDelete }: { t: ClassTask; c: ClassDetail; onDelete: () => void }) {
  const [open, setOpen] = useState(false);
  const today = trDay();
  const late = !!t.due && t.due < today;
  const sum = useMemo(() => {
    const v = Object.values(t.status);
    return { done: v.filter((s) => s.done).length, started: v.filter((s) => s.started && !s.done).length };
  }, [t.status]);
  const mine = t.status[c.me];
  return (
    <article className="p-5 rounded-2xl bg-s4 border border-line3 flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xs font-bold tracking-[.08em] uppercase text-lab">{TASK_KIND[t.kind]}</span>
        {t.due && <span className={`text-xs font-semibold ${late && !(mine?.done) ? 'text-bad' : 'text-mute2'}`}>Son gün: {fmtDue(t.due)}{late ? ' (geçti)' : ''}</span>}
        <span className="flex-1" />
        {!c.isOwner && <StatusPill s={mine} />}
        {c.isOwner && <button type="button" onClick={onDelete} aria-label="Ödevi kaldır" title="Ödevi kaldır" className="w-9 h-9 rounded-lg text-faint hover:text-bad inline-flex items-center justify-center"><Raw html={I.trash(16)} /></button>}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <span className="flex-1 min-w-[200px] text-[19px] font-bold">{t.title}</span>
        {t.href
          ? <Link href={t.href} className="h-10 px-4 rounded-xl bg-acc text-onacc text-sm font-bold inline-flex items-center gap-2 hover:text-onacc">{c.isOwner ? 'Aç' : mine?.done ? 'Tekrar çalış' : mine?.started ? 'Devam et' : t.kind === 'list' && t.href.startsWith('/liste/') ? 'Listeyi kopyala' : 'Başla'} <Raw html={I.arrow(15)} /></Link>
          : <span className="text-sm text-faint">Öğretmen bu listenin paylaşımını kapatmış.</span>}
      </div>
      {c.isOwner && (
        <>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="text-mute">Tamamlayan: <b className="text-okt">{sum.done}</b> / {c.members.length}</span>
            <span className="text-mute">Devam eden: <b className="text-prog">{sum.started}</b></span>
            {c.members.length > 0 && <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} className="ml-auto text-sm font-semibold text-acct">{open ? 'Gizle' : 'Öğrenci öğrenci gör'}</button>}
          </div>
          {open && (
            <ul className="m-0 p-0 list-none flex flex-col gap-1.5">
              {c.members.map((m) => {
                const s = t.status[m.userId];
                return (
                  <li key={m.userId} className="flex items-center gap-3 px-3 h-11 rounded-xl bg-s2 border border-line2">
                    <span className="flex-1 min-w-0 truncate text-sm font-medium text-ink">{m.name}</span>
                    <span className="hidden sm:block w-[140px] h-1.5 rounded-full bg-track overflow-hidden"><span className="block h-full rounded-full" style={{ width: (s?.pct || 0) + '%', background: s?.done ? 'rgb(var(--c-ok))' : 'rgb(var(--c-acc))' }} /></span>
                    <StatusPill s={s} />
                  </li>
                );
              })}
            </ul>
          )}
        </>
      )}
    </article>
  );
}

/* ---------- Sınıf ayarları (öğretmen) ---------- */
function Settings({ name, onRename, onDelete }: { name: string; onRename: (n: string) => Promise<unknown>; onDelete: () => void }) {
  const [v, setV] = useState(name);
  useEffect(() => setV(name), [name]);
  return (
    <section className="flex flex-col gap-4 p-5 rounded-2xl border border-line" aria-label="Sınıf ayarları">
      <form onSubmit={(e) => { e.preventDefault(); if (v.trim() && v.trim() !== name) void onRename(v.trim()); }} className="flex flex-wrap gap-3 items-end">
        <label className="flex-1 min-w-[220px] flex flex-col gap-1.5">
          <span className="text-sm text-mute">Sınıfın adı</span>
          <input value={v} onChange={(e) => setV(e.target.value)} maxLength={80} className="h-11 px-3 rounded-xl bg-s2 border border-line3 text-ink outline-none focus:border-acc" />
        </label>
        <button type="submit" disabled={!v.trim() || v.trim() === name} className="h-11 px-5 rounded-xl border border-line3 bg-s2 text-soft font-semibold disabled:opacity-50">Kaydet</button>
      </form>
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-line">
        <span className="text-sm text-mute">Sınıfı silmek öğrencileri, ödevleri ve sınıf ligini kaldırır. Geri alınamaz.</span>
        <button type="button" onClick={onDelete} className="h-11 px-5 rounded-xl border border-badln text-bad font-semibold hover:bg-badbg">Sınıfı sil</button>
      </div>
    </section>
  );
}
