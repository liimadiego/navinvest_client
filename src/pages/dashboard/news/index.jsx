import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/global-config';
import { NewsListView } from 'src/sections/news/view/news-list-view';

const metadata = { title: `Notícias | ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title>{metadata.title}</title>
      </Helmet>

      <NewsListView />
    </>
  );
}
