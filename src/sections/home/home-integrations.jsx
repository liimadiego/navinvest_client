import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';

import { CONFIG } from 'src/global-config';

import { varScale, MotionViewport } from 'src/components/animate';

import { SectionTitle } from './components/section-title';
import { FloatLine, FloatDotIcon } from './components/svg-elements';

// ----------------------------------------------------------------------

const renderLines = () => (
  <>
    <Stack
      spacing={8}
      alignItems="center"
      sx={{
        top: 64,
        left: 80,
        zIndex: 2,
        bottom: 64,
        position: 'absolute',
        transform: 'translateX(-50%)',
        '& span': { position: 'static', opacity: 0.12 },
      }}
    >
      <FloatDotIcon />
      <FloatDotIcon sx={{ opacity: 0.24, width: 14, height: 14 }} />
      <Box sx={{ flexGrow: 1 }} />
      <FloatDotIcon sx={{ opacity: 0.24, width: 14, height: 14 }} />
      <FloatDotIcon />
    </Stack>

    <FloatLine vertical sx={{ top: 0, left: 80 }} />
  </>
);

export function HomeIntegrations({ sx, ...other }) {
  const renderDescription = () => (
    <SectionTitle
      caption="Jornal Inteligente"
      title="Informação de verdade, todo dia"
      description={
        <>
          <Box component="span" sx={{ mb: 1, display: 'block' }}>
            Nossa IA analisa as principais notícias do Brasil e do mundo, resumindo tudo o que realmente importa para seus investimentos. Você recebe por e-mail, todos os dias úteis, um jornal exclusivo, fácil de entender e focado em decisões inteligentes.
          </Box>

          <Box
            component="span"
            sx={{ fontStyle: 'italic', color: 'text.disabled', typography: 'caption' }}
          >
            * Informação relevante, sem ruído.
          </Box>
        </>
      }
      sx={{ textAlign: { xs: 'center', md: 'left' } }}
    />
  );

  const renderImage = () => (
    <Box
      component={m.img}
      variants={{ ...varScale('in'), initial: { scale: 0.8, opacity: 0 } }}
      animate={{
        rotate: 360,
        transition: {
          duration: 50,
          ease: "linear",
          repeat: Infinity,
          repeatType: "loop"
        }
      }}
      alt="Jornal Inteligente"
      src={`${CONFIG.assetsDir}/assets/illustrations/geometric-circle.png`}
      sx={{
        opacity: 0.48,
        width: { xs: '100%', md: '80%' },
        maxWidth: 480,
        height: 'auto',
        mx: 'auto',
        //filtro de cor saturação
        // filter: 'hue-rotate(240deg)',
        userSelect: 'none',
        pointerEvents: 'none',

      }}
    />
  );

  return (
    <Box
      component="section"
      sx={[{ pt: 10, position: 'relative' }, ...(Array.isArray(sx) ? sx : [sx])]}
      {...other}
    >
      <MotionViewport>
        {renderLines()}

        <Container>
          <Grid container spacing={{ xs: 5, md: 8 }}>
            <Grid size={{ xs: 12, md: 6, lg: 5 }}>{renderDescription()}</Grid>

            <Grid sx={{ textAlign: { xs: 'center', md: 'right' } }} size={{ xs: 12, md: 6, lg: 7 }}>
              {renderImage()}
            </Grid>
          </Grid>
        </Container>
      </MotionViewport>
    </Box>
  );
}

