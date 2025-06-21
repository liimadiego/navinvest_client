import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { Chart, useChart, ChartLegends } from 'src/components/chart';
import SeoIllustration from 'src/assets/illustrations/upload-illustration';

// ----------------------------------------------------------------------

export function TreemapChart({ title, subheader, chart, sx, ...other }) {
  const theme = useTheme();

  const chartColors = chart.colors ?? [
    theme.palette.primary.light,
    theme.palette.warning.main,
    theme.palette.info.main,
    theme.palette.error.main,
    theme.palette.success.main,
  ];

  const chartOptions = useChart({
    legend: { show: false },
    colors: chartColors,
    plotOptions: { treemap: { distributed: true } },
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
        <>
          <Chart
            type="treemap"
            series={seriesData}
            options={chartOptions}
            sx={{ p: 2, height: 320 }}
          />

          <Divider sx={{ borderStyle: 'dashed' }} />

          <ChartLegends
            labels={seriesData[0].data.map((item) => item.x)}
            values={seriesData[0].data.map((item) => `${item.y}%`)}
            colors={chartOptions.colors}
            sx={{ p: 3, justifyContent: 'center', alignItems: 'center' }}
          />
        </>
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
