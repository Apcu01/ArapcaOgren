import LeagueView from '@/components/LeagueView';

export const metadata = {
  title: 'Haftalık lig',
  description: 'Ders okudukça, etkinlik bitirdikçe ve kelime listelerini çalıştıkça puan kazan; haftanın sıralamasında yerini gör.',
  alternates: { canonical: '/lig' }
};

export default function LeaguePage() {
  return <LeagueView />;
}
