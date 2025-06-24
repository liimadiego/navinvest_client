import React, { useContext, useEffect, useState } from 'react';
import { WelcomeBack } from './welcome-back';
import { CompleteCarousel } from 'src/components/complete-carousel';
import { Box, colors, Divider, Skeleton, Typography } from '@mui/material';

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
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

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

    const [sectorWalletEvolution, setSectorWalletEvolution] = useState(null);
    const [sectorsAvailable, setSectorsAvailable] = useState(null);
    const [sectorSelected, setSectorSelected] = useState(null);
    const [isSectorDataLoading, setIsSectorDataLoading] = useState(false);

    const theme = useTheme();
    const { currentWallet } = useContext(WalletContext);

    const convertToBRLMonth = (month) => {
        const monthNames = [
            'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
            'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
        ];
        return monthNames[month - 1];
    }

    const getLast12Months = () => {
        const data = new Date();
        const mes = data.getMonth() + 1;
        const ano = data.getFullYear();
        const meses = [];
        for (let i = 0; i < 12; i++) {
            const mesAtual = mes - i;
            if (mesAtual <= 0) {
                meses.unshift(`${ano - 1}-${12 + mesAtual}`);
            } else {
                meses.unshift(`${ano}-${mesAtual}`);
            }
        }
        return meses.map((item) => {
            const [ano, mes] = item.split("-");
            return `${convertToBRLMonth(Number(mes))}/${ano}`;
        });
    }

    const setDefaultValues = () => {
        setTotalAssets(0);
        setTotalInvested(0);
        setHistoricalTotalAssets({
            categories: [...getLast12Months()],
            series: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        });
        setHistoricalTotalInvested({
            categories: [...getLast12Months()],
            series: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        });
        setTotalAssetEvolutionThisMonth(0);
        setTotalAssetEvolutionTwelveMonths(0);
        setPortfolioDivision([]);
        setWalletEvolution({
            categories: [...getLast12Months()],
            series: [{
                name: "Evolução da carteira",
                data: [
                    {
                        name: 'Valor aplicado',
                        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                    },
                    {
                        name: 'Ganho de capital',
                        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                    },
                ],
            }]
        });
    }

    useEffect(() => {
        setDefaultValues();
        if (currentWallet && currentWallet.id) {
            setError(false);
            setLoading(true);

            axios.get(`/investment-portfolio/get-sectors-available-from-portfolio/${currentWallet.id}`)
                .then(({ data }) => {
                    setSectorsAvailable(data || []);
                    if (sectorSelected === null && data && data.length > 0) {
                        setSectorSelected(data[0]);
                    }
                })
                .catch(() => {
                    setError(true);
                })
                .finally(() => {
                    setLoading(false);
                });

            axios.get(`/investment-portfolio/portfolio-data/${currentWallet.id}`)
                .then(({ data }) => {
                    if (!data.currentTotalAssets || !data.currentTotalInvested) {
                        setError(true);
                        setLoading(false);
                        return;
                    }
                    setTotalAssets(data?.currentTotalAssets || 0);
                    setTotalInvested(data?.currentTotalInvested || 0);

                    const totalAssetsChartCategories = data.historicalData.length > 0 ? data.historicalData.map((item) => {
                        const month = numToMonth(item.month);
                        return month;
                    }) : [...getLast12Months()];

                    const monthsReversed = totalAssetsChartCategories.reverse();

                    const totalAssetsChartSeries = data.historicalData.length > 0 ? data.historicalData.map((item) => {
                        return item?.totalAssets || 0;
                    }) : [...getLast12Months()];

                    const totalInvestedChartSeries = data.historicalData.length > 0 ? data.historicalData.map((item) => {
                        return item.totalInvested;
                    }) : [...getLast12Months()];

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

                    const firstMonthData = data.historicalData.reverse().find((item, index) => item.totalAssets > 0 && item.totalInvested > 0);

                    if (!firstMonthData) {
                        setTotalAssetEvolutionThisMonth(0);
                        setTotalAssetEvolutionTwelveMonths(0);
                        setLoading(false);
                        return;
                    }

                    const firstMonthIndex = data.historicalData.indexOf(firstMonthData);

                    let evolutionTotalAssets = 0;

                    if (firstMonthIndex === 11) {
                        evolutionTotalAssets = ((firstMonthData.totalAssets - firstMonthData.totalInvested) / firstMonthData.totalInvested) * 100;
                    } else {
                        evolutionTotalAssets = calculatePatrimonyEvolution(data.historicalData.slice(-2))
                    }

                    setTotalAssetEvolutionThisMonth(evolutionTotalAssets);

                    let evolutionTwelveMonths = 0;

                    if (data.historicalData.length > 0) {
                        if (firstMonthIndex === 11) {
                            evolutionTwelveMonths = evolutionTotalAssets
                        } else {
                            const lastMonthData = data.historicalData.at(-1);
                            const firstMonthData = data.historicalData[firstMonthIndex];
                            evolutionTwelveMonths = calculatePatrimonyEvolution([firstMonthData, lastMonthData]);
                        }
                    }

                    setTotalAssetEvolutionTwelveMonths(evolutionTwelveMonths);

                    const portfolioDivisionChartSeries = data?.portfolioDivision && data.portfolioDivision.length > 0 ? data.portfolioDivision.map((item) => {
                        return {
                            label: item.category,
                            value: Number(item.total_percentage) || 0
                        }
                    }) : [];

                    setPortfolioDivision(portfolioDivisionChartSeries);

                    setWalletEvolution(data.historicalData.length > 0 ? {
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
                    } : {
                        categories: [...getLast12Months()],
                        series: [{
                            name: "Evolução da carteira",
                            data: [
                                {
                                    name: 'Valor aplicado',
                                    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                                },
                                {
                                    name: 'Ganho de capital',
                                    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                                },
                            ],
                        }]
                    })

                    setLoading(false);
                })
                .catch((error) => {
                    console.error('Error fetching wallet data:', error);
                    localStorage.removeItem('selectedWallet');
                    setError(true);
                    setLoading(false);
                });
        }
    }, [currentWallet]);

    useEffect(() => {
        if (currentWallet && currentWallet.id && sectorSelected !== null) {
            setIsSectorDataLoading(true);

            axios.get(`/investment-portfolio/portfolio-data/${currentWallet.id}?sector=${sectorSelected}`)
                .then(({ data }) => {
                    // Sempre definir o estado, mesmo que não haja dados
                    if (data && data.historicalData && data.historicalData.length > 0) {
                        const totalAssetsChartCategories = data.historicalData.map((item) => {
                            const month = numToMonth(item.month);
                            return month;
                        });

                        const monthsReversed = totalAssetsChartCategories.reverse();

                        const totalAssetsChartSeries = data.historicalData.map((item) => {
                            return item?.totalAssets || 0;
                        });

                        const totalInvestedChartSeries = data.historicalData.map((item) => {
                            return item.totalInvested || 0;
                        });

                        const totalAssetReversed = totalAssetsChartSeries.reverse();
                        const totalInvestedReversed = totalInvestedChartSeries.reverse();

                        setSectorWalletEvolution({
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
                        });
                    } else {
                        // Definir dados vazios quando não há histórico
                        setSectorWalletEvolution({
                            categories: [...getLast12Months()],
                            series: [{
                                name: "Evolução da carteira",
                                data: [
                                    {
                                        name: 'Valor aplicado',
                                        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                                    },
                                    {
                                        name: 'Ganho de capital',
                                        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                                    },
                                ],
                            }]
                        });
                    }
                })
                .catch((error) => {
                    console.error('Error fetching sector wallet data:', error);
                    // Definir dados vazios em caso de erro
                    setSectorWalletEvolution({
                        categories: [...getLast12Months()],
                        series: [{
                            name: "Evolução da carteira",
                            data: [
                                {
                                    name: 'Valor aplicado',
                                    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                                },
                                {
                                    name: 'Ganho de capital',
                                    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                                },
                            ],
                        }]
                    });
                })
                .finally(() => {
                    // Sempre finalizar o loading, independente do resultado
                    setIsSectorDataLoading(false);
                });
        }
    }, [currentWallet, sectorSelected]);

    const calculatePatrimonyEvolution = (historicalData) => {
        if (!historicalData || historicalData.length === 0) {
            return 0;
        }

        let baseValue = 1;
        const lastMonthIncome = historicalData[0].totalAssets - historicalData[0].totalInvested;
        const currentMonthIncome = historicalData[1].totalAssets - historicalData[1].totalInvested;

        const monthlyReturn = (currentMonthIncome - lastMonthIncome) / historicalData[1].totalInvested;
        baseValue = (1 + monthlyReturn);

        return (baseValue - 1) * 100;
    }

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
                {historicalTotalAssets != null && totalAssets != null ? <IndicatorChartMini
                    title="Patrimônio total"
                    percent={totalAssetEvolutionThisMonth || 0}
                    total={totalAssets || 0}
                    chart={historicalTotalAssets}
                /> : <Skeleton variant="rounded" width="100%" height={"160px"} />}
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
                {historicalTotalInvested != null && totalInvested != null ? <IndicatorChartMini
                    title="Valor total investido"
                    total={totalInvested || 0}
                    chart={historicalTotalInvested}
                /> : <Skeleton variant="rounded" width="100%" height={"100%"} />}
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
                {totalAssetEvolutionTwelveMonths != null ? <IndicatorChartMini
                    title="Desempenho da carteira (12 meses)"
                    message={(totalAssetEvolutionTwelveMonths === 0) ? "" : (totalAssetEvolutionTwelveMonths > 0 ? "Aumento de patrimônio" : "Redução de patrimônio")}
                    type="percent"
                    total={totalAssetEvolutionTwelveMonths || 0}
                /> : <Skeleton variant="rounded" width="100%" height={"100%"} />}
            </Grid>

            <Grid size={{ xs: 12, md: 4, lg: 4 }}>
                {portfolioDivision ? <DonutChart
                    title="Ativos na carteira"
                    subheader="Classificados por tipo"
                    chart={{
                        series: portfolioDivision
                    }}
                /> : <Skeleton variant="rounded" width="100%" height={"100%"} />}
            </Grid>

            <Grid size={{ xs: 12, md: 8, lg: 8 }}>
                {walletEvolution ? <WealthEvolution
                    sx={{ height: 1 }}
                    title={`Evolução da carteira (12 meses)`}
                    subheader={`(${totalAssetEvolutionTwelveMonths < 0 ? "-" : "+"}${totalAssetEvolutionTwelveMonths ? totalAssetEvolutionTwelveMonths.toFixed(2) : 0}%) no último ano`}
                    chart={{
                        colors: [
                            theme.palette.primary.main,
                            theme.palette.primary.lighter,
                        ],
                        categories: walletEvolution?.categories,
                        series: walletEvolution?.series,
                    }}
                /> : <Skeleton variant="rounded" width="100%" height={"100%"} />}
            </Grid>


            {Array.isArray(sectorsAvailable) && sectorsAvailable.length > 0 && <Grid size={{ xs: 12, md: 12 }}>
                <Divider sx={{ width: '100%', mb: 3, mt: 1 }} />
                <Typography variant="h5" sx={{ mb: 2 }}>
                    Evolução da carteira por setor
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Typography variant="subtitle1">
                        Selecione um setor para visualizar a evolução da carteira:
                    </Typography>
                    {isSectorDataLoading ? (
                        <Skeleton variant="rounded" width="100%" height={"40px"} />
                    ) : (
                        <Box sx={{ minWidth: 120 }}>
                            {sectorsAvailable && sectorsAvailable.length > 0 ? (
                                <FormControl fullWidth>
                                    <InputLabel id="sector-select-label">Setor</InputLabel>
                                    <Select
                                        labelId="sector-select-label"
                                        id="sector-select"
                                        value={sectorSelected || ''}
                                        label="Setor"
                                        onChange={(e) => setSectorSelected(e.target.value)}
                                    >
                                        {sectorsAvailable.map((sector) => (
                                            <MenuItem key={sector} value={sector}>
                                                {sector}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            ) : (
                                <Typography variant="body2" sx={{ color: colors.grey[600] }}>
                                    Nenhum setor disponível
                                </Typography>
                            )}
                        </Box>
                    )}
                </Box>
                <Grid size={12} sx={{ mt: 3 }}>
                    {sectorWalletEvolution && !isSectorDataLoading ? <WealthEvolution
                        sx={{ height: 1 }}
                        title={`Evolução da carteira (12 meses) - ${sectorSelected}`}
                        chart={{
                            colors: [
                                theme.palette.primary.main,
                                theme.palette.primary.lighter,
                            ],
                            categories: sectorWalletEvolution?.categories,
                            series: sectorWalletEvolution?.series,
                        }}
                    /> : <Skeleton variant="rounded" width="100%" height={"100%"} />}
                </Grid>
            </Grid>}

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