import { describe, expect, it } from 'vitest';
import { BADGES, evaluate, longestStreak, progressStats } from '@/lib/badges';
import { isCode, normCode } from '@/lib/class-shared';
import { actXp, addDays, daysLeft, leagueName, rankRows, weekStart, XP } from '@/lib/league';
import { queueable } from '@/lib/outbox';
import { bareWord, READING_TOPIC, READINGS, sentenceAr } from '@/lib/readings';
import { DICTATE_KEY, isAr } from '@/lib/text';

const BAD = /[–—…“”‘’]/;

describe('okuma metinleri', () => {
  it('kimlikler benzersiz, metinler ve sorular tutarlı', () => {
    expect(new Set(READINGS.map((r) => r.slug)).size).toBe(READINGS.length);
    for (const r of READINGS) {
      expect(isAr(r.ar)).toBe(true);
      expect(r.sentences.length).toBeGreaterThanOrEqual(5);
      expect(r.questions.length).toBeGreaterThanOrEqual(3);
      for (const s of r.sentences) {
        expect(s.w.length).toBeGreaterThan(0);
        for (const [ar, tr] of s.w) {
          expect(isAr(ar), ar).toBe(true);
          expect(/[A-Za-z]/.test(ar), ar).toBe(false);
          expect(bareWord(ar).length).toBeGreaterThan(0);
          expect(tr.trim()).not.toBe('');
        }
        expect(sentenceAr(s).split(' ').length).toBe(s.w.length);
      }
      for (const q of r.questions) {
        expect(q.options).toContain(q.a);
        expect(new Set(q.options).size).toBe(q.options.length);
      }
      const text = JSON.stringify(r);
      expect(BAD.test(text), r.slug).toBe(false);
    }
  });
  it('noktalama seslendirmeden önce atılır', () => {
    expect(bareWord('الْمَطْعَمِ.')).toBe('الْمَطْعَمِ');
    expect(bareWord('تُرِيدَانِ؟')).toBe('تُرِيدَانِ');
    expect(bareWord('طَبِيبٌ،')).toBe('طَبِيبٌ');
  });
});

describe('haftalık lig', () => {
  it('hafta pazartesi başlar', () => {
    expect(weekStart('2026-11-02')).toBe('2026-11-02'); // pazartesi
    expect(weekStart('2026-11-08')).toBe('2026-11-02'); // pazar
    expect(weekStart('2026-11-09')).toBe('2026-11-09');
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01');
    expect(daysLeft('2026-11-02')).toBe(6);
    expect(daysLeft('2026-11-08')).toBe(0);
  });
  it('aynı puana aynı sıra', () => {
    const r = rankRows([{ xp: 5 }, { xp: 9 }, { xp: 9 }, { xp: 1 }]);
    expect(r.map((x) => [x.xp, x.rank])).toEqual([[9, 1], [9, 1], [5, 3], [1, 4]]);
  });
  it('ad gizliliği ve puan kuralı', () => {
    expect(leagueName('Efe Katman')).toBe('Efe K.');
    expect(leagueName('Ali Rıza İnce')).toBe('Ali İ.');
    expect(leagueName('Zeynep')).toBe('Zeynep');
    expect(leagueName('  ')).toBe('Öğrenci');
    expect(actXp(1, true)).toBe(XP.actBase + XP.actScore + XP.actDone);
    expect(actXp(0, false)).toBe(XP.actBase);
    expect(actXp(0.5, false)).toBe(XP.actBase + 4);
  });
});

describe('rozetler', () => {
  it('en uzun seri', () => {
    expect(longestStreak([])).toBe(0);
    expect(longestStreak(['2026-01-01', '2026-01-02', '2026-01-04', '2026-01-05', '2026-01-06'])).toBe(3);
    expect(longestStreak(['2026-02-28', '2026-03-01'])).toBe(2);
  });
  it('ilerlemeden sayılar: okuma ve dikte ayrı sayılır', () => {
    const s = progressStats({
      last: null, days: ['2026-01-01', '2026-01-02'],
      progress: {
        aile: { lesson: true, acts: { a: { best: 1, done: true, tries: 1, last: 1 }, b: { best: 0.5, done: false, tries: 1, last: 0.5 }, [DICTATE_KEY]: { best: 0.8, done: true, tries: 1, last: 0.8 } } },
        evim: { lesson: false, acts: { c: { best: 0.9, done: true, tries: 2, last: 0.9 } } },
        [READING_TOPIC]: { lesson: false, acts: { ailem: { best: 0.75, done: true, tries: 1, last: 0.75 }, evimiz: { best: 0.5, done: false, tries: 1, last: 0.5 } } }
      }
    });
    expect(s).toEqual({ lessons: 1, acts: 2, perfect: 1, streakMax: 2, readings: 1, dictations: 1 });
    const b = evaluate(s, false);
    expect(b.find((x) => x.id === 'ders-1')!.earned).toBe(true);
    expect(b.find((x) => x.id === 'tam-1')!.earned).toBe(true);
    expect(b.find((x) => x.id === 'oku-1')!.earned).toBe(true);
    expect(b.find((x) => x.id === 'dikte-1')!.earned).toBe(true);
    expect(b.find((x) => x.id === 'kelime-25')!.locked).toBe(true);
    expect(b.find((x) => x.id === 'etk-10')!.cur).toBe(2);
  });
  it('rozet kimlikleri benzersiz', () => {
    expect(new Set(BADGES.map((b) => b.id)).size).toBe(BADGES.length);
    expect(BAD.test(JSON.stringify(BADGES))).toBe(false);
  });
});

describe('sınıflar ve çevrimdışı kuyruk', () => {
  it('katılma kodu', () => {
    expect(normCode(' abc-234 ')).toBe('ABC234');
    expect(isCode('ABC234')).toBe(true);
    expect(isCode('ABC10O')).toBe(false); // 0, 1 ve O kullanılmaz
    expect(isCode('ABC23')).toBe(false);
  });
  it('yalnızca ilerleme kayıtları kuyruğa alınır', () => {
    expect(queueable('/api/progress')).toBe(true);
    expect(queueable('/api/mistakes')).toBe(true);
    expect(queueable('/api/lists/12/study')).toBe(true);
    expect(queueable('/api/metrics')).toBe(false);
    expect(queueable('/api/lists/12')).toBe(false);
  });
});
