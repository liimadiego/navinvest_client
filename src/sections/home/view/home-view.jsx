import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Rating,
  Chip,
  useTheme,
  alpha,
  createTheme,
  ThemeProvider,
  useMediaQuery,
  Drawer,
  IconButton,
  SwipeableDrawer,
  Avatar,
  Stack
} from '@mui/material';
import {
  CheckCircle,
  Close,
  TrendingUp,
  Shield,
  Assessment,
  Bolt,
  Visibility,
  Chat,
  QuestionAnswer,
  Timeline,
  Compare,
  Verified,
  ArrowForward,
  ArrowDownward,
  Menu,
  BarChart,
  PersonOutline,
  Star
} from '@mui/icons-material';
import { m } from 'framer-motion';
import FAQAccordion from '../components/faqs';
import { useNavigate } from 'react-router-dom';
import { paths } from 'src/routes/paths';

// Custom theme with dark mode focus and mobile optimization
const customTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      lighter: '#6786fd',
      light: '#345efc',
      main: '#0236fc',
      dark: '#012bc9',
      darker: '#012097',
      contrastText: '#FFFFFF',
    },
    background: {
      paper: '#1E1E2A',
      default: '#13131A',
      card: '#262636',
      gradient: 'linear-gradient(145deg, #0236fc 0%, #345efc 100%)'
    },
    text: {
      primary: '#ffffff',
      secondary: '#B4B4C7',
    },
    divider: 'rgba(255,255,255,0.08)'
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
      '@media (min-width:600px)': {
        fontSize: '3.5rem',
      }
    },
    h2: {
      fontWeight: 700,
      fontSize: '2rem',
      lineHeight: 1.2,
      letterSpacing: '-0.01em',
      '@media (min-width:600px)': {
        fontSize: '2.5rem',
      }
    },
    h3: {
      fontWeight: 700,
      fontSize: '1.5rem',
      lineHeight: 1.3,
      '@media (min-width:600px)': {
        fontSize: '2rem',
      }
    },
    h4: {
      fontWeight: 700,
      fontSize: '1.25rem',
      lineHeight: 1.4,
      '@media (min-width:600px)': {
        fontSize: '1.5rem',
      }
    },
    body1: {
      fontWeight: 400,
      fontSize: '1rem',
      lineHeight: 1.7,
      '@media (min-width:600px)': {
        fontSize: '1.1rem',
      }
    },
    body2: {
      fontWeight: 400,
      fontSize: '0.875rem',
      lineHeight: 1.4,
      '@media (min-width:600px)': {
        fontSize: '1rem',
      }
    }
  },
  shape: {
    borderRadius: 16
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '10px 24px',
          fontWeight: 600,
          textTransform: 'none',
          boxShadow: 'none',
          transition: 'all 0.3s ease'
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          overflow: 'hidden'
        }
      }
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: 16,
          paddingRight: 16,
          '@media (min-width:600px)': {
            paddingLeft: 24,
            paddingRight: 24,
          }
        }
      }
    }
  }
});

const TESTIMONIALS = [
  {
    id: 2,
    name: 'Ana Paula',
    avatar: 'AP',
    role: 'Investidora iniciante',
    rating: 5,
    category: 'Tudo num lugar só',
    content: `Estou conseguindo tomar minhas decisões para investir com dados de um lugar só, antes eu precisava olhar notícias em um lugar, gráficos em outro, comparações em outro... Agora está bem mais fácil`,
  },
  {
    id: 6,
    name: 'Lucas Almeida',
    avatar: 'LA',
    role: 'Estudante',
    category: 'Recomendo para iniciantes',
    rating: 5,
    content: `Não sei muito sobre investir, mas o Navi tem me ajudado bastante, consegui melhorar meus investimentos e entender melhor o mercado`,
  },
  {
    id: 3,
    name: 'Vitória Silva',
    avatar: 'VS',
    role: 'Profissional de TI',
    category: 'Toda informação que preciso',
    rating: 5,
    content: `A experiência tem sido muito boa pois consigo ver todas as informações só na plataforma, sem precisar ficar procurando em outros sites.`,
  },
  {
    id: 4,
    name: 'Gabriel Pereira',
    avatar: 'GP',
    role: 'Empresário',
    category: 'A IA é incrível',
    rating: 5,
    content: `É incrível onde a tecnologia chegou, a IA parece uma pessoa de verdade, um analista de investimentos`,
  }
];

export function HomeView() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [menuOpen, setMenuOpen] = useState(false);
  const [visibleSection, setVisibleSection] = useState('hero');

  // Handle intersection observer for animations
  useEffect(() => {
    const sections = ['hero', 'comparison', 'how', 'testimonials', 'plans'];

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setVisibleSection(entry.target.id);
        }
      });
    }, { threshold: 0.3 });

    sections.forEach(section => {
      const element = document.getElementById(section);
      if (element) observer.observe(element);
    });

    return () => sections.forEach(section => {
      const element = document.getElementById(section);
      if (element) observer.unobserve(element);
    });
  }, []);

  const CTAButton = ({ children, variant = 'contained', size = 'large', sx = {}, ...props }) => (
    <Button
      onClick={() => navigate(paths.payment)}
      variant={variant}
      size={size}
      sx={{
        py: 1.5,
        px: isMobile ? 2 : 4,
        fontSize: isMobile ? '0.875rem' : '1.1rem',
        fontWeight: 600,
        borderRadius: 2,
        background: theme.palette.background.gradient,
        boxShadow: `0 8px 16px ${alpha('#0236fc', 0.25)}`,
        '&:hover': {
          boxShadow: `0 12px 24px ${alpha('#0236fc', 0.4)}`,
          transform: 'translateY(-2px)',
        },
        '&:active': {
          transform: 'translateY(1px)',
        },
        ...sx
      }}
      {...props}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {children}
        <ArrowForward sx={{ fontSize: isMobile ? 18 : 20, ml: 1 }} />
      </Box>
    </Button>
  );

  const FeatureCard = ({ icon, title, description }) => (
    <Card
      component={m.div}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      sx={{
        height: '100%',
        bgcolor: 'background.card',
        border: '1px solid',
        borderColor: alpha(theme.palette.primary.main, 0.1),
        overflow: 'visible'
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box
          sx={{
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            borderRadius: '50%',
            width: 56,
            height: 56,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2,
            color: 'primary.main'
          }}
        >
          {icon}
        </Box>
        <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );

  const SectionTitle = ({ title, subtitle, center = true, ...props }) => (
    <Box sx={{ textAlign: center ? 'center' : 'left', mb: 5, ...props.sx }}>
      <Typography
        variant="h2"
        component={m.h2}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        sx={{ mb: 2 }}
      >
        {title}
      </Typography>
      {subtitle && (
        <Typography
          variant="body1"
          component={m.p}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
          color="text.secondary"
          sx={{
            maxWidth: center ? '800px' : 'none',
            mx: center ? 'auto' : 0,
            fontSize: { xs: '1rem', md: '1.125rem' }
          }}
        >
          {subtitle}
        </Typography>
      )}
    </Box>
  );

  return (
    <ThemeProvider theme={customTheme}>
      <Box sx={{
        bgcolor: 'background.default',
        minHeight: '100vh',
        overflow: 'hidden',
        position: 'relative'
      }}>
        <Box
          id="hero"
          sx={{
            py: { xs: 6, md: 0 },
            pt: { xs: 3, md: 0 },
            position: 'relative',
            // height: { xs: 'auto', md: 'calc(100vh - 64px)' },
            minHeight: 'calc(100vh - 64px)',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Container maxWidth="lg">
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={12}>
                <Box
                  component={m.div}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  sx={{
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    height: '100%',
                  }}
                >
                  <Box>
                    <Typography
                      variant="h2"
                      sx={{
                        mb: 3,
                        mt: { xs: 3, md: 0 },
                        // fontSize: 100,
                      }}
                    >
                      Conheça a inteligência artificial que está revolucionando os investimentos e agora trabalha pra você.
                    </Typography>

                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{ mb: 4, fontSize: { xs: '1rem', md: '1.125rem' } }}
                    >
                      Imagine ter um assessor que nunca dorme, não tem comissões ocultas e age 100% no seu interesse. A Navinvest é a primeira IA no Brasil dedicada exclusivamente a ajudar investidores a tomarem decisões mais inteligentes, com base em dados e sem conflitos de interesse.
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                      <CTAButton>
                        Comece agora a usar a IA que pensa como você
                      </CTAButton>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
                      <Box sx={{ display: 'flex' }}>
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} sx={{ color: '#FFD700', fontSize: 18 }} />
                        ))}
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        <strong>4.95/5</strong> com mais de <strong>1.200+ avaliações</strong>
                      </Typography>
                      <Chip
                        label="7 dias grátis"
                        size="small"
                        sx={{
                          bgcolor: alpha(theme.palette.primary.main, 0.3),
                          color: 'primary.lighter',
                          fontWeight: 600
                        }}
                      />
                    </Box>
                  </Box>

                  {/* Scroll indicator */}
                  <Box
                    onClick={() => {
                      const nextSection = document.getElementById('comparison');
                      if (nextSection) {
                        // Scroll to the next section with 64px offset
                        window.scrollTo({
                          top: nextSection.offsetTop,
                          behavior: 'smooth'
                        });
                      }
                    }}
                    component={m.div}
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    sx={{
                      flexDirection: 'column',
                      alignItems: 'center',
                      mt: 8,
                      opacity: 0.7,
                      display: { xs: 'flex', md: 'flex' },
                      cursor: 'pointer',
                    }}
                  >
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Explore mais
                    </Typography>
                    <ArrowDownward sx={{ color: 'text.secondary' }} />
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Comparison Section */}
        <Box
          id="comparison"
          sx={{
            py: { xs: 6, md: 0 },
            minHeight: { xs: 'auto', md: 'calc(100vh - 64px)' },
            display: 'flex',
            alignItems: 'center',
            bgcolor: alpha(theme.palette.background.paper, 0.3)
          }}
        >
          <Container maxWidth="lg">
            <SectionTitle
              title="Por que usar a Navinvest?"
              subtitle="A diferença entre a assessoria tradicional e nossa tecnologia de IA"
            />

            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Card
                  component={m.div}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  sx={{
                    height: '100%',
                    bgcolor: alpha(theme.palette.error.main, 0.1),
                    border: '1px solid',
                    borderColor: alpha(theme.palette.error.main, 0.1),
                  }}
                >
                  <CardContent sx={{ p: 3, opacity: 0.85 }}>
                    <Typography variant="h4" sx={{ mb: 3, color: 'error.main', opacity: 0.85 }}>
                      Assessores Tradicionais
                    </Typography>
                    <List disablePadding>
                      {[
                        'Empurram ativos para bater metas',
                        'Recomendam produtos que geram comissão',
                        'Agem por interesse próprio',
                        'Recomendam produtos com altas comissões',
                      ].map((item, index) => (
                        <ListItem
                          key={index}
                          disableGutters
                          disablePadding
                          sx={{ mb: 2 }}
                        >
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <Close sx={{ color: 'error.main' }} />
                          </ListItemIcon>
                          <ListItemText
                            primary={item}
                            primaryTypographyProps={{ color: 'text.secondary' }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card
                  component={m.div}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  sx={{
                    height: '100%',
                    background: alpha(theme.palette.primary.main, 0.05),
                    border: '1px solid',
                    borderColor: alpha('#0236fc', 0.2),
                    // boxShadow: `0 0 12px ${alpha('#0236fc', 0.3)}`
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h4" sx={{ mb: 3, color: theme.palette.mode == 'light' ? theme.palette.primary.dark : 'inherit', fontWeight: 'bold' }}>
                      Navinvest AI
                    </Typography>
                    <List disablePadding>
                      {[
                        { text: 'Analisa ativos com profundidade', icon: <Shield /> },
                        { text: 'Compara oportunidades em tempo real', icon: <Bolt /> },
                        { text: 'Interpreta movimentos do mercado', icon: <Assessment /> },
                        { text: 'Entrega insights imparciais como nenhum outro sistema', icon: <Verified /> }
                      ].map((item, index) => (
                        <ListItem
                          key={index}
                          disableGutters
                          disablePadding
                          sx={{ mb: 2 }}
                        >
                          <ListItemIcon sx={{ minWidth: 36, color: 'primary.light' }}>
                            <CheckCircle />
                          </ListItemIcon>
                          <ListItemText
                            primary={item.text}
                          // primaryTypographyProps={{ color: 'primary.contrastText' }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Box
              component={m.div}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              sx={{
                mt: 6,
                textAlign: 'center'
              }}
            >
              <CTAButton>
                Experimente sem compromisso
              </CTAButton>
              <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
                7 dias grátis, cancele quando quiser
              </Typography>
            </Box>
          </Container>
        </Box>

        {/* FAQ Section */}
        <Box
          id="faq"
          sx={{
            py: { xs: 6, md: 0 },
            minHeight: 'calc(100vh - 64px)',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Container maxWidth="lg">
            <SectionTitle
              title="Mas será que é pra mim?"
              subtitle="Respostas para as dúvidas que travam sua evolução"
              sx={{ mb: { xs: 1, md: 5 } }}
            />

            <Grid container spacing={4} sx={{ mt: { xs: 0, md: 4 } }}>
              <Grid item xs={12} md={4}>
                <Box
                  component={m.div}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  sx={{
                    p: 4,
                    borderRadius: 4,
                    bgcolor: 'background.card',
                    border: '1px solid',
                    borderColor: 'divider',
                    height: '100%'
                  }}
                >
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                    "Não sou especialista em investimentos. Vou conseguir usar?"
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                    <strong>Sim!</strong> A Navinvest usa linguagem natural. Você pergunta como se estivesse conversando com um assessor no WhatsApp e a IA te responde com clareza.
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} md={4}>
                <Box
                  component={m.div}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  viewport={{ once: true }}
                  sx={{
                    p: 4,
                    borderRadius: 4,
                    bgcolor: 'background.card',
                    border: '1px solid',
                    borderColor: 'divider',
                    height: '100%'
                  }}
                >
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                    "Posso confiar nas sugestões?"
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                    <strong>Sim.</strong> Diferente de um assessor com metas de venda, a IA foi programada para agir no seu melhor interesse — sem influências externas.
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} md={4}>
                <Box
                  component={m.div}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                  sx={{
                    p: 4,
                    borderRadius: 4,
                    bgcolor: 'background.card',
                    border: '1px solid',
                    borderColor: 'divider',
                    height: '100%'
                  }}
                >
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                    "Já invisto. Isso é útil pra mim?"
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                    <strong>Muito.</strong> A IA analisa sua carteira atual, simula rendimentos passados e aponta pontos de melhoria baseados em dados e histórico real.
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            <Box
              component={m.div}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              sx={{
                mt: 6,
                textAlign: 'center'
              }}
            >
              <CTAButton>
                Veja como investir pode ser simples
              </CTAButton>
            </Box>
          </Container>
        </Box>

        {/* What is Navinvest Section */}
        <Box
          id="what-is"
          sx={{
            py: { xs: 6, md: 0 },
            minHeight: 'calc(100vh - 64px)',
            display: 'flex',
            alignItems: 'center',
            background: alpha(theme.palette.background.paper, 0.3)
          }}
        >
          <Container maxWidth="lg">
            <SectionTitle
              title="O que é a Navinvest?"
              subtitle="Uma revolução no jeito de decidir seus investimentos"
            />

            <Box
              component={m.div}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              sx={{
                mt: 6,
                p: 6,
                borderRadius: 4,
                bgcolor: 'background.card',
                border: '1px solid',
                borderColor: 'divider',
                textAlign: 'center'
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  mb: 4,
                  lineHeight: 1.4,
                  color: 'text.primary',
                  maxWidth: 800,
                  mx: 'auto'
                }}
              >
                A Navinvest é uma plataforma digital com inteligência artificial que centraliza todas as informações dos ativos brasileiros e americanos, incluindo dados históricos, cotações, comparações, notícias e análises — tudo interpretado por uma IA que conversa com você.
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  mb: 4,
                  lineHeight: 1.4,
                  color: 'primary.light',
                  fontWeight: 'bold'
                }}
              >
                É como ter um analista de dados e um consultor neutro em um só lugar.
              </Typography>

              <CTAButton>
                Conheça agora o assistente de investimentos que trabalha para você
              </CTAButton>
            </Box>
          </Container>
        </Box>

        {/* Testimonials */}
        <Box
          id="testimonials"
          sx={{
            py: { xs: 6, md: 0 },
            // bgcolor: alpha(theme.palette.background.paper, 0.3),
            minHeight: 'calc(100vh - 64px)',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Container maxWidth="lg">
            <SectionTitle
              title="O que nossos usuários dizem"
              subtitle="Descubra como a Navinvest está transformando a maneira como as pessoas investem"
            />

            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                gap: 3,
                mb: 6
              }}
            >
              {TESTIMONIALS.map((testimonial, index) => (
                <Card
                  key={testimonial.id}
                  component={m.div}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    bgcolor: 'background.card',
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                    <Box>
                      <Rating value={testimonial.rating} readOnly size="small" sx={{ mb: 2 }} />

                      <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{
                          mb: 3,
                          minHeight: { xs: 'auto', md: 120 }
                        }}
                      >
                        "{testimonial.content}"
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar
                        sx={{
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          color: 'primary.main'
                        }}
                      >
                        {testimonial.avatar}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2">{testimonial.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {testimonial.role}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>

            <Box
              component={m.div}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              sx={{ textAlign: 'center' }}
            >
              <CTAButton>
                Junte-se a milhares de usuários satisfeitos
              </CTAButton>
            </Box>
          </Container>
        </Box>

        {/* How it Works Section */}
        <Box
          id="how-it-works"
          sx={{
            py: { xs: 6, md: 0 },
            minHeight: 'calc(100vh - 64px)',
            display: 'flex',
            alignItems: 'center',
            bgcolor: alpha(theme.palette.background.paper, 0.3)
          }}
        >
          <Container maxWidth="lg">
            <SectionTitle
              title="Como funciona?"
              subtitle="Tudo o que você precisa em um só lugar, 24h por dia"
            />

            <Box
              component={m.div}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              sx={{
                mt: 6,
                p: 6,
                borderRadius: 4,
                bgcolor: 'background.card',
                border: '1px solid',
                borderColor: 'divider',
                textAlign: 'center'
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  mb: 4,
                  lineHeight: 1.4,
                  color: 'text.primary',
                  maxWidth: 800,
                  mx: 'auto'
                }}
              >
                Você acessa a plataforma, abre o chat e conversa com a IA. Pode pedir uma análise de qualquer ativo, comparar dois ou mais investimentos, entender notícias do dia e até simular como sua carteira teria se comportado nos últimos anos.
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  mb: 4,
                  lineHeight: 1.4,
                  color: 'primary.light',
                  fontWeight: 'bold'
                }}
              >
                A IA busca dados dos principais ativos do Brasil e dos EUA e organiza tudo pra você entender de forma simples, visual e estratégica.
              </Typography>

              <CTAButton>
                Experimente agora o poder de investir com embasamento real
              </CTAButton>
            </Box>
          </Container>
        </Box>

        <Box
          id="two-paths"
          sx={{
            py: { xs: 6, md: 0 },
            minHeight: 'calc(100vh - 64px)',
            display: 'flex',
            alignItems: 'center',
            // bgcolor: alpha(theme.palette.background.paper, 0.3),
          }}
        >
          <Container maxWidth="lg">
            <SectionTitle
              title="Dois caminhos possíveis"
              subtitle="Escolha entre investir à moda antiga ou com inteligência artificial"
            />

            <Grid container spacing={4} sx={{ mt: 4 }}>
              <Grid item xs={12} md={6}>
                <Card
                  component={m.div}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  sx={{
                    height: '100%',
                    bgcolor: alpha(theme.palette.error.main, 0.1),
                    border: '1px solid',
                    borderColor: alpha(theme.palette.error.main, 0.1),
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h4" sx={{ mb: 3, color: 'error.main', opacity: 0.85 }}>
                      Sem Navinvest
                    </Typography>
                    <List disablePadding>
                      {[
                        'Perder horas buscando dados em sites diferentes',
                        'Receber análises rasas ou influenciadas por comissões',
                        'Tomar decisões sem clareza ou embasamento real',
                        'Depender de assessores com conflito de interesse',
                      ].map((item, index) => (
                        <ListItem
                          key={index}
                          disableGutters
                          disablePadding
                          sx={{ mb: 2 }}
                        >
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <Close sx={{ color: 'error.main' }} />
                          </ListItemIcon>
                          <ListItemText
                            primary={item}
                            primaryTypographyProps={{ color: 'text.secondary' }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card
                  component={m.div}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  sx={{
                    height: '100%',
                    background: alpha(theme.palette.primary.main, 0.05),
                    border: '1px solid',
                    borderColor: alpha('#0236fc', 0.2),
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h4" sx={{ mb: 3, color: theme.palette.mode === 'light' ? theme.palette.primary.dark : 'inherit', fontWeight: 'bold' }}>
                      Com Navinvest
                    </Typography>
                    <List disablePadding>
                      {[
                        { text: 'Todas as informações centralizadas em um só lugar', icon: <Shield /> },
                        { text: 'Análises imparciais sem conflito de interesse', icon: <Bolt /> },
                        { text: 'Insights profundos sobre qualquer ativo', icon: <Assessment /> },
                        { text: 'IA que trabalha 24/7 exclusivamente para você', icon: <Verified /> }
                      ].map((item, index) => (
                        <ListItem
                          key={index}
                          disableGutters
                          disablePadding
                          sx={{ mb: 2 }}
                        >
                          <ListItemIcon sx={{ minWidth: 36, color: 'primary.light' }}>
                            <CheckCircle />
                          </ListItemIcon>
                          <ListItemText
                            primary={item.text}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Box
              component={m.div}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              sx={{
                mt: 6,
                textAlign: 'center'
              }}
            >
              <CTAButton>
                Escolha o caminho inteligente
              </CTAButton>
              <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
                7 dias grátis, cancele quando quiser
              </Typography>
            </Box>
          </Container>
        </Box>

        {/* Pricing Section */}
        <Box
          id="pricing"
          sx={{
            py: { xs: 6, md: 8 },
            minHeight: 'calc(100vh - 64px)',
            display: 'flex',
            alignItems: 'center',
            bgcolor: alpha(theme.palette.background.paper, 0.3)
          }}
        >
          <Container maxWidth="lg">
            <SectionTitle
              title="Planos acessíveis para quem leva o dinheiro a sério"
              subtitle="Escolha o plano que melhor se adapta às suas necessidades de investimento"
            />

            <Grid container spacing={4} sx={{ mt: 4 }}>
              {/* Monthly Plan */}
              <Grid item xs={12} md={6}>
                <Card
                  component={m.div}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  sx={{
                    height: '100%',
                    bgcolor: 'background.card',
                    border: '1px solid',
                    borderColor: alpha(theme.palette.primary.main, 0.2),
                    position: 'relative'
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Typography variant="h4" sx={{ mb: 0, fontWeight: 600, color: 'primary.light' }}>
                      Plano Mensal
                    </Typography>

                    <Typography variant="h3" sx={{ mb: 2, fontWeight: 700 }}>
                      <span style={{ textDecoration: 'line-through', opacity: 0.6, fontSize: '0.875rem' }}>R$59,99</span><br />
                      <span>R$26,99</span>
                      <Typography component="span" variant="body1" sx={{ color: 'text.secondary' }}>/mês </Typography>
                      <i style={{ opacity: 0.8, fontSize: '0.95rem' }}>Nos primeiros 3 meses</i>
                    </Typography>

                    <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
                      Ideal para quem quer experimentar mês a mês.
                    </Typography>

                    <List disablePadding>
                      {[
                        'Acesso total à plataforma e à IA',
                        'Simulações, comparações e análises diárias',
                        'Notícias e relatórios do mercado',
                        'Cancelamento fácil e rápido',
                        'Teste grátis por 7 dias'
                      ].map((item, index) => (
                        <ListItem
                          key={index}
                          disableGutters
                          disablePadding
                          sx={{ mb: 2 }}
                        >
                          <ListItemIcon sx={{ minWidth: 36, color: 'primary.light' }}>
                            <CheckCircle />
                          </ListItemIcon>
                          <ListItemText
                            primary={item}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>

              {/* Annual Plan */}
              <Grid item xs={12} md={6}>
                <Card
                  component={m.div}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  sx={{
                    height: '100%',
                    background: alpha(theme.palette.primary.main, 0.05),
                    border: '1px solid',
                    borderColor: alpha(theme.palette.primary.main, 0.3),
                    position: 'relative',
                    overflow: 'visible'
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -12,
                      right: { xs: 'calc(50% - 60px)', md: 24 },
                      bgcolor: 'background.gradient',
                      color: 'white',
                      px: 2,
                      py: 0.5,
                      borderRadius: 2,
                      fontWeight: 'bold',
                      fontSize: '0.875rem',
                      zIndex: 1,
                      boxShadow: `0 4px 8px ${alpha(theme.palette.primary.main, 0.25)}`,
                      background: theme.palette.primary.main,
                    }}
                  >
                    MAIS POPULAR
                  </Box>

                  <CardContent sx={{ p: 4 }}>
                    <Typography variant="h4" sx={{ mb: 0, fontWeight: 600, color: 'primary.main' }}>
                      Plano Anual
                    </Typography>

                    <Typography variant="h3" sx={{ mb: 1, fontWeight: 700 }}>
                      <span style={{ textDecoration: 'line-through', opacity: 0.6, fontSize: '0.875rem' }}>R$47,99</span><br />
                      <span>R$21,59</span>
                      <Typography component="span" variant="body1" sx={{ color: 'text.secondary' }}>/mês </Typography>
                      <i style={{ opacity: 0.6, fontSize: '0.875rem' }}>No primeiro ano</i>
                    </Typography>

                    <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
                      (pago anualmente)
                    </Typography>

                    <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
                      Perfeito para quem leva seus investimentos a sério.
                    </Typography>

                    <List disablePadding>
                      {[
                        'Todos os recursos do plano mensal',
                        'Economia de mais de R$140 por ano',
                        'Acesso garantido por 12 meses sem reajustes',
                        'Tranquilidade para planejar sua carteira com visão de longo prazo'
                      ].map((item, index) => (
                        <ListItem
                          key={index}
                          disableGutters
                          disablePadding
                          sx={{ mb: 2 }}
                        >
                          <ListItemIcon sx={{ minWidth: 36, color: 'primary.main' }}>
                            <CheckCircle />
                          </ListItemIcon>
                          <ListItemText
                            primary={item}
                            primaryTypographyProps={{
                              fontWeight: index === 1 ? 600 : 400
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Box
              component={m.div}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              sx={{
                mt: 6,
                textAlign: 'center'
              }}
            >
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                Cancelamento sem complicações. Teste grátis por 7 dias, sem compromisso.
              </Typography>

              <CTAButton>
                Comece agora com o melhor assistente de investimentos
              </CTAButton>
            </Box>
          </Container>
        </Box>

        {/* Final Call to Action Section */}
        <Box
          id="final-cta"
          sx={{
            py: { xs: 6, md: 0 },
            minHeight: 'calc(100vh - 64px)',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Container maxWidth="lg">
            <SectionTitle
              title="Sua nova maneira de investir começa hoje"
              subtitle=""
            />

            <Box
              component={m.div}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              sx={{
                mt: 6,
                p: 6,
                borderRadius: 4,
                bgcolor: 'background.card',
                border: '1px solid',
                borderColor: 'divider',
                textAlign: 'center'
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  mb: 4,
                  lineHeight: 1.4,
                  color: 'text.primary',
                  maxWidth: 700,
                  mx: 'auto'
                }}
              >
                O mundo dos investimentos mudou. E quem quiser melhores resultados vai precisar de mais do que intuição: vai precisar de inteligência.
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  mb: 4,
                  lineHeight: 1.4,
                  color: 'text.secondary',
                  maxWidth: 700,
                  mx: 'auto'
                }}
              >
                Não é mais sobre ter tempo — é sobre ter a ferramenta certa. A Navinvest é essa ferramenta. E você pode experimentar agora mesmo.
              </Typography>

              <CTAButton>
                Comece agora com o plano ideal para o seu perfil
              </CTAButton>
            </Box>
          </Container>
        </Box>

        {/* FAQ Section */}
        <Box
          id="pricing"
          sx={{
            py: { xs: 6, md: 8 },
            minHeight: 'calc(100vh - 64px)',
            display: 'flex',
            alignItems: 'center',
            bgcolor: alpha(theme.palette.background.paper, 0.3)
          }}
        >
          <FAQAccordion />
        </Box>

        {/* Final Decision Section */}
        <Box
          id="final-decision"
          sx={{
            py: { xs: 8, md: 12 },
            mt: { xs: 4, md: 0 },
            background: 'linear-gradient(135deg, #02c 0%, #6786fd 100%)',
            color: 'white'
          }}
        >
          <Container maxWidth="lg">
            <Box
              component={m.div}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              sx={{
                textAlign: 'center',
                p: 6,
                borderRadius: 4,
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              <Typography
                variant="h3"
                sx={{
                  mb: 4,
                  fontWeight: 'bold',
                  color: 'white'
                }}
              >
                Você ainda vai investir como antes? Ou vai deixar a inteligência trabalhar por você?
              </Typography>

              <Typography
                variant="h5"
                sx={{
                  mb: 6,
                  lineHeight: 1.4,
                  color: 'rgba(255, 255, 255, 0.9)',
                  maxWidth: 600,
                  mx: 'auto'
                }}
              >
                A escolha é sua. Continuar buscando dados em mil lugares, ou conversar com uma IA treinada para te ajudar a decidir melhor?
              </Typography>

              <Button
                variant="contained"
                size="large"
                sx={{
                  // py: 3,
                  px: 6,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  bgcolor: 'white',
                  color: 'primary.main',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.9)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
                  },
                  transition: 'all 0.3s ease'
                }}
                onClick={() => navigate(paths.payment)}
              >
                Comece agora com 7 dias grátis
              </Button>
            </Box>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}