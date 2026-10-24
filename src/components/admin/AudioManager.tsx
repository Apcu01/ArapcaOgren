'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { audioKey } from '@/lib/text';
import AudioControl, { type AudioMap } from './AudioControl';
import { Card, dt } from './ui';

type Rec = { id: number; text: string; size: number; mime: string; createdAt: string };
type T = { id: string; name: string; n: number; words: { ar: string; tr: string }[] };

export default function AudioManager({ map: initial, records, topics }: { map: AudioMap; records: Rec[]; topics: T[] }) {
  const router = useRouter();
  const [map, setMap] = useState<AudioMap>(initial);
  const [onlyMissing, setOnlyMissing] = useState(true);
  const [text, setText] = useState('');
  const change = (key: string, id: number | null) => {
    setMap((m) => { const n = { ...m }; if (id) n[key] = id; else delete n[key]; return n; });
    router.refresh();
  };
  const allWords = useMemo(() => topics.flatMap((t) => t.words), [topics]);
  const missing = allWords.filter((w) => !map[audioKey(w.ar)]).length;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="m-0 text-[32px] sm:text-[40px] font-bold tracking-tight leading-tight">Sesler</h1>
        <p className="m-0 text-mute max-w-[760px]">
          Yüklediğin ses, Arapça metnin harekesiz biçimiyle eşleşir ve sitenin her yerinde (kelime paneli, örnekler, tablolar, etkinlikler) tarayıcı sesi yerine çalınır.
          Ses olmayan yerlerde tarayıcının sesi kullanılmaya devam eder. Dosya en fazla 2 MB olabilir.
        </p>
      </div>

      <Card title="Herhangi bir metin için ses ekle">
        <div className="flex flex-wrap items-center gap-3">
          <input value={text} onChange={(e) => setText(e.target.value)} dir="rtl" placeholder="Arapça metin, örn. كَيْفَ حَالُكَ؟"
            className="flex-[1_1_320px] min-h-[46px] px-4 rounded-xl bg-s2 border border-line2 text-ink font-ar text-[22px] outline-none focus:border-lineh placeholder:text-faint placeholder:text-base" />
          {text.trim() && <AudioControl text={text} map={map} onChange={change} />}
        </div>
      </Card>

      <Card title={`Ders kelimeleri (${allWords.length - missing} / ${allWords.length} kelimenin sesi var)`}
        right={<label className="flex items-center gap-2 text-sm text-soft"><input type="checkbox" checked={onlyMissing} onChange={(e) => setOnlyMissing(e.target.checked)} className="w-4 h-4 accent-[#C8894A]" /> Yalnızca sesi olmayanlar</label>}>
        <div className="flex flex-col gap-5">
          {topics.map((t) => {
            const words = t.words.filter((w) => !onlyMissing || !map[audioKey(w.ar)]);
            if (!words.length) return null;
            return (
              <div key={t.id} className="flex flex-col gap-2">
                <h3 className="m-0 text-base font-bold">{t.n}. {t.name}</h3>
                <div className="flex flex-col">
                  {words.map((w, i) => (
                    <div key={i} className="flex flex-wrap items-center justify-between gap-3 py-2 border-b border-[#241B15] last:border-0">
                      <span className="flex items-center gap-3 min-w-0">
                        <span className="ar text-[24px] text-ink" lang="ar" dir="rtl">{w.ar}</span>
                        <span className="text-sm text-mute2">{w.tr}</span>
                      </span>
                      <AudioControl text={w.ar} map={map} onChange={change} compact />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
          {onlyMissing && missing === 0 && <p className="m-0 text-sm text-okt">Bütün ders kelimelerinin sesi var.</p>}
        </div>
      </Card>

      <Card title={`Tüm kayıtlar (${records.length})`}>
        {!records.length && <p className="m-0 text-sm text-faint">Henüz ses yüklenmedi.</p>}
        <div className="flex flex-col">
          {records.map((r) => (
            <div key={r.id} className="flex flex-wrap items-center justify-between gap-3 py-2.5 border-b border-[#241B15] last:border-0">
              <span className="flex flex-col min-w-0">
                <span className="ar text-[22px] text-ink" lang="ar" dir="rtl">{r.text}</span>
                <span className="text-xs text-faint">{Math.round(r.size / 1024)} KB · {r.mime} · {dt(r.createdAt, true)}</span>
              </span>
              <AudioControl text={r.text} map={map} onChange={change} compact />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
