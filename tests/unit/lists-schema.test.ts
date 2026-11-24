import { describe, expect, it } from 'vitest';
import { FolderZ, ItemZ, ListZ, TagsZ } from '@/app/api/lists/schema';
import { audioKey, cleanText, normAr } from '@/lib/text';

const ZW = String.fromCharCode(0x200b), RLM = String.fromCharCode(0x200f), BOM = String.fromCharCode(0xfeff);

describe('görünmez karakter temizliği', () => {
  it('kopyala-yapıştırla gelen sıfır genişlikli boşluk ve yön işaretleri kayıttan önce atılır', () => {
    const it = ItemZ.parse({ ar: ZW + 'صَعْب', tl: "Sa'b" + RLM, tr: ' Zor' + BOM, note: ZW });
    expect(it).toEqual({ ar: 'صَعْب', tl: "Sa'b", tr: 'Zor', note: '' });
  });
  it('yalnızca görünmez karakterden oluşan Arapça yazım kabul edilmez', () => {
    expect(ItemZ.safeParse({ ar: ZW + ZW, tr: 'x' }).success).toBe(false);
  });
  it('ses anahtarı ve Arapça karşılaştırma görünmez karakterlerden etkilenmez', () => {
    expect(audioKey(ZW + 'صَعْب')).toBe(audioKey('صَعْب'));
    expect(normAr('صَعْب' + RLM)).toBe(normAr('صَعْب'));
    expect(cleanText('a' + ZW + 'b')).toBe('ab');
  });
});

describe('liste klasörü ve etiketleri', () => {
  it('klasör adı kırpılır, 40 karakteri geçemez', () => {
    expect(FolderZ.parse('  1. dönem ')).toBe('1. dönem');
    expect(FolderZ.safeParse('x'.repeat(41)).success).toBe(false);
  });
  it('etiketlerde tekrarlar (büyük-küçük harf farkı dahil) ayıklanır, en fazla 6', () => {
    expect(TagsZ.parse(['sınav', 'Sınav', ' fiiller ', 'SINAV'])).toEqual(['sınav', 'fiiller']);
    expect(TagsZ.safeParse(['1', '2', '3', '4', '5', '6', '7']).success).toBe(false);
    expect(TagsZ.safeParse(['x'.repeat(25)]).success).toBe(false);
  });
  it('eski istemciler klasör ve etiket göndermeden liste kaydedebilir', () => {
    const r = ListZ.parse({ title: 'Liste', items: [{ ar: 'كِتَاب', tr: 'kitap' }] });
    expect(r.folder).toBeUndefined();
    expect(r.tags).toBeUndefined();
    expect(ListZ.parse({ title: 'Liste', folder: 'Okul', tags: ['a'], items: [] })).toMatchObject({ folder: 'Okul', tags: ['a'] });
  });
});
