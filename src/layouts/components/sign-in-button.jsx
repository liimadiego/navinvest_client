import Button from '@mui/material/Button';

import { RouterLink } from 'src/routes/components';

import { CONFIG } from 'src/global-config';
import { IconButton, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

export function SignInButton({ sx, ...other }) {
  const navigate = useNavigate();
  return (
    <>
      <Button
        component={RouterLink}
        href={CONFIG.auth.redirectPath}
        variant="outlined"
        sx={{ ...sx, transform: { xs: 'translateX(8px)', md: 'none' } }}
        {...other}
      >
        <Typography variant="body2" sx={{ textTransform: 'none' }}>
          Entrar
        </Typography>
      </Button>

      <Button
        // variant="outlined"
        sx={{ ...sx, transform: { xs: 'translateX(8px)', md: 'none' }, backgroundColor: "#0236fc", color: "#fff", px: 2 }}
        {...other}
        onClick={() => navigate(paths.auth.jwt.signUp)}
      >
        <Typography variant="body2" sx={{ textTransform: 'none' }}>
          Registrar
        </Typography>
        {/* <Login sx={{ pr: 0, mr: 0, display: { xs: 'inline-block', md: 'none' } }} /> */}
      </Button>
    </>

  );
}
