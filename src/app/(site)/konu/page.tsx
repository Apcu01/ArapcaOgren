import { permanentRedirect } from 'next/navigation';

// Eski ders adresi (/konu?id=renkler) yeni adrese kalıcı olarak yönlendirilir: /konu/renkler
export default async function OldTopicUrl({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const { id } = await searchParams;
  permanentRedirect(id && /^[a-z0-9-]{1,64}$/.test(id) ? `/konu/${id}` : '/');
}
