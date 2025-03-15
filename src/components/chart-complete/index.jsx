import { Chart, useChart, ChartLegends, ChartSelect } from 'src/components/chart';
import { useTheme } from '@emotion/react';
import { useCallback, useEffect, useState } from 'react';
import { Box, CardHeader, Paper, Skeleton } from '@mui/material';

export function ChartComplete({ chart, title, subheader }) {
    const [selectedSeries, setSelectedSeries] = useState(chart.series.length > 0 ? chart.series[0].name : '');

    const theme = useTheme();

    const chartColors = chart.colors ?? [theme.palette.primary.main, theme.palette.warning.main];

    const currentSeries = chart.series?.find((i) => i.name === selectedSeries) ?? undefined;

    const chartOptions = useChart({
        colors: chartColors,
        xaxis: { categories: currentSeries?.categories },
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

    const handleChangeSeries = useCallback((newValue) => {
        setSelectedSeries(newValue);
    }, []);

    useEffect(() => {
        setSelectedSeries(chart.series.length > 0 ? chart.series[0].name : '');
    }, [chart]);

    return (
        <>
            {currentSeries?.data && currentSeries.data.length > 0 ? (
                <Paper elevation={3} sx={{ mt: 2 }}>
                    <CardHeader
                        title={title}
                        subheader={subheader}
                        action={
                            <ChartSelect
                                options={chart.series ? chart.series.map((item) => item.name) : []}
                                value={selectedSeries}
                                onChange={handleChangeSeries}
                            />
                        }
                        sx={{ mb: 3 }}
                    />

                    {/* <ChartLegends
                        colors={chartOptions?.colors}
                        labels={chart.series ? chart.series[0].data.map((item) => item.name) : []}
                        sx={{ px: 3, gap: 3 }}
                    /> */}

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
                </Paper>
            ) : (
                <Paper elevation={3} sx={{ mt: 2, p: 2 }}>
                    <Box display={'flex'} flexDirection={'row'} justifyContent={'space-between'}>
                        <Skeleton variant="text" width="40%" height={32} sx={{ mb: 1 }} />
                        <Skeleton variant="text" width="10%" height={24} sx={{ mb: 3 }} />
                    </Box>
                    <Skeleton variant="text" width="30%" height={24} sx={{ mb: 3 }} />
                    <Skeleton variant="rounded" width="100%" height={40} sx={{ mb: 3 }} />
                    <Skeleton variant="rounded" width="100%" height={270} />
                </Paper>
            )}
        </>
    );
}
