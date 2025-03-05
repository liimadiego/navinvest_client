import React, { useContext, useEffect, useRef } from 'react';
import { useRouter } from 'src/routes/hooks';
import { Box, Typography, Card, Grid } from '@mui/material';
import { format } from 'date-fns';
import { BacktestContext } from 'src/context/BacktestContext';
import { Chart, LineController, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend } from 'chart.js';

// Registra os componentes necessários do Chart.js
Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

export function BacktestResults() {
    const { results } = useContext(BacktestContext);
    const chartRef = useRef(null);
    const cumulativeChartRef = useRef(null);

    useEffect(() => {
        if (!results || !chartRef.current || !cumulativeChartRef.current) return;

        const dataLength = results.dailyReturns.length;
        let groupBy;

        if (dataLength <= 15) {
            groupBy = 'day';
        } else if (dataLength <= 100) {
            groupBy = 'week';
        } else if (dataLength <= 1000) {
            groupBy = 'month';
        } else {
            groupBy = 'year';
        }

        const monthlyData = results.dailyReturns.reduce((acc, [timestamp, returnValue]) => {
            const date = new Date(timestamp);
            let key;

            switch (groupBy) {
                case 'day':
                    key = format(date, 'yyyy-MM-dd');
                    break;
                case 'week':
                    const startOfWeek = date.setDate(date.getDate() - date.getDay());
                    key = format(new Date(startOfWeek), 'yyyy-MM-dd');
                    break;
                case 'month':
                    key = `${date.getFullYear()}-${date.getMonth()}`;
                    break;
                case 'year':
                    key = `${date.getFullYear()}`;
                    break;
                default:
                    key = `${date.getFullYear()}-${date.getMonth()}`;
            }

            if (!acc[key]) {
                acc[key] = {
                    date: format(date, groupBy === 'day' ? 'dd/MM/yyyy' : groupBy === 'week' ? 'dd/MM/yyyy' : groupBy === 'month' ? 'MM/yyyy' : 'yyyy'),
                    return: 0,
                    count: 0,
                };
            }

            acc[key].return += returnValue;
            acc[key].count += 1;
            return acc;
        }, {});

        const chartData = Object.values(monthlyData).map((item) => ({
            date: item.date,
            return: (item.return / item.count) * 100, // Média mensal
        }));

        let cumulativeReturn = 0;
        const cumulativeData = results.dailyReturns.map(([timestamp, returnValue]) => {
            cumulativeReturn += returnValue;
            return {
                date: format(new Date(timestamp), 'dd/MM/yyyy'),
                return: cumulativeReturn * 100
            };
        });

        //tecnica para reduzir dados do gráfico de retorno acumulado:
        const maxDataPoints = 30;
        if (cumulativeData.length > maxDataPoints) {
            const step = Math.ceil(cumulativeData.length / maxDataPoints);
            const reducedData = cumulativeData.filter((_, index) => index % step === 0);
            cumulativeData.length = 0;
            cumulativeData.push(...reducedData);
        }

        const ctx = chartRef.current.getContext('2d');
        const chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: chartData.map((item) => item.date),
                datasets: [
                    {
                        label: 'Retorno (%)',
                        data: chartData.map((item) => item.return),
                        borderColor: '#6BB1F8',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        type: 'category',
                        title: {
                            display: true,
                            text: 'Data',
                        },
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Retorno (%)',
                        },
                        ticks: {
                            callback: (value) => `${parseFloat(value).toFixed(2)}%`,
                        },
                    },
                }
            },
        });

        const cumulativeCtx = cumulativeChartRef.current.getContext('2d');
        const cumulativeChart = new Chart(cumulativeCtx, {
            type: 'line',
            data: {
                labels: cumulativeData.map((item) => item.date),
                datasets: [
                    {
                        label: 'Retorno Acumulado (%)',
                        data: cumulativeData.map((item) => item.return),
                        borderColor: '#4CAF50',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4,
                        // pointRadius: 0, // Remove os pontos do gráfico
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        type: 'category',
                        title: {
                            display: true,
                            text: 'Data',
                        },
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Retorno Acumulado (%)',
                        },
                        ticks: {
                            callback: (value) => `${parseFloat(value).toFixed(2)}%`,
                        },
                    },
                }
            },
        });

        return () => {
            chart.destroy();
            cumulativeChart.destroy();
        };
    }, [results]);

    if (!results) {
        return <Typography>Nenhum resultado disponível.</Typography>;
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" sx={{ mb: 3 }}>
                Resultados do Backtest
            </Typography>

            <Grid container spacing={3}>

                <Grid item xs={12} md={3}>
                    <Grid item xs={12} md={12} sx={{ mb: 3 }}>
                        <Card sx={{ p: 3 }}>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                Métricas de Desempenho
                            </Typography>
                            <Typography>
                                <strong>Retorno Total:</strong> {(results.totalReturn * 100).toFixed(2)}%
                            </Typography>
                            <Typography>
                                <strong>Retorno Médio Diário:</strong> {(results.avgDailyReturn * 100).toFixed(2)}%
                            </Typography>
                            <Typography>
                                <strong>Volatilidade:</strong> {(results.volatility * 100).toFixed(2)}%
                            </Typography>
                            <Typography>
                                <strong>Dias Computados:</strong> {results.computedDays}
                            </Typography>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={12}>
                        <Card sx={{ p: 3 }}>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                Intervalo de Dados dos Ativos
                            </Typography>
                            {Object.entries(results.assetsDates).map(([asset, { start, end }]) => (
                                <Box key={asset} sx={{ mb: 2 }}>
                                    <Typography>
                                        <strong>{asset}:</strong>
                                    </Typography>
                                    <Typography>
                                        Início: {format(new Date(start), 'dd/MM/yyyy')}
                                    </Typography>
                                    <Typography>
                                        Término: {format(new Date(end), 'dd/MM/yyyy')}
                                    </Typography>
                                </Box>
                            ))}
                        </Card>
                    </Grid>
                </Grid>

                <Grid item xs={12} md={9}>

                    <Grid item xs={12} md={12} sx={{ mb: 3 }}>
                        <Card sx={{ p: 3 }}>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                Retorno Acumulado de Portfólio (%)
                            </Typography>
                            <Box sx={{ height: '400px' }}>
                                <canvas ref={cumulativeChartRef} />
                            </Box>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={12}>
                        <Card sx={{ p: 3 }}>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                Retorno de Portfólio (%)
                            </Typography>
                            <Box sx={{ height: '400px' }}>
                                <canvas ref={chartRef} />
                            </Box>
                        </Card>
                    </Grid>
                </Grid>

            </Grid>
        </Box>
    );
}