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
  StarOutline
} from '@mui/icons-material';
import { m } from 'framer-motion';

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
      lineHeight: 1.6,
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
      variant={variant}
      size={size}
      sx={{
        py: isMobile ? 1.5 : 2,
        px: isMobile ? 3 : 4,
        fontSize: isMobile ? '1rem' : '1.1rem',
        fontWeight: 600,
        borderRadius: 3,
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
            pt: { xs: '6rem', md: '8rem' },
            pb: { xs: 8, md: 12 },
            position: 'relative',
            height: { xs: 'auto', md: 'calc(100vh - 64px)' },
          }}
        >
          <Container maxWidth="lg">
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={6}>
                <Box
                  component={m.div}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <Typography
                    variant="h1"
                    sx={{
                      mb: 3
                    }}
                  >
                    A inteligência que revoluciona seus investimentos
                  </Typography>

                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ mb: 4, fontSize: { xs: '1rem', md: '1.125rem' } }}
                  >
                    Imagine ter um assessor que nunca dorme, não tem comissões ocultas e age 100% no seu interesse. A Navinvest é a primeira IA no Brasil dedicada exclusivamente a ajudar investidores a tomarem decisões mais inteligentes, com base em dados e sem conflitos de interesse.
                  </Typography>

                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4 }}>
                    <CTAButton>
                      Comece grátis
                    </CTAButton>

                    <Button
                      variant="outlined"
                      sx={{
                        borderColor: alpha(theme.palette.primary.main, 0.3),
                        color: 'text.primary',
                        '&:hover': {
                          borderColor: 'primary.main',
                          bgcolor: alpha(theme.palette.primary.main, 0.05)
                        }
                      }}
                    >
                      Como funciona
                    </Button>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                    <Box sx={{ display: 'flex' }}>
                      {[...Array(5)].map((_, i) => (
                        <StarOutline key={i} sx={{ color: '#FFD700', fontSize: 18 }} />
                      ))}
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      <strong>4.9/5</strong> com mais de <strong>1.200+ avaliações</strong>
                    </Typography>
                    <Chip
                      label="7 dias grátis"
                      size="small"
                      sx={{
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: 'primary.main',
                        fontWeight: 600
                      }}
                    />
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box
                  component={m.div}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  sx={{
                    position: 'relative',
                    borderRadius: 4,
                    overflow: 'hidden',
                    boxShadow: `0 16px 40px ${alpha('#000', 0.3)}`,
                  }}
                >
                  <Box
                    component="img"
                    src="https://placehold.co/600x400/1E1E2A/345efc?text=NavInvest+Dashboard"
                    alt="NavInvest Dashboard"
                    sx={{
                      width: '100%',
                      height: 'auto',
                      borderRadius: 4,
                      border: '1px solid',
                      borderColor: 'divider'
                    }}
                  />

                  {/* Floating elements for visual appeal */}
                  <Box
                    component={m.div}
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                    sx={{
                      position: 'absolute',
                      top: '10%',
                      right: '10%',
                      bgcolor: 'background.paper',
                      borderRadius: 2,
                      p: 2,
                      border: '1px solid',
                      borderColor: 'divider',
                      boxShadow: `0 8px 16px ${alpha('#000', 0.2)}`,
                    }}
                  >
                    <TrendingUp sx={{ color: 'success.main', fontSize: 20 }} />
                  </Box>

                  <Box
                    component={m.div}
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 4, delay: 1 }}
                    sx={{
                      position: 'absolute',
                      bottom: '15%',
                      left: '5%',
                      bgcolor: 'background.paper',
                      borderRadius: 2,
                      p: 2,
                      border: '1px solid',
                      borderColor: 'divider',
                      boxShadow: `0 8px 16px ${alpha('#000', 0.2)}`,
                    }}
                  >
                    <BarChart sx={{ color: 'primary.main', fontSize: 20 }} />
                  </Box>
                </Box>
              </Grid>
            </Grid>

            {/* Scroll indicator */}
            <Box
              component={m.div}
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              sx={{
                flexDirection: 'column',
                alignItems: 'center',
                mt: 8,
                opacity: 0.7,
                display: { xs: 'none', md: 'flex' }
              }}
            >
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Explore mais
              </Typography>
              <ArrowDownward sx={{ color: 'text.secondary' }} />
            </Box>
          </Container>
        </Box>

        {/* Comparison Section */}
        <Box
          id="comparison"
          sx={{
            py: { xs: 8, md: 12 },
            bgcolor: alpha(theme.palette.background.paper, 0.3)
          }}
        >
          <Container maxWidth="lg">
            <SectionTitle
              title="Por que usar a NavInvest?"
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
                    bgcolor: alpha(theme.palette.error.main, 0.05),
                    border: '1px solid',
                    borderColor: alpha(theme.palette.error.main, 0.2),
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h4" sx={{ mb: 3, color: 'error.light' }}>
                      Assessores Tradicionais
                    </Typography>
                    <List disablePadding>
                      {[
                        'Recomendam produtos com altas comissões',
                        'Disponíveis apenas em horário comercial',
                        'Conhecimento limitado a certos produtos',
                        'Podem ter conflitos de interesse'
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
                    background: theme.palette.background.gradient,
                    boxShadow: `0 12px 24px ${alpha('#0236fc', 0.3)}`
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h4" sx={{ mb: 3, color: 'white' }}>
                      NavInvest IA
                    </Typography>
                    <List disablePadding>
                      {[
                        { text: 'Análises imparciais sem conflitos de interesse', icon: <Shield /> },
                        { text: 'Disponível 24 horas por dia, 7 dias por semana', icon: <Bolt /> },
                        { text: 'Processamento de dados em tempo real', icon: <Assessment /> },
                        { text: 'Decisões baseadas em fatos, não em comissões', icon: <Verified /> }
                      ].map((item, index) => (
                        <ListItem
                          key={index}
                          disableGutters
                          disablePadding
                          sx={{ mb: 2 }}
                        >
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <CheckCircle sx={{ color: 'white' }} />
                          </ListItemIcon>
                          <ListItemText
                            primary={item.text}
                            primaryTypographyProps={{ color: 'white' }}
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

        {/* How it Works */}
        <Box
          id="how"
          sx={{ py: { xs: 8, md: 12 } }}
        >
          <Container maxWidth="lg">
            <SectionTitle
              title="Como a NavInvest funciona"
              subtitle="Uma plataforma intuitiva que facilita suas decisões de investimento"
            />

            <Grid container spacing={3}>
              {[
                {
                  icon: <Chat />,
                  title: "Converse com a IA",
                  description: "Faça perguntas em linguagem natural sobre qualquer investimento ou estratégia"
                },
                {
                  icon: <Assessment />,
                  title: "Análise profunda",
                  description: "Receba análises detalhadas baseadas em dados atualizados em tempo real"
                },
                {
                  icon: <Compare />,
                  title: "Compare opções",
                  description: "Compare diferentes ativos e estratégias para encontrar a melhor opção para você"
                },
                {
                  icon: <Timeline />,
                  title: "Acompanhe resultados",
                  description: "Monitore o desempenho da sua carteira e receba sugestões de otimização"
                }
              ].map((feature, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <FeatureCard
                    icon={feature.icon}
                    title={feature.title}
                    description={feature.description}
                  />
                </Grid>
              ))}
            </Grid>

            <Box
              component={m.div}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              sx={{
                mt: 8,
                textAlign: 'center',
                p: 4,
                borderRadius: 4,
                bgcolor: 'background.card',
                border: '1px solid',
                borderColor: 'divider'
              }}
            >
              <Typography variant="h5" sx={{ mb: 3 }}>
                Veja como é simples usar a NavInvest
              </Typography>
              <Box
                component="video"
                poster="https://placehold.co/800x450/262636/345efc?text=Video+Tutorial"
                controls
                sx={{
                  width: '100%',
                  maxWidth: 800,
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: 'divider'
                }}
              />
            </Box>
          </Container>
        </Box>

        {/* Testimonials */}
        <Box
          id="testimonials"
          sx={{
            py: { xs: 8, md: 12 },
            bgcolor: alpha(theme.palette.background.paper, 0.3)
          }}
        >
          <Container maxWidth="lg">
            <SectionTitle
              title="O que nossos usuários dizem"
              subtitle="Descubra como a NavInvest está transformando a maneira como as pessoas investem"
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
                  <CardContent sx={{ p: 3, flexGrow: 1 }}>
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

        {/* Pricing */}
        <Box
          id="plans"
          sx={{ py: { xs: 8, md: 12 } }}
        >
          <Container maxWidth="lg">
            <SectionTitle
              title="Planos acessíveis para todos os investidores"
              subtitle="Escolha o plano que melhor se adapta às suas necessidades"
            />

            <Grid container spacing={4} sx={{ mb: 6 }}>
              <Grid item xs={12} md={6}>
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
                    borderColor: 'divider',
                    position: 'relative'
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Typography variant="h5" sx={{ mb: 1 }}>
                      Plano Mensal
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      Ideal para quem quer experimentar mês a mês
                    </Typography>

                    <Typography variant="h3" sx={{ mb: 1 }}>
                      R$59,90
                      <Typography component="span" variant="body2" color="text.secondary">
                        /mês
                      </Typography>
                    </Typography>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                      Sem compromisso, cancele quando quiser
                    </Typography>

                    <Button
                      fullWidth
                      variant="outlined"
                      sx={{
                        mb: 4,
                        borderColor: alpha(theme.palette.primary.main, 0.3),
                        color: 'text.primary',
                        '&:hover': {
                          borderColor: 'primary.main',
                          bgcolor: alpha(theme.palette.primary.main, 0.05)
                        }
                      }}
                    >
                      Comece agora
                    </Button>

                    <List disablePadding>
                      {[
                        'Acesso completo à plataforma',
                        'Análises ilimitadas',
                        'Comparações em tempo real',
                        'Suporte por email'
                      ].map((feature, index) => (
                        <ListItem
                          key={index}
                          disableGutters
                          disablePadding
                          sx={{ mb: 1.5 }}
                        >
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <CheckCircle sx={{ color: 'primary.main', fontSize: 20 }} />
                          </ListItemIcon>
                          <ListItemText
                            primary={feature}
                            primaryTypographyProps={{ variant: 'body2' }}
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
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  viewport={{ once: true }}
                  sx={{
                    height: '100%',
                    background: theme.palette.background.gradient,
                    position: 'relative',
                    boxShadow: `0 12px 24px ${alpha('#0236fc', 0.3)}`
                  }}
                >
                  <Chip
                    label="MAIS POPULAR"
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 16,
                      right: 16,
                      bgcolor: alpha('#ffffff', 0.9),
                      color: 'primary.main',
                      fontWeight: 600
                    }}
                  />

                  <CardContent sx={{ p: 4 }}>
                    <Typography variant="h5" sx={{ mb: 1, color: 'white' }}>
                      Plano Anual
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 3, color: alpha('#ffffff', 0.7) }}>
                      Melhor valor para investidores comprometidos
                    </Typography>

                    <Typography variant="h3" sx={{ mb: 1, color: 'white' }}>
                      R$47,90
                      <Typography component="span" variant="body2" sx={{ color: alpha('#ffffff', 0.7) }}>
                        /mês
                      </Typography>
                    </Typography>

                    <Typography variant="body2" sx={{ mb: 4, color: alpha('#ffffff', 0.7) }}>
                      Faturado anualmente (R$574,80)
                    </Typography>

                    <Button
                      fullWidth
                      variant="contained"
                      sx={{
                        mb: 4,
                        bgcolor: 'white',
                        color: 'primary.main',
                        '&:hover': {
                          bgcolor: alpha('#ffffff', 0.9)
                        }
                      }}
                    >
                      Economize 20%
                    </Button>

                    <List disablePadding>
                      {[
                        'Tudo do plano mensal',
                        'Economia de R$144 por ano',
                        'Acesso a recursos exclusivos',
                        'Suporte prioritário',
                        'Sem reajustes durante 12 meses'
                      ].map((feature, index) => (
                        <ListItem
                          key={index}
                          disableGutters
                          disablePadding
                          sx={{ mb: 1.5 }}
                        >
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <CheckCircle sx={{ color: 'white', fontSize: 20 }} />
                          </ListItemIcon>
                          <ListItemText
                            primary={feature}
                            primaryTypographyProps={{
                              variant: 'body2',
                              color: 'white'
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
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              sx={{
                p: 4,
                borderRadius: 4,
                bgcolor: 'background.card',
                border: '1px solid',
                borderColor: 'divider',
                textAlign: 'center'
              }}
            >
              <Typography variant="h5" sx={{ mb: 2 }}>
                Satisfação garantida
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Se você não estiver satisfeito nos primeiros 30 dias, devolveremos seu dinheiro
              </Typography>
              <Button
                variant="outlined"
                sx={{
                  borderColor: alpha(theme.palette.primary.main, 0.3),
                  color: 'text.primary',
                  '&:hover': {
                    borderColor: 'primary.main',
                    bgcolor: alpha(theme.palette.primary.main, 0.05)
                  }
                }}
              >
                Ver detalhes da garantia
              </Button>
            </Box>
          </Container>
        </Box>

        {/* Final CTA */}
        <Box
          sx={{
            py: { xs: 8, md: 12 },
            bgcolor: alpha(theme.palette.background.paper, 0.3)
          }}
        >
          <Container maxWidth="md">
            <Card
              component={m.div}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              sx={{
                background: theme.palette.background.gradient,
                p: { xs: 4, md: 6 },
                textAlign: 'center',
                overflow: 'hidden',
                position: 'relative'
              }}
            >
              {/* Abstract shape for visual appeal */}
              <Box
                sx={{
                  position: 'absolute',
                  top: -100,
                  right: -100,
                  width: 300,
                  height: 300,
                  borderRadius: '50%',
                  bgcolor: alpha('#ffffff', 0.05),
                  zIndex: 0
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: -80,
                  left: -80,
                  width: 200,
                  height: 200,
                  borderRadius: '50%',
                  bgcolor: alpha('#ffffff', 0.05),
                  zIndex: 0
                }}
              />

              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Typography variant="h2" sx={{ color: 'white', mb: 3 }}>
                  Comece sua jornada hoje
                </Typography>
                <Typography variant="body1" sx={{ color: alpha('#ffffff', 0.8), mb: 5, maxWidth: 600, mx: 'auto' }}>
                  Junte-se a milhares de investidores que estão tomando decisões mais inteligentes com a ajuda da NavInvest.
                </Typography>
                <CTAButton
                  sx={{
                    bgcolor: 'white',
                    color: 'primary.main',
                    '&:hover': {
                      bgcolor: alpha('#ffffff', 0.9)
                    }
                  }}
                >
                  Experimente grátis por 7 dias
                </CTAButton>
                <Typography variant="body2" sx={{ mt: 2, color: alpha('#ffffff', 0.7) }}>
                  Sem necessidade de cartão de crédito
                </Typography>
              </Box>
            </Card>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}