import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { describe, expect, it } from 'vitest';
import { clean, deepClean } from '../../scripts/typography';
import { TopicInput } from '@/lib/topic-schema';

// Eski sitedeki 12 dersin verisi: yönetim paneli şemasından geçmeli
function oldTopics() {
  const dir = path.join(process.cwd(), 'oldsite', 'assets', 'js', 'data');
  const ctx: Record<string, unknown> = {};
  ctx.window = ctx;
  vm.createContext(ctx);
  for (const f of fs.readdirSync(dir)) vm.runInContext(fs.readFileSync(path.join(dir, f), 'utf8'), ctx);
  return ctx.TOPICS as Record<string, unknown>[];
}

describe('tipografi temizliği', () => {
  it('uzun tire, kıvrık tırnak ve üç nokta karakterini sadeleştirir', () => {
    expect(clean('Bu — şu')).toBe('Bu, şu');
    expect(clean('1–10')).toBe('1-10');
    expect(clean('“Merhaba”')).toBe('"Merhaba"');
    expect(clean('Türkiye’den…')).toBe("Türkiye'den...");
  });
  it('Arapça okunuştaki ayn işaretini korur', () => {
    expect(clean('mu‘allim')).toBe('mu‘allim');
  });
  it('tek başına tire olan tablo hücresini kısa tireye çevirir', () => {
    expect(clean('—')).toBe('-');
  });
});

describe('ders verisi', () => {
  const topics = oldTopics().map((t) => deepClean(t));

  it('12 ders yüklenir', () => {
    expect(topics).toHaveLength(12);
  });

  it.each(topics.map((t) => [t.id as string, t]))('%s yönetim paneli şemasından geçer', (_id, t) => {
    const acts = (t.acts as Record<string, unknown>[]).map((a) => ({ ...a, desc: a.desc ?? '' }));
    const r = TopicInput.safeParse({ ...t, acts, keys: t.keys, mistakes: t.mistakes ?? [] });
    if (!r.success) throw new Error(JSON.stringify(r.error.issues.slice(0, 3)));
    expect(r.success).toBe(true);
  });

  it('her çoktan seçmeli ve boşluk doldurma sorusunun doğru cevabı seçeneklerde bulunur', () => {
    for (const t of topics) {
      for (const a of t.acts as { type: string; items?: Record<string, unknown>[] }[]) {
        for (const q of a.items || []) {
          if (Array.isArray(q)) continue;
          const type = (q.t as string) || (a.type === 'test' ? 'mc' : a.type);
          if (type === 'mc' || type === 'fill') expect(q.options as string[]).toContain(q.a);
          if (type === 'fill') expect(String(q.s)).toContain('___');
        }
      }
    }
  });

  it('içerikte uzun tire kalmaz', () => {
    expect(JSON.stringify(topics)).not.toMatch(/[—“”…]/);
  });

  it('geçersiz kısa ad reddedilir', () => {
    const t = topics[0];
    const r = TopicInput.safeParse({ ...t, id: 'Büyük Harf', acts: [] });
    expect(r.success).toBe(false);
  });
});
