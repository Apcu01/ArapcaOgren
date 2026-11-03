import ReadingList from '@/components/reading/ReadingList';
import { READINGS, readMins, wordCount } from '@/lib/readings';
import { getTopics } from '@/lib/topics';

export const metadata = {
  title: 'Arapça okuma metinleri',
  description: 'Derslerdeki kelimelerle yazılmış kısa Arapça hikâyeler. Kelimeye dokununca anlamı ve sesi çıkar, metnin sonunda anlama soruları var.',
  alternates: { canonical: '/okuma' }
};

export default async function ReadingsPage() {
  const topics = await getTopics();
  const name = (id: string) => topics.find((t) => t.id === id)?.name || '';
  const cards = READINGS.map((r) => ({ slug: r.slug, title: r.title, ar: r.ar, level: r.level, desc: r.desc, lesson: name(r.topic), words: wordCount(r), mins: readMins(r) }));
  return (
    <div className="max-w-[1100px] mx-auto px-4 sm:px-6 pt-10 pb-20 flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <span className="text-[13px] font-semibold tracking-[.12em] uppercase text-lab">Okuma</span>
        <h1 className="m-0 text-[34px] sm:text-[44px] leading-tight font-bold tracking-tight">Okuma metinleri</h1>
        <p className="m-0 text-mute max-w-[700px] leading-relaxed">Derslerde öğrendiğin kelimelerle yazılmış kısa hikâyeler. Bilmediğin kelimeye dokun, anlamını ve sesini gör. Cümleleri tek tek ya da baştan sona dinleyebilir, sonunda anlama sorularıyla kendini sınayabilirsin.</p>
      </div>
      <ReadingList cards={cards} />
    </div>
  );
}
