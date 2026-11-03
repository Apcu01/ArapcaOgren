import ClassesView from '@/components/classes/ClassesView';

export const metadata = {
  title: 'Sınıflarım',
  description: 'Öğretmenler sınıf açıp ders, okuma metni ve kelime listesi ödevi verir; öğrenciler kodla katılır.',
  robots: { index: false }
};

export default function ClassesPage() {
  return <ClassesView />;
}
