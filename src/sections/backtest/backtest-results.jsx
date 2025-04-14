import React, { useCallback, useContext, useState } from 'react';
import { Box, Typography, Card, Grid, Button } from '@mui/material';
import { format } from 'date-fns';
import { BacktestContext } from 'src/context/BacktestContext';
import DownloadIcon from '@mui/icons-material/Download';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';

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

    const daysToExtendedDate = (days) => {
        const date = new Date();
        date.setDate(date.getDate() + days);
        const year = date.getFullYear() - new Date().getFullYear();
        const month = date.getMonth() - new Date().getMonth();
        const day = date.getDate() - new Date().getDate();
        const yearText = year > 0 ? `${year} ano${year > 1 ? 's' : ''}` : '';
        const monthText = month > 0 ? `${month} ${month > 1 ? 'meses' : 'mês'}` : '';
        const dayText = day > 0 ? `${day} dia${day > 1 ? 's' : ''}` : '';
        return `${yearText} ${monthText} ${monthText ? 'e' : ''} ${dayText}`.trim().replace(/\s+/g, ' ');
    }

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

            <Box width={'100%'} display={'flex'} flexDirection={{ xs: 'column', sm: 'row', md: 'row' }} gap={{ xs: 2, sm: 2, md: 3 }} sx={{ mb: 3 }}>
                <Card sx={{ p: 3, flex: 1 }}>
                    <Typography variant="h6" sx={{ mb: 1, textAlign: 'center' }}>
                        Retorno Médio Diário
                    </Typography>
                    <Typography variant="h4" color={'primary.main'} sx={{ textAlign: 'center' }}>
                        {`${(results[dividendsKeyValue[currentDividendMode]].avgDailyReturn * 100).toFixed(2)}%`}
                    </Typography>

                </Card>
                <Card sx={{ p: 3, flex: 1 }}>
                    <Typography variant="h6" sx={{ mb: 1, textAlign: 'center' }}>
                        Período de Teste
                    </Typography>
                    <Typography variant="h4" color={'primary.main'} sx={{ textAlign: 'center' }}>
                        {daysToExtendedDate(results.computedDays)}
                    </Typography>
                </Card>
                <Card sx={{ p: 3, flex: 1 }}>
                    <Typography variant="h6" sx={{ mb: 1, textAlign: 'center' }}>
                        Retorno Total
                    </Typography>
                    <Typography variant="h4" color={'primary.main'} sx={{ textAlign: 'center' }}>
                        {`${(results[dividendsKeyValue[currentDividendMode]].totalReturn * 100).toFixed(2)}%`}
                    </Typography>
                </Card>
            </Box>

            <Box sx={{ mb: 3 }}>
                <Card sx={{ p: 2 }}>
                    <Typography sx={{ textAlign: 'center' }}>
                        <EmojiObjectsIcon sx={{ color: 'warning.main', fontSize: '20px', transform: 'translateY(3px)' }} /> Se você tivesse investido <strong>R$1.000,00</strong> ({currentDividendMode === 'Com Dividendos' ? 'reinvestindo os dividendos' : 'sem reinvestir os dividendos'}) neste portfólio no início do período, no fim você teria aproximadamente <strong>R${(1000 * (1 + results[dividendsKeyValue[currentDividendMode]].totalReturn)).toFixed(2)}</strong>
                    </Typography>
                </Card>
            </Box>

            <Box display={'flex'} sx={{ width: '100%' }} gap={3}>

                <Box display={'flex'} flexDirection={'column'} sx={{ flex: 1 }}>
                    <Card sx={{ mb: 3 }}>
                        <CardHeader
                            title={"Retorno Acumulado de Portfólio (%)"}
                            sx={{ mb: 3 }}
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
                </Box>
            </Box>

            <Box>
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
            </Box>

        </Box >
    );
}