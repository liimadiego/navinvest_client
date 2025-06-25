import { m } from 'framer-motion';
import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';

import { varFade, MotionViewport, AnimateCountUp } from 'src/components/animate';
import { useEffect, useState, useRef } from 'react';
import { FloatLine } from './components/svg-elements';
import { Button, Grid2 as Grid, Stack, useColorScheme } from '@mui/material';
import { SectionTitle } from './components/section-title';
import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

const motionProps = {
  variants: varFade('inUp', { distance: 24 }),
};

const renderLines = () => (
  <>
    {/* <FloatLine sx={{ bottom: 40, left: 0 }} /> */}
    <FloatLine vertical sx={{ top: 0, left: 80 }} />
  </>
);

const phrases = [
  'Como posso começar a investir?',
  'Quais as últimas notícias do mercado financeiro?',
  'Quais são os melhores investimentos para iniciantes?',
  'Quais as útimas notícias sobre Petrobras?',
  'Como diversificar minha carteira de investimentos?',
];

const renderDescription = () => (
  <m.div variants={varFade('inUp', { distance: 24 })}>
    <SectionTitle
      caption="Tire suas dúvidas"
      title="Converse com o Navi"
      description={
        <>
          <Box component="span" sx={{ mb: 1, display: 'block' }}>
            Converse com um assistente que responde suas dúvidas, mostra dados de empresas, gráficos de cotações e notícias do mercado em tempo real. Aprenda a investir, explore oportunidades e tome decisões com mais confiança — tudo em um só chat.
          </Box>

          <Box
            component="span"
            sx={{ fontStyle: 'italic', color: 'text.disabled', typography: 'caption' }}
          >
            * Um assistente sem conflitos de interesse.
          </Box>
        </>
      }
      sx={{ textAlign: { xs: 'center', md: 'left' } }}
    />
  </m.div>
);

export function HomeAIAssistant({ sx, ...other }) {
  const [text, setText] = useState('');
  const [displayText, setDisplayText] = useState('');
  const [textPosition, setTextPosition] = useState(0);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [speed, setSpeed] = useState(75);
  const inputRef = useRef(null);
  const [visibleChars, setVisibleChars] = useState(40); // Default value
  const { mode } = useColorScheme();

  // Calculate visible characters based on input width
  useEffect(() => {
    const calculateVisibleChars = () => {
      if (inputRef.current) {
        const inputWidth = inputRef.current.clientWidth;
        const estimatedChars = Math.floor(inputWidth / 7.5);
        setVisibleChars(Math.max(20, estimatedChars));
      }
    };

    calculateVisibleChars();
    window.addEventListener('resize', calculateVisibleChars);

    return () => window.removeEventListener('resize', calculateVisibleChars);
  }, []);

  useEffect(() => {
    const currentPhrase = phrases[phraseIndex % phrases.length];

    const timer = setTimeout(() => {
      if (isDeleting) {
        setText((prev) => prev.slice(0, -1));
        setSpeed(30);
      } else {
        setText((prev) => currentPhrase.slice(0, prev.length + 1));
        setSpeed(75);
      }

      if (!isDeleting && text === currentPhrase) {
        setIsDeleting(true);
        setSpeed(1000);
      } else if (isDeleting && text === '') {
        setIsDeleting(false);
        setPhraseIndex((prev) => (prev + 1) % phrases.length);
        setSpeed(500);
        setTextPosition(0);
      }
    }, speed);

    return () => clearTimeout(timer);
  }, [text, isDeleting, phraseIndex, speed]);

  useEffect(() => {
    if (text.length > visibleChars && !isDeleting) {
      setTextPosition(text.length - visibleChars);
    } else if (isDeleting) {
      setTextPosition(Math.max(0, text.length - visibleChars));
    } else {
      setTextPosition(0);
    }

    setDisplayText(text.slice(textPosition));
  }, [text, textPosition, isDeleting]);

  return (
    <Box
      component="section"
      sx={[
        {
          position: 'relative',
          overflow: 'hidden',
          pb: { xs: 15, md: 15 },
          pt: 15
        },
        ...(Array.isArray(sx) ? sx : [sx])
      ]}
      {...other}
    >
      <MotionViewport>
        {renderLines()}

        <Container sx={{ position: 'relative' }}>
          <Box sx={{ height: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Grid container spacing={{ xs: 5, md: 8 }}>
              <Grid size={{ xs: 12, md: 6, lg: 5 }}>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-end' } }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'medium', mt: 1 }}>
                      {renderDescription()}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid sx={{
                textAlign: { xs: 'center', md: 'right' },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }} size={{ xs: 12, md: 6, lg: 7 }}>
                <Box sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: { xs: 'center', md: 'flex-end' },
                  height: 'auto',
                  mx: 'auto',
                  width: '95%',
                }}>
                  <m.div variants={varFade('inUp', { distance: 24 })} style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
                    <Box sx={{ width: { xs: '100%', md: '90%' }, mb: { xs: 2, md: 0 } }}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                          borderRadius: 1,
                          padding: '0 2%',
                          pr: "1%",
                          width: { xs: '100%', sm: '100%', md: '100%' }
                        }}
                      >
                        <TextField
                          ref={inputRef}
                          variant="standard"
                          value={displayText}
                          placeholder="Faça uma pergunta..."
                          InputProps={{
                            disableUnderline: true,
                            sx: {
                              flex: 1,
                              userSelect: 'none',
                              pointerEvents: 'none',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              pl: 0.5,
                            },
                          }}
                          fullWidth
                        />
                        <IconButton sx={(theme) => ({
                          userSelect: 'none',
                          pointerEvents: 'none',
                          ...(theme.palette.mode === 'light' && {
                            color: 'primary.main',
                          }),
                          ...(theme.palette.mode === 'dark' && {
                            color: 'primary.lighter',
                          }),
                        })}>
                          <SendIcon />
                        </IconButton>
                      </Box>
                    </Box>
                  </m.div>

                  <m.div variants={varFade('inUp', { distance: 24 })} style={{ width: '90%' }}>
                    <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary', maxWidth: '100%', textAlign: 'center', display: { xs: 'none', md: 'block' } }}>
                      Quer você esteja investindo pela primeira vez ou levando seu crescimento para o próximo nível,
                      a Navinvest ajuda você a encontrar rapidamente investimentos relevantes.
                    </Typography>
                  </m.div>

                  <Box sx={{ width: '90%', display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <m.div variants={varFade('inUp', { distance: 24 })}>
                      <Stack>
                        <Button
                          size="large"
                          // variant="contained"
                          target="_blank"
                          rel="noopener"
                          href={import.meta.env.VITE_FOCUS === 'register' ? paths.auth.jwt.signUp : paths.pricing}
                          sx={(theme) => ({
                            width: '200px',
                            alignSelf: { xs: 'center', md: 'flex-start' },
                            backgroundColor: theme.palette.primary.main,
                            color: theme.palette.primary.contrastText,
                            '&:hover': {

                              background: theme.palette.primary.dark,

                            },
                          })}
                        >
                          <span>
                            Acessar Assistente
                          </span>
                        </Button>
                      </Stack>
                    </m.div>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </MotionViewport>
    </Box>
  );
}