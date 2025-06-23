import React from 'react';
import { Box, Paper, Typography, Skeleton, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export function News({ news, otherNews }) {
    const navigate = useNavigate();

    let newsContentArr = news?.content?.split('\n') || [];

    newsContentArr = newsContentArr.filter(item => item.trim() !== '').filter(item => item !== 'Publicidade' && item !== 'Continua depois da publicidade')

    return (
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'column', md: 'row' }, mt: 3, gap: 3 }}> {/*,px: { xs: "2%", sm: "3%", md: "6%", xl: "10%" } */}
            {news ?
                <>
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
                            {newsContentArr.map((item, index) => (
                                <Typography key={index} variant="body1" sx={{ mb: 2 }}>
                                    {item}
                                </Typography>
                            ))}
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
                                            sx={{ width: '100%', height: 'auto', borderRadius: 1, mb: 2, aspectRatio: '16/9', objectFit: 'cover' }}
                                        />
                                    </Box>}
                                    {/* //publishedAt */}
                                    <Typography variant="caption" color="textSecondary" sx={{ mb: 1 }}>
                                        {new Date(item.publishedAt).toLocaleDateString('pt-BR', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric'
                                        })}
                                    </Typography>
                                    <Typography variant="subtitle1">
                                        {item.title.slice(0, 45)}...
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        {item.summary.slice(0, 80)}...
                                    </Typography>
                                    <Divider sx={{ my: 2 }} key={`divider-${index}`} />
                                </Box>

                            ))}
                        </Paper>
                    </Box>
                </>
                :
                <>
                    <Skeleton variant="rounded" sx={{ width: { xs: "100%", sm: "100%", md: "74.07%" } }} height={400} />
                    <Skeleton variant="rounded" sx={{ width: { xs: "100%", sm: "100%", md: "25.93%" } }} height={400} />
                </>}
        </Box>
    );
}