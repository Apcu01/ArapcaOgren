import { NextRequest } from 'next/server';
import { describe, expect, it } from 'vitest';
import { pushEndpointOk } from '@/lib/push-shared';
import { safeNext } from '@/lib/site';
import { proxy } from '@/proxy';

describe('girişten sonra dönülecek adres', () => {
  const BS = String.fromCharCode(92), TAB = String.fromCharCode(9), NL = String.fromCharCode(10);
  it('sitenin kendi sayfaları olduğu gibi kalır', () => {
    expect(safeNext('/listelerim/12?x=1#a')).toBe('/listelerim/12?x=1#a');
    expect(safeNext('/konu/renkler')).toBe('/konu/renkler');
  });
  it('başka siteye giden yazımlar ana sayfaya döner', () => {
    for (const n of ['//evil.com', '/' + BS + 'evil.com', '/' + BS + BS + 'evil.com', '/' + TAB + '/evil.com', '/' + NL + '/evil.com', 'https://evil.com', 'javascript:alert(1)', '', null, undefined]) {
      expect(safeNext(n), JSON.stringify(n)).toBe('/');
    }
    // Kodlanmış ters bölü sitenin içinde bir yol olarak kalır (başka siteye gitmez)
    expect(safeNext('/%5Cevil.com').startsWith('//')).toBe(false);
  });
});

describe('bildirim adresi: yalnızca tarayıcıların bildirim servisleri', () => {
  it('Chrome, Firefox, Edge ve Safari adresleri kabul edilir', () => {
    for (const u of [
      'https://fcm.googleapis.com/fcm/send/abc:APA91b',
      'https://updates.push.services.mozilla.com/wpush/v2/gAAAAA',
      'https://wns2-par02p.notify.windows.com/w/?token=BQYAAA',
      'https://web.push.apple.com/QGuQyavXutnMH',
      'https://fcm.googleapis.com:443/wp/abc'
    ]) expect(pushEndpointOk(u), u).toBe(true);
  });
  it('iç ağ, başka siteler, http, farklı port ve benzer görünen adresler reddedilir', () => {
    for (const u of [
      'http://fcm.googleapis.com/fcm/send/abc',
      'https://127.0.0.1/x',
      'https://localhost:3000/api/internal/push',
      'https://169.254.169.254/latest/meta-data',
      'https://mysql:3306/',
      'https://evil.example.com/fcm.googleapis.com',
      'https://fcm.googleapis.com.evil.example/x',
      'https://evilgoogleapis.com/x',
      'https://fcm.googleapis.com:8443/x',
      'https://user:pass@fcm.googleapis.com/x',
      'ftp://fcm.googleapis.com/x',
      'adres değil'
    ]) expect(pushEndpointOk(u), u).toBe(false);
  });
});

describe('başka siteden işlem (CSRF) koruması', () => {
  const req = (method: string, headers: Record<string, string> = {}) =>
    new NextRequest('http://localhost:3000/api/progress', { method, headers: { host: 'localhost:3000', ...headers } });
  const passes = (r: Response) => r.headers.get('x-middleware-next') === '1';

  it('sitenin kendi sayfalarından gelen istek geçer', () => {
    expect(passes(proxy(req('POST', { 'sec-fetch-site': 'same-origin', origin: 'http://localhost:3000' })))).toBe(true);
    // Sec-Fetch-Site göndermeyen eski tarayıcı, kendi adresiyle
    expect(passes(proxy(req('POST', { origin: 'http://localhost:3000' })))).toBe(true);
  });
  it('tarayıcı dışı istemciler (zamanlayıcı, cron, testler) etkilenmez', () => {
    expect(passes(proxy(req('POST')))).toBe(true);
    expect(passes(proxy(req('DELETE')))).toBe(true);
  });
  it('aynı ana alan adındaki başka bir alt alan adından ya da başka siteden gelen istek reddedilir', () => {
    expect(proxy(req('POST', { 'sec-fetch-site': 'same-site', origin: 'https://baska.minefox.net' })).status).toBe(403);
    expect(proxy(req('DELETE', { 'sec-fetch-site': 'cross-site' })).status).toBe(403);
    expect(proxy(req('PUT', { origin: 'https://baska.minefox.net' })).status).toBe(403);
    expect(proxy(req('POST', { origin: 'null' })).status).toBe(403);
  });
  it('okuma istekleri (GET) her yerden yapılabilir', () => {
    expect(passes(proxy(req('GET', { 'sec-fetch-site': 'cross-site' })))).toBe(true);
  });
});
