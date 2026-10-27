/* Canlı yarışma sonuç raporu: tip ve Excel (CSV) dosyası. Tarayıcıda ve sunucuda çalışır */

export type LiveAnswer = { choice: number; ok: boolean; points: number; ms: number };
export type LiveReport = {
  title: string; code: string; seconds: number; startedAt: number; endedAt: number;
  questions: {
    prompt: string; side: 'ar' | 'tr'; options: string[]; correct: number;
    /** Seçeneklere göre cevap sayısı, doğru sayısı, cevaplayan sayısı, ortalama süre (ms) */
    counts: number[]; right: number; answered: number; avgMs: number | null;
  }[];
  /** Puana göre sıralı */
  players: { name: string; score: number; right: number; wrong: number; blank: number; avgMs: number | null; answers: (LiveAnswer | null)[] }[];
};

const sec = (ms: number | null) => (ms == null ? '' : (ms / 1000).toFixed(1).replace('.', ','));
const pctOf = (a: number, b: number) => (b ? Math.round((a / b) * 100) : 0);

/** Excel'in Türkçe ayarlarında doğrudan açılır: noktalı virgül ayraçlı, UTF-8 (BOM ile) */
export function reportCsv(r: LiveReport) {
  const cell = (v: string | number) => {
    const s = String(v);
    return /[;"\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const row = (cells: (string | number)[]) => cells.map(cell).join(';');
  const lines: string[] = [];
  lines.push(row([r.title, new Date(r.startedAt).toLocaleString('tr-TR'), `${r.players.length} öğrenci`, `${r.questions.length} soru`]));
  lines.push('');
  lines.push(row(['Sıra', 'Ad', 'Puan', 'Doğru', 'Yanlış', 'Boş', 'Ortalama süre (sn)', ...r.questions.map((_, i) => `S${i + 1}`)]));
  r.players.forEach((p, i) => lines.push(row([i + 1, p.name, p.score, p.right, p.wrong, p.blank, sec(p.avgMs),
    ...p.answers.map((a) => (!a ? '-' : a.ok ? `Doğru (${a.points})` : 'Yanlış'))])));
  lines.push('');
  lines.push(row(['Soru', 'Sorulan', 'Doğru cevap', 'Doğru oranı (%)', 'Cevaplayan', 'Ortalama süre (sn)', 'En çok seçilen yanlış']));
  r.questions.forEach((q, i) => {
    const wrongIdx = q.counts.map((n, j) => ({ n, j })).filter((x) => x.j !== q.correct && x.n > 0).sort((a, b) => b.n - a.n)[0];
    lines.push(row([`S${i + 1}`, q.prompt, q.options[q.correct], pctOf(q.right, r.players.length), q.answered, sec(q.avgMs), wrongIdx ? `${q.options[wrongIdx.j]} (${wrongIdx.n})` : '']));
  });
  return '﻿' + lines.join('\r\n');
}

export function downloadCsv(r: LiveReport) {
  const blob = new Blob([reportCsv(r)], { type: 'text/csv;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  const day = new Date(r.startedAt).toISOString().slice(0, 10);
  a.download = `yarisma-${day}-${r.title.replace(/[^\p{L}\p{N}]+/gu, '-').toLocaleLowerCase('tr').slice(0, 40)}.csv`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
