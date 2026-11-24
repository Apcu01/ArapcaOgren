import { describe, expect, it } from 'vitest';
import { ANTONYMS, DIGIT_WORDS, DRILLS, normDigits, numAr, PRICES, priceAr, SOUND_GROUPS, SYNONYMS, toArDigits } from '@/lib/drills';
import { endlessGen, endlessTexts, KIND_TR, kindLabel, RULE_TR, type EQ } from '@/lib/endless';

const HARAKA = /[ًٌٍَُِّْٰ]/;
const many = (gen: () => EQ, n = 1500) => Array.from({ length: n }, gen);

describe('sayıların Arapçası', () => {
  it('derste kullanılan biçimle aynı yazılır', () => {
    expect(numAr(0)).toBe('صِفْر');
    expect(numAr(7)).toBe('سَبْعَة');
    expect(numAr(10)).toBe('عَشَرَة');
    expect(numAr(13)).toBe('ثَلَاثَةَ عَشَرَ');
    expect(numAr(20)).toBe('عِشْرُونَ');
    // Sayılar dersindeki soru: "kırk iki" = اِثْنَانِ وَأَرْبَعُونَ (birler önce)
    expect(numAr(42)).toBe('اِثْنَانِ وَأَرْبَعُونَ');
    expect(numAr(99)).toBe('تِسْعَةٌ وَتِسْعُونَ');
    expect(numAr(100)).toBe('مِئَة');
    for (let n = 0; n <= 100; n++) expect(numAr(n), String(n)).toMatch(HARAKA);
  });
  it('fiyatta sayılan isim sayıya göre değişir', () => {
    expect(priceAr(1)).toBe('رِيَالٌ وَاحِدٌ');
    expect(priceAr(2)).toBe('رِيَالَانِ');
    expect(priceAr(3)).toBe('ثَلَاثَةُ رِيَالَاتٍ');
    expect(priceAr(10)).toBe('عَشَرَةُ رِيَالَاتٍ');
    expect(priceAr(11)).toBe('أَحَدَ عَشَرَ رِيَالًا');
    expect(priceAr(25)).toBe('خَمْسَةٌ وَعِشْرُونَ رِيَالًا');
    expect(priceAr(100)).toBe('مِئَةُ رِيَالٍ');
  });
  it('rakamlar iki yönde çevrilir, yazılan cevaptaki Arapça rakamlar tanınır', () => {
    expect(toArDigits(2026)).toBe('٢٠٢٦');
    expect(normDigits('٠٥٣٢ ١٢٣')).toBe('0532123');
    expect(normDigits('53-41 07')).toBe('534107');
    expect(normDigits('۴۵')).toBe('45');
  });
});

describe('ek alıştırmaların soruları', () => {
  for (const [id, d] of Object.entries(DRILLS)) {
    it(`${d.name}: her soru geçerli`, () => {
      const gen = endlessGen(id, [])!;
      expect(gen).toBeTypeOf('function');
      for (const q of many(gen)) {
        expect(q.g, q.key).toBeTruthy();
        expect(RULE_TR[q.g!], q.g).toBeTruthy();
        expect(KIND_TR[q.kind] || q.kind.startsWith('ses-'), q.kind).toBeTruthy();
        expect(kindLabel(q).length).toBeGreaterThan(1);
        if (q.input) {
          // Yazarak cevap: rakamlar; Hatalarım için yanlış seçenekler cevabı içermez
          expect(q.a).toMatch(/^\d+$/);
          expect(q.alt?.length, q.key).toBeGreaterThanOrEqual(2);
          expect(q.alt).not.toContain(q.a);
          expect(q.listen).toBe(true);
        } else {
          expect(q.options, q.key).toContain(q.a);
          expect(new Set(q.options).size, q.key).toBe(q.options.length);
          expect(q.options.length).toBeGreaterThanOrEqual(2);
        }
        if (q.listen) expect(q.ar, q.key).toBeTruthy();
        if (q.seq) for (const t of q.seq) expect(DIGIT_WORDS).toContain(t);
      }
    });
  }
  it('benzer seslerde seçenekler yalnızca karışan sesle ayrılır', () => {
    for (const g of SOUND_GROUPS) {
      for (const [a, at, b, bt] of g.pairs) {
        expect(a).not.toBe(b);
        expect(a, at).toMatch(HARAKA);
        expect(b, bt).toMatch(HARAKA);
      }
    }
    const qs = many(DRILLS.sesler.gen);
    expect(new Set(qs.map((q) => q.kind))).toEqual(new Set(['ses-dinle', 'ses-harf']));
    // Harf sorusunda doğru harf gerçekten kelimede geçer
    for (const q of qs.filter((x) => x.kind === 'ses-harf')) {
      expect(q.a === 'ء' ? /[ءأإآؤئ]/.test(q.ar!) : q.ar!.includes(q.a), q.key).toBe(true);
    }
  });
  it('zıt ve eş anlamlılarda kelime tekrarı yok, sorulan kelime seçeneklerde çıkmaz', () => {
    for (const list of [ANTONYMS, SYNONYMS]) {
      const keys = list.map(([a, , b]) => a + '|' + b);
      expect(new Set(keys).size).toBe(keys.length);
    }
    for (const q of many(DRILLS.zitlar.gen)) {
      if (q.ar) expect(q.options, q.key).not.toContain(q.ar);
      expect(q.options.filter((o) => o === q.a)).toHaveLength(1);
    }
  });
  it('Sayılar dersinin sınırsız pratiğinde kelimeler ve rakam soruları karışık gelir', () => {
    const words = [{ ar: 'وَاحِد', tr: 'bir' }, { ar: 'اِثْنَان', tr: 'iki' }, { ar: 'ثَلَاثَة', tr: 'üç' }, { ar: 'أَرْبَعَة', tr: 'dört' }];
    const kinds = new Set(many(endlessGen('sayilar', words)!, 300).map((q) => q.kind.split('-')[0]));
    expect(kinds).toEqual(new Set(['kelime', 'rakam']));
  });
  it('dinleme sorularındaki ifadelerin hepsi ses üretimine girer', () => {
    const texts = new Set(endlessTexts());
    for (const g of SOUND_GROUPS) for (const p of g.pairs) { expect(texts).toContain(p[0]); expect(texts).toContain(p[2]); }
    for (let n = 0; n <= 100; n++) expect(texts).toContain(numAr(n));
    for (const n of PRICES) expect(texts).toContain(priceAr(n));
    for (const [a, , b] of [...ANTONYMS, ...SYNONYMS]) { expect(texts).toContain(a); expect(texts).toContain(b); }
  });
});

describe('Hatalarım kural başlıkları', () => {
  it('zamir ve iyelik sorularının her biri bir kurala bağlanır', () => {
    for (const id of ['zamirler', 'iyelik']) {
      for (const q of many(endlessGen(id, [])!, 2000)) {
        expect(q.g, q.key).toBeTruthy();
        expect(RULE_TR[q.g!], q.key + ' ' + q.g).toBeTruthy();
      }
    }
  });
  it('fiil soruları "zamir ve fiil uyumu", ة ile biten isimler "ة ve ت değişimi" başlığına düşer', () => {
    const z = many(endlessGen('zamirler', [])!, 2000);
    for (const q of z.filter((x) => x.kind === 'zamir-fiil')) expect(q.g).toBe('fiil');
    const iy = many(endlessGen('iyelik', [])!, 2000).filter((q) => q.kind === 'iyelik-ar' || q.kind === 'iyelik-anlam');
    expect(iy.some((q) => q.g === 'ta' && q.full.includes('ت'))).toBe(true);
    expect(iy.some((q) => q.g === 'iyelik')).toBe(true);
  });
  it('kelime sorularında başlık "Kelime anlamları"', () => {
    const words = ['كِتَاب', 'قَلَم', 'بَيْت', 'بَاب'].map((ar, i) => ({ ar, tr: 'k' + i }));
    for (const q of many(endlessGen('renkler', words)!, 100)) expect(q.g).toBe('kelime');
  });
});
