import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import { useTheme } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';

import { fNumber } from 'src/utils/format-number';

import { Chart, useChart, ChartLegends } from 'src/components/chart';
import { Box } from '@mui/material';
import SeoIllustration from "src/assets/illustrations/upload-illustration";

// ----------------------------------------------------------------------

export function DonutChart({ title, subheader, chart, sx, ...other }) {
  const theme = useTheme();

  const chartColors = chart.colors ?? [
    theme.palette.primary.lighter,
    theme.palette.primary.light,
    theme.palette.primary.dark,
    theme.palette.primary.darker,
  ];

  const chartSeries = chart.series.map((item) => item.value);

  const isEmptyArray = (array) => {
    if (!Array.isArray(array)) {
      return false;
    }

    if (array.length === 0) {
      return true;
    }

    return false;
  }

  const chartOptions = useChart({
    chart: { sparkline: { enabled: true } },
    colors: chartColors,
    labels: chart.series.map((item) => item.label),
    stroke: { width: 0 },
    tooltip: {
      y: {
        formatter: (value) => `${fNumber(value)}%`,
        title: { formatter: (seriesName) => `${seriesName}` },
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: '72%',
          labels: {
            value: { formatter: (value) => `${fNumber(value)}%` },
            total: {
              formatter: (w) => {
                return "100%";
              },
            },
          },
        },
      },
    },
    ...chart.options,
  });

  return (
    <Card sx={sx} {...other}>
      <CardHeader title={title} subheader={subheader} />

      {!isEmptyArray(chart.series) ? (
        <>
          <Chart
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
            sx={{ p: 3, justifyContent: 'center', alignItems: 'center' }}
          />
        </>) :
        <Box height={370} display="flex" justifyContent="center">
          {SeoIllustration && <Box sx={{ maxWidth: 260, marginTop: "55px", }}><SeoIllustration hideBackground /></Box>}
        </Box>
      }
    </Card>
  );
}


