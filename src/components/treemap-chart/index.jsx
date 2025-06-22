import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { Chart, useChart } from 'src/components/chart';
import SeoIllustration from 'src/assets/illustrations/upload-illustration';
import { themeConfig } from 'src/theme/theme-config.js';

// ----------------------------------------------------------------------

export function TreemapChart({ title, subheader, chart, sx, ...other }) {
  const theme = useTheme();

  const chartColors = chart.colors ?? [
    themeConfig.palette.primary.darker,
    themeConfig.palette.secondary.darker,
    
    themeConfig.palette.primary.dark,
    themeConfig.palette.secondary.dark,

    themeConfig.palette.primary.main,
    themeConfig.palette.secondary.main,

    themeConfig.palette.primary.light,
    themeConfig.palette.secondary.light,
    
    themeConfig.palette.primary.lighter,
    themeConfig.palette.secondary.lighter,
  ];

  const chartOptions = useChart({
    legend: { show: false },
    colors: chartColors,
    // fill: { colors: [ '#1A73E8', '#B32824' ] },
    stroke: { show: false, width: 10, colors: [ '#FFFFFF' ], curve: 'straight' },
    plotOptions: { 
      treemap: { 
        distributed: true,
        useFillColorAsStroke: false,
        dataLabels: { format: "truncate" }
      } 
    },
    toolbar: { show: false },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: '14px',
        fontWeight: theme.typography.fontWeightBold,
        colors: [theme.palette.common.white],
      },
      formatter: (text, opts) => [text, `${opts.value}%`],
    },
    tooltip: {
      y: {
        formatter: (value) => `${value}%`,
        title: { formatter: () => '' },
      },
    },
    ...chart.options,
  });

  const seriesData = [{ data: chart.series ?? [] }];

  const isEmpty = !Array.isArray(chart.series) || chart.series.length === 0;

  return (
    <Card sx={{ ...sx, backgroundColor: 'background.paper' }} {...other}>
      <CardHeader title={title} subheader={subheader} />

      {!isEmpty ? (
        <Box sx={{ borderRadius: '8px', overflow: 'hidden' }}>
          <Chart
            type="treemap"
            series={seriesData}
            options={chartOptions}
            sx={{ p: 2, height: 320, borderRadius: 1, overflow: 'hidden' }}
          />
        </Box>
      ) : (
        <Box height={370} display="flex" justifyContent="center">
          {SeoIllustration && (
            <Box sx={{ maxWidth: 260, marginTop: '55px' }}>
              <SeoIllustration hideBackground />
            </Box>
          )}
        </Box>
      )}
    </Card>
  );
}
