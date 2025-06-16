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
import { background } from 'src/theme';

// ----------------------------------------------------------------------

const renderLines = () => (
  <>
    <FloatPlusIcon sx={{ top: 72, left: 72 }} />
    <FloatPlusIcon sx={{ bottom: 72, left: 72 }} />
    <FloatLine sx={{ top: 50, left: 0 }} />
    <FloatLine sx={{ bottom: 0, left: 0 }} />
    <FloatLine vertical sx={{ top: 0, left: 80 }} />
  </>
);

export function HomeMinimal({ sx, ...other }) {
  const theme = useTheme();
  const renderDescription = () => (
    <>
      <SectionTitle
        caption="Tudo o que você precisa para investir melhor, em um só lugar."
        title="O que é"
        txtGradient="Navinvest?"
        sx={{ mb: { xs: 5, md: 8 }, textAlign: { xs: 'center', md: 'left' } }}
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

  const renderImage = () => (
    <Stack
      component={m.div}
      variants={varFade('inRight', { distance: 24 })}
      sx={{
        height: 1,
        alignItems: 'center',
        position: 'relative',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={[
          (theme) => ({
            left: 0,
            width: 720,
            borderRadius: 2,
            position: 'absolute',
            bgcolor: 'background.default',
            boxShadow: `-40px 40px 80px 0px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.16)}`,
            ...theme.applyStyles('dark', {
              boxShadow: `-40px 40px 80px 0px ${varAlpha(theme.vars.palette.common.blackChannel, 0.16)}`,
            }),
          }),
        ]}
      >
        <WealthEvolution
          sx={{ height: "100%", width: "100%", background: 'transparent' }}
          title="Evolução da carteira (12 meses)"
          subheader={`(+10.4%) no último ano`}
          chart={{
            colors: [
              theme.palette.info.dark,
              theme.palette.info.light,
            ],
            categories: [
              'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
              'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
            ],
            series: [{
              name: "Evolução da carteira",
              data: [
                {
                  name: 'Valor aplicado',
                  data: [10234, 11356, 12487, 13864, 16982, 17345, 19128, 20276, 22158, 24083, 24378, 29867]
                },
                {
                  name: 'Ganho de capital',
                  data: [187, 263, 342, 417, 321, 493, 978, 1467, 1523, 2112, 2486, 3043]
                },
              ],
            }],
          }}
        />
      </Box>
    </Stack>
  );

  return (
    <Box
      component="section"
      sx={[
        {
          overflow: 'hidden',
          position: 'relative',
          py: { xs: 10, md: 20 },
          pb: { xs: 0, md: 15 },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <MotionViewport>
        {renderLines()}

        <Container sx={{ position: 'relative' }}>
          <Grid container columnSpacing={{ xs: 0, md: 8 }} sx={{ position: 'relative', zIndex: 9 }}>
            <Grid size={{ xs: 12, md: 6, lg: 7 }}>{renderDescription()}</Grid>

            <Grid sx={{ display: { xs: 'none', md: 'block' } }} size={{ md: 6, lg: 5 }}>
              {renderImage()}
            </Grid>
          </Grid>

          <CircleSvg variants={varFade('in')} sx={{ display: { xs: 'none', md: 'block' } }} />
        </Container>
      </MotionViewport>
    </Box>
  );
}

// ----------------------------------------------------------------------

const ITEMS = [
  {
    icon: <AssistantIcon />,
    title: 'Acompanhamento 24/7',
    description: 'Um assistente virtual que te ajuda a investir melhor.',
  },
  {
    icon: <NewspaperIcon />,
    title: 'Jornal Inteligente',
    description: 'A IA analisa notícias mundiais e te atualiza.',
  },
  {
    icon: <BalanceIcon />,
    title: 'Sem conflito de interesses',
    description: 'A IA não tem interesses próprios, ela trabalha para você.',
  },
  {
    icon: <InsightsIcon />,
    title: 'Análise Inteligente',
    description: 'A IA analisa o mercado e te dá insights valiosos.',
  },
];
