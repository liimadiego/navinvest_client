import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/global-config';
import { NewsView } from 'src/sections/news/view/news-view';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ConstructionOutlined } from '@mui/icons-material';

export default function Page() {
  const { news_id } = useParams();
  const [news, setNews] = useState(null);
  const [otherNews, setOtherNews] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_SERVER_URL2}/news/${news_id}`)
      .then((response) => response.json())
      .then((data) => {
        const formattedData = {
          id: data.uuid,
          title: data.title,
          content: data.content,
          coverUrl: data.image_url,
          buttonText: "Ver mais",
          newsUrl: `/dashboard/noticias/${data.uuid}`
        }
        setNews(formattedData);
      })
      .catch((error) => {
        console.error('Error:', error);
      });

    fetch(`${import.meta.env.VITE_SERVER_URL2}/news/other_news/${news_id}`)
      .then((response) => response.json())
      .then((data) => {
        const formattedData = data.map((item) => {
          return {
            id: item.uuid,
            title: item.title,
            coverUrl: item.image_url,
            summary: item.content,
            newsUrl: `/dashboard/noticias/${item.uuid}`
          };
        });
        setOtherNews(formattedData);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, []);

  const metadata = { title: `${news?.title ?? ""} | ${CONFIG.appName.toUpperCase()}` };

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <NewsView news={news} otherNews={otherNews} />
    </>
  );
}
