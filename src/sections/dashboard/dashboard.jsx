import React, { useState } from 'react';
import { WelcomeBack } from './welcome-back';
import { CompleteCarousel } from 'src/components/complete-carousel';
import { Box } from '@mui/material';

export function Dashboard() {
    const news = [
        {
            id: 1,
            title: "Petrobras (PETR4) recebe indicados para novo conselho com Pietro Mendes como chairman",
            coverUrl: "https://www.moneytimes.com.br/uploads/2025/02/petrobras-petr4-dividendos.jpg",
            buttonText: "Ver mais",
            newsUrl: "/dashboard/news/1"
        },
        {
            id: 2,
            title: "Não é a Taesa (TAEE11) e nem a Engie (EGIE3): A elétrica com maior retorno de dividendos da Ágora",
            coverUrl: "https://www.moneytimes.com.br/uploads/2024/09/setor-eletrico-2.jpg",
            buttonText: "Ver mais",
            newsUrl: "/dashboard/news/2"
        },
        {
            id: 3,
            title: "Banco do Brasil (BBAS3): BBA vê dividendos em xeque",
            coverUrl: "https://www.infomoney.com.br/wp-content/uploads/2023/08/Ed-Sede-BB-Brasilia-2022-Giovanni-Nobile-Assessoria-de-Imprensa-BB-6.jpg?quality=70",
            buttonText: "Ver mais",
            newsUrl: "/dashboard/news/3"
        }
    ]

    return (
        <Box display={'flex'} gap={2} flexDirection={{ xs: 'column', md: 'row' }}>
            <WelcomeBack sx={{ flex: 2 }} />
            <CompleteCarousel sx={{ flex: 1 }} list={news} />
        </Box>
    );
}