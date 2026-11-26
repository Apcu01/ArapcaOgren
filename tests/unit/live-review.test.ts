import { describe, expect, it } from 'vitest';
import { reviewOf, reviewQuestion } from '@/lib/live-report';
import { mistakeKey } from '@/lib/qkey';

const Q = (prompt: string, side: 'ar' | 'tr', options: string[], correct: number) => ({ prompt, promptTl: side === 'ar' ? 'tl' : '', side, options, correct, say: '' });
const questions = [
  Q('أَحْمَر', 'ar', ['kırmızı', 'mavi', 'yeşil', 'sarı'], 0),
  Q('mavi', 'tr', ['أَحْمَر', 'أَزْرَق', 'أَسْوَد', 'أَبْيَض'], 1),
  Q('أَبْيَض', 'ar', ['siyah', 'beyaz', 'mor', 'gri'], 1),
  Q('yeşil', 'tr', ['أَخْضَر', 'أَصْفَر', 'أَحْمَر', 'أَزْرَق'], 0)
];
const ans = (choice: number, ok: boolean) => ({ choice, ok, ms: 1000, points: ok ? 900 : 0 });

describe('canlı yarışma sonrası tekrar', () => {
  it('yalnızca yanlış ve boş sorular gelir; erken bitirilen yarışmada sorulmayanlar gelmez', () => {
    const answers = new Map([[0, ans(0, true)], [1, ans(2, false)]]);
    // Üçüncü soru ekrandayken bitti: üçüncü soru boş sayılır, dördüncü hiç sorulmadı
    const r = reviewOf({ questions, q: 2 }, { answers });
    expect(r.map((x) => x.prompt)).toEqual(['mavi', 'أَبْيَض']);
    expect(r[0]).toMatchObject({ choice: 2, correct: 1, side: 'tr' });
    expect(r[1].choice).toBeNull();
    expect(reviewOf({ questions, q: -1 }, { answers: new Map() })).toEqual([]);
  });
  it("Hatalarım'a çoktan seçmeli soru olarak eklenir; doğru cevap seçeneklerde, anahtar kararlı", () => {
    const [tr, ar] = [reviewOf({ questions, q: 3 }, { answers: new Map() })[1], reviewOf({ questions, q: 3 }, { answers: new Map() })[0]];
    const qa = reviewQuestion(ar);
    expect(qa).toMatchObject({ t: 'mc', ar: 'أَحْمَر', tl: 'tl', a: 'kırmızı' });
    const qt = reviewQuestion(tr);
    expect(qt.t).toBe('mc');
    expect(qt.q).toContain('mavi');
    expect(qt.options).toContain(qt.a);
    expect(qt.a).toBe('أَزْرَق');
    expect(mistakeKey('renkler', qt)).toBe(mistakeKey('renkler', reviewQuestion({ ...tr })));
  });
});
