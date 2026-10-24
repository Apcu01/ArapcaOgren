import HomeView from '@/components/HomeView';
import { SITE_DESC, SITE_NAME, siteOrigin } from '@/lib/site';
import { getTopics } from '@/lib/topics';

export const metadata = { alternates: { canonical: '/' } };

export default async function HomePage() {
  const topics = await getTopics();
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    description: SITE_DESC,
    inLanguage: 'tr',
    url: siteOrigin() + '/'
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, '\\u003c') }} />
      <HomeView topics={topics} />
    </>
  );
}
