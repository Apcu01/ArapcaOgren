// OpenRouter metinden sese istemcisi (sunucu ve komut satırı betikleri ortak kullanır; tarayıcıya gönderilmez)
import crypto from 'node:crypto';

export const NARR_MODEL = 'elevenlabs/eleven-v4-turbo';
export const NARR_VOICE = 'sarah';

/** Anlatım metnini seslendirmeye hazırlar: {{ }} işaretleri ve HTML etiketleri kaldırılır */
export const speakable = (s: string) => s.replace(/\{\{|\}\}/g, '').replace(/<[^>]+>/g, '').replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim();

/** Ses anahtarı: model, ses ve metin değişirse değişir */
export const narrKey = (text: string, model = NARR_MODEL, voice = NARR_VOICE) =>
  crypto.createHash('sha256').update(`${model}|${voice}|${speakable(text)}`).digest('hex');

export async function synthesize(text: string, opts: { model?: string; voice?: string; key?: string } = {}): Promise<Buffer> {
  const key = opts.key || process.env.OPENROUTER_API_KEY;
  if (!key) throw new Error('OPENROUTER_API_KEY tanımlı değil.');
  for (let attempt = 1; ; attempt++) {
    const r = await fetch('https://openrouter.ai/api/v1/audio/speech', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: opts.model || NARR_MODEL, voice: opts.voice || NARR_VOICE, input: speakable(text), response_format: 'mp3' })
    });
    const type = r.headers.get('content-type') || '';
    if (r.ok && type.startsWith('audio')) return Buffer.from(await r.arrayBuffer());
    const body = (await r.text()).slice(0, 300);
    // Hız sınırı ve geçici hatalarda bekleyip yeniden dene
    if ((r.status === 429 || r.status >= 500) && attempt < 5) {
      await new Promise((res) => setTimeout(res, 2000 * attempt));
      continue;
    }
    throw new Error(`Ses üretilemedi (HTTP ${r.status}): ${body}`);
  }
}
