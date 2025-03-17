import React, { useState } from 'react';
import { Box, FormControl, InputLabel, MenuItem, Select, Typography, Card, CardHeader } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useTheme, alpha as hexAlpha } from '@mui/material/styles';

import { Chart, ChartSelect, useChart } from 'src/components/chart';

const data5Years = [
    { year: '2017', dividend: 2.5, yield: 1.5 },
    { year: '2018', dividend: 3.0, yield: 1.8 },
    { year: '2019', dividend: 3.5, yield: 2.0 },
    { year: '2020', dividend: 4.0, yield: 2.5 },
    { year: '2021', dividend: 4.5, yield: 2.8 },
];

const data10Years = [
    { year: '2012', dividend: 1.0, yield: 0.8 },
    { year: '2013', dividend: 1.2, yield: 0.9 },
    { year: '2014', dividend: 1.5, yield: 1.0 },
    { year: '2015', dividend: 1.8, yield: 1.2 },
    { year: '2016', dividend: 2.0, yield: 1.3 },
    ...data5Years,
];

export function DividendsHistoric({ ticker }) {
    const [dataType, setDataType] = useState('Dividend Yield');
    const [timeRange, setTimeRange] = useState('5 Anos');

    const selectedTimeRange = timeRange === '5 Anos' ? data5Years : data10Years;

    const chart = {
        series: [
            { name: 'Dividendos Pagos', data: selectedTimeRange.map((item) => item.dividend) },
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
                            <ChartSelect
                                options={['Dividend Yield', 'Dividendos Pagos']}
                                value={dataType}
                                onChange={handleDataTypeChange}
                            />
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