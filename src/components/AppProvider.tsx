'use client';

import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import type { ActRec, ProgressState, Question, SessionUser } from '@/lib/types';
import { mistakeKey, type MistakeItem } from '@/lib/qkey';
import { audioKey, dayKey, esc, makeText, streakOf, type ActView, type TextFns } from '@/lib/text';
import { I } from './icons';

import type { Metric } from '@/lib/metrics';
import { DEFAULT_SETTINGS, parseSettings, SETTINGS_COOKIE, settingsClasses, THEME_COLOR, type Settings } from '@/lib/settings';
export type { Settings };
const LS_KEY = 'arblearn:v1';
const ANON_KEY = 'arblearn:anon';
const MISTAKES_KEY = 'arblearn:mistakes';
const MAX_LOCAL_MISTAKES = 300;
// Oturum gelene kadar başlıkta hesap düğmesi yerine bir an 'Giriş yap' görünmesin diye son üyenin adı
const HINT_KEY = 'arblearn:user-hint';
type UserHint = { name: string };

const empty = (): ProgressState => ({ progress: {}, last: null, days: [], counts: {} });

type Ctx = {
  user: SessionUser | null;
  /** Oturum henüz sunucudan gelmediyse 'loading' */
  session: 'loading' | 'ready';
  /** Oturum gelirken gösterilecek son üye bilgisi (tarayıcıda saklanır) */
  hint: UserHint | null;
  /** Giriş, çıkış ve hesap değişikliklerinden sonra oturumu ve ilerlemeyi yeniden yükler */
  refreshSession: () => Promise<void>;
  settings: Settings;
  setSetting: <K extends keyof Settings>(k: K, v: Settings[K]) => void;
  tx: TextFns;
  state: ProgressState;
  ready: boolean;
  setLesson: (topicId: string) => void;
  setAct: (topicId: string, actKey: string, score: number, done: boolean) => void;
  actState: (topicId: string, actKey: string) => ActRec | null;
  topicStats: (topicId: string, acts: ActView[]) => { done: number; total: number; lesson: boolean; pct: number; started: boolean };
  setLast: (topicId: string) => void;
  /** Kelime listesi çalışıldı: bugünü takvime ve seriye işler (sunucuya liste API'si kaydeder) */
  noteStudy: () => void;
  streak: number;
  reset: () => Promise<void>;
  speak: (text: string, rate?: number) => boolean;
  canSpeak: () => boolean;
  toast: (msg: string) => void;
  track: (type: 'view' | 'lesson' | 'activity', data?: Record<string, unknown>) => void;
  /** Günlük sayaç (dinleme, arama, doğru/yanlış): biriktirilip toplu gönderilir */
  metric: (m: Metric, n?: number) => void;
  mistakes: MistakeItem[];
  addMistake: (topicId: string, q: Question) => void;
  resolveMistake: (topicId: string, q: Question) => void;
  removeMistake: (mkey: string) => void;
  clearMistakes: () => void;
};

const AppCtx = createContext<Ctx | null>(null);
export const useApp = () => {
  const c = useContext(AppCtx);
  if (!c) throw new Error('useApp, AppProvider içinde kullanılmalı');
  return c;
};

function readLocal(): ProgressState {
  try {
    const raw = JSON.parse(localStorage.getItem(LS_KEY) || '{}');
    return {
      progress: raw.progress && typeof raw.progress === 'object' ? raw.progress : {},
      last: raw.last ?? null,
      days: Array.isArray(raw.days) ? raw.days : [],
      counts: raw.counts && typeof raw.counts === 'object' ? raw.counts : {}
    };
  } catch { return empty(); }
}
function writeLocal(s: ProgressState) {
  try {
    const prev = JSON.parse(localStorage.getItem(LS_KEY) || '{}');
    localStorage.setItem(LS_KEY, JSON.stringify({ ...prev, progress: s.progress, last: s.last, days: s.days, counts: s.counts }));
  } catch { /* gizli pencere vb. */ }
}
export function anonId() {
  try {
    let id = localStorage.getItem(ANON_KEY);
    if (!id) { id = crypto.randomUUID(); localStorage.setItem(ANON_KEY, id); }
    return id;
  } catch { return null; }
}

function post(url: string, body: unknown) {
  return fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), keepalive: true })
    .catch(() => null);
}

/* Sayfalar önceden hazırlanır (statik): oturum, ilerleme ve ayarlar sunucuda değil burada, tarayıcıda okunur.
   Ayarlar sayfa çizilmeden önce çerezden uygulanır; oturum /api/me ile gelir. */
export function AppProvider({ audios, children }: {
  /** Yüklenmiş ses kayıtları: harekesiz metin anahtarı -> kayıt numarası */
  audios: Record<string, number>;
  children: React.ReactNode;
}) {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [settingsReady, setSettingsReady] = useState(false);
  const [user, setUser] = useState<SessionUser | null>(null);
  const [session, setSession] = useState<'loading' | 'ready'>('loading');
  const [hint, setHint] = useState<UserHint | null>(null);
  const [state, setState] = useState<ProgressState>(empty());
  const [ready, setReady] = useState(false);
  const stateRef = useRef(state);
  stateRef.current = state;

  // Ayarlar: ekrana çizilmeden önce çerezden (sunucu varsayılan ayarlarla çizer)
  useLayoutEffect(() => {
    setSettings(parseSettings(document.cookie.match(new RegExp('(?:^|; )' + SETTINGS_COOKIE + '=([^;]*)'))?.[1]));
    setSettingsReady(true);
    try { setHint(JSON.parse(localStorage.getItem(HINT_KEY) || 'null')); } catch { /* yok */ }
  }, []);

  /* ---------- Hatalarım ---------- */
  const [mistakes, setMistakes] = useState<MistakeItem[]>([]);

  /* ---------- Oturum: üyeyse ilerleme ve hatalar sunucudan, misafirse tarayıcıdan ---------- */
  const refreshSession = useCallback(async () => {
    const r = await fetch('/api/me', { cache: 'no-store' }).catch(() => null);
    const j = r?.ok ? ((await r.json()) as { user: SessionUser | null; progress?: ProgressState; mistakes?: MistakeItem[] }) : null;
    if (j?.user) {
      setUser(j.user);
      setState(j.progress ?? empty());
      setMistakes(j.mistakes ?? []);
      const h = { name: j.user.name };
      setHint(h);
      try { localStorage.setItem(HINT_KEY, JSON.stringify(h)); } catch { /* yok */ }
    } else {
      setUser(null);
      setState(readLocal());
      try { const l = JSON.parse(localStorage.getItem(MISTAKES_KEY) || '[]'); setMistakes(Array.isArray(l) ? l : []); } catch { setMistakes([]); }
      setHint(null);
      try { localStorage.removeItem(HINT_KEY); } catch { /* yok */ }
    }
    setReady(true);
    setSession('ready');
  }, []);
  useEffect(() => { void refreshSession(); }, [refreshSession]);

  const saveLocalMistakes = (list: MistakeItem[]) => { try { localStorage.setItem(MISTAKES_KEY, JSON.stringify(list)); } catch { /* yok */ } };
  const mistakesRef = useRef(mistakes);
  mistakesRef.current = mistakes;
  const addMistake = useCallback((topicId: string, q: Question) => {
    const { _retry, _topic, ...clean } = q as Question & { _retry?: boolean; _topic?: string };
    void _retry; void _topic;
    const tid = (q as { _topic?: string })._topic || topicId;
    const mkey = mistakeKey(tid, clean);
    setMistakes((prev) => {
      const old = prev.find((m) => m.mkey === mkey);
      const item: MistakeItem = { mkey, topicId: tid, question: clean, count: (old?.count || 0) + 1, at: Date.now() };
      const next = [item, ...prev.filter((m) => m.mkey !== mkey)].slice(0, MAX_LOCAL_MISTAKES);
      if (!user) saveLocalMistakes(next);
      return next;
    });
    if (user) post('/api/mistakes', { action: 'add', mkey, topicId: tid, question: clean });
  }, [user]);
  const removeMistake = useCallback((mkey: string) => {
    if (!mistakesRef.current.some((m) => m.mkey === mkey)) return;
    setMistakes((prev) => { const next = prev.filter((m) => m.mkey !== mkey); if (!user) saveLocalMistakes(next); return next; });
    if (user) post('/api/mistakes', { action: 'resolve', mkey });
  }, [user]);
  const resolveMistake = useCallback((topicId: string, q: Question) => {
    const { _retry, _topic, ...clean } = q as Question & { _retry?: boolean; _topic?: string };
    void _retry;
    removeMistake(mistakeKey(_topic || topicId, clean));
  }, [removeMistake]);
  const clearMistakes = useCallback(() => {
    setMistakes([]);
    if (user) post('/api/mistakes', { action: 'clear' }); else saveLocalMistakes([]);
  }, [user]);

  const commit = useCallback((fn: (s: ProgressState) => ProgressState) => {
    setState((prev) => {
      const next = fn(structuredClone(prev));
      if (!user) writeLocal(next);
      return next;
    });
  }, [user]);

  const studied = (s: ProgressState) => {
    const k = dayKey(new Date());
    if (!s.days.includes(k)) s.days = [...s.days, k].slice(-500);
    s.counts = { ...(s.counts || {}), [k]: (s.counts?.[k] || 0) + 1 };
    return s;
  };

  const setLesson = useCallback((topicId: string) => {
    commit((s) => {
      s.progress[topicId] = s.progress[topicId] || { lesson: false, acts: {} };
      s.progress[topicId].lesson = true;
      return studied(s);
    });
    if (user) post('/api/progress', { action: 'lesson', topicId, day: dayKey(new Date()) });
  }, [commit, user]);

  const setAct = useCallback((topicId: string, actKey: string, score: number, done: boolean) => {
    commit((s) => {
      const p = (s.progress[topicId] = s.progress[topicId] || { lesson: false, acts: {} });
      const prev = p.acts[actKey] || { best: 0, done: false, tries: 0, last: 0 };
      p.acts[actKey] = { best: Math.max(prev.best, score), done: prev.done || done, tries: prev.tries + 1, last: score };
      return studied(s);
    });
    if (user) post('/api/progress', { action: 'act', topicId, actKey, score, done, day: dayKey(new Date()) });
  }, [commit, user]);

  const noteStudy = useCallback(() => commit((s) => studied(s)), [commit]);

  const setLast = useCallback((topicId: string) => {
    if (stateRef.current.last === topicId) return;
    commit((s) => { s.last = topicId; return s; });
    if (user) post('/api/progress', { action: 'last', topicId });
  }, [commit, user]);

  const reset = useCallback(async () => {
    if (user) await post('/api/progress', { action: 'reset' });
    commit(() => empty());
  }, [commit, user]);

  const actState = useCallback((topicId: string, actKey: string) => state.progress[topicId]?.acts[actKey] || null, [state]);

  const topicStats = useCallback((topicId: string, acts: ActView[]) => {
    const p = state.progress[topicId] || { lesson: false, acts: {} };
    const done = acts.filter((a) => p.acts[a.id]?.done).length;
    const total = acts.length + 1;
    const steps = done + (p.lesson ? 1 : 0);
    return { done, total: acts.length, lesson: !!p.lesson, pct: Math.round((steps / total) * 100), started: steps > 0 || Object.keys(p.acts).length > 0 };
  }, [state]);

  /* ---------- Ayarlar (çerezde; ilk çizimde kök düzendeki betik uygular) ---------- */
  const setSetting = useCallback(<K extends keyof Settings>(k: K, v: Settings[K]) => {
    setSettings((prev) => {
      const next = { ...prev, [k]: v };
      document.cookie = `${SETTINGS_COOKIE}=${encodeURIComponent(JSON.stringify(next))}; path=/; max-age=31536000; samesite=lax`;
      return next;
    });
  }, []);
  useEffect(() => {
    if (!settingsReady) return; // ilk çizimde çerezi uygulayan betiğin eklediği sınıflara dokunma
    const on = settingsClasses(settings);
    for (const c of ['no-tl', 'no-en', 'ar-1', 'ar-2']) document.body.classList.toggle(c, on.includes(c));
  }, [settings, settingsReady]);
  // Tema: html etiketindeki data-theme ve tarayıcı çubuğu rengi
  useEffect(() => {
    const root = document.documentElement;
    if (!settingsReady || root.dataset.theme === settings.theme) return;
    root.dataset.theme = settings.theme;
    const light = settings.theme === 'light' || (settings.theme === 'system' && matchMedia('(prefers-color-scheme: light)').matches);
    document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]').forEach((m) => { m.content = light ? THEME_COLOR.light : THEME_COLOR.dark; });
  }, [settings.theme, settingsReady]);
  const tx = useMemo(() => makeText(settings.harakat), [settings.harakat]);

  /* ---------- Bildirim ---------- */
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const toast = useCallback((msg: string) => {
    setToastMsg(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMsg(null), 4200);
  }, []);

  /* ---------- Günlük sayaçlar: 20 saniyede bir ve sekme gizlenirken toplu gönderilir ---------- */
  const counts = useRef<Partial<Record<Metric, number>>>({});
  const metric = useCallback((m: Metric, n = 1) => { counts.current[m] = (counts.current[m] || 0) + n; }, []);
  useEffect(() => {
    const flush = () => {
      const c = counts.current;
      if (!Object.keys(c).length) return;
      counts.current = {};
      post('/api/metrics', { counts: Object.fromEntries(Object.entries(c).map(([k, v]) => [k, Math.min(500, v!)])) });
    };
    const t = setInterval(flush, 20_000);
    const hide = () => { if (document.visibilityState === 'hidden') flush(); };
    document.addEventListener('visibilitychange', hide);
    window.addEventListener('pagehide', flush);
    return () => { clearInterval(t); document.removeEventListener('visibilitychange', hide); window.removeEventListener('pagehide', flush); flush(); };
  }, []);

  /* ---------- Ses (Web Speech API) ---------- */
  const voice = useRef<SpeechSynthesisVoice | null>(null);
  const warned = useRef(false);
  useEffect(() => {
    if (!('speechSynthesis' in window)) return;
    const pick = () => {
      try {
        const vs = speechSynthesis.getVoices();
        voice.current = vs.find((v) => /^ar[-_]SA/i.test(v.lang)) || vs.find((v) => /^ar/i.test(v.lang)) || null;
      } catch { voice.current = null; }
    };
    pick();
    speechSynthesis.onvoiceschanged = pick;
  }, []);
  const canSpeak = useCallback(() => !!voice.current, []);
  const audioEl = useRef<HTMLAudioElement | null>(null);
  const speak = useCallback((text: string, rate = 0.8) => {
    metric('word_listen');
    // Önce yönetim panelinden yüklenmiş gerçek ses kaydı
    const rec = audios[audioKey(text)];
    if (rec) {
      try { speechSynthesis.cancel(); } catch { /* yok */ }
      audioEl.current?.pause();
      audioEl.current = new Audio('/api/audio/' + rec);
      audioEl.current.play().catch(() => null);
      return true;
    }
    if (!('speechSynthesis' in window)) { toast('Tarayıcın sesli okumayı desteklemiyor.'); return false; }
    try {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'ar-SA';
      if (voice.current) u.voice = voice.current;
      u.rate = rate;
      speechSynthesis.speak(u);
    } catch { return false; }
    if (!voice.current && !warned.current) {
      warned.current = true;
      toast('Bu cihazda Arapça ses bulunamadı. Edge tarayıcısı ya da işletim sisteminin Arapça ses paketi en iyi sonucu verir.');
    }
    return true;
  }, [toast, audios, metric]);
  // data-say özniteliği taşıyan her düğme (zengin içerikteki tablolar dahil) sesli okur
  useEffect(() => {
    const h = (e: MouseEvent) => {
      const b = (e.target as HTMLElement).closest<HTMLElement>('[data-say]');
      if (b) { e.preventDefault(); e.stopPropagation(); speak(b.dataset.say || ''); }
    };
    document.addEventListener('click', h);
    return () => document.removeEventListener('click', h);
  }, [speak]);

  /* ---------- Site istatistikleri ---------- */
  const track = useCallback((type: 'view' | 'lesson' | 'activity', data: Record<string, unknown> = {}) => {
    post('/api/events', { type, anonId: anonId(), ...data });
  }, []);
  const pathname = usePathname();
  useEffect(() => {
    // Konu sayfaları TopicView içinde ders kimliğiyle ayrıca sayılır
    if (!pathname || pathname.startsWith('/admin') || pathname === '/konu') return;
    track('view', { path: pathname });
  }, [pathname, track]);

  /* ---------- Şu an sitede: görünür sekme dakikada bir sinyal gönderir (yönetim sayfaları hariç) ---------- */
  useEffect(() => {
    if (!pathname || pathname.startsWith('/admin')) return;
    const ping = () => {
      if (document.visibilityState !== 'visible') return;
      post('/api/presence', { anonId: anonId(), path: (location.pathname + location.search).slice(0, 200) });
    };
    ping();
    const t = setInterval(ping, 60_000);
    document.addEventListener('visibilitychange', ping);
    return () => { clearInterval(t); document.removeEventListener('visibilitychange', ping); };
  }, [pathname]);

  const value: Ctx = {
    user, session, hint, refreshSession, settings, setSetting, tx, state, ready, setLesson, setAct, actState, topicStats, setLast,
    streak: streakOf(state.days), noteStudy, reset, speak, canSpeak, toast, track, metric,
    mistakes, addMistake, resolveMistake, removeMistake, clearMistakes
  };

  return (
    <AppCtx.Provider value={value}>
      {children}
      <div
        id="toast"
        role="status"
        className="fixed left-1/2 -translate-x-1/2 bottom-6 z-[90] max-w-[92vw] w-[440px] px-5 py-4 rounded-2xl bg-s5 border border-line3 text-sm text-ink shadow-2xl transition-opacity duration-200 pointer-events-none"
        style={{ opacity: toastMsg ? 1 : 0 }}
      >
        {toastMsg}
      </div>
    </AppCtx.Provider>
  );
}

/** Arapça metin: ayarlara göre harekeli/harekesiz */
export function Ar({ t, className = '' }: { t: string; className?: string }) {
  const { tx } = useApp();
  return <span className={`ar ${className}`} lang="ar" dir="rtl">{tx.showAr(t)}</span>;
}

/** Sesli dinleme düğmesi (eski sayBtn) */
export function SayBtn({ text, cls = '', size = 18 }: { text: string; cls?: string; size?: number }) {
  return (
    <button
      type="button"
      data-say={text}
      aria-label="Sesli dinle"
      title="Dinle"
      className={`inline-flex items-center justify-center shrink-0 w-10 h-10 rounded-full border border-line3 bg-chip text-acct hover:text-ink hover:border-lineh ${cls}`}
      dangerouslySetInnerHTML={{ __html: I.speaker(size) }}
    />
  );
}
export const sayBtnHtml = (text: string, cls = '', size = 18) =>
  `<button type="button" data-say="${esc(text)}" aria-label="Sesli dinle" title="Dinle" class="inline-flex items-center justify-center shrink-0 w-10 h-10 rounded-full border border-line3 bg-chip text-acct hover:text-ink hover:border-lineh ${cls}">${I.speaker(size)}</button>`;
