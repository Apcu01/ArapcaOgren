import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { flushOutbox, outboxSize, send } from '@/lib/outbox';

// Tarayıcı depolaması ve ağ yerine sahte nesneler
const store = new Map<string, string>();
beforeEach(() => {
  store.clear();
  vi.stubGlobal('localStorage', { getItem: (k: string) => store.get(k) ?? null, setItem: (k: string, v: string) => store.set(k, v), removeItem: (k: string) => store.delete(k) });
  vi.stubGlobal('window', { dispatchEvent: () => true });
});
afterEach(() => { vi.unstubAllGlobals(); });

describe('çevrimdışı kuyruk', () => {
  it('ağ hatasında üyenin ilerleme kaydı kuyruğa alınır, istatistik alınmaz', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('offline')));
    expect(await send('/api/progress', { action: 'lesson', topicId: 'aile', day: '2026-11-02' }, 7)).toBeNull();
    await send('/api/metrics', { counts: {} }, 7);
    await send('/api/progress', { action: 'last', topicId: 'aile' }, null);
    expect(outboxSize(7)).toBe(1);
    expect(outboxSize()).toBe(1);
  });

  it('bağlantı gelince sırayla gönderilir; başka hesabın kaydı gönderilmez', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('offline')));
    await send('/api/progress', { n: 1 }, 7);
    await send('/api/lists/3/study', { n: 2 }, 7);
    await send('/api/progress', { n: 3 }, 9);
    const ok = vi.fn().mockResolvedValue(new Response('{}', { status: 200 }));
    vi.stubGlobal('fetch', ok);
    expect(await flushOutbox(7)).toBe(2);
    expect(ok.mock.calls.map((c) => [c[0], JSON.parse(c[1].body).n])).toEqual([['/api/progress', 1], ['/api/lists/3/study', 2]]);
    expect(outboxSize(7)).toBe(0);
    expect(outboxSize(9)).toBe(1);
  });

  it('bağlantı yine koparsa kalanlar bekler, oturum düşerse (401) silinmez', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('offline')));
    await send('/api/progress', { n: 1 }, 7);
    await send('/api/progress', { n: 2 }, 7);
    vi.stubGlobal('fetch', vi.fn().mockResolvedValueOnce(new Response('{}', { status: 200 })).mockRejectedValueOnce(new TypeError('offline')));
    expect(await flushOutbox(7)).toBe(1);
    expect(outboxSize(7)).toBe(1);
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('{}', { status: 401 })));
    expect(await flushOutbox(7)).toBe(0);
    expect(outboxSize(7)).toBe(1);
  });
});
