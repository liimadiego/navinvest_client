import React, { useEffect, useState } from 'react';
import { WelcomeBack } from './welcome-back';
import { CompleteCarousel } from 'src/components/complete-carousel';
import { Box, Skeleton } from '@mui/material';
import { set } from 'nprogress';
import { ConstructionOutlined } from '@mui/icons-material';

export function Dashboard() {
    const [news, setNews] = useState(null);
    const [errorNews, setErrorNews] = useState(false);

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
                setErrorNews(true);
                console.error('Error:', error);
            });
    }, []);

    return (
        <Box display={'flex'} gap={2} flexDirection={{ xs: 'column', md: 'row' }}>
            <WelcomeBack sx={{ flex: 2 }} />
            {news && !errorNews ? (
                <CompleteCarousel sx={{ flex: 1 }} list={news} />
            ) : (
                errorNews ?
                    "" :
                    <Box sx={{ flex: 1 }}>
                        <Skeleton variant="rounded" width="100%" height={"100%"} />
                    </Box>
            )}
        </Box>
    );
}