import React, { useState } from 'react';
import { Box, Paper, Card, Typography } from '@mui/material';
import { fNumber } from 'src/utils/format-number';
import { useTheme } from '@mui/material/styles';
import { Chart, useChart, ChartLegends } from 'src/components/chart';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';

export function ComparisonColumn({ _width = '40%', content = <></>, chart, title, subheader, sx, ...other }) {
    if (chart) {
        const theme = useTheme();

        const chartColors = chart.colors ?? [
            theme.palette.primary.dark,
            theme.palette.primary.darker,
            theme.palette.primary.light,
            theme.palette.primary.lighter,
            theme.palette.primary.main,
        ];

        const chartSeries = chart.series.map((item) => item.value);

        const chartOptions = useChart({
            chart: { sparkline: { enabled: true } },
            colors: chartColors,
            labels: chart.series.map((item) => item.label),
            stroke: { width: 0 },
            tooltip: {
                y: {
                    formatter: (value) => fNumber(value),
                    title: { formatter: (seriesName) => `${seriesName}` },
                },
            },
            plotOptions: {
                pie: {
                    donut: {
                        size: '72%',
                        labels: {
                            value: { formatter: (value) => fNumber(value) },
                            total: {
                                formatter: (w) => {
                                    const sum = w.globals.seriesTotals.reduce((a, b) => a + b, 0);
                                    return fNumber(sum);
                                },
                            },
                        },
                    },
                },
            },
            ...chart.options,
        });

        return (
            <Paper elevation={3} sx={{ width: _width, display: 'flex', alignItems: 'center', justifyContent: 'center', ...sx }} {...other}>
                GRAFICO_AQUI
                {/* <Chart
                    type="donut"
                    series={chartSeries}
                    options={chartOptions}
                    sx={{
                        my: 6,
                        mx: 'auto',
                        width: { xs: 240, xl: 260 },
                        height: { xs: 240, xl: 260 },
                    }}
                />

                <Divider sx={{ borderStyle: 'dashed' }} />

                <ChartLegends
                    labels={chartOptions?.labels}
                    colors={chartOptions?.colors}
                    sx={{ p: 3, justifyContent: 'center' }}
                /> */}
            </Paper>
        );
    }

    return (
        <Paper elevation={3} sx={{ width: _width, padding: 2 }} >
            <Box width={"100%"} height={"100%"} display={'flex'} justifyContent={'center'} alignItems={'center'}>
                {content}
            </Box>
        </Paper>
    );
}