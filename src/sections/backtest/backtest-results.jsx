import React, { useCallback, useContext } from 'react';
import { Box, Typography, Card, Grid, Button } from '@mui/material';
import { format } from 'date-fns';
import { BacktestContext } from 'src/context/BacktestContext';
import DownloadIcon from '@mui/icons-material/Download';

import CardHeader from '@mui/material/CardHeader';
import { Chart, useChart, ChartLegends } from 'src/components/chart';
import { useTheme } from '@emotion/react';
import * as XLSX from 'xlsx';

export function BacktestResults() {
    const { results } = useContext(BacktestContext);

    if (!results) {
        return <Typography>Nenhum resultado disponível.</Typography>;
    }

    const handleDownload = useCallback(() => {

        const ws = XLSX.utils.json_to_sheet(
            results.dailyReturns.map(([timestamp, returnValue], index) => ({
                Data: format(new Date(timestamp), 'dd/MM/yyyy'),
                'Retorno Diário': (returnValue * 100).toFixed(2),
                'Retorno Acumulado': (results.dailyReturnsCumulative[index][1] * 100).toFixed(2),
                'Retorno Total': index === 0 ? (results.totalReturn * 100).toFixed(2) : '',
                'Retorno Médio Diário': index === 0 ? (results.avgDailyReturn * 100).toFixed(2) : '',
                'Volatilidade': index === 0 ? (results.volatility * 100).toFixed(2) : '',
                'Dias Computados': index === 0 ? results.computedDays : ''
            }))
        );
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Resultados');
        XLSX.writeFile(wb, 'backtest_results.xlsx');
    }, [results]);

    results.totalReturn = results.dailyReturns.reduce((acc, [, returnValue]) => acc * (1 + returnValue), 1) - 1;

    results.dailyReturnsCumulative = results.dailyReturns.reduce((acc, [timestamp, returnValue]) => {
        const lastValue = acc.length ? acc[acc.length - 1][1] : 0;
        const newValue = (1 + lastValue) * (1 + returnValue) - 1;
        acc.push([timestamp, newValue]);
        return acc;
    }, []);


    if (results.dailyReturns.length > 30) {
        const step = Math.ceil(results.dailyReturns.length / 30);
        const reducedData = results.dailyReturns.filter((_, index) => index % step === 0);
        if (reducedData[reducedData.length - 1][0] !== results.dailyReturns[results.dailyReturns.length - 1][0]) {
            reducedData.push(results.dailyReturns[results.dailyReturns.length - 1]);
        }
        results.dailyReturnsReduced = reducedData;
    } else {
        results.dailyReturnsReduced = results.dailyReturns;
    }

    if (results.dailyReturnsCumulative.length > 30) {
        const step = Math.ceil(results.dailyReturnsCumulative.length / 30);
        const reducedData = results.dailyReturnsCumulative.filter((_, index) => index % step === 0);
        if (reducedData[reducedData.length - 1][0] !== results.dailyReturnsCumulative[results.dailyReturnsCumulative.length - 1][0]) {
            reducedData.push(results.dailyReturnsCumulative[results.dailyReturnsCumulative.length - 1]);
        }
        results.dailyReturnsCumulativeReduced = reducedData;
    } else {
        results.dailyReturnsCumulativeReduced = results.dailyReturnsCumulative;
    }

    /********************************************* */

    const chart = {
        categories: results.dailyReturnsReduced.map(([timestamp]) => format(new Date(timestamp), 'dd/MM/yyyy')),
        series: [
            {
                name: 'backtest_results',
                data: [
                    {
                        name: 'Retorno Diário',
                        data: results.dailyReturnsReduced.map(([timestamp, returnValue]) => (returnValue * 100).toFixed(2)),
                    },
                    {
                        name: 'Retorno acumulado',
                        data: results.dailyReturnsCumulativeReduced.map(([timestamp, returnValue]) => (returnValue * 100).toFixed(2)),
                    },
                ],
            },
        ],
    };

    const theme = useTheme();

    const chartColors = chart.colors ?? [theme.palette.primary.main, theme.palette.warning.main];

    const chartOptions = useChart({
        colors: chartColors,
        xaxis: { categories: chart.categories },
        tooltip: {
            theme: 'dark',
            style: {
                fontSize: '12px',
                fontFamily: 'inherit'
            },
            fillSeriesColor: false,
            y: {
                formatter: (value) => `${value}%`,
            }
        },
        ...chart.options,
    });

    const currentSeries = chart.series[0];

    /********************************************* */

    return (
        <Box>
            <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                <Typography variant="h4" sx={{ mb: 3 }}>
                    Resultados do Backtest
                </Typography>
                <Button
                    sx={{ mb: 3 }}
                    variant="outlined"
                    color="primary"
                    startIcon={<DownloadIcon />}
                    onClick={handleDownload}
                >
                    Download
                </Button>
            </Box>

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
                    <Card sx={{ mb: 3 }}>
                        <CardHeader
                            title={"Retorno Acumulado de Portfólio (%)"}
                            sx={{ mb: 3 }}
                        />

                        <ChartLegends
                            colors={chartOptions?.colors}
                            labels={chart.series[0].data.map((item) => item.name)}
                            sx={{ px: 3, gap: 3 }}
                        />

                        <Chart
                            type="area"
                            series={currentSeries?.data}
                            options={chartOptions}
                            slotProps={{ loading: { p: 2.5 } }}
                            sx={{
                                pl: 1,
                                py: 2.5,
                                pr: 2.5,
                                height: 320,
                            }}
                        />
                    </Card>
                </Grid>

            </Grid>
        </Box>
    );
}