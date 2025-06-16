import { m } from 'framer-motion';
import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { CONFIG } from 'src/global-config';

import { SvgColor } from 'src/components/svg-color';
import { varFade, MotionViewport } from 'src/components/animate';

import { SectionTitle } from './components/section-title';
import { CircleSvg, FloatLine, FloatPlusIcon } from './components/svg-elements';
import AssistantIcon from '@mui/icons-material/Assistant';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import BalanceIcon from '@mui/icons-material/Balance';
import InsightsIcon from '@mui/icons-material/Insights';
import { WealthEvolution } from 'src/components/wealth-evolution';
import { useTheme } from '@emotion/react';
import Timeline from '@mui/icons-material/Timeline';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import { Button, Paper, useColorScheme } from '@mui/material';
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const motionProps = {
  variants: varFade('inUp', { distance: 24 }),
};

const renderLines = () => (
  <>
    <FloatPlusIcon sx={{ top: 72, left: 72 }} />
    <FloatPlusIcon sx={{ bottom: 72, left: 72 }} />
    <FloatLine sx={{ top: 0, left: 0 }} />
    <FloatLine sx={{ bottom: 80, left: 0 }} />
    <FloatLine vertical sx={{ top: 0, left: 80 }} />
  </>
);

export function HomeBacktest({ sx, ...other }) {
  const { mode } = useColorScheme();
  const renderDescription = () => (
    <>
      <SectionTitle
        caption="Backtest Inteligente: Valide suas estratégias"
        title="Simule. Visualize. Decida com dados."
        sx={{ mb: 5, textAlign: { xs: 'center', md: 'left' } }}
      />

      <Stack spacing={6} sx={{ maxWidth: { sm: 560, md: 400 }, mx: { xs: 'auto', md: 'unset' } }}>
        {ITEMS.map((item) => (
          <Box
            component={m.div}
            variants={varFade('inUp', { distance: 24 })}
            key={item.title}
            sx={[{ gap: 3, display: 'flex' }]}
          >
            <Box sx={{ transform: 'translateY(3px)' }}>
              {item.icon}
            </Box>
            <Stack spacing={1}>
              <Typography variant="h5" component="h6">
                {item.title}
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}>{item.description}</Typography>
            </Stack>
          </Box>
        ))}
      </Stack>
    </>
  );

  const renderButtons = () => (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: { xs: 1.5, sm: 2 },
        mt: 5,
      }}
    >
      {/* <m.div {...motionProps}>
        <Stack spacing={2.5} sx={{ alignItems: 'center' }}>
          <Button
            component={RouterLink}
            href={paths.pricing}
            color="inherit"
            size="large"
            variant="contained"
            startIcon={<Iconify width={24} icon="iconoir:flash" />}
          >
            <span>
              Teste Grátis por 7 dias
            </span>
          </Button>
        </Stack>
      </m.div> */}

      <m.div {...motionProps}>
        <Button
          color="inherit"
          size="large"
          variant="contained"
          target="_blank"
          rel="noopener"
          href={paths.auth.jwt.signUp}
          // startIcon={<Iconify width={24} icon="eva:log-in-fill" />}
          sx={{ borderColor: 'text.primary' }}
        >
          Crie sua conta grátis e acesse o Backtest
        </Button>
      </m.div>
    </Box>
  );

  const renderImage = () => (
    <m.div variants={varFade('inUp')}>
      {/* <Paper sx={{ overflow: 'hidden' }} elevation={3}> */}

      <Box
        component={m.img}
        alt="Backtest Inteligente"
        src={mode === 'dark' ? `${CONFIG.assetsDir}/assets/images/backtest-black.png` : `${CONFIG.assetsDir}/assets/images/backtest-white.png`}
        sx={{
          zIndex: 9,
          width: '100%',
          // aspectRatio: '1/1',
          position: 'relative',
        }}
      />
      {/* </Paper> */}
    </m.div>
  );

  return (
    <Box
      component="section"
      sx={[
        {
          overflow: 'hidden',
          position: 'relative',
          py: { xs: 10, md: 25 },
          pt: { xs: 5, md: 15 },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <MotionViewport>
        {renderLines()}

        <Container sx={{ position: 'relative' }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: { xs: 'center', md: 'flex-start' },
              justifyContent: 'center',
              // gap: { xs: 0, md: 8 },
              position: 'relative',
              zIndex: 9,
            }}
          >
            <Box sx={{
              flex: { md: 1, lg: 1 },
              width: '100%'
            }}>
              {renderDescription()}
            </Box>

            <Box
              sx={{
                display: { xs: 'none', md: 'block' },
                flex: { md: 1, lg: 1 }
              }}
            >
              {renderImage()}
              {renderButtons()}
            </Box>
          </Box>
          <Box>
          </Box>

          <CircleSvg variants={varFade('in')} sx={{ display: { xs: 'none', md: 'block' } }} />
        </Container>
      </MotionViewport>
    </Box>
  );
}

// ----------------------------------------------------------------------

const ITEMS = [
  {
    icon: <BarChartOutlinedIcon />,
    title: 'Simule antes de investir',
    description: ' Simule o desempenho do seu portfólio em diferentes períodos históricos',
  },
  {
    icon: <MonetizationOnIcon />,
    title: 'Veja o impacto real dos seus investimentos',
    description: 'Descubra o retorno total, o retorno médio diário e o impacto do reinvestimento de dividendos',
  },
  {
    icon: <Timeline />,
    title: 'Acompanhe a evolução do seu dinheiro',
    description: 'Visualize o crescimento do capital com gráficos dinâmicos e interativos',
  },
  {
    icon: <VerifiedUserIcon />,
    title: 'Invista com confiança e dados reais',
    description: 'Tome decisões mais seguras com base em dados reais e históricos do mercado',
  },
];
