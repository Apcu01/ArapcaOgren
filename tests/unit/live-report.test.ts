import { describe, expect, it } from 'vitest';
import { reportCsv, type LiveReport } from '@/lib/live-report';

const r: LiveReport = {
  title: 'Renkler; deneme', code: '123456', seconds: 20, startedAt: Date.UTC(2026, 9, 26, 9), endedAt: Date.UTC(2026, 9, 26, 9, 5),
  questions: [
    { prompt: 'أَحْمَر', side: 'ar', options: ['kırmızı', 'mavi', 'yeşil', 'sarı'], correct: 0, counts: [1, 1, 0, 0], right: 1, answered: 2, avgMs: 4200 },
    { prompt: 'mavi', side: 'tr', options: ['أَزْرَق', 'أَحْمَر', 'أَسْوَد', 'أَبْيَض'], correct: 0, counts: [0, 0, 1, 0], right: 0, answered: 1, avgMs: 9000 }
  ],
  players: [
    { name: 'Ayşe', score: 950, right: 1, wrong: 1, blank: 0, avgMs: 3000, answers: [{ choice: 0, ok: true, points: 950, ms: 2000 }, { choice: 2, ok: false, points: 0, ms: 4000 }] },
    { name: 'Ali "Can"', score: 0, right: 0, wrong: 1, blank: 1, avgMs: 6400, answers: [{ choice: 1, ok: false, points: 0, ms: 6400 }, null] }
  ]
};

describe('yarışma raporu dosyası', () => {
  const csv = reportCsv(r);
  const lines = csv.slice(1).split('\r\n');
  it("Excel için BOM ve noktalı virgül ayraç; ayraç içeren hücre tırnaklanır", () => {
    expect(csv.charCodeAt(0)).toBe(0xfeff);
    expect(lines[0].startsWith('"Renkler; deneme";')).toBe(true);
  });
  it('öğrenci satırları: sıra, puan, doğru/yanlış/boş ve soru bazında sonuç', () => {
    expect(lines[2]).toBe('Sıra;Ad;Puan;Doğru;Yanlış;Boş;Ortalama süre (sn);S1;S2');
    expect(lines[3]).toBe('1;Ayşe;950;1;1;0;3,0;Doğru (950);Yanlış');
    expect(lines[4]).toBe('2;"Ali ""Can""";0;0;1;1;6,4;Yanlış;-');
  });
  it('soru satırları: doğru oranı ve en çok seçilen yanlış', () => {
    expect(lines[7]).toBe('S1;أَحْمَر;kırmızı;50;2;4,2;mavi (1)');
    expect(lines[8]).toBe('S2;mavi;أَزْرَق;0;1;9,0;أَسْوَد (1)');
  });
});
