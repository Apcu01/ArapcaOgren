import { describe, expect, it } from 'vitest';

// Sayfa boyutu testleri: büyük veriler sayfalara gömülmüyor mu?
// - Ses eşlemesi (~160 KB) her sayfada vardı: artık yalnızca sürümü gömülür, eşleme ayrı ve önbellekli adresten gelir.
// - Ana sayfa ve İlerlemem bütün dersleri (anlatım, kelimeler, sorular) gönderiyordu: artık yalnızca kart özeti.
// - Yazı tipleri Google'dan değil sitenin kendisinden gelir.
// Çalışan bir sunucu gerekir (TEST_BASE_URL, varsayılan http://localhost:3000). Veritabanına yazmaz.

const BASE = (process.env.TEST_BASE_URL || 'http://localhost:3000').replace(/\/$/, '');
const page = async (path: string) => {
  const r = await fetch(BASE + path);
  expect(r.status, path).toBe(200);
  return r.text();
};
// Sayfa verisi HTML içinde kaçışlı JSON olarak durur: "anahtar": ya da \"anahtar\":
const hasKey = (html: string, key: string) => new RegExp(`\\\\?"${key}\\\\?":`).test(html);
const audioVOf = (html: string) => html.match(/\\?"audioV\\?":\\?"([A-Za-z0-9_-]+)\\?"/)?.[1];

describe('ses eşlemesi sayfalara gömülmez', () => {
  it('sayfada yalnızca sürüm var; eşleme sürüm adresinden uzun süreli önbellekle gelir', async () => {
    const html = await page('/lig');
    expect(hasKey(html, 'audios')).toBe(false);
    const v = audioVOf(html);
    expect(v, 'audioV sayfada olmalı').toBeTruthy();

    const r = await fetch(`${BASE}/api/audio/map?v=${v}`);
    expect(r.status).toBe(200);
    expect(r.headers.get('cache-control')).toBe('public, max-age=31536000, immutable');
    const map = (await r.json()) as Record<string, number>;
    expect(typeof map).toBe('object');
    for (const id of Object.values(map).slice(0, 50)) expect(Number.isInteger(id)).toBe(true);
  });

  it('eski sürümle istenirse güncel eşleme döner ama önbelleğe alınmaz', async () => {
    const r = await fetch(`${BASE}/api/audio/map?v=eski-surum`);
    expect(r.status).toBe(200);
    expect(r.headers.get('cache-control')).toBe('no-cache');
  });

  it('bütün sayfalar aynı sürümü taşır', async () => {
    const [a, b] = await Promise.all([page('/'), page('/okuma')]);
    expect(audioVOf(a)).toBe(audioVOf(b));
  });
});

describe('liste sayfaları dersin tamamını göndermez', () => {
  it('ana sayfa ve İlerlemem yalnızca kart özetini taşır', async () => {
    for (const path of ['/', '/ilerleme']) {
      const html = await page(path);
      // Kart bilgileri ve etkinlik listesi var
      expect(hasKey(html, 'acts'), path).toBe(true);
      expect(hasKey(html, 'glyph'), path).toBe(true);
      // Anlatım, kelimeler, püf noktaları ve sorular yok
      for (const k of ['lesson', 'words', 'intro', 'keys', 'mistakes', 'summaryNarr', 'items']) expect(hasKey(html, k), `${path} ${k}`).toBe(false);
    }
  });

  it('sözlük kelimeleri taşır ama anlatımı ve soruları taşımaz', async () => {
    const html = await page('/sozluk');
    expect(hasKey(html, 'words')).toBe(true);
    for (const k of ['lesson', 'intro', 'acts', 'summaryNarr']) expect(hasKey(html, k), k).toBe(false);
  });

  it('ders sayfası dersin tamamını taşımaya devam eder', async () => {
    const html = await page('/konu/zamirler');
    for (const k of ['lesson', 'words', 'acts']) expect(hasKey(html, k), k).toBe(true);
  });
});

describe('yazı tipleri sitenin kendisinden', () => {
  it('sayfa Google Fonts adresine bağlanmaz; yazı tipi değişkenleri html etiketinde', async () => {
    const html = await page('/');
    expect(html).not.toContain('fonts.googleapis.com');
    expect(html).not.toContain('fonts.gstatic.com');
    expect(html).toMatch(/<html[^>]*class="[^"]*variable[^"]*"/);
  });
});
