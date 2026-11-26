import LoanwordsView from '@/components/LoanwordsView';

export const metadata = {
  title: 'Türkçedeki Arapça kelimeler',
  description: 'Kitap, saat, hayat, dünya: Türkçede her gün kullandığımız kelimelerin Arapça aslı ve sesi. Anlamı değişenler (medrese, misafir, sadık, muhabbet) ve Arapça çoğuldan gelenler (eşya, evlat, akraba). Anlamı aynı mı oyunuyla çalış.',
  alternates: { canonical: '/turkcedeki-arapca' }
};

export default function LoanwordsPage() {
  return <LoanwordsView />;
}
