import { notFound } from 'next/navigation';
import StudyShell from '@/components/lists/StudyShell';
import { MODES, type ModeKey } from '@/lib/study';

type Params = { params: Promise<{ id: string; mod: string }> };

export async function generateMetadata({ params }: Params) {
  const { mod } = await params;
  const m = MODES.find((x) => x.key === mod);
  return { title: m ? m.name : 'Kelime listesi', robots: { index: false } };
}

export default async function StudyPage({ params }: Params) {
  const { id: raw, mod } = await params;
  const id = Number(raw);
  if (!Number.isInteger(id) || id <= 0 || !MODES.some((m) => m.key === mod)) notFound();
  return <StudyShell id={id} mode={mod as ModeKey} />;
}
