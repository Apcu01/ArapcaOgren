'use client';

/* Liste sayfası: çalışma modları, ilerleme durumu ve kelimeler */
import Link from 'next/link';
import { useState } from 'react';
import { Ar, SayBtn, useApp } from '../AppProvider';
import { I, Raw } from '../icons';
import { jsonFetch, useList, useStudy } from './useList';
import { Loading, LoginNeeded, Missing } from './parts';
import ShareButton from './ShareDialog';
import { fmtTime, MODES, STATUS_LABEL, statusOf, type ModeKey, type Status, type WordList } from '@/lib/study';

/** Modların çalışması için gereken en az kelime sayısı */
export const MIN_ITEMS: Record<ModeKey, number> = { kartlar: 1, ogren: 2, test: 2, eslestir: 3, blast: 4, bloklar: 4, tilsim: 4 };

export function bestLabel(list: WordList, mode: ModeKey) {
  const b = list.best;
  if (mode === 'eslestir' && b.match != null) return 'En iyi süre: ' + fmtTime(b.match);
  const key = mode === 'blast' ? 'blast' : mode === 'bloklar' ? 'blocks' : mode === 'tilsim' ? 'charms' : null;
  return key && b[key] != null ? `En iyi puan: ${b[key]}` : '';
}

export default function ListOverview({ id }: { id: number }) {
  const { state, update } = useList(id);
  if (state.status === 'loading') return <Loading />;
  if (state.status === 'login') return <LoginNeeded />;
  if (state.status !== 'ready') return <Missing />;
  return <Overview list={state.list} update={update} />;
}

function Overview({ list, update }: { list: WordList; update: (fn: (l: WordList) => WordList) => void }) {
  const { toast } = useApp();
  const { star } = useStudy(list.id, update);
  const [open, setOpen] = useState<Status | null>(null);
  const [onlyStar, setOnlyStar] = useState(false);
  const n = list.items.length;
  const groups: Record<Status, typeof list.items> = { new: [], learning: [], learned: [] };
  for (const it of list.items) groups[statusOf(it)].push(it);
  const starred = list.items.filter((x) => x.starred).length;
  const shown = onlyStar ? list.items.filter((x) => x.starred) : list.items;

  async function reset() {
    if (!confirm('Bu listedeki bütün kelimeler "Çalışılmamış" durumuna dönsün mü?')) return;
    const r = await jsonFetch(`/api/lists/${list.id}/study`, { method: 'POST', body: JSON.stringify({ action: 'reset' }) });
    if (!r.ok) { toast(r.error); return; }
    update((l) => ({ ...l, items: l.items.map((it) => ({ ...it, correct: 0, wrong: 0, streak: 0 })) }));
    toast('İlerleme sıfırlandı.');
  }

  return (
    <div className="max-w-[1000px] mx-auto px-4 sm:px-6 pt-8 pb-20 flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <Link href="/listelerim" className="self-start inline-flex items-center gap-2 text-sm text-mute hover:text-ink"><Raw html={I.back()} /> Listelerim</Link>
        <div className="flex flex-wrap gap-4 items-start justify-between">
          <div className="flex flex-col gap-1.5 min-w-0">
            <h1 className="m-0 text-[30px] sm:text-[38px] leading-tight font-bold tracking-tight break-words">{list.title}</h1>
            <span className="text-mute">{n} kelime{list.description ? ' · ' + list.description : ''}</span>
          </div>
          <div className="flex gap-2">
            {n > 0 && <ShareButton list={list} update={update} />}
            <Link href={`/listelerim/${list.id}/duzenle`} className="h-11 px-4 rounded-xl border border-line3 bg-s2 text-soft font-semibold inline-flex items-center gap-2 hover:text-ink hover:border-lineh"><Raw html={I.edit(16)} /> Düzenle</Link>
          </div>
        </div>
      </div>

      {n === 0 ? (
        <div className="p-8 rounded-2xl bg-s1 border border-line text-center flex flex-col items-center gap-3">
          <p className="m-0 text-mute">Bu listede henüz kelime yok.</p>
          <Link href={`/listelerim/${list.id}/duzenle`} className="h-11 px-5 rounded-xl bg-acc text-onacc font-bold inline-flex items-center hover:text-onacc">Kelime ekle</Link>
        </div>
      ) : (
        <section aria-label="Çalışma modları" className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {MODES.map((m) => {
            const need = MIN_ITEMS[m.key];
            const best = bestLabel(list, m.key);
            const inner = (
              <>
                <span className="w-12 h-12 shrink-0 rounded-xl bg-chip border border-line3 text-acct flex items-center justify-center"><Raw html={I[m.icon](22)} /></span>
                <span className="flex flex-col gap-0.5 min-w-0">
                  <span className="text-[17px] font-bold text-ink">{m.name}</span>
                  <span className="text-sm text-mute2 leading-snug">{n < need ? `En az ${need} kelime gerekir` : best || m.desc}</span>
                </span>
              </>
            );
            return n < need
              ? <div key={m.key} className="flex items-center gap-4 p-4 rounded-2xl bg-s1 border border-line opacity-60" aria-disabled="true">{inner}</div>
              : <Link key={m.key} href={`/listelerim/${list.id}/${m.key}`} className="cat flex items-center gap-4 p-4 rounded-2xl bg-s4 border border-line3 hover:text-ink">{inner}</Link>;
          })}
        </section>
      )}

      {n > 0 && (
        <section className="flex flex-col gap-3">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="flex flex-col gap-1">
              <h2 className="m-0 text-[22px] font-bold">İlerleme durumu</h2>
              <p className="m-0 text-sm text-mute2 max-w-[620px]">Her kelimenin durumu Kartlar, Öğren ve Test modlarındaki son iki cevabına göre belirlenir; oyunlar sayılmaz. Art arda iki kez doğru bildiğin kelime öğrenilmiş sayılır.</p>
            </div>
            <button type="button" onClick={reset} className="h-9 px-3 rounded-lg text-sm text-faint hover:text-ink">İlerlemeyi sıfırla</button>
          </div>
          {(['new', 'learning', 'learned'] as Status[]).map((s) => {
            const g = groups[s];
            const tone = s === 'learned' ? 'border-okln text-okt' : s === 'learning' ? 'border-prog text-prog' : 'border-line3 text-faint';
            return (
              <div key={s} className="rounded-2xl bg-s4 border border-line3 overflow-hidden">
                <button type="button" onClick={() => setOpen(open === s ? null : s)} aria-expanded={open === s} disabled={!g.length}
                  className="w-full flex items-center gap-4 px-5 h-16 text-left disabled:cursor-default">
                  <span className={`w-11 h-11 shrink-0 rounded-full border-[3px] ${tone} flex items-center justify-center font-bold`}>{g.length}</span>
                  <span className={`flex-1 font-semibold ${g.length ? 'text-ink' : 'text-faint'}`}>{STATUS_LABEL[s]}</span>
                  {g.length > 0 && <Raw html={open === s ? I.up() : I.down()} className="text-mute" />}
                </button>
                {open === s && (
                  <div className="px-5 pb-4 flex flex-wrap gap-2">
                    {g.map((it) => (
                      <span key={it.id} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-s2 border border-line3">
                        <Ar t={it.ar} className="text-[17px] text-ink" /><span className="text-sm text-mute">{it.tr}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </section>
      )}

      {n > 0 && (
        <section className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="m-0 text-[22px] font-bold">Bu listedeki kelimeler ({n})</h2>
            <div role="radiogroup" aria-label="Gösterilen kelimeler" className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-s2 border border-line3">
              {([[false, 'Tümü'], [true, `Yıldızlı (${starred})`]] as const).map(([v, l]) => (
                <button key={String(v)} type="button" role="radio" aria-checked={onlyStar === v} onClick={() => setOnlyStar(v)}
                  className={`h-9 px-3 rounded-lg text-[13px] font-semibold ${onlyStar === v ? 'bg-acc text-onacc' : 'text-soft hover:text-ink'}`}>{l}</button>
              ))}
            </div>
          </div>
          {onlyStar && !starred && <p className="m-0 text-sm text-mute">Yıldızlı kelime yok. Zorlandığın kelimeleri yıldızla; çalışma modlarında yalnız onları seçebilirsin.</p>}
          <div className="flex flex-col gap-2">
            {shown.map((it) => (
              <div key={it.id} className="flex items-center gap-3 sm:gap-5 px-4 sm:px-5 py-3 rounded-2xl bg-s4 border border-line3">
                <div className="flex-1 min-w-0 flex flex-col">
                  <span className="text-[16px] font-semibold text-ink break-words">{it.tr}</span>
                  {it.note && <span className="text-xs text-faint">{it.note}</span>}
                </div>
                <div className="flex flex-col items-end">
                  <Ar t={it.ar} className="text-[24px] text-ink leading-[1.5]" />
                  {it.tl && <span className="tl text-xs text-mute">{it.tl}</span>}
                </div>
                <SayBtn text={it.ar} />
                <button type="button" onClick={() => star(it)} aria-pressed={it.starred} aria-label={it.starred ? 'Yıldızı kaldır' : 'Yıldızla'}
                  className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center ${it.starred ? 'text-acct' : 'text-faint hover:text-ink'}`}>
                  <Raw html={it.starred ? I.starFill(19) : I.star(19)} />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
