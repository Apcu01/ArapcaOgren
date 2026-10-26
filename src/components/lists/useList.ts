'use client';

/* Kelime listesi verisi ve çalışma sonuçlarının kaydı */
import { useCallback, useEffect, useRef, useState } from 'react';
import { useApp } from '../AppProvider';
import { dayKey } from '@/lib/text';
import type { GameKey, ListItem, WordList } from '@/lib/study';

export type LoadState = { status: 'loading' } | { status: 'login' } | { status: 'missing' } | { status: 'error' } | { status: 'ready'; list: WordList };

export async function jsonFetch<T>(url: string, init?: RequestInit): Promise<{ ok: true; data: T } | { ok: false; status: number; error: string }> {
  try {
    const r = await fetch(url, { ...init, headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) } });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) return { ok: false, status: r.status, error: (j as { error?: string }).error || 'Bir sorun oluştu. Tekrar dene.' };
    return { ok: true, data: j as T };
  } catch {
    return { ok: false, status: 0, error: 'Bağlantı kurulamadı. İnternetini kontrol et.' };
  }
}

// Gönderilmekte olan çalışma kayıtları: liste sayfası açılırken önce bunlar bitsin (yoksa eski durum görünür)
let pending: Promise<unknown> = Promise.resolve();

/** Listeyi yükler; oturum gelmeden istek atılmaz */
export function useList(id: number) {
  const { user, session } = useApp();
  const [state, setState] = useState<LoadState>({ status: 'loading' });
  const load = useCallback(async () => {
    await pending;
    const r = await jsonFetch<{ list: WordList }>(`/api/lists/${id}`);
    if (r.ok) setState({ status: 'ready', list: r.data.list });
    else setState({ status: r.status === 401 ? 'login' : r.status === 404 ? 'missing' : 'error' });
  }, [id]);
  useEffect(() => {
    if (session === 'loading') return;
    if (!user) { setState({ status: 'login' }); return; }
    load();
  }, [session, user, load]);
  const update = useCallback((fn: (l: WordList) => WordList) => {
    setState((s) => (s.status === 'ready' ? { status: 'ready', list: fn(s.list) } : s));
  }, []);
  return { state, reload: load, update };
}

/** Çalışma kaydı: cevaplar biriktirilip toplu gönderilir (sayfa kapanırken de) */
export function useStudy(listId: number, update: (fn: (l: WordList) => WordList) => void) {
  const { noteStudy, metric } = useApp();
  const buf = useRef<{ id: number; ok: boolean }[]>([]);
  const noted = useRef(false);

  const flush = useCallback(() => {
    if (!buf.current.length) return;
    const results = buf.current.splice(0, 300);
    const req = fetch(`/api/lists/${listId}/study`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, keepalive: true,
      body: JSON.stringify({ action: 'answers', results, day: dayKey(new Date()) })
    }).catch(() => null);
    pending = Promise.all([pending, req]);
  }, [listId]);

  useEffect(() => {
    const t = setInterval(flush, 8000);
    window.addEventListener('pagehide', flush);
    return () => { clearInterval(t); window.removeEventListener('pagehide', flush); flush(); };
  }, [flush]);

  const touch = useCallback(() => {
    if (noted.current) return;
    noted.current = true;
    noteStudy();
  }, [noteStudy]);

  /** Kelimenin öğrenilme durumuna sayılan cevap (Kartlar, Öğren, Test) */
  const answer = useCallback((itemId: number, ok: boolean) => {
    buf.current.push({ id: itemId, ok });
    metric(ok ? 'correct' : 'wrong');
    touch();
    update((l) => ({
      ...l,
      items: l.items.map((it) => it.id !== itemId ? it : ok
        ? { ...it, correct: it.correct + 1, streak: it.streak + 1 }
        : { ...it, wrong: it.wrong + 1, streak: 0 })
    }));
    if (buf.current.length >= 10) flush();
  }, [flush, metric, touch, update]);

  /** Oyunlardaki cevaplar: yalnızca günlük sayaç, kelime durumu değişmez */
  const gameAnswer = useCallback((ok: boolean) => { metric(ok ? 'correct' : 'wrong'); touch(); }, [metric, touch]);

  const star = useCallback((it: ListItem) => {
    const on = !it.starred;
    update((l) => ({ ...l, items: l.items.map((x) => (x.id === it.id ? { ...x, starred: on } : x)) }));
    fetch(`/api/lists/${listId}/study`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'star', itemId: it.id, on }) }).catch(() => null);
  }, [listId, update]);

  /** Oyun sonucu; yeni rekorsa true */
  const best = useCallback(async (game: GameKey, value: number) => {
    touch();
    const r = await jsonFetch<{ record: boolean; best: number }>(`/api/lists/${listId}/study`, {
      method: 'POST', body: JSON.stringify({ action: 'best', game, value: Math.round(value), day: dayKey(new Date()) })
    });
    if (!r.ok) return null;
    update((l) => ({ ...l, best: { ...l.best, [game]: r.data.best } }));
    return r.data;
  }, [listId, touch, update]);

  return { answer, gameAnswer, star, best, flush };
}
