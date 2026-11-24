import { describe, expect, it } from 'vitest';
import { sounds } from '@/lib/soundmatch';
import { indexLexicon, matchLexicon, parseLexicon } from '@/lib/lexicon';
import { keepFitting, NO_FIT_NOTE } from '@/lib/lookup-filter';
import { LEXICON } from '../../scripts/lexicon-data';

const exact = (l: string, a: string) => sounds(l, a)?.miss === 0;
const index = indexLexicon(parseLexicon(LEXICON));
const found = (q: string) => matchLexicon(index, q)?.items.map((x) => x.e.ar) ?? [];

describe('Kelime bul: harf harf eşleştirme', () => {
  it('yazılan bir harf kelimede yoksa önermez', () => {
    // kış: ş harfi var, قِصَّة (kıssa) ise sad ile yazılır
    expect(sounds('kış', 'قِصَّة')).toBeNull();
    expect(sounds('şita', 'سِتَّة')).toBeNull();
    expect(sounds('havda', 'هَوَاء')).toBeNull();
    expect(sounds('yesgutu', 'يَسْجُدُ')).toBeNull();
  });
  it('kelimedeki bir harf yazılmadıysa önermez', () => {
    // estetia: başındaki ye yazılmamış
    expect(sounds('estetia', 'يَسْتَطِيعُ')).toBeNull();
    expect(sounds('hedietü', 'هَدِيَّة')).toBeNull();
    expect(sounds('bet', 'بَيْت')).toBeNull();
    expect(sounds('subua', 'ثُعْبَان')).toBeNull();
  });
  it('e/a, i/ı, u/ü farkını yok sayar', () => {
    expect(exact('ketebe', 'كَتَبَ')).toBe(true);
    expect(exact('katabe', 'كَتَبَ')).toBe(true);
    expect(exact('kıtab', 'كِتَاب')).toBe(true);
    expect(exact('kütüb', 'كُتُب')).toBe(true);
    expect(exact('şita', 'شِتَاء')).toBe(true);
  });
  it('cezm ve şedde yanlış yazılsa da bulur', () => {
    expect(exact('kalib', 'قَلْب')).toBe(true);
    expect(exact('muderis', 'مُدَرِّس')).toBe(true);
    expect(exact('müderris', 'مُدَرِّس')).toBe(true);
    expect(exact('rab', 'رَبّ')).toBe(true);
    expect(exact('neccar', 'نَجَّار')).toBe(true);
  });
  it('ayn, hemze, tâ merbûta, tenvin ve belirlilik takısı yazılmayabilir', () => {
    expect(exact('amel', 'عَمَل')).toBe(true);
    expect(exact('sual', 'سُؤَال')).toBe(true);
    expect(exact('sahife', 'صَحِيفَة')).toBe(true);
    expect(exact('sahifetun', 'صَحِيفَة')).toBe(true);
    expect(exact('kitabun', 'كِتَاب')).toBe(true);
    expect(exact('elkitab', 'كِتَاب')).toBe(true);
    expect(exact('el-kitab', 'الْكِتَاب')).toBe(true);
    expect(exact('eşşems', 'الشَّمْس')).toBe(true);
    expect(exact('levhi', 'لَوْحِيّ')).toBe(true);
    expect(exact('beyt', 'بَيْت')).toBe(true);
  });
  it('kesme işareti yazıldıysa orada ayn ya da hemze olmalı', () => {
    expect(sounds("tef'alu", 'طِفْل')).toBeNull();
    expect(exact("sa'b", 'صَعْب')).toBe(true);
  });
  it('kelime ünsüzle başlıyorsa baştaki fazladan ünlü tam eşleşme sayılmaz', () => {
    expect(exact('ebi', 'بِ')).toBe(false);
    expect(exact('sad', 'أَسَد')).toBe(false);
    expect(exact('esed', 'أَسَد')).toBe(true);
    expect(exact('ism', 'اسْم')).toBe(true);
  });
  it('Türkçe harf kullanılmadıysa s harfi ş yerine de geçer', () => {
    expect(exact('mustesfa', 'مُسْتَشْفَى')).toBe(true);
    expect(exact('mushtashfa', 'مُسْتَشْفَى')).toBe(true);
    // Yazımda ş varsa s artık yalnızca sin, sad ya da se
    expect(sounds('şukrası', 'سُكْر')).toBeNull();
  });
  it('İngilizce ve Türkçe ikili yazımları tanır', () => {
    expect(exact('tadhkira', 'تَذْكِرَة')).toBe(true);
    expect(exact('khubz', 'خُبْز')).toBe(true);
    expect(exact('ashab', 'أَصْحَاب')).toBe(true);
    expect(exact('jamil', 'جَمِيل')).toBe(true);
  });
});

describe('Kelime bul: yerleşik sözlük', () => {
  it('geçmiş aramalardaki yanlış öneriler artık çıkmaz', () => {
    expect(matchLexicon(index, 'kış')).toBeNull();
    expect(found('estetia')).not.toContain('يَسْتَطِيعُ');
    expect(found('şita')).toEqual(['شِتَاء']);
    // uhte: baştaki u, ünsüzle başlayan حَتَّى ve خَطَأ için tam eşleşme sayılmaz; doğrusu أُخْت
    expect(matchLexicon(index, 'uhte')?.kind).not.toBe('exact');
    expect(exact('uhte', 'أُخْت')).toBe(true);
  });
  it('tam eşleşme azsa harekesi farklı olanlar işaretli olarak eklenir', () => {
    const m = matchLexicon(index, 'kitab')!;
    expect(m.kind).toBe('exact');
    expect(m.items[0].e.ar).toBe('كِتَاب');
    expect(m.items.filter((x) => x.near).map((x) => x.e.ar)).toContain('كَتَبَ');
  });
  it('ek okunuşlar ve fiilin şimdiki zamanı', () => {
    expect(found('telfaz')[0]).toBe('تِلْفَاز');
    expect(found('yesgutu')[0]).toBe('سَقَطَ');
    expect(found('derrace')[0]).toBe('دَرَّاجَة');
  });
});

describe('Kelime bul: yapay zekâ sonuçlarının süzülmesi', () => {
  it('yazılan harflerle uyuşmayan sonuçlar atılır', () => {
    const r = keepFitting('yesgutu', { results: [{ ar: 'يَسْقُطُ', tl: 'yeskutu', tr: 'düşer' }, { ar: 'يَسْجُدُ', tl: 'yescudu', tr: 'secde eder' }], note: '' });
    expect(r.results.map((x) => x.ar)).toEqual(['يَسْقُطُ']);
  });
  it('hiçbiri uymuyorsa açıklama gösterilir', () => {
    const r = keepFitting('meyve', { results: [{ ar: 'فَاكِهَة', tl: 'fâkihe', tr: 'meyve' }], note: '' });
    expect(r.results).toEqual([]);
    expect(r.note).toBe(NO_FIT_NOTE);
  });
  it('Arapça harflerle yapılan aramaya dokunmaz', () => {
    const res = { results: [{ ar: 'يَأْكُلُ', tl: "ye'kulu", tr: 'yer' }], note: '' };
    expect(keepFitting('يناكل', res)).toBe(res);
  });
});
