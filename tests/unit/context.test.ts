import { describe, expect, it } from 'vitest';
import { contextFit, contextKey, contextTerms, rankByContext } from '@/lib/context';

describe('kelime bul bağlamı', () => {
  it('dolgu sözcükleri atar, Türkçe ekleri yok sayar', () => {
    const t = contextTerms('Teknoloji ünitesinde geçiyor')!;
    expect(t.stems).toEqual(['tekno']);
    expect(contextFit(t, ['teknoloji ve iletişim'])).toBe(1);
    expect(contextFit(contextTerms('teknolojide'), ['Teknoloji ve iletişim'])).toBe(1);
    expect(contextFit(t, ['Sağlık', 'hastane doktor'])).toBe(0);
  });
  it('yer bildiren bağlam konu ipuçlarıyla eşleşir', () => {
    const t = contextTerms('hastanede doktor söyledi');
    expect(contextFit(t, ['Sağlık', 'hastane doktor ilaç hasta'])).toBe(2);
    expect(contextFit(t, ['Okul ve sınıf', 'okul ders öğretmen'])).toBe(0);
  });
  it('Arapça bağlam cümlesinde geçen kelime güçlü eşleşir (hareke ve el takısı fark etmez)', () => {
    const t = contextTerms('ذَهَبْتُ إِلَى الْمَدْرَسَةِ صَبَاحًا');
    expect(contextFit(t, [], 'مَدْرَسَة')).toBe(2);
    expect(contextFit(t, [], 'مَسْجِد')).toBe(0);
  });
  it('boş ya da yalnızca dolgu sözcüklü bağlam yok sayılır', () => {
    expect(contextTerms('')).toBeNull();
    expect(contextTerms('  ünitede geçiyor ')).toBeNull();
    expect(contextKey(null)).toBe('');
  });
  it('aynı bağlamın farklı yazımları aynı anahtarı verir', () => {
    expect(contextKey(contextTerms('Teknoloji ünitesi'))).toBe(contextKey(contextTerms('teknolojide')));
  });
  it('uyanlar öne gelir, sıra kararlıdır', () => {
    const t = contextTerms('okul');
    const r = rankByContext(['ev', 'okul', 'hastane', 'okulda ders'], (x) => contextFit(t, [x]));
    expect(r).toEqual(['okul', 'okulda ders', 'ev', 'hastane']);
  });
});
