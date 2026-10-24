'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import type { ActRec, ProgressState, Question, SessionUser } from '@/lib/types';
import { mistakeKey, type MistakeItem } from '@/lib/qkey';
import { audioKey, dayKey, esc, makeText, streakOf, type ActView, type TextFns } from '@/lib/text';
import { I } from './icons';

import { SETTINGS_COOKIE, settingsClasses, type Settings } from '@/lib/settings';
export type { Settings };
const LS_KEY = 'arblearn:v1';
const ANON_KEY = 'arblearn:anon';
const MISTAKES_KEY = 'arblearn:mistakes';
const MAX_LOCAL_MISTAKES = 300;

const empty = (): ProgressState => ({ progress: {}, last: null, days: [] });

type Ctx = {
  user: SessionUser | null;
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
  streak: number;
  reset: () => Promise<void>;
  speak: (text: string, rate?: number) => boolean;
  canSpeak: () => boolean;
  toast: (msg: string) => void;
  track: (type: 'view' | 'lesson' | 'activity', data?: Record<string, unknown>) => void;
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
      days: Array.isArray(raw.days) ? raw.days : []
    };
  } catch { return empty(); }
}
function writeLocal(s: ProgressState) {
  try {
    const prev = JSON.parse(localStorage.getItem(LS_KEY) || '{}');
    localStorage.setItem(LS_KEY, JSON.stringify({ ...prev, progress: s.progress, last: s.last, days: s.days }));
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

export function AppProvider({ user, initial, initialSettings, initialMistakes, audios, children }: {
  user: SessionUser | null;
  initial: ProgressState | null;
  initialSettings: Settings;
  initialMistakes: MistakeItem[] | null;
  /** Yüklenmiş ses kayıtları: harekesiz metin anahtarı -> kayıt numarası */
  audios: Record<string, number>;
  children: React.ReactNode;
}) {
  const [settings, setSettings] = useState<Settings>(initialSettings);
  const [state, setState] = useState<ProgressState>(initial ?? empty());
  const [ready, setReady] = useState(!!user);
  const stateRef = useRef(state);
  stateRef.current = state;

  // Misafir: ilerleme localStorage'da
  useEffect(() => {
    if (user) return;
    setState(readLocal());
    setReady(true);
  }, [user]);

  /* ---------- Hatalarım ---------- */
  const [mistakes, setMistakes] = useState<MistakeItem[]>(initialMistakes ?? []);
  useEffect(() => {
    if (user) return;
    try { const l = JSON.parse(localStorage.getItem(MISTAKES_KEY) || '[]'); if (Array.isArray(l)) setMistakes(l); } catch { /* yok */ }
  }, [user]);
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

  /* ---------- Ayarlar (çerezde: sunucu da doğru biçimde çizer) ---------- */
  const setSetting = useCallback(<K extends keyof Settings>(k: K, v: Settings[K]) => {
    setSettings((prev) => {
      const next = { ...prev, [k]: v };
      document.cookie = `${SETTINGS_COOKIE}=${encodeURIComponent(JSON.stringify(next))}; path=/; max-age=31536000; samesite=lax`;
      return next;
    });
  }, []);
  useEffect(() => {
    const on = settingsClasses(settings);
    for (const c of ['no-tl', 'no-en', 'ar-1', 'ar-2']) document.body.classList.toggle(c, on.includes(c));
  }, [settings]);
  const tx = useMemo(() => makeText(settings.harakat), [settings.harakat]);

  /* ---------- Bildirim ---------- */
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const toast = useCallback((msg: string) => {
    setToastMsg(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMsg(null), 4200);
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
  }, [toast, audios]);
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

  const value: Ctx = {
    user, settings, setSetting, tx, state, ready, setLesson, setAct, actState, topicStats, setLast,
    streak: streakOf(state.days), reset, speak, canSpeak, toast, track,
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
