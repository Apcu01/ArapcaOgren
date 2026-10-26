'use client';

/* Çalışma modu sayfası: listeyi yükler, ortak ayarları (yön, yıldızlılar) gösterir ve modu açar */
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { I, Raw } from '../icons';
import { useList, useStudy } from './useList';
import { Loading, LoginNeeded, Missing } from './parts';
import { MIN_ITEMS } from './ListOverview';
import { DIR_LABEL, MODES, type Dir, type ListItem, type ModeKey, type WordList } from '@/lib/study';

export type StudyOpts = { dir: Dir; starred: boolean; write: boolean };
export type ModeProps = {
  list: WordList;
  items: ListItem[];
  opts: StudyOpts;
  study: ReturnType<typeof useStudy>;
};

const Loader = () => <Loading />;
const VIEWS: Record<ModeKey, React.ComponentType<ModeProps>> = {
  kartlar: dynamic(() => import('./modes/Flashcards'), { loading: Loader }),
  ogren: dynamic(() => import('./modes/Learn'), { loading: Loader }),
  test: dynamic(() => import('./modes/TestMode'), { loading: Loader }),
  eslestir: dynamic(() => import('./modes/Match'), { loading: Loader }),
  blast: dynamic(() => import('./modes/Blast'), { loading: Loader }),
  bloklar: dynamic(() => import('./modes/Blocks'), { loading: Loader }),
  tilsim: dynamic(() => import('./modes/Charms'), { loading: Loader })
};

const OPTS_KEY = 'arblearn:study-opts';
const DEFAULT_OPTS: StudyOpts = { dir: 'ar', starred: false, write: true };

export default function StudyShell({ id, mode }: { id: number; mode: ModeKey }) {
  const { state, update } = useList(id);
  if (state.status === 'loading') return <Loading />;
  if (state.status === 'login') return <LoginNeeded />;
  if (state.status !== 'ready') return <Missing />;
  return <Shell list={state.list} update={update} mode={mode} />;
}

function Shell({ list, update, mode }: { list: WordList; update: (fn: (l: WordList) => WordList) => void; mode: ModeKey }) {
  const study = useStudy(list.id, update);
  const [opts, setOpts] = useState<StudyOpts>(DEFAULT_OPTS);
  const [ready, setReady] = useState(false);
  const [menu, setMenu] = useState(false);
  // Oturum boyunca yeniden başlatmak için: ayar değişince mod sıfırdan açılır
  const [run, setRun] = useState(0);
  const wrap = useRef<HTMLDivElement>(null);
  useEffect(() => {
    try { setOpts({ ...DEFAULT_OPTS, ...JSON.parse(localStorage.getItem(OPTS_KEY) || '{}') }); } catch { /* depolama kapalı */ }
    setReady(true);
  }, []);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (wrap.current && !e.composedPath().includes(wrap.current)) setMenu(false); };
    document.addEventListener('click', h);
    return () => document.removeEventListener('click', h);
  }, []);
  const setOpt = <K extends keyof StudyOpts>(k: K, v: StudyOpts[K]) => {
    const next = { ...opts, [k]: v };
    setOpts(next);
    setRun((r) => r + 1);
    try { localStorage.setItem(OPTS_KEY, JSON.stringify(next)); } catch { /* depolama kapalı */ }
  };

  const m = MODES.find((x) => x.key === mode)!;
  const starredItems = list.items.filter((x) => x.starred);
  const useStar = opts.starred && starredItems.length >= MIN_ITEMS[mode];
  // Kelimeler her başlatmada bir kez seçilir: çalışırken yıldız ya da ilerleme değişince mod baştan başlamaz
  const snap = useRef<{ run: number; items: ListItem[] } | null>(null);
  if (ready && snap.current?.run !== run) snap.current = { run, items: useStar ? starredItems : list.items };
  const pool = snap.current?.items ?? [];
  const View = VIEWS[mode];
  const enough = list.items.length >= MIN_ITEMS[mode];

  return (
    <div className="max-w-[1000px] mx-auto px-4 sm:px-6 pt-6 pb-20 flex flex-col gap-6">
      <div className="flex items-center gap-3 flex-wrap">
        <Link href={`/listelerim/${list.id}`} className="inline-flex items-center gap-2 text-sm text-mute hover:text-ink min-w-0"><Raw html={I.back()} /> <span className="truncate max-w-[40vw]">{list.title}</span></Link>
        <span className="flex-1" />
        <div className="relative" ref={wrap}>
          <button type="button" onClick={() => setMenu(!menu)} aria-expanded={menu} className="h-10 px-4 rounded-xl border border-line3 bg-s2 text-soft text-sm font-semibold inline-flex items-center gap-2 hover:text-ink hover:border-lineh">
            <Raw html={I[m.icon](17)} /> {m.name} <Raw html={I.down(14)} />
          </button>
          {menu && (
            <div className="absolute right-0 top-12 z-50 w-[300px] p-4 rounded-2xl bg-s4 border border-line3 shadow-2xl flex flex-col gap-4">
              <nav aria-label="Modlar" className="grid grid-cols-2 gap-1">
                {MODES.map((x) => (
                  <Link key={x.key} href={`/listelerim/${list.id}/${x.key}`} aria-current={x.key === mode ? 'page' : undefined}
                    className={`flex items-center gap-2 px-3 h-10 rounded-lg text-sm font-semibold ${x.key === mode ? 'bg-s5 text-ink' : 'text-soft hover:text-ink hover:bg-s5'}`}>
                    <Raw html={I[x.icon](16)} /> {x.name}
                  </Link>
                ))}
              </nav>
              <div className="flex flex-col gap-2 border-t border-line pt-3">
                <span className="text-xs font-bold tracking-[.1em] uppercase text-lab">Soru yönü</span>
                <div role="radiogroup" aria-label="Soru yönü" className="grid gap-1 p-1 rounded-xl bg-s2 border border-line3">
                  {(Object.keys(DIR_LABEL) as Dir[]).map((d) => (
                    <button key={d} type="button" role="radio" aria-checked={opts.dir === d} onClick={() => setOpt('dir', d)}
                      className={`h-9 rounded-lg text-[13px] font-semibold ${opts.dir === d ? 'bg-acc text-onacc' : 'text-soft hover:text-ink'}`}>{DIR_LABEL[d]}</button>
                  ))}
                </div>
              </div>
              <label className="flex items-center justify-between gap-3 cursor-pointer">
                <span className="flex flex-col"><span className="text-[15px] font-semibold text-ink">Yalnız yıldızlılar</span>
                  <span className="text-xs text-faint">{starredItems.length} yıldızlı kelime{starredItems.length < MIN_ITEMS[mode] ? ` (en az ${MIN_ITEMS[mode]} gerekir)` : ''}</span></span>
                <input type="checkbox" checked={opts.starred} onChange={(e) => setOpt('starred', e.target.checked)} className="w-5 h-5 accent-acc" />
              </label>
              {(mode === 'ogren' || mode === 'bloklar' || mode === 'tilsim') && (
                <label className="flex items-center justify-between gap-3 cursor-pointer">
                  <span className="flex flex-col"><span className="text-[15px] font-semibold text-ink">Yazılı sorular</span><span className="text-xs text-faint">Cevabı yazarak ver</span></span>
                  <input type="checkbox" checked={opts.write} onChange={(e) => setOpt('write', e.target.checked)} className="w-5 h-5 accent-acc" />
                </label>
              )}
            </div>
          )}
        </div>
      </div>
      {!ready ? <Loading /> : enough
        ? <View key={run} list={list} items={pool} opts={opts} study={study} />
        : <p className="text-mute">Bu mod için listede en az {MIN_ITEMS[mode]} kelime olmalı.</p>}
    </div>
  );
}
