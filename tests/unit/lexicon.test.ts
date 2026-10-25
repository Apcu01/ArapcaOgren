import { describe, expect, it } from 'vitest';
import { indexLexicon, matchLexicon, parseLexicon, toLookupResult } from '@/lib/lexicon';
import { LEXICON } from '../../scripts/lexicon-data';

const list = parseLexicon(LEXICON);
const index = indexLexicon(list);
const first = (q: string) => matchLexicon(index, q)?.items[0]?.e.ar;

describe('yerleşik sözlük', () => {
  it('bütün satırlar ayrışır ve tekrar eden kayıt yok', () => {
    expect(list.length).toBeGreaterThan(500);
    for (const e of list) {
      expect(e.ar, e.tl).toMatch(/[؀-ۿ]/);
      expect(e.tr.length, e.ar).toBeGreaterThan(0);
    }
    const dup = list.map((e) => e.ar).filter((a, i, arr) => arr.indexOf(a) !== i);
    expect(dup).toEqual([]);
  });
  it('defterdeki kelimeler farklı okunuşlarla bulunur', () => {
    expect(first('sahifetun')).toBe('صَحِيفَة');
    expect(first('sehifatün')).toBe('صَحِيفَة');
    expect(first('sahife')).toBe('صَحِيفَة');
    expect(first('tilfaz')).toBe('تِلْفَاز');
    expect(first('telfaz')).toBe('تِلْفَاز');
    expect(first('hafile')).toBe('حَافِلَة');
    expect(first('derrace')).toBe('دَرَّاجَة');
    expect(first('daraca')).toBe('دَرَّاجَة');
    expect(first('mustesfa')).toBe('مُسْتَشْفَى');
    expect(first('mushtashfa')).toBe('مُسْتَشْفَى');
    expect(first('tezkire')).toBe('تَذْكِرَة');
    expect(first('tadhkira')).toBe('تَذْكِرَة');
  });
  it('harekesi tamamen yanlış okunan kelime en yakın tahminle bulunur', () => {
    const m = matchLexicon(index, 'sihafa');
    expect(m?.kind).toBe('near');
    expect(m?.items.map((x) => x.e.ar)).toContain('صَحِيفَة');
    expect(matchLexicon(index, 'kitib')?.items.map((x) => x.e.ar)).toEqual(expect.arrayContaining(['كِتَاب', 'كَاتِب']));
  });
  it('kalıp ifadeler, bağlaçlar ve fiiller bulunur', () => {
    expect(first('afvan')).toBe('عَفْوًا');
    expect(first('efvan')).toBe('عَفْوًا');
    expect(first('lev semahte')).toBe('لَوْ سَمَحْتَ');
    expect(first('lakin')).toMatch(/^لٰكِن/);
    expect(first('summe')).toBe('ثُمَّ');
    expect(first('ketebe')).toBe('كَتَبَ');
  });
  it('fiilin şimdiki zaman hâli de tanınır', () => {
    const m = matchLexicon(index, 'yektubu')!;
    expect(m.items[0].e.ar).toBe('كَتَبَ');
    expect(m.items[0].viaMu).toBe(true);
    expect(toLookupResult(m).results[0].ar).toBe('يَكْتُبُ');
  });
  it('Arapça yazımla da arar', () => {
    expect(first('صحيفة')).toBe('صَحِيفَة');
    expect(first('الصحيفة')).toBe('صَحِيفَة');
  });
  it('alakasız yazımda sonuç vermez', () => {
    expect(matchLexicon(index, 'xyzq')).toBeNull();
  });
});
