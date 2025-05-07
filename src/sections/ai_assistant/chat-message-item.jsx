import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { fToNow } from 'src/utils/format-time';
import { Chart, ChartLegends, useChart } from 'src/components/chart';
import { useTheme } from '@emotion/react';

export function ChatMessageItem({ message }) {
  const user = { id: 1 };

  const me = message.senderId === user.id;
  const { firstName, avatarUrl } = { firstName: 'Assistente de Investimentos', avatarUrl: 'https://cdn.fakercloud.com/avatars/brunodesign1202_128.jpg' };
  const { contentType, body, createdAt } = message;

  const renderInfo = () => (
    <Typography
      noWrap
      variant="caption"
      sx={{ mb: 1, color: 'text.disabled', ...(!me && { mr: 'auto' }) }}
    >
      {!me && `${firstName}, `}
      {fToNow(createdAt)}
    </Typography>
  );

  const renderBody = () => {
    if (contentType === 'text') {
      return (
        <Stack
          sx={{
            p: 1.5,
            maxWidth: '80%',
            borderRadius: 1,
            typography: 'body2',
            bgcolor: message.warning ? '#7A4100' : 'background.neutral',
            ...(me && { color: 'grey.800', bgcolor: 'primary.lighter' }),
          }}
        >
          {/* replace \n para queda de linha */}
          {body.split('\n').map((line, index) => (
            <Typography key={index} variant="body2" sx={{ mb: 0.5 }}>
              {line}
            </Typography>
          ))}
        </Stack>
      );

    } else if (contentType === 'chart') {
      const chart = {
          series: body.series,
          categories: body.categories,
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
              // y: {
              //     formatter: (value) => `R$ ${value}`,
              // }
          },
          ...chart.options,
      });

      return (
        <Stack
          sx={{
            p: 1.5,
            width: '80%',
            borderRadius: 1,
            typography: 'body2',
            bgcolor: message.warning ? '#7A4100' : 'background.neutral',
            ...(me && { color: 'grey.800', bgcolor: 'primary.lighter' }),
          }}
        >
        
          <ChartLegends
              colors={chartOptions?.colors}
              labels={[ chart.series[0].name]}
              sx={{ px: 3, pt: 2 }}
          />

          <Chart
              type="area"
              series={body.series}
              options={chartOptions}
              sx={{
                  pl: 1,
                  py: 2.5,
                  pr: 2.5,
                  height: 320,
              }}
          />
        </Stack>
      );
    
    } else {
      console.error('Unsupported content type:', contentType, '\n ');
    }
  };

  if (!message.body) {
    return null;
  }

  return (
    <Box sx={{ mb: 1, display: 'flex', width: '100%' }}>
      {!me && <Avatar alt={firstName} src={avatarUrl} sx={{ width: 32, height: 32, mr: 2 }} />}

      <Stack alignItems={me ? 'flex-end' : 'flex-start'} sx={{ width: '100%' }}>
        {renderInfo()}

        <Box
          sx={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            position: 'relative',
            '&:hover': { '& .message-actions': { opacity: 1 } },
            justifyContent: me ? 'flex-end' : 'flex-start',
          }}
        >
          {renderBody()}
        </Box>
      </Stack>
    </Box>
  );
}
