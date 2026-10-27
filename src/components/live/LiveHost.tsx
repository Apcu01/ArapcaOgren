'use client';

/* Canlı yarışma: öğretmen ekranı (tahtaya yansıtılır) */
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useApp } from '../AppProvider';
import { I, Raw } from '../icons';
import QrCode from './QrCode';
import ReportView from './ReportView';
import { music, sfx, unlock } from './sound';
import type { LiveReport } from '@/lib/live-report';
import { hostKeyOf, OPTS, OptText, post, Prompt, Ring, Shape, store, useCountdown, usePoll } from './shared';

type HostState = {
  v: number; code: string; title: string; phase: 'lobby' | 'question' | 'reveal' | 'board' | 'end'; q: number; total: number; seconds: number; remaining: number;
  question: { prompt: string; promptTl: string; side: 'ar' | 'tr'; options: string[]; say: string; correct: number | null } | null;
  answered: number; counts: number[] | null;
  players: { id: string; name: string; score: number; streak: number; last: number | null }[];
  report: LiveReport | null; saved: boolean;
};

export default function LiveHost({ code }: { code: string }) {
  const [key, setKey] = useState<string | null | undefined>(undefined);
  useEffect(() => { setKey(store<string>(hostKeyOf(code))); }, [code]);
  if (key === undefined) return null;
  if (!key) {
    return (
      <div className="max-w-[560px] mx-auto px-4 py-16 flex flex-col items-center text-center gap-4">
        <h1 className="m-0 text-[28px] font-bold">Bu yarışmayı yönetemiyorsun</h1>
        <p className="m-0 text-mute">Yarışma başka bir tarayıcıda açılmış. Öğrenci olarak katılmak için PIN ile gir.</p>
        <Link href={`/canli/${code}`} className="h-11 px-5 rounded-xl bg-acc text-onacc font-bold inline-flex items-center hover:text-onacc">Öğrenci olarak katıl</Link>
      </div>
    );
  }
  return <Host code={code} hostKey={key} />;
}

function Host({ code, hostKey }: { code: string; hostKey: string }) {
  const { speak, toast, user } = useApp();
  const { data: s, status, at, refresh } = usePoll<HostState>(`/api/live/${code}?k=${encodeURIComponent(hostKey)}`, 800);
  const left = useCountdown(s?.phase === 'question' ? s.remaining : 0, at);
  const audio = useLiveAudio(s, left);
  const [busy, setBusy] = useState(false);
  const [origin, setOrigin] = useState('');
  const [qr, setQr] = useState(false);
  // Karekod doğrudan ad yazma ekranını açar (PIN yazmaya gerek kalmaz)
  const joinUrl = origin ? `${origin}/canli/${code}` : '';
  useEffect(() => { setOrigin(location.origin); }, []);

  async function act(action: 'start' | 'next' | 'skip' | 'kick' | 'end', pid?: string) {
    setBusy(true);
    const r = await post(`/api/live/${code}`, { action, k: hostKey, pid });
    setBusy(false);
    if (!r.ok) toast(r.error);
    refresh();
  }

  if (status === 404) {
    return (
      <div className="max-w-[560px] mx-auto px-4 py-16 flex flex-col items-center text-center gap-4">
        <h1 className="m-0 text-[28px] font-bold">Yarışma sona erdi</h1>
        <p className="m-0 text-mute">Uzun süre işlem yapılmadığı ya da sunucu yeniden başladığı için yarışma kapandı.</p>
        <Link href="/canli" className="h-11 px-5 rounded-xl bg-acc text-onacc font-bold inline-flex items-center hover:text-onacc">Yeni yarışma aç</Link>
      </div>
    );
  }
  if (!s) return <div className="py-24 text-center text-mute" role="status">Yükleniyor</div>;

  const bar = (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-col min-w-0">
        <span className="text-[13px] font-semibold tracking-[.12em] uppercase text-lab">Canlı yarışma · PIN {code}</span>
        <span className="text-lg font-bold truncate">{s.title}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-mute">{s.players.length} kişi</span>
        <button type="button" onClick={() => audio.set('sfx', !audio.sfx)} aria-pressed={audio.sfx} title="Ses efektleri" className={`h-10 px-3 rounded-xl border text-sm font-semibold inline-flex items-center gap-1.5 ${audio.sfx ? 'border-line3 bg-s2 text-soft hover:text-ink' : 'border-line3 text-faint line-through'}`}><Raw html={I.speaker(15)} /> Ses</button>
        <button type="button" onClick={() => audio.set('music', !audio.music)} aria-pressed={audio.music} title="Müzik" className={`h-10 px-3 rounded-xl border text-sm font-semibold ${audio.music ? 'border-line3 bg-s2 text-soft hover:text-ink' : 'border-line3 text-faint line-through'}`}>Müzik</button>
        {s.phase !== 'lobby' && s.phase !== 'end' && <button type="button" onClick={() => setQr(true)} className="h-10 px-4 rounded-xl border border-line3 bg-s2 text-soft text-sm font-semibold hover:text-ink">Katılma karekodu</button>}
        {s.phase !== 'end' && <button type="button" disabled={busy} onClick={() => { if (confirm('Yarışma bitirilsin mi? Sonuçlar gösterilir.')) act('end'); }} className="h-10 px-4 rounded-xl text-soft text-sm font-semibold hover:text-ink">Yarışmayı bitir</button>}
      </div>
    </div>
  );
  // Yarışma sürerken geç gelenler için
  const qrDialog = qr && joinUrl && (
    <div className="fixed inset-0 z-[95] bg-black/70 flex items-center justify-center p-4" onClick={() => setQr(false)} onKeyDown={(e) => { if (e.key === 'Escape') setQr(false); }}>
      <div role="dialog" aria-modal="true" aria-label="Katılma karekodu" className="pop flex flex-col items-center gap-4 p-8 rounded-[28px] bg-s4 border border-line3 text-center">
        <QrCode text={joinUrl} size={360} label={`Yarışmaya katılma bağlantısı: ${joinUrl}`} />
        <span className="text-[44px] font-bold tracking-[.12em] tabular-nums">{code.slice(0, 3)} {code.slice(3)}</span>
        <button type="button" autoFocus onClick={() => setQr(false)} className="h-11 px-6 rounded-xl bg-acc text-onacc font-bold">Kapat</button>
      </div>
    </div>
  );

  if (s.phase === 'lobby') {
    const join = origin ? `${origin.replace(/^https?:\/\//, '')}/canli` : '';
    return (
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-6 pb-16 flex flex-col gap-8">
        {bar}
        {qrDialog}
        <section className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 py-8 px-6 rounded-[28px] bg-s4 border border-line3">
          {joinUrl && (
            <div className="flex flex-col items-center gap-2">
              <QrCode text={joinUrl} size={260} label={`Yarışmaya katılma bağlantısı: ${joinUrl}`} />
              <span className="text-sm text-soft">Telefonun kamerasıyla okut</span>
            </div>
          )}
          <div className="flex flex-col items-center text-center gap-3">
            <span className="text-lg text-soft">ya da <b className="text-ink">{join}</b> adresine gir ve PIN'i yaz</span>
            <span className="text-[64px] sm:text-[96px] font-bold tracking-[.12em] leading-none tabular-nums text-ink" aria-label={`PIN ${code.split('').join(' ')}`}>{code.slice(0, 3)} {code.slice(3)}</span>
            <span className="text-sm text-mute">{s.total} soru · her soru {s.seconds} saniye · hesap açmak gerekmez</span>
          </div>
        </section>
        <section className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="m-0 text-xl font-bold">Katılanlar ({s.players.length})</h2>
            <button type="button" disabled={busy || !s.players.length} onClick={() => act('start')} className="h-14 px-8 rounded-2xl bg-acc text-onacc text-lg font-bold disabled:opacity-50 inline-flex items-center gap-2">
              <Raw html={I.play(18)} /> Başlat
            </button>
          </div>
          {!s.players.length && <p className="m-0 text-mute">Öğrenciler katıldıkça adları burada görünür.</p>}
          <div className="flex flex-wrap gap-2.5">
            {s.players.map((p) => (
              <button key={p.id} type="button" title="Çıkarmak için dokun" onClick={() => { if (confirm(`${p.name} yarışmadan çıkarılsın mı?`)) act('kick', p.id); }}
                className="pop px-4 h-11 rounded-full bg-s4 border border-line3 text-ink font-semibold hover:border-badln hover:text-bad">{p.name}</button>
            ))}
          </div>
        </section>
      </div>
    );
  }

  if (s.phase === 'board' || s.phase === 'end') {
    const top = s.players.slice(0, s.phase === 'end' ? 3 : 5);
    return (
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 pt-6 pb-16 flex flex-col gap-8">
        {bar}
        {qrDialog}
        <h1 className="m-0 text-center text-[34px] sm:text-[44px] font-bold">{s.phase === 'end' ? 'Kazananlar' : 'Sıralama'}</h1>
        {s.phase === 'end' ? (
          <div className="flex items-end justify-center gap-3 sm:gap-6">
            {[1, 0, 2].map((i) => top[i] && (
              <div key={i} className="pop flex flex-col items-center gap-2 w-[30%] max-w-[220px]">
                <span className="font-bold text-lg text-center truncate max-w-full">{top[i].name}</span>
                <span className="text-sm text-mute">{top[i].score} puan</span>
                <div className={`w-full rounded-t-2xl flex items-start justify-center pt-3 text-[40px] font-bold text-onacc ${i === 0 ? 'h-48 bg-acc' : i === 1 ? 'h-36 bg-acc/75' : 'h-28 bg-acc/55'}`}>{i + 1}</div>
              </div>
            ))}
          </div>
        ) : (
          <ol className="m-0 p-0 list-none flex flex-col gap-2.5 max-w-[680px] w-full mx-auto">
            {top.map((p, i) => (
              <li key={p.id} className="pop flex items-center gap-4 px-5 h-16 rounded-2xl bg-s4 border border-line3">
                <span className="w-9 text-2xl font-bold text-acct">{i + 1}</span>
                <span className="flex-1 font-bold text-lg truncate">{p.name}{p.streak >= 3 && <span className="ml-2 text-sm text-prog font-semibold">{p.streak} doğru üst üste</span>}</span>
                {p.last ? <span className="text-sm text-okt font-semibold">+{p.last}</span> : null}
                <span className="w-20 text-right text-xl font-bold tabular-nums">{p.score}</span>
              </li>
            ))}
          </ol>
        )}
        <div className="flex justify-center gap-3">
          {s.phase === 'board'
            ? <button type="button" disabled={busy} onClick={() => act('next')} className="h-14 px-8 rounded-2xl bg-acc text-onacc text-lg font-bold">Sonraki soru</button>
            : <Link href="/canli" className="h-14 px-8 rounded-2xl bg-acc text-onacc text-lg font-bold inline-flex items-center hover:text-onacc">Yeni yarışma</Link>}
        </div>
        {s.phase === 'end' && s.report && s.report.questions.length > 0 && (
          <>
            <p className="m-0 text-center text-sm text-mute">
              {s.saved ? <>Sonuçlar <Link href="/canli/gecmis">Geçmiş yarışmalarım</Link> sayfasına kaydedildi.</>
                : user ? 'Sonuçlar kaydediliyor.' : 'Giriş yapmadan açılan yarışmanın sonuçları saklanmaz; sayfadan çıkmadan önce Excel\'e indirebilirsin.'}
            </p>
            <ReportView report={s.report} />
          </>
        )}
      </div>
    );
  }

  // Soru ve cevap
  const q = s.question!;
  const reveal = s.phase === 'reveal';
  const max = Math.max(1, ...(s.counts || [0]));
  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-6 pb-16 flex flex-col gap-6">
      {bar}
      {qrDialog}
      <div className="flex items-center justify-between gap-4">
        <span className="text-lg font-semibold text-soft">Soru {s.q + 1} / {s.total}</span>
        {reveal ? <span className="text-lg font-semibold text-soft">{s.answered} / {s.players.length} cevap</span> : <Ring left={left} total={s.seconds} />}
        {reveal
          ? <button type="button" disabled={busy} onClick={() => act('next')} className="h-12 px-6 rounded-xl bg-acc text-onacc font-bold">{s.q + 1 >= s.total ? 'Sonuçlar' : 'Sıralama'}</button>
          : <span className="flex items-center gap-3"><span className="text-lg font-semibold">{s.answered} / {s.players.length}</span><button type="button" disabled={busy} onClick={() => act('skip')} className="h-11 px-4 rounded-xl border border-line3 bg-s2 text-soft text-sm font-semibold hover:text-ink">Süreyi bitir</button></span>}
      </div>
      <section className="flex flex-col items-center gap-3 py-8 px-4 rounded-[28px] bg-s4 border border-line3 min-h-[200px] justify-center">
        <span className="text-sm text-lab font-semibold">{q.side === 'ar' ? 'Anlamı ne?' : 'Arapçası hangisi?'}</span>
        <span className="flex items-center gap-4">
          <Prompt text={q.prompt} tl={q.promptTl} side={q.side} />
          {q.side === 'ar' && <button type="button" onClick={() => speak(q.say)} aria-label="Sesli dinle" className="w-12 h-12 rounded-full bg-chip border border-line3 text-acct flex items-center justify-center hover:text-ink"><Raw html={I.speaker(20)} /></button>}
        </span>
      </section>
      <div className="grid gap-3 sm:grid-cols-2">
        {q.options.map((o, i) => {
          const right = reveal && q.correct === i;
          return (
            <div key={i} className={`relative flex items-center gap-4 min-h-[88px] px-5 py-3 rounded-2xl text-white transition-opacity ${reveal && !right ? 'opacity-35' : ''}`} style={{ background: OPTS[i].bg }}>
              <Shape i={i} size={30} />
              <span className="flex-1"><OptText text={o} big /></span>
              {reveal && <span className="flex items-center gap-2 text-lg font-bold">{right && <Raw html={I.check(22)} />}{s.counts?.[i] ?? 0}</span>}
              {reveal && <span className="absolute left-0 bottom-0 h-1.5 rounded-bl-2xl bg-white/70" style={{ width: `${((s.counts?.[i] ?? 0) / max) * 100}%` }} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const AUDIO_KEY = 'arblearn:live-audio';

/** Öğretmen ekranının sesleri: durum değiştikçe efekt, bekleme ve soru sırasında müzik */
function useLiveAudio(s: HostState | null, left: number) {
  const [pref, setPref] = useState({ sfx: true, music: true });
  useEffect(() => { try { setPref({ sfx: true, music: true, ...JSON.parse(localStorage.getItem(AUDIO_KEY) || '{}') }); } catch { /* yok */ } }, []);
  const set = (k: 'sfx' | 'music', v: boolean) => {
    unlock();
    const next = { ...pref, [k]: v };
    setPref(next);
    try { localStorage.setItem(AUDIO_KEY, JSON.stringify(next)); } catch { /* yok */ }
  };
  // Tarayıcı, ses için bir dokunuş bekler
  useEffect(() => {
    const h = () => unlock();
    document.addEventListener('pointerdown', h);
    return () => document.removeEventListener('pointerdown', h);
  }, []);
  const prev = useRef<{ phase?: string; q?: number; players?: number; sec?: number }>({});
  useEffect(() => {
    if (!s) return;
    const p = prev.current;
    if (pref.sfx) {
      if (s.phase === 'lobby' && p.players != null && s.players.length > p.players) sfx.join();
      if (s.phase === 'question' && (p.phase !== 'question' || p.q !== s.q)) sfx.start();
      if (s.phase !== p.phase && p.phase) {
        if (s.phase === 'reveal') sfx.reveal();
        else if (s.phase === 'board') sfx.board();
        else if (s.phase === 'end') sfx.fanfare();
      }
    }
    prev.current = { ...p, phase: s.phase, q: s.q, players: s.players.length };
  }, [s, pref.sfx]);
  // Son 5 saniye
  const sec = Math.ceil(left);
  useEffect(() => {
    if (!pref.sfx || s?.phase !== 'question' || sec > 5 || sec < 1 || prev.current.sec === sec) return;
    prev.current.sec = sec;
    sfx.tick(sec === 1);
  }, [sec, s?.phase, pref.sfx]);
  const playing = pref.music && (s?.phase === 'lobby' || s?.phase === 'question');
  useEffect(() => { music(!!playing); }, [playing]);
  useEffect(() => () => music(false), []);
  return { ...pref, set };
}
