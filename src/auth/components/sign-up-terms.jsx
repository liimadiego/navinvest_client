import Box from '@mui/material/Box';
import Link from '@mui/material/Link';

// ----------------------------------------------------------------------

export function SignUpTerms({ sx, ...other }) {
  return (
    <Box
      component="span"
      sx={[
        () => ({
          mt: 3,
          display: 'block',
          textAlign: 'center',
          typography: 'caption',
          color: 'text.secondary',
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      {'Ao se registrar, você concorda com nossos '}
      <Link underline="always" color="text.primary">
        Termos e serviços
      </Link>
      {' e '}
      <Link underline="always" color="text.primary">
        Política de privacidade
      </Link>
      .
    </Box>
  );
}
