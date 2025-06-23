import Button from '@mui/material/Button';

import { RouterLink } from 'src/routes/components';

import { CONFIG } from 'src/global-config';
import { IconButton, Typography } from '@mui/material';
import { Login } from '@mui/icons-material';

// ----------------------------------------------------------------------

export function SignInButton({ sx, ...other }) {
  return (
    <Button
      component={RouterLink}
      href={CONFIG.auth.redirectPath}
      variant="outlined"
      sx={{ ...sx, transform: { xs: 'translateX(8px)', md: 'none' } }}
      {...other}
    >
      <Typography variant="body2" sx={{ textTransform: 'none', display: { xs: 'none', md: 'inline-block' } }}>
        Entrar
      </Typography>
      <Login sx={{ pr: 0, mr: 0, display: { xs: 'inline-block', md: 'none' } }} />
    </Button>
  );
}
