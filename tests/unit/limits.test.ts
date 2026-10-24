import { describe, expect, it } from 'vitest';
import { blockedFor, waitMessage, type AttemptRow } from '@/lib/limits';

const now = new Date('2026-10-23T12:00:00Z');
const ago = (min: number) => new Date(now.getTime() - min * 60e3);
const fail = (email: string | null, ip: string, min: number): AttemptRow => ({ email, ip, ok: false, createdAt: ago(min) });

describe('giriş denemesi sınırı', () => {
  it('aynı e-postaya 4 hatalı denemede engel yok, 5.de var', () => {
    const rows = [1, 2, 3, 4].map((m) => fail('a@x.com', '1.1.1.1', m));
    expect(blockedFor('login', rows, 'a@x.com', '1.1.1.1', now)).toBe(0);
    rows.push(fail('a@x.com', '2.2.2.2', 0.5));
    expect(blockedFor('login', rows, 'a@x.com', '1.1.1.1', now)).toBeGreaterThan(0);
  });

  it('engel en eski sayılan deneme pencereden çıkınca kalkar', () => {
    const rows = [14, 10, 8, 6, 2].map((m) => fail('a@x.com', '1.1.1.1', m));
    const wait = blockedFor('login', rows, 'a@x.com', '1.1.1.1', now);
    // En eski deneme 14 dk önce: yaklaşık 1 dk sonra açılır
    expect(wait).toBeGreaterThan(0);
    expect(wait).toBeLessThanOrEqual(60);
  });

  it('15 dakikadan eski denemeler sayılmaz', () => {
    const rows = [16, 17, 18, 19, 20].map((m) => fail('a@x.com', '1.1.1.1', m));
    expect(blockedFor('login', rows, 'a@x.com', '1.1.1.1', now)).toBe(0);
  });

  it('başarılı girişler hatalı sayılmaz', () => {
    const rows: AttemptRow[] = [1, 2, 3, 4, 5].map((m) => ({ email: 'a@x.com', ip: '1.1.1.1', ok: true, createdAt: ago(m) }));
    expect(blockedFor('login', rows, 'a@x.com', '1.1.1.1', now)).toBe(0);
  });

  it("farklı e-postalarla aynı IP'den 20 hatalı deneme IP'yi engeller", () => {
    const rows = Array.from({ length: 20 }, (_, i) => fail(`k${i}@x.com`, '9.9.9.9', 1));
    expect(blockedFor('login', rows, 'yeni@x.com', '9.9.9.9', now)).toBeGreaterThan(0);
    expect(blockedFor('login', rows, 'yeni@x.com', '8.8.8.8', now)).toBe(0);
  });

  it('kayıtta başarılı denemeler de sayılır (IP başına saatte 5)', () => {
    const rows: AttemptRow[] = [5, 10, 20, 30, 40].map((m) => ({ email: null, ip: '3.3.3.3', ok: true, createdAt: ago(m) }));
    expect(blockedFor('register', rows, null, '3.3.3.3', now)).toBeGreaterThan(0);
  });

  it('bekleme mesajı dakikayı yukarı yuvarlar', () => {
    expect(waitMessage(61)).toContain('2 dakika');
  });
});
