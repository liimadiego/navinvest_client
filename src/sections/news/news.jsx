import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export function News({ news, otherNews }) {
    const navigate = useNavigate();

    return (
        <Box sx={{ display: 'flex', flexDirection: { sm: 'column', md: 'row' }, mt: 3, gap: 3, px: { xs: "2%", sm: "3%", md: "6%", xl: "10%" } }}>
            <Box flex={2}>
                <Paper sx={{ p: 3, pt: 2, borderRadius: 1 }}>
                    <Typography variant="h4" sx={{ mb: 2 }}>
                        {news?.title}
                    </Typography>
                    {news?.coverUrl && (
                        <Box width={"100%"} sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Box
                                component="img"
                                src={news.coverUrl}
                                alt={news.title}
                                sx={{ width: '100%', height: 'auto', borderRadius: 1, mb: 2 }}
                            />
                        </Box>
                    )}
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }} dangerouslySetInnerHTML={{ __html: news?.content }} />
                </Paper>
            </Box>
            <Box flex={.7} sx={{ display: 'flex', flexDirection: "column" }}>
                <Paper sx={{ width: 1, p: 2, borderRadius: 1 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Outras Notícias
                    </Typography>
                    {otherNews?.map((item, index) => (
                        <Box key={index} sx={{ mb: 2, cursor: 'pointer' }} onClick={() => navigate(item.newsUrl)}>
                            {item.coverUrl && <Box width={"100%"} sx={{ display: 'flex', justifyContent: 'center' }}>
                                <Box
                                    component="img"
                                    src={item.coverUrl}
                                    alt={item.title}
                                    sx={{ width: '100%', height: 'auto', borderRadius: 1, mb: 2 }}
                                />
                            </Box>}
                            <Typography variant="subtitle1">
                                {item.title}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                {item.summary.slice(0, 80)}...
                            </Typography>
                        </Box>
                    ))}
                </Paper>
            </Box>
        </Box>
    );
}