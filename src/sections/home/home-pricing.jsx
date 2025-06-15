import { m } from 'framer-motion';
import { useTabs } from 'minimal-shared/hooks';
import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/global-config';

import { Iconify } from 'src/components/iconify';
import { varFade, varScale, MotionViewport } from 'src/components/animate';

import { SectionTitle } from './components/section-title';
import { FloatLine, FloatXIcon } from './components/svg-elements';

// ----------------------------------------------------------------------

export function HomePricing({ sx, ...other }) {
  const tabs = useTabs('Premium');

  const renderDescription = () => (
    <SectionTitle
      caption="Planos"
      title="Preços"
      txtGradient="transparentes"
      description="Temos um plano ideal para você. Teste por 7 dias grátis e cancele quando quiser. Sem complicações."
      sx={{ mb: 8, textAlign: 'center' }}
    />
  );

  const renderContentDesktop = () => (
    <Box gridTemplateColumns="repeat(2, 1fr)" sx={{ display: { xs: 'none', md: 'grid' } }}>
      {PLANS.map((plan) => (
        <PlanCard
          key={plan.license}
          plan={plan}
          sx={(theme) => ({
            ...(plan.license === 'Plus' && {
              [theme.breakpoints.down(1440)]: {
                borderLeft: `dashed 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.2)}`,
                borderRight: `dashed 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.2)}`,
              },
            }),
          })}
        />
      ))}
    </Box>
  );

  const renderContentMobile = () => (
    <Stack spacing={5} alignItems="center" sx={{ display: { md: 'none' } }}>
      <Tabs
        value={tabs.value}
        onChange={tabs.onChange}
        sx={[
          (theme) => ({
            boxShadow: `0px -2px 0px 0px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)} inset`,
          }),
        ]}
      >
        {PLANS.map((tab) => (
          <Tab key={tab.license} value={tab.license} label={tab.license} />
        ))}
      </Tabs>

      <Box
        sx={[
          (theme) => ({
            width: 1,
            borderRadius: 2,
            border: `dashed 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.2)}`,
          }),
        ]}
      >
        {PLANS.map(
          (tab) => tab.license === tabs.value && <PlanCard key={tab.license} plan={tab} />
        )}
      </Box>
    </Stack>
  );

  return (
    <Box
      component="section"
      sx={[{ py: 10, pt: 5, position: 'relative' }, ...(Array.isArray(sx) ? sx : [sx])]}
      {...other}
    >
      <MotionViewport>
        <FloatLine vertical sx={{ top: 0, left: 80 }} />

        <Container>{renderDescription()}</Container>

        <Box
          sx={(theme) => ({
            position: 'relative',
            '&::before, &::after': {
              width: 64,
              height: 64,
              content: "''",
              [theme.breakpoints.up(1440)]: { display: 'block' },
            },
          })}
        >
          <Container>{renderContentDesktop()}</Container>

          <FloatLine sx={{ top: 64, left: 0 }} />
          <FloatLine sx={{ bottom: 64, left: 0 }} />
        </Box>

        <Container>{renderContentMobile()}</Container>
      </MotionViewport>
    </Box>
  );
}

// ----------------------------------------------------------------------

const renderLines = () => (
  <>
    <FloatLine vertical sx={{ top: -64, left: 0, height: 'calc(100% + (64px * 2))' }} />
    <FloatLine vertical sx={{ top: -64, right: 0, height: 'calc(100% + (64px * 2))' }} />
    <FloatXIcon sx={{ top: -8, left: -8 }} />
    <FloatXIcon sx={{ top: -8, right: -8 }} />
    <FloatXIcon sx={{ bottom: -8, left: -8 }} />
    <FloatXIcon sx={{ bottom: -8, right: -8 }} />
  </>
);

function PlanCard({ plan, sx, ...other }) {
  const freeLicense = plan.license === 'Grátis';

  const premiumLicense = plan.license === 'Premium';

  return (
    <MotionViewport>
      <Box
        sx={[
          () => ({
            px: 6,
            py: 8,
            gap: 5,
            display: 'flex',
            position: 'relative',
            flexDirection: 'column',
          }),
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
        {...other}
      >
        {premiumLicense && renderLines()}

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Stack flexGrow={1}>
            <m.div variants={varFade('inLeft', { distance: 24 })}>
              <Typography variant="h4" component="h6">
                {plan.license}
              </Typography>
            </m.div>

            <m.div variants={varScale('inX')}>
              <Box
                sx={{
                  width: 32,
                  height: 6,
                  opacity: 0.24,
                  borderRadius: 1,
                  bgcolor: 'error.main',
                  ...(freeLicense && { bgcolor: 'primary.main' }),
                  ...(premiumLicense && { bgcolor: 'secondary.main' }),
                }}
              />
            </m.div>
          </Stack>

          <m.div variants={varFade('inLeft', { distance: 24 })}>
            <Box component="span" sx={{ typography: 'h3' }}>
              R${plan.price ? plan.price.toFixed(2).replace('.', ',') : '0,00'}<Typography component="span" variant="subtitle2" sx={{ ml: 0.5, opacity: 0.48 }}>
                {plan.price ? '/mês' : ''}
              </Typography>
            </Box>
          </m.div>
        </Box>

        <Stack spacing={2.5}>
          {plan.commons.map((option) => (
            <Box
              key={option}
              component={m.div}
              variants={varFade('in')}
              sx={{
                gap: 1.5,
                display: 'flex',
                typography: 'body2',
                alignItems: 'center',
              }}
            >
              <Iconify width={16} icon="eva:checkmark-fill" />
              {option}
            </Box>
          ))}

          <m.div variants={varFade('inLeft', { distance: 24 })}>
            <Divider sx={{ borderStyle: 'dashed' }} />
          </m.div>

          {plan.options.map((option, index) => {
            const disabled =
              (freeLicense && [0, 1, 2, 3, 4, 5, 6].includes(index)) ||
              (premiumLicense && [].includes(index));

            return (
              <Box
                key={option}
                component={m.div}
                variants={varFade('in')}
                sx={{
                  gap: 1.5,
                  display: 'flex',
                  typography: 'body2',
                  alignItems: 'center',
                  ...(disabled && { color: 'text.disabled', textDecoration: 'line-through' }),
                }}
              >
                <Iconify
                  width={18}
                  icon={disabled ? 'mingcute:close-line' : 'eva:checkmark-fill'}
                />
                {option}
              </Box>
            );
          })}
        </Stack>

        <m.div variants={varFade('inUp', { distance: 24 })}>
          <Button
            fullWidth
            variant={premiumLicense ? 'contained' : 'outlined'}
            color="inherit"
            size="large"
            rel="noopener"
            href={premiumLicense ? paths.payment : paths.auth.jwt.signUp}
          >
            Começar a investir
          </Button>
        </m.div>
      </Box>
    </MotionViewport>
  );
}

// ----------------------------------------------------------------------

const PLANS = Array.from({ length: 2 }, (_, index) => ({
  license: ['Grátis', 'Premium'][index],
  price: [0, 47.99][index],
  commons: ['Dashboard completo', 'Notícias', 'Backtest', 'Gerenciador de carteira (1 carteira)', 'Conversor de moedas', 'Detalhe dos ativos', 'Glossário de investimentos', 'Agenda de dividendos', 'Comparação de ativos (simples)'],
  options: [
    'Assistente de investimentos com IA (24h)',
    'Gerenciador de carteira (até 3 carteiras)',
    'Comparação de ativos (com relatório da IA)',
    'Importador inteligente de carteira',
    'Momento da empresa com IA',
    'Navi Diário (Jornal de investimentos gerado por IA)',
    'Importação automática de portfólio da B3'
  ],
}));
