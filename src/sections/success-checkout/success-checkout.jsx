import { CheckCircleOutlined } from '@mui/icons-material';
import { Box, Button, Container, Typography, Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';

export function SuccessCheckout({ plan = 'monthly', amount = 575.88, mail = 'diegolima@gmail.com' }) {
  const theme = useTheme();

  const formatAmount = (value) => {
    if (typeof value !== 'number') {
      return 'R$ 0,00';
    }
    return `R$ ${value.toFixed(2).replace('.', ',')}`;
  }

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper
        elevation={3}
        sx={{
          p: { xs: 3, md: 5 },
          textAlign: 'center',
          borderRadius: 2,
          backgroundColor: 'background.paper',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '8px',
            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
          }}
        />

        <CheckCircleOutlined
          color="success"
          sx={{
            fontSize: { xs: 60, md: 80 },
            mb: 2
          }}
        />

        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            color: theme.palette.primary.main
          }}
        >
          Pagamento Realizado com Sucesso!
        </Typography>

        <Typography
          variant="body1"
          paragraph
          sx={{
            mb: 4,
            fontSize: { xs: '1rem', md: '1.1rem' }
          }}
        >
          Parabéns! Seu pagamento para o plano {plan === 'monthly' ? 'mensal' : 'anual'} foi processado e confirmado. Estamos muito felizes em recebê-lo na Navinvest,
          onde você terá acesso às melhores ferramentas e recursos para alavancar seus investimentos.
        </Typography>

        <Typography
          variant="body1"
          sx={{
            mb: 4,
            fontSize: { xs: '1rem', md: '1.1rem' }
          }}
        >
          Faça login com o e-mail <strong>{mail}</strong> para acessar sua conta e iniciar sua jornada de investimentos com a gente.
        </Typography>

        <Button
          component={RouterLink}
          to="/auth/login"
          variant="contained"
          size="large"
          sx={{
            px: 4,
            py: 1.5,
            borderRadius: 2,
            fontSize: '1rem',
            boxShadow: theme.shadows[4],
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: theme.shadows[8],
            },
            transition: 'all 0.3s ease-in-out'
          }}
        >
          Ir para o Login
        </Button>
      </Paper>
    </Container>
  );
}
