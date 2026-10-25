import { NextResponse } from 'next/server';
import { getTopics } from '@/lib/topics';

// Çevrimdışı kullanım için önbelleğe alınacak sayfalar
export async function GET() {
  const topics = await getTopics();
  const urls = ['/', '/sozluk', '/alfabe', '/ilerleme', '/hatalarim', '/cevrimdisi', ...topics.map((t) => `/konu/${t.id}`)];
  return NextResponse.json({ urls });
}
