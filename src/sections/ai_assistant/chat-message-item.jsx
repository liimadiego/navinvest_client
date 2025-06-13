import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { fToNow } from 'src/utils/format-time';
import { Chart, ChartLegends, useChart } from 'src/components/chart';
import { useTheme } from '@emotion/react';
import { useState, useEffect } from 'react';
import { IconButton, Modal, CircularProgress } from '@mui/material';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import { CloseFullscreen } from '@mui/icons-material';
import { useAuthContext } from 'src/auth/hooks';

function Typewriter({ text }) {
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      setDisplayed(text.slice(0, index + 1));
      index += 1;
      if (index >= text.length) {
        clearInterval(timer);
      }
    }, 20);
    return () => clearInterval(timer);
  }, [text]);

  return (
    <>
      {displayed.split('\n').map((line, idx) => (
        <Typography key={idx} variant="body2" sx={{ mb: 0.5 }}>
          {line}
        </Typography>
      ))}
    </>
  );
}

export function ChatMessageItem({ message }) {
  const { user } = useAuthContext();
  const me = message.senderId === user?.id;
  const { firstName, avatarUrl } = { firstName: 'Assistente de Investimentos', avatarUrl: "" };
  const { messageType, answer, createdAt } = message;

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
    if (message.loading) {
      return (
        <Stack
          sx={{
            p: 1.5,
            maxWidth: { xs: '95%', sm: '90%', md: '80%' },
            borderRadius: 1,
            bgcolor: 'background.neutral',
          }}
        >
          <CircularProgress size={16} />
        </Stack>
      );
    }

    if (messageType === 'text') {
      return (
        <Stack
          sx={{
            p: 1.5,
            maxWidth: { xs: '95%', sm: '90%', md: '80%' },
            borderRadius: 1,
            typography: 'body2',
            bgcolor: message.warning ? '#7A4100' : 'background.neutral',
            ...(me && { color: 'grey.800', bgcolor: 'primary.lighter' }),
          }}
        >
          {me || !message.animate ? (
            answer.split('\n').map((line, index) => (
              <Typography key={index} variant="body2" sx={{ mb: 0.5 }}>
                {line}
              </Typography>
            ))
          ) : (
            <Typewriter text={answer} />
          )}
        </Stack>
      );

    } else if (messageType === 'chart') {
      const chart = {
        series: answer.series,
        categories: answer.categories,
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

      const [isFullscreen, setIsFullscreen] = useState(false);

      const handleToggleFullscreen = () => {
        setIsFullscreen(!isFullscreen);
      };

      return (
        <>
          <Modal
            open={isFullscreen}
            onClose={handleToggleFullscreen}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            BackdropProps={{
              onClick: handleToggleFullscreen,
            }}

            sx={{
              backdropFilter: 'blur(2px)',
            }}
          >
            <Box sx={{ width: '100%', height: '100%', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <IconButton
                onClick={handleToggleFullscreen}
                sx={{ position: 'absolute', top: -40, right: -5, color: 'white' }}
              >
                <CloseFullscreen />
              </IconButton>

              <Stack
                sx={{
                  p: 1.5,
                  width: { xs: '95%', sm: '90%', md: '80%' },
                  borderRadius: 1,
                  typography: 'body2',
                  bgcolor: message.warning ? '#7A4100' : 'background.neutral',
                  ...(me && { color: 'grey.800', bgcolor: 'primary.lighter' }),
                  position: 'relative',
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <IconButton
                    size="small"
                    onClick={handleToggleFullscreen}
                    sx={{ position: 'absolute', top: 5, right: 5 }}
                  >
                    <FullscreenIcon fontSize="small" />
                  </IconButton>
                </Box>

                <ChartLegends
                  colors={chartOptions?.colors}
                  labels={[chart.series[0].name]}
                  sx={{ px: 3, pt: 2 }}
                />

                <Chart
                  type="area"
                  series={answer.series}
                  options={chartOptions}
                  sx={{
                    pl: 1,
                    py: 2.5,
                    pr: 2.5,
                    height: 470,
                  }}
                />
              </Stack>
            </Box>
          </Modal>

          <Stack
            sx={{
              p: 1.5,
              pl: 0.5,
              width: { xs: '95%', sm: '90%', md: '80%' },
              borderRadius: 1,
              typography: 'body2',
              bgcolor: message.warning ? '#7A4100' : 'background.neutral',
              ...(me && { color: 'grey.800', bgcolor: 'primary.lighter' }),
              position: 'relative',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <IconButton
                size="small"
                onClick={handleToggleFullscreen}
                sx={{ position: 'absolute', top: 5, right: 5 }}
              >
                <FullscreenIcon fontSize="small" />
              </IconButton>
            </Box>

            <ChartLegends
              colors={chartOptions?.colors}
              labels={[chart.series[0].name]}
              sx={{ px: 3, pt: 2 }}
            />

            <Chart
              type="area"
              series={answer.series}
              options={chartOptions}
              sx={{
                pl: 1,
                py: 2.5,
                pr: 2.5,
                height: 320,
              }}
            />
          </Stack>
        </>
      );

    } else {
      console.error('Unsupported content type:', messageType, '\n ');
    }
  };

  if (!message.answer && !message.loading) {
    return null;
  }

  return (
    <Box sx={{ mb: 1, display: 'flex', width: '100%' }}>
      {!me && <Avatar alt={firstName} src={avatarUrl} sx={{ width: 32, height: 32, mr: 2, display: { xs: 'none', sm: 'inlune-block' } }} />}

      <Stack alignItems={me ? 'flex-end' : 'flex-start'} sx={{ width: '100%' }}>
        {!message.loading && renderInfo()}

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
