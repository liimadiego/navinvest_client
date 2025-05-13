import React, { useEffect, useState } from 'react';
import { Box, FormControl, InputLabel, MenuItem, Select, Typography, Card, CardHeader } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useTheme, alpha as hexAlpha } from '@mui/material/styles';

import { Chart, ChartSelect, useChart } from 'src/components/chart';


export function DividendsHistoric({ historicalDividendYieldData }) {
    historicalDividendYieldData = historicalDividendYieldData?.dividendYields ?? [];
    const [dataType, setDataType] = useState('Dividend Yield');
    const [timeRange, setTimeRange] = useState('5 Anos');
    const [data5Years, setData5Years] = useState([]);
    const [data10Years, setData10Years] = useState([]);

    useEffect(() => {
        if (historicalDividendYieldData.length > 0) {
            let formattedHDY = historicalDividendYieldData.sort((a, b) => {
                let dateA = new Date(a.year);
                let dateB = new Date(b.year);

                return dateA - dateB;
            });

            formattedHDY = formattedHDY.map((item) => ({
                year: item.year,
                yield: item.dy.toFixed(2)
            }));

            const data5Years = formattedHDY.filter((item) => {
                const year = new Date(item.year).getFullYear();
                const currentYear = new Date().getFullYear();
                return year >= currentYear - 5;
            });

            const data10Years = formattedHDY.filter((item) => {
                const year = new Date(item.year).getFullYear();
                const currentYear = new Date().getFullYear();
                return year >= currentYear - 10;
            });

            setData5Years(data5Years);
            setData10Years(data10Years);
        }
    }, [historicalDividendYieldData]);

    const selectedTimeRange = timeRange === '5 Anos' ? data5Years : data10Years;

    const chart = {
        series: [
            // { name: 'Dividendos Pagos', data: selectedTimeRange.map((item) => item.dividend) },
            { name: 'Dividend Yield', data: selectedTimeRange.map((item) => item.yield) },
        ],
        categories: selectedTimeRange.map((item) => item.year),
    };
    const theme = useTheme();

    const chartColors = chart.colors ?? [
        hexAlpha(theme.palette.warning.main, 0.8),
    ];

    const chartOptions = useChart({
        colors: chartColors,
        // stroke: { width: 2, colors: ['transparent'] },
        xaxis: { categories: chart.categories },
        legend: { show: true },
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
        yaxis: {
            labels: {
                formatter: (value) => `${value}%`,
            },
        },
        ...chart.options,
    });

    const handleDataTypeChange = (type) => {
        setDataType(type);
    };

    const handleTimeRangeChange = (event) => {
        setTimeRange(event);
    };

    const data = timeRange === '5 Anos' ? data5Years : data10Years;

    const selectedSeries = chart.series.find((series) => series.name === dataType);

    return (
        <Box>
            <Card>
                <CardHeader
                    action={
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            {/* <ChartSelect
                                options={['Dividend Yield', 'Dividendos Pagos']}
                                value={dataType}
                                onChange={handleDataTypeChange}
                            /> */}
                            <ChartSelect
                                options={['5 Anos', '10 Anos']}
                                value={timeRange}
                                onChange={handleTimeRangeChange}
                            />
                        </Box>
                    }
                />

                <Chart
                    type="bar"
                    series={[selectedSeries]}
                    options={chartOptions}
                    slotProps={{ loading: { p: 2.5 } }}
                    sx={{
                        pl: 1,
                        py: 2.5,
                        pr: 2.5,
                        height: 364,
                    }}
                />
            </Card>
        </Box>
    );
}