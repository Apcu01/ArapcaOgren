'use client';

/* Canlı yarışma: öğrenci ekranı (telefon). Hesap gerekmez: ad yazıp katılınır */
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { I, Raw } from '../icons';
import { OPTS, OptText, playerKeyOf, post, Prompt, save, Shape, store, useCountdown, usePoll } from './shared';

type Creds = { pid: string; pkey: string; name: string };
type Peek = { title: string; phase: string; players: number; joinable: boolean };
type PlayerState = {
  gone?: boolean; kicked?: boolean;
  v: number; title: string; phase: 'lobby' | 'question' | 'reveal' | 'board' | 'end'; q: number; total: number; seconds: number; remaining: number;
  name: string; score: number; streak: number; place: number; players: number;
  question: { prompt: string; promptTl: string; side: 'ar' | 'tr'; options: string[]; correct: number | null } | null;
  answer: { choice: number; ok: boolean | null; points: number | null } | null;
  podium: { name: string; score: number }[] | null;
};

export default function LivePlayer({ code }: { code: string }) {
  const [creds, setCreds] = useState<Creds | null | undefined>(undefined);
  useEffect(() => { setCreds(store<Creds>(playerKeyOf(code))); }, [code]);
  if (creds === undefined) return null;
  if (!creds) return <Join code={code} onJoined={(c) => { save(playerKeyOf(code), c); setCreds(c); }} />;
  return <Play code={code} creds={creds} onLeave={() => { save(playerKeyOf(code), null); setCreds(null); }} />;
}

function Center({ children }: { children: React.ReactNode }) {
  return <div className="max-w-[520px] mx-auto px-4 py-10 sm:py-16 flex flex-col items-center text-center gap-4">{children}</div>;
}

function Join({ code, onJoined }: { code: string; onJoined: (c: Creds) => void }) {
  const { data: peek, status } = usePoll<Peek>(`/api/live/${code}`, 3000);
  const [name, setName] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  useEffect(() => { try { setName(localStorage.getItem('arblearn:live-name') || ''); } catch { /* yok */ } }, []);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) { setErr('Adını yaz.'); return; }
    setBusy(true); setErr('');
    const r = await post<Creds>(`/api/live/${code}`, { action: 'join', name });
    setBusy(false);
    if (!r.ok) { setErr(r.error); return; }
    try { localStorage.setItem('arblearn:live-name', name.trim()); } catch { /* yok */ }
    onJoined(r.data);
  }
  if (status === 404) {
    return (
      <Center>
        <h1 className="m-0 text-[28px] font-bold">Yarışma bulunamadı</h1>
        <p className="m-0 text-mute">PIN yanlış olabilir ya da yarışma bitmiş olabilir.</p>
        <Link href="/canli" className="h-12 px-6 rounded-xl bg-acc text-onacc font-bold inline-flex items-center hover:text-onacc">PIN'i tekrar gir</Link>
      </Center>
    );
  }
  return (
    <Center>
      <span className="text-[13px] font-semibold tracking-[.12em] uppercase text-lab">Canlı yarışma · PIN {code}</span>
      <h1 className="m-0 text-[30px] font-bold leading-tight">{peek?.title || 'Yarışmaya katıl'}</h1>
      {peek && !peek.joinable ? <p className="m-0 text-bad">Bu yarışmaya şu an katılınamıyor.</p> : (
        <form onSubmit={submit} className="w-full flex flex-col gap-3">
          <label className="flex flex-col gap-1.5 text-left">
            <span className="text-sm font-semibold text-soft">Adın</span>
            <input value={name} onChange={(e) => setName(e.target.value)} maxLength={20} autoFocus autoComplete="nickname" placeholder="Ekranda görünecek ad"
              className="h-14 px-4 rounded-xl bg-s2 border border-line3 text-ink text-lg outline-none focus:border-acc" />
          </label>
          {err && <p className="m-0 text-sm text-bad" role="alert">{err}</p>}
          <button type="submit" disabled={busy} className="h-14 rounded-xl bg-acc text-onacc text-lg font-bold disabled:opacity-60">{busy ? 'Katılıyor' : 'Katıl'}</button>
          <p className="m-0 text-xs text-faint">Hesap açman gerekmez. Adın, öğretmenin ekranında ve sıralamada görünür.</p>
        </form>
      )}
    </Center>
  );
}

function Play({ code, creds, onLeave }: { code: string; creds: Creds; onLeave: () => void }) {
  const url = `/api/live/${code}?p=${encodeURIComponent(creds.pid)}&pk=${encodeURIComponent(creds.pkey)}`;
  const { data: s, at, refresh } = usePoll<PlayerState>(url, 900);
  const left = useCountdown(s?.phase === 'question' ? s.remaining : 0, at);
  // Gönderilen cevap, sunucu onaylayana kadar hemen gösterilir
  const [sent, setSent] = useState<{ q: number; choice: number } | null>(null);
  const [err, setErr] = useState('');

  async function choose(i: number) {
    if (!s || s.phase !== 'question' || s.answer || sent?.q === s.q) return;
    setSent({ q: s.q, choice: i });
    try { navigator.vibrate?.(30); } catch { /* yok */ }
    const r = await post(`/api/live/${code}`, { action: 'answer', pid: creds.pid, pkey: creds.pkey, q: s.q, choice: i });
    if (!r.ok) setErr(r.error);
    refresh();
  }
  useEffect(() => { setErr(''); }, [s?.q]);

  if (!s) return <div className="py-24 text-center text-mute" role="status">Bağlanıyor</div>;
  if (s.kicked || s.gone) {
    return (
      <Center>
        <h1 className="m-0 text-[26px] font-bold">{s.kicked ? 'Öğretmen seni yarışmadan çıkardı' : 'Yarışma sona erdi'}</h1>
        <button type="button" onClick={onLeave} className="h-12 px-6 rounded-xl bg-acc text-onacc font-bold">{s.kicked ? 'Yeniden katıl' : 'Tamam'}</button>
        <Link href="/canli" className="text-soft">Başka bir yarışmaya katıl</Link>
      </Center>
    );
  }

  const head = (
    <div className="w-full flex items-center justify-between gap-3 text-sm">
      <span className="font-bold text-ink truncate">{s.name}</span>
      <span className="text-mute whitespace-nowrap">{s.phase !== 'lobby' ? `${s.place}. sıra · ` : ''}<b className="text-ink tabular-nums">{s.score}</b> puan</span>
    </div>
  );

  if (s.phase === 'lobby') {
    return (
      <Center>
        {head}
        <span className="mt-6 w-16 h-16 rounded-2xl bg-okbg border border-okln text-okt flex items-center justify-center"><Raw html={I.check(30)} /></span>
        <h1 className="m-0 text-[28px] font-bold">Hazırsın!</h1>
        <p className="m-0 text-mute">Adın tahtada görünüyor. Öğretmen başlatınca sorular burada çıkacak.</p>
        <span className="text-sm text-faint">{s.players} kişi katıldı</span>
      </Center>
    );
  }

  if (s.phase === 'question' || s.phase === 'reveal') {
    const q = s.question!;
    const mine = s.answer ?? (sent?.q === s.q ? { choice: sent.choice, ok: null, points: null } : null);
    if (s.phase === 'reveal') {
      const ok = s.answer?.ok;
      return (
        <Center>
          {head}
          <div className={`pop mt-4 w-full flex flex-col items-center gap-2 py-8 rounded-[24px] border ${ok ? 'bg-okbg border-okln' : 'bg-badbg border-badln'}`}>
            <span className={`text-[30px] font-bold ${ok ? 'text-okt' : 'text-bad'}`}>{!s.answer ? 'Süre doldu' : ok ? 'Doğru!' : 'Yanlış'}</span>
            {ok && <span className="text-xl font-bold text-ink">+{s.answer!.points} puan</span>}
            {ok && s.streak >= 2 && <span className="text-sm text-prog font-semibold">{s.streak} doğru üst üste</span>}
          </div>
          {!ok && q.correct != null && (
            <div className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-white" style={{ background: OPTS[q.correct].bg }}>
              <Shape i={q.correct} /><span className="flex-1 text-left"><OptText text={q.options[q.correct]} /></span>
            </div>
          )}
          <p className="m-0 text-mute">{s.place}. sıradasın · {s.players} kişi</p>
        </Center>
      );
    }
    return (
      <div className="max-w-[640px] mx-auto px-4 pt-5 pb-10 flex flex-col gap-4 min-h-[calc(100vh-90px)]">
        {head}
        <div className="h-2 rounded-full bg-track overflow-hidden"><div className="h-full bg-acc transition-[width] duration-100" style={{ width: `${(left / s.seconds) * 100}%` }} /></div>
        <div className="flex flex-col items-center gap-1 py-3">
          <span className="text-xs text-lab font-semibold">Soru {s.q + 1} / {s.total} · {q.side === 'ar' ? 'Anlamı ne?' : 'Arapçası hangisi?'}</span>
          <Prompt text={q.prompt} tl={q.promptTl} side={q.side} size="md" />
        </div>
        {mine ? (
          <div className="pop flex-1 flex flex-col items-center justify-center gap-3 text-center">
            <span className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: OPTS[mine.choice].bg }}><Shape i={mine.choice} size={32} /></span>
            <span className="text-xl font-bold">Cevabın alındı</span>
            <span className="text-mute">Süre bitince sonucu göreceksin.</span>
          </div>
        ) : (
          <div className="flex-1 grid grid-cols-1 min-[420px]:grid-cols-2 gap-3 content-start">
            {q.options.map((o, i) => (
              <button key={i} type="button" onClick={() => choose(i)} disabled={left <= 0}
                className="min-h-[96px] px-4 py-3 rounded-2xl text-white flex items-center gap-3 text-left active:scale-[.98] transition-transform disabled:opacity-60" style={{ background: OPTS[i].bg }}>
                <Shape i={i} /><span className="flex-1"><OptText text={o} /></span>
              </button>
            ))}
          </div>
        )}
        {err && <p className="m-0 text-sm text-bad text-center" role="alert">{err}</p>}
      </div>
    );
  }

  if (s.phase === 'board') {
    return (
      <Center>
        {head}
        <span className="mt-6 text-[64px] font-bold leading-none text-acct">{s.place}.</span>
        <h1 className="m-0 text-[24px] font-bold">sıradasın</h1>
        <p className="m-0 text-mute">{s.score} puan · {s.players} kişi. Sıradaki soru birazdan.</p>
      </Center>
    );
  }

  // Bitiş
  return (
    <Center>
      {head}
      <span className="mt-4 text-[13px] font-semibold tracking-[.12em] uppercase text-lab">Yarışma bitti</span>
      <span className="text-[64px] font-bold leading-none text-acct">{s.place}.</span>
      <p className="m-0 text-lg">{s.players} kişi arasında <b>{s.score}</b> puanla {s.place}. oldun{s.place === 1 ? '. Tebrikler!' : '.'}</p>
      {s.podium && (
        <ol className="m-0 p-0 list-none w-full flex flex-col gap-2">
          {s.podium.map((p, i) => <li key={i} className="flex justify-between px-4 py-3 rounded-xl bg-s4 border border-line3"><span className="font-semibold">{i + 1}. {p.name}</span><b className="tabular-nums">{p.score}</b></li>)}
        </ol>
      )}
      <Link href="/canli" className="h-12 px-6 rounded-xl bg-acc text-onacc font-bold inline-flex items-center hover:text-onacc">Başka bir yarışmaya katıl</Link>
    </Center>
  );
}
