import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';

import { CONFIG } from 'src/global-config';

import { varScale, MotionViewport, varFade } from 'src/components/animate';

import { SectionTitle } from './components/section-title';
import { FloatLine, FloatDotIcon } from './components/svg-elements';
import Polyhedron from 'src/components/polyhedron';
import { Button } from '@mui/material';
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const motionProps = {
  variants: varFade('inUp', { distance: 24 }),
};

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
      <FloatLine sx={{ bottom: 80, left: 0 }} />
    </Stack>

    <FloatLine vertical sx={{ top: 0, left: 80 }} />
    <FloatLine sx={{ bottom: 0, left: 0, zIndex: 9999 }} />
  </>
);


const renderButtons = () => (
  <Box
    sx={{
      mt: { xs: 0, md: 5 },
    }}
  >
    <m.div {...motionProps}>
      <Stack>
        <Button
          // color="inherit"
          size="large"
          // variant="contained"
          target="_blank"
          rel="noopener"
          href={paths.pricing}
          // startIcon={<Iconify width={24} icon="eva:log-in-fill" />}
          sx={{
            backgroundColor: "#0236fc", color: "#fff", px: 2, alignSelf: { xs: 'center', md: 'flex-start' },
            '&:hover': {
              background: (theme) => theme.palette.primary.dark,
            }
          }}

        >
          <span>
            Teste Grátis por 7 dias
          </span>
        </Button>
      </Stack>
    </m.div>

    {/* <m.div {...motionProps}>
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
    </m.div> */}
  </Box>
);

export function HomeIntegrations({ sx, ...other }) {
  const renderDescription = () => (
    <>
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
      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        {renderButtons()}
      </Box>
    </>
  );

  const renderImage = () => (
    <Box
      component={m.div}
      variants={varScale('in', { durationIn: 3, delayIn: 0.5 })}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, amount: 0.3 }}
      sx={{
        width: { xs: '100%', md: '80%' },
        maxWidth: '100%',
        height: 'auto',
        mx: 'auto',
        userSelect: 'none',
        pointerEvents: 'none',
      }}
    >
      <m.div
        animate={{
          rotate: 360,
          transition: {
            duration: 50,
            ease: "linear",
            repeat: Infinity,
            repeatType: "loop"
          }
        }}
      >
        <Polyhedron />
      </m.div>
    </Box>
  );

  return (
    <Box
      component="section"
      sx={[{ py: 5, position: 'relative' }, ...(Array.isArray(sx) ? sx : [sx])]}
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
            <Grid sx={{ display: { xs: 'block', md: 'none' }, textAlign: 'center' }} size={12}>
              {renderButtons()}
            </Grid>
          </Grid>
        </Container>
      </MotionViewport>
    </Box>
  );
}

