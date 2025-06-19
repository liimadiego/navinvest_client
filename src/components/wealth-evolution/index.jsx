import { useState, useCallback } from 'react';

import Card from '@mui/material/Card';
import { useTheme } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';

import { fCurrency, fNumber, fShortenNumber } from 'src/utils/format-number';

import { Chart, useChart, ChartSelect, ChartLegends } from 'src/components/chart';

// ----------------------------------------------------------------------

export function WealthEvolution({ title, subheader, chart, sx, ...other }) {
  const theme = useTheme();

  const [selectedSeries, setSelectedSeries] = useState('Evolução da carteira');

  const chartColors = chart.colors ?? [
    theme.palette.primary.dark,
    theme.palette.warning.main,
    theme.palette.info.main,
  ];

  const chartOptions = useChart({
    chart: { stacked: true },
    colors: chartColors,
    stroke: { width: 0 },
    xaxis: { categories: chart.categories },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (value) => fCurrency(value)
      },
      custom: ({ series, seriesIndex, dataPointIndex }) => {
        if (!series || !series.length || seriesIndex < 0 || dataPointIndex < 0) {
          return '';
        }

        const total = series.reduce((sum, s) => sum + (s[dataPointIndex] || 0), 0);
        let content = '';

        series.forEach((s, i) => {
          content += `<div style="display: flex; justify-content: space-between; margin: 2px 0; gap: 8px;">
            <span>${chart.series[0].data[i].name}:</span>
            <span>${fCurrency(s[dataPointIndex] || 0)}</span>
          </div>`;
        });

        content += `<div style="display: flex; justify-content: space-between; margin-top: 8px; border-top: 1px solid #ccc; padding-top: 4px; gap: 8px;">
          <span>Total:</span>
          <span>${fCurrency(total)}</span>
        </div>`;

        return `<div style="padding: 10px;font-size:9pt">${content}</div>`;
      }
    },
    plotOptions: { bar: { columnWidth: '40%' } },
    ...chart.options,
  });

  const handleChangeSeries = useCallback((newValue) => {
    setSelectedSeries(newValue);
  }, []);

  const currentSeries = chart.series.find((i) => i.name === selectedSeries);

  return (
    <Card sx={{ ...sx, backgroundColor: 'background.paper' }} {...other}>
      <CardHeader
        title={title}
        subheader={subheader}
        // action={
        //   <ChartSelect
        //     options={chart.series.map((item) => item.name)}
        //     value={selectedSeries}
        //     onChange={handleChangeSeries}
        //   />
        // }
        sx={{ mb: 3 }}
      />

      <ChartLegends
        colors={chartOptions?.colors}
        labels={chart.series[0].data.map((item) => item.name)}
        sx={{ px: 3, gap: 3 }}
      />

      <Chart
        key={selectedSeries}
        type="bar"
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
  );
}
