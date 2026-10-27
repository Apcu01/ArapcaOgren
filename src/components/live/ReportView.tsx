'use client';

/* Canlı yarışma sonuç raporu: özet, sorulara göre ve öğrencilere göre sonuçlar, Excel'e indirme */
import { useState } from 'react';
import { I, Raw } from '../icons';
import { OPTS, OptText } from './shared';
import { downloadCsv, type LiveReport } from '@/lib/live-report';

const sec = (ms: number | null) => (ms == null ? '-' : (ms / 1000).toFixed(1).replace('.', ',') + ' sn');
const pct = (a: number, b: number) => (b ? Math.round((a / b) * 100) : 0);

export default function ReportView({ report: r }: { report: LiveReport }) {
  const [tab, setTab] = useState<'questions' | 'players'>('questions');
  const n = r.players.length;
  const total = n * r.questions.length;
  const right = r.players.reduce((s, p) => s + p.right, 0);
  // En çok zorlanılan sorular önce
  const hardest = r.questions.map((q, i) => ({ q, i })).sort((a, b) => pct(a.q.right, n) - pct(b.q.right, n));

  return (
    <section className="flex flex-col gap-5" aria-label="Sonuç raporu">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h2 className="m-0 text-[24px] font-bold">Sonuç raporu</h2>
          <p className="m-0 text-sm text-mute">{new Date(r.startedAt).toLocaleString('tr-TR', { dateStyle: 'long', timeStyle: 'short' })} · {n} öğrenci · {r.questions.length} soru · soru başına {r.seconds} sn</p>
        </div>
        <button type="button" onClick={() => downloadCsv(r)} className="h-11 px-4 rounded-xl border border-line3 bg-s2 text-soft font-semibold inline-flex items-center gap-2 hover:text-ink hover:border-lineh">
          <Raw html={I.down(16)} /> Excel'e indir
        </button>
      </div>

      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        {[
          ['Sınıf başarısı', `%${pct(right, total)}`, `${right} / ${total} doğru cevap`],
          ['En yüksek puan', r.players[0] ? String(r.players[0].score) : '-', r.players[0]?.name ?? ''],
          ['En zor soru', hardest[0] ? `%${pct(hardest[0].q.right, n)}` : '-', hardest[0] ? `S${hardest[0].i + 1}: ${hardest[0].q.prompt}` : ''],
          ['Cevapsız kalan', String(r.players.reduce((s, p) => s + p.blank, 0)), 'süre biten cevap']
        ].map(([l, v, sub]) => (
          <div key={l} className="flex flex-col gap-1 p-4 rounded-2xl bg-s4 border border-line3 min-w-0">
            <span className="text-xs font-semibold text-lab">{l}</span>
            <span className="text-[26px] font-bold leading-tight">{v}</span>
            <span className="text-xs text-mute truncate">{sub}</span>
          </div>
        ))}
      </div>

      <div role="tablist" aria-label="Rapor görünümü" className="self-start grid grid-cols-2 gap-1 p-1 rounded-xl bg-s2 border border-line3">
        {([['questions', 'Sorulara göre'], ['players', 'Öğrencilere göre']] as const).map(([k, l]) => (
          <button key={k} type="button" role="tab" aria-selected={tab === k} onClick={() => setTab(k)}
            className={`h-9 px-4 rounded-lg text-[13px] font-semibold ${tab === k ? 'bg-acc text-onacc' : 'text-soft hover:text-ink'}`}>{l}</button>
        ))}
      </div>

      {tab === 'questions' ? (
        <div className="flex flex-col gap-3">
          <p className="m-0 text-sm text-mute">En çok zorlanılan sorular üstte. Tekrar etmek için iyi bir başlangıç.</p>
          {hardest.map(({ q, i }) => {
            const rate = pct(q.right, n);
            return (
              <div key={i} className="flex flex-col gap-3 p-4 rounded-2xl bg-s4 border border-line3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="flex items-center gap-3 min-w-0">
                    <span className="text-xs font-bold text-lab shrink-0">S{i + 1}</span>
                    <OptText text={q.prompt} />
                    <Raw html={I.arrow(14)} className="text-faint" />
                    <span className="text-okt"><OptText text={q.options[q.correct]} /></span>
                  </span>
                  <span className="flex items-center gap-3 text-sm">
                    <span className={`font-bold ${rate >= 70 ? 'text-okt' : rate >= 40 ? 'text-prog' : 'text-bad'}`}>%{rate} doğru</span>
                    <span className="text-faint">ort. {sec(q.avgMs)}</span>
                  </span>
                </div>
                <div className="grid gap-1.5 sm:grid-cols-2">
                  {q.options.map((o, j) => (
                    <div key={j} className={`flex items-center gap-2 text-sm px-2.5 py-1.5 rounded-lg ${j === q.correct ? 'bg-okbg' : 'bg-s2'}`}>
                      <span className="w-3 h-3 rounded-sm shrink-0" style={{ background: OPTS[j].bg }} />
                      <span className="flex-1 min-w-0 truncate">{o}</span>
                      <b className="tabular-nums">{q.counts[j]}</b>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-line3">
          <table className="w-full min-w-[640px] text-sm border-collapse">
            <thead className="bg-s2 text-left text-xs text-lab">
              <tr>
                <th className="px-3 py-2.5">#</th><th className="px-3 py-2.5">Ad</th><th className="px-3 py-2.5">Puan</th><th className="px-3 py-2.5">Doğru</th><th className="px-3 py-2.5">Ort. süre</th>
                {r.questions.map((_, i) => <th key={i} className="px-1.5 py-2.5 text-center">S{i + 1}</th>)}
              </tr>
            </thead>
            <tbody>
              {r.players.map((p, i) => (
                <tr key={i} className="border-t border-line3">
                  <td className="px-3 py-2 text-faint">{i + 1}</td>
                  <td className="px-3 py-2 font-semibold whitespace-nowrap">{p.name}</td>
                  <td className="px-3 py-2 font-bold tabular-nums">{p.score}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{p.right} / {r.questions.length}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-mute">{sec(p.avgMs)}</td>
                  {p.answers.map((a, j) => (
                    <td key={j} className="px-1.5 py-2 text-center" title={a ? `${r.questions[j].options[a.choice]} · ${a.points} puan · ${sec(a.ms)}` : 'Cevapsız'}>
                      {!a ? <span className="text-faint">-</span> : a.ok ? <span className="text-okt font-bold">✓</span> : <span className="text-bad font-bold">✗</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
