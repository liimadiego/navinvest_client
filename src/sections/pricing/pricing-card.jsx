import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';

import { PlanFreeIcon, PlanStarterIcon, PlanPremiumIcon } from 'src/assets/icons';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import InfoIcon from '@mui/icons-material/Info';

import { useNavigate } from 'react-router-dom';

// ----------------------------------------------------------------------

export function PricingCard({ card, sx, isYearly, ...other }) {
  const { subscription, price, caption, lists, labelAction, priceYear, iaLimitExplained } = card;

  const navigate = useNavigate();

  const handleGoToCheckoutPage = () => {
    navigate('/checkout-pagamento', { state: { subscription } });
  };

  const isBasic = subscription === 'basic';
  const isStarter = subscription === 'starter';
  const isPremium = subscription === 'premium';

  const renderIcon = () => (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      {isBasic && <PlanFreeIcon sx={{ width: 64 }} />}
      {isStarter && <PlanStarterIcon sx={{ width: 64 }} />}
      {isPremium && <PlanPremiumIcon sx={{ width: 64 }} />}

      {isStarter && <Label color="info">POPULAR</Label>}
    </Box>
  );

  const renderSubscription = () => (
    <Stack spacing={1}>
      <Typography variant="h4" sx={{ textTransform: 'capitalize' }}>
        {subscription}
      </Typography>
      {(isYearly || isBasic) && <Typography variant="subtitle2">{caption}</Typography>}
    </Stack>
  );

  const renderPrice = () =>
    isBasic ? (
      <Typography variant="h2">Grátis</Typography>
    ) : (
      <Box sx={{ display: 'flex' }}>
        <Typography variant="h4">R$</Typography>

        <Typography variant="h2">{(isYearly ? priceYear : price)}</Typography>

        <Typography
          component="span"
          sx={{
            ml: 1,
            alignSelf: 'center',
            typography: 'body2',
            color: 'text.disabled',
          }}
        >
          / mês
        </Typography>
      </Box>
    );

  const renderList = () => (
    <Stack spacing={2} sx={{ flexGrow: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box component="span" sx={{ typography: 'overline' }}>
          Funcionalidades
        </Box>

        {/* <Link variant="body2" color="inherit" underline="always">
          Todas
        </Link> */}
      </Box>

      {lists.map((item) => (
        <Box key={item} sx={{ gap: 1, display: 'flex', typography: 'body2', alignItems: 'center' }}>
          <Iconify icon="eva:checkmark-fill" width={16} />
          {item}
        </Box>
      ))}

      {iaLimitExplained && <Box sx={{ typography: 'body2', textDecoration: 'underline', mt: 3 }}>
        <Tooltip title={iaLimitExplained}>
          Como funciona o limite de uso da IA?
          <IconButton sx={{ my: 0, py: 0, transform: 'scale(0.7) translate(5px, -1px)' }}>
            <InfoIcon />
          </IconButton>
        </Tooltip>
      </Box>
      }
    </Stack>
  );

  return (
    <Box
      sx={[
        (theme) => ({
          mx: 1,
          p: 5,
          pt: 3,
          gap: 3,
          display: 'flex',
          borderRadius: 2,
          flexDirection: 'column',
          bgcolor: 'background.neutral',
          boxShadow: theme.vars.customShadows.card,
          [theme.breakpoints.up('md')]: {
            boxShadow: 'none',
          },
          // ...((isBasic || isStarter) && {
          //   borderTopRightRadius: { md: 0 },
          //   borderBottomRightRadius: { md: 0 },
          // }),
          ...((true) && {
            [theme.breakpoints.up('md')]: {
              boxShadow: `-40px 40px 80px 0px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.16)}`,
              ...theme.applyStyles('dark', {
                boxShadow: `-40px 40px 80px 0px ${varAlpha(theme.vars.palette.common.blackChannel, 0.16)}`,
              }),
            },
          }),
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      {renderIcon()}
      {renderSubscription()}
      {renderPrice()}

      <Divider sx={{ borderStyle: 'dashed' }} />

      {renderList()}

      <Button
        fullWidth
        size="large"
        variant="contained"
        disabled={isBasic}
        color={isStarter ? 'primary' : 'inherit'}
        onClick={isPremium ? handleGoToCheckoutPage : undefined}
      >
        {labelAction}
      </Button>
    </Box>
  );
}
