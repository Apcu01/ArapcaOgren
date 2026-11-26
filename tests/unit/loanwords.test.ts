import { describe, expect, it } from 'vitest';
import { LOAN_GROUPS, loanPairs, loanQ, loanTexts, LOANWORDS } from '@/lib/loanwords';
import { endlessTexts } from '@/lib/endless';
import { deepClean } from '../../scripts/typography';

const HARAKA = /[ًٌٍَُِّْٰ]/;
const many = (n = 2000) => Array.from({ length: n }, loanQ);

describe('Türkçedeki Arapça kelimeler', () => {
  it('her kelime bir kez, harekeli ve bilinen bir grupta', () => {
    expect(new Set(LOANWORDS.map((w) => w.ar)).size).toBe(LOANWORDS.length);
    const groups = new Set(LOAN_GROUPS.map((g) => g.id));
    for (const w of LOANWORDS) {
      expect(groups.has(w.g), w.ar).toBe(true);
      expect(w.ar, w.tr).toMatch(HARAKA);
      expect(w.tr.trim() && w.mean.trim() && w.tl.trim(), w.ar).toBeTruthy();
      if (w.sg) { expect(w.g, w.ar).toBe('cogul'); expect(w.sg).toMatch(HARAKA); }
      if (w.g === 'cogul') expect(w.sg, w.ar).toBeTruthy();
    }
  });
  it('anlamı farklı olanların hepsinde açıklama var; açıklamadaki Arapça işaretleri kapalı', () => {
    for (const w of LOANWORDS) {
      if (!w.same) expect(w.note, w.ar).toBeTruthy();
      if (w.note) expect((w.note.match(/\{\{/g) || []).length, w.ar).toBe((w.note.match(/\}\}/g) || []).length);
    }
    // Sayfanın vaadi: bir kısmı aynı, bir kısmı farklı
    expect(LOANWORDS.filter((w) => w.same).length).toBeGreaterThan(40);
    expect(LOANWORDS.filter((w) => !w.same).length).toBeGreaterThan(30);
  });
  it('uzun tire, kıvrık tırnak ve üç nokta karakteri yok', () => {
    expect(deepClean(LOANWORDS)).toEqual(LOANWORDS);
    expect(deepClean(LOAN_GROUPS)).toEqual(LOAN_GROUPS);
  });
  it('sorular geçerli: cevap seçeneklerde bir kez, seçenekler tekrarsız; dört soru türü de çıkar', () => {
    const qs = many();
    for (const q of qs) {
      expect(q.options.filter((o) => o === q.a), q.key).toHaveLength(1);
      expect(new Set(q.options).size, q.key).toBe(q.options.length);
      expect(q.options.length).toBeGreaterThanOrEqual(2);
      expect(q.g).toBe('turkce');
      if (q.listen) expect(q.ar).toBeTruthy();
    }
    expect(new Set(qs.map((q) => q.kind))).toEqual(new Set(['tk-ayni', 'tk-anlam', 'tk-ar', 'tk-dinle']));
  });
  it('"anlamı aynı mı" sorusunun cevabı veriyle tutarlı, çoğulda belirsiz olanlar sorulmaz', () => {
    for (const q of many().filter((x) => x.kind === 'tk-ayni')) {
      const w = LOANWORDS.find((x) => x.ar === q.ar)!;
      expect(q.a, w.ar).toBe(w.same ? 'Aynı anlamda' : 'Anlamı farklı');
      expect(!w.sg || !w.same, w.ar).toBe(true);
    }
  });
  it('eşleştirme çiftleri tekrarsız; bütün kelimeler ses üretimine girer', () => {
    const p = loanPairs(10);
    expect(p).toHaveLength(10);
    expect(new Set(p.map(([a]) => a)).size).toBe(10);
    const texts = new Set(endlessTexts());
    for (const t of loanTexts()) expect(texts).toContain(t);
  });
});
