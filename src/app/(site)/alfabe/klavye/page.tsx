import KeyboardTrainer from '@/components/KeyboardTrainer';

export const metadata = {
  title: 'Arapça klavye',
  description: 'Bilgisayarda Arapça yazmayı öğren: Arapça (101) klavyede harflerin yeri, harf harf yazma oyunu, hız ve doğruluk ölçümü. Arapça klavye eklemeden de çalışır.',
  alternates: { canonical: '/alfabe/klavye' }
};

export default function KeyboardPage() {
  return <KeyboardTrainer />;
}
