import React, { useCallback, useContext, useState } from 'react';
import { Box, Typography, Card, Grid, Button } from '@mui/material';
import { format } from 'date-fns';
import { BacktestContext } from 'src/context/BacktestContext';
import DownloadIcon from '@mui/icons-material/Download';

import CardHeader from '@mui/material/CardHeader';
import { Chart, useChart, ChartLegends, ChartSelect } from 'src/components/chart';
import { useTheme } from '@emotion/react';
import * as XLSX from 'xlsx';

export function BacktestResults() {
    const { results } = useContext(BacktestContext);
    const [currentDividendMode, setCurrentDividendMode] = useState('Com Dividendos');
    const dividendsKeyValue = {
        'Com Dividendos': 'withDividends',
        'Sem Dividendos': 'withoutDividends',
    };

    const handleChangeDividendMode = useCallback((dividendMode) => {
        setCurrentDividendMode(dividendMode);
    }, []);

    if (!results || !results.withDividends.dailyReturns || !results.withoutDividends.dailyReturns) {
        return <Typography>Nenhum resultado disponível.</Typography>;
    };

    const handleDownload = useCallback(() => {
        const ws = XLSX.utils.json_to_sheet(
            results[dividendsKeyValue[currentDividendMode]].dailyReturns.map(({ accumulated, current, date }, index) => ({
                Data: format(new Date(date), 'dd/MM/yyyy'),
                'Retorno Diário': `${(current * 100).toFixed(2)}%`,
                'Retorno Acumulado': `${(accumulated * 100).toFixed(2)}%`,
                'Retorno Total': index === 0 ? `${(results[dividendsKeyValue[currentDividendMode]].totalReturn * 100).toFixed(2)}%` : '',
                'Retorno Médio Diário': index === 0 ? `${(results[dividendsKeyValue[currentDividendMode]].avgDailyReturn * 100).toFixed(2)}%` : '',
                'Volatilidade': index === 0 ? `${(results[dividendsKeyValue[currentDividendMode]].volatility * 100).toFixed(2)}%` : '',
                'Dias Computados': index === 0 ? results.computedDays : ''
            }))
        );
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Resultados');
        XLSX.writeFile(wb, 'backtest_results.xlsx');
    }, [results]);

    if (results[dividendsKeyValue[currentDividendMode]].dailyReturns.length > 30) {
        const step = Math.ceil(results[dividendsKeyValue[currentDividendMode]].dailyReturns.length / 30);
        const reducedData = results[dividendsKeyValue[currentDividendMode]].dailyReturns.filter((_, index) => index % step === 0);
        if (reducedData[reducedData.length - 1].date !== results[dividendsKeyValue[currentDividendMode]].dailyReturns[results[dividendsKeyValue[currentDividendMode]].dailyReturns.length - 1].date) {
            reducedData.push(results[dividendsKeyValue[currentDividendMode]].dailyReturns[results[dividendsKeyValue[currentDividendMode]].dailyReturns.length - 1]);
        }
        results[dividendsKeyValue[currentDividendMode]].dailyReturnsReduced = reducedData;
    } else {
        results[dividendsKeyValue[currentDividendMode]].dailyReturnsReduced = results[dividendsKeyValue[currentDividendMode]].dailyReturns;
    }

    /********************************************* */

    const chart = {
        categories: results[dividendsKeyValue[currentDividendMode]].dailyReturnsReduced.map(({ date }) => format(new Date(date), 'dd/MM/yyyy')),
        series: [
            {
                name: 'backtest_results',
                data: [
                    {
                        name: 'Retorno Diário',
                        data: results[dividendsKeyValue[currentDividendMode]].dailyReturnsReduced.map(({ current }) => (current * 100).toFixed(2)),
                    },
                    {
                        name: 'Retorno acumulado',
                        data: results[dividendsKeyValue[currentDividendMode]].dailyReturnsReduced.map(({ accumulated }) => (accumulated * 100).toFixed(2)),
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
                                <strong>Retorno Total:</strong> {(results[dividendsKeyValue[currentDividendMode]].totalReturn * 100).toFixed(2)}%
                            </Typography>
                            <Typography>
                                <strong>Retorno Médio Diário:</strong> {(results[dividendsKeyValue[currentDividendMode]].avgDailyReturn * 100).toFixed(2)}%
                            </Typography>
                            <Typography>
                                <strong>Volatilidade:</strong> {(results[dividendsKeyValue[currentDividendMode]].volatility * 100).toFixed(2)}%
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
                            // toggle para dados com ou sem dividendos
                            action={
                                <ChartSelect
                                    value={currentDividendMode}
                                    onChange={handleChangeDividendMode}
                                    options={['Com Dividendos', 'Sem Dividendos']}
                                />
                            }
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