import React, { useContext, useEffect, useState } from 'react';
import { WelcomeBack } from './welcome-back';
import { CompleteCarousel } from 'src/components/complete-carousel';
import { Box, colors, Skeleton } from '@mui/material';

import Grid from '@mui/material/Grid2';
import { IndicatorChartMini } from 'src/components/indicator-chart-mini';
import { useTheme } from '@emotion/react';
import { DonutChart } from 'src/components/donut-chart';
import { WealthEvolution } from 'src/components/wealth-evolution';
import { AssetRankings } from 'src/components/asset-rankings';
import { _appRelated } from 'src/_mock';
import { ComparisonChart } from 'src/components/comparison-chart';
import { WalletContext } from 'src/context/WalletContext';
import { numToMonth } from 'src/utils/format-date';
import axios from 'src/lib/axios';

export function Dashboard() {
    const [news, setNews] = useState(null);
    const [errorNews, setErrorNews] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const [totalAssets, setTotalAssets] = useState(null);
    const [historicalTotalAssets, setHistoricalTotalAssets] = useState(null);
    const [historicalTotalInvested, setHistoricalTotalInvested] = useState(null);
    const [totalAssetEvolutionThisMonth, setTotalAssetEvolutionThisMonth] = useState(null);
    const [totalAssetEvolutionTwelveMonths, setTotalAssetEvolutionTwelveMonths] = useState(null);
    const [totalInvested, setTotalInvested] = useState(null);
    const [portfolioDivision, setPortfolioDivision] = useState(null);
    const [walletEvolution, setWalletEvolution] = useState(null);

    const theme = useTheme();
    const { currentWallet } = useContext(WalletContext);

    useEffect(() => {
        if (currentWallet && currentWallet.id) {
            setTotalAssets(null);
            setTotalInvested(null);
            setHistoricalTotalAssets(null);
            setHistoricalTotalInvested(null);
            setTotalAssetEvolutionThisMonth(null);
            setTotalAssetEvolutionTwelveMonths(null);
            setPortfolioDivision(null);
            setWalletEvolution(null);
            setError(false);
            setLoading(true);

            axios.get(`/investment-portfolio/portfolio-data/${currentWallet.id}`)
                .then(({ data }) => {
                    if (!data.currentTotalAssets || !data.currentTotalInvested) {
                        setError(true);
                        setLoading(false);
                        return;
                    }
                    setTotalAssets(data.currentTotalAssets);
                    setTotalInvested(data.currentTotalInvested);

                    const totalAssetsChartCategories = data.historicalData.map((item) => {
                        const month = numToMonth(item.month);
                        return month;
                    });

                    const monthsReversed = totalAssetsChartCategories.reverse();

                    const totalAssetsChartSeries = data.historicalData.map((item) => {
                        return item.totalAssets;
                    });

                    const totalInvestedChartSeries = data.historicalData.map((item) => {
                        return item.totalInvested;
                    });

                    const totalAssetReversed = totalAssetsChartSeries.reverse();
                    const totalInvestedReversed = totalInvestedChartSeries.reverse();

                    setHistoricalTotalAssets({
                        categories: monthsReversed,
                        series: totalAssetReversed,
                    });

                    setHistoricalTotalInvested({
                        categories: monthsReversed,
                        series: totalInvestedReversed,
                    });

                    const evolutionTotalAssets = (data.currentTotalAssets / totalAssetsChartSeries[totalAssetsChartSeries.length - 1]) * 100 - 100;

                    setTotalAssetEvolutionThisMonth(evolutionTotalAssets);

                    const evolutionTwelveMonths = (data.currentTotalAssets / data.historicalData[data.historicalData.length - 1].totalAssets) * 100 - 100;

                    setTotalAssetEvolutionTwelveMonths(evolutionTwelveMonths);

                    const portfolioDivisionChartSeries = data.portfolioDivision.map((item) => {
                        return {
                            label: item.category,
                            value: Number(item.total_percentage) || 0
                        }
                    });

                    setPortfolioDivision(portfolioDivisionChartSeries);

                    setWalletEvolution({
                        categories: monthsReversed,
                        series: [
                            {
                                name: "Evolução da carteira",
                                data: [
                                    {
                                        name: 'Valor aplicado',
                                        data: totalInvestedReversed
                                    },
                                    {
                                        name: 'Ganho de capital',
                                        data: totalAssetReversed.map((item, index) => {
                                            return Number((item - totalInvestedReversed[index]).toFixed(2)) || 0;
                                        })
                                    },
                                ],
                            }
                        ]
                    })

                    setLoading(false);
                })
                .catch((error) => {
                    console.error('Error fetching wallet data:', error);
                    setError(true);
                    setLoading(false);
                });
        }
    }, [currentWallet]);

    useEffect(() => {
        axios.get(`/news/latest_news`)
            .then(({ data }) => {
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
        <Grid container spacing={3} mt={3}>
            <Grid size={{ xs: 12, md: (news && news.length > 0) ? 8 : 12 }}>
                <WelcomeBack />
            </Grid>

            {news && news.length > 0 && <Grid size={{ xs: 12, md: 4 }}>
                <CompleteCarousel sx={{ flex: 1 }} list={news} />
            </Grid>}

            <Grid size={{ xs: 12, md: 4 }}>
                {historicalTotalAssets && totalAssets ? <IndicatorChartMini
                    title="Patrimônio total"
                    percent={totalAssetEvolutionThisMonth || 0}
                    total={totalAssets || 0}
                    chart={historicalTotalAssets}
                /> : <Skeleton variant="rounded" width="100%" height={"160px"} />}
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
                {historicalTotalInvested && totalInvested ? <IndicatorChartMini
                    title="Valor total investido"
                    total={totalInvested || 0}
                    chart={historicalTotalInvested}
                /> : <Skeleton variant="rounded" width="100%" height={"100%"} />}
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
                {totalAssetEvolutionTwelveMonths ? <IndicatorChartMini
                    title="Desempenho da carteira (12 meses)"
                    message={totalAssetEvolutionTwelveMonths > 0 ? "Aumento de patrimônio" : "Redução de patrimônio"}
                    type="percent"
                    total={totalAssetEvolutionTwelveMonths || 0}
                /> : <Skeleton variant="rounded" width="100%" height={"100%"} />}
            </Grid>

            <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                {portfolioDivision ? <DonutChart
                    title="Ativos na carteira"
                    subheader="Classificados por tipo"
                    chart={{
                        series: portfolioDivision
                    }}
                /> : <Skeleton variant="rounded" width="100%" height={"100%"} />}
            </Grid>

            <Grid size={{ xs: 12, md: 6, lg: 8 }}>
                {walletEvolution ? <WealthEvolution
                    sx={{ height: 1 }}
                    title="Evolução da carteira (12 meses)"
                    subheader="(+43%) no último ano"
                    chart={{
                        colors: [
                            theme.palette.info.dark,
                            theme.palette.info.light,
                        ],
                        categories: walletEvolution?.categories,
                        series: walletEvolution?.series,
                    }}
                /> : <Skeleton variant="rounded" width="100%" height={"100%"} />}
            </Grid>

            {/* <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                <AssetRankings title="Ranking de ativos" list={_appRelated} />
            </Grid> */}

            {/* <Grid size={{ xs: 12, md: 12, lg: 12 }}>
                <ComparisonChart
                    sx={{ height: 1 }}
                    title="Carteira X Mercado"
                    subheader="Comparação com ativos do mercado"
                    chart={{
                        categories: [
                            'Jan',
                            'Feb',
                            'Mar',
                            'Apr',
                            'May',
                            'Jun',
                            'Jul',
                            'Aug',
                            'Sep',
                            'Oct',
                            'Nov',
                            'Dec',
                        ],
                        series: [
                            {
                                name: '2022',
                                data: [
                                    {
                                        name: 'IBOV11',
                                        data: [1, 2, -3, -2, -2.5, -2.7, -2, 1.7, 1.5, 1.55, 1.60, 1.65],
                                    },
                                    {
                                        name: 'CDI',
                                        data: [0, 1, -4, -2, -2.7, -3.5, -2, 2.7, 3.5, 2.55, 2.60, 3.65],
                                    },
                                    {
                                        name: 'Carteira',
                                        data: [1, 2, 3, 2, 3, 3.5, 2, 4.7, 4.5, 5.55, 6.26, 6.65],
                                    }
                                ],
                            },
                            {
                                name: '2023',
                                data: [
                                    {
                                        name: 'IBOV11',
                                        data: [2, 3, -2, -1, -1.5, -1.7, -1, 2.7, 2.5, 2.55, 2.60, 4.65],
                                    },
                                    {
                                        name: 'CDI',
                                        data: [1, 2, -3, -1, -1.7, -2.5, -1, 3.7, 4.5, 3.55, 3.66, 5.65],
                                    },
                                    {
                                        name: 'Carteira',
                                        data: [2, 3, 4, 3, 4, 4.5, 3, 5.7, 5.5, 6.55, 7.26, 7.65],
                                    }
                                ],
                            },
                        ],
                    }}
                />
            </Grid> */}
        </Grid>
    );
}