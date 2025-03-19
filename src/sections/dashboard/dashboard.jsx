import React, { useEffect, useState } from 'react';
import { WelcomeBack } from './welcome-back';
import { CompleteCarousel } from 'src/components/complete-carousel';
import { Box } from '@mui/material';

export function Dashboard() {
    const [news, setNews] = useState(null);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_SERVER_URL2}/news/latest_news`)
            .then((response) => response.json())
            .then((data) => {
                const formattedData = data.map((item) => {
                    return {
                        id: item.uuid,
                        title: item.title,
                        coverUrl: item.image_url,
                        buttonText: "Ver mais",
                        newsUrl: `/dashboard/noticias/${item.uuid}`
                    };
                });
                setNews(formattedData);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }, []);

    return (
        <Box display={'flex'} gap={2} flexDirection={{ xs: 'column', md: 'row' }}>
            <WelcomeBack sx={{ flex: 2 }} />
            {news ? <CompleteCarousel sx={{ flex: 1 }} list={news} /> : <Box sx={{ flex: 1 }} />}
        </Box>
    );
}