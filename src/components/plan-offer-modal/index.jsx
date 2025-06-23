import { Modal, Paper, Typography, Button, IconButton, Box, Chip, Divider, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import StarIcon from '@mui/icons-material/Star';
import { useNavigate } from 'react-router-dom';
import { keyframes } from '@mui/system';

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

export function PlanOfferModal({ open, onClose }) {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate('/checkout-pagamento');
    if (onClose) onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="plan-offer-title"
      sx={{ backdropFilter: 'blur(5px)' }}
    >
      <Paper
        elevation={6}
        sx={{
          width: 500,
          maxWidth: '90%',
          p: 4,
          m: 'auto',
          mt: '10%',
          position: 'relative',
          borderRadius: 2,
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
          }
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <IconButton onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
          <CloseIcon />
        </IconButton>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <StarIcon sx={{ color: 'primary.main', mr: 1 }} />
          <Typography id="plan-offer-title" variant="h5" component="h2" fontWeight="bold">
            Recurso Premium
          </Typography>
        </Box>

        <Chip
          label="Disponível no plano Premium"
          color="primary"
          size="small"
          sx={{ mb: 2 }}
        />

        <Typography variant="body1" sx={{ mb: 3 }}>
          Este recurso está disponível exclusivamente para assinantes do plano Premium.
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 1 }}>
          Benefícios do plano Premium:
        </Typography>

        <List dense sx={{ mb: 2 }}>
          <ListItem disableGutters>
            <ListItemIcon sx={{ minWidth: 36 }}>
              <CheckCircleOutlineIcon color="success" />
            </ListItemIcon>
            <ListItemText primary="Assistente de investimentos com IA (24h)" />
          </ListItem>
          <ListItem disableGutters>
            <ListItemIcon sx={{ minWidth: 36 }}>
              <CheckCircleOutlineIcon color="success" />
            </ListItemIcon>
            <ListItemText primary="Gerenciador de carteira (até 3 carteiras)" />
          </ListItem>
          <ListItem disableGutters>
            <ListItemIcon sx={{ minWidth: 36 }}>
              <CheckCircleOutlineIcon color="success" />
            </ListItemIcon>
            <ListItemText primary="Comparação de ativos (com relatório da IA)" />
          </ListItem>
          <ListItem disableGutters>
            <ListItemIcon sx={{ minWidth: 36 }}>
              <CheckCircleOutlineIcon color="success" />
            </ListItemIcon>
            <ListItemText primary="Importador inteligente de carteira" />
          </ListItem>
          <ListItem disableGutters>
            <ListItemIcon sx={{ minWidth: 36 }}>
              <CheckCircleOutlineIcon color="success" />
            </ListItemIcon>
            <ListItemText primary="Momento da empresa com IA" />
          </ListItem>
          <ListItem disableGutters>
            <ListItemIcon sx={{ minWidth: 36 }}>
              <CheckCircleOutlineIcon color="success" />
            </ListItemIcon>
            <ListItemText primary="Momento do FII com IA" />
          </ListItem>
          <ListItem disableGutters>
            <ListItemIcon sx={{ minWidth: 36 }}>
              <CheckCircleOutlineIcon color="success" />
            </ListItemIcon>
            <ListItemText primary="Navi Diário (Jornal de investimentos gerado por IA)" />
          </ListItem>
        </List>


        <Button
          fullWidth
          variant="contained"
          size="large"
          onClick={handleNavigate}
          sx={{
            mt: 2,
            py: 1.2,
            fontWeight: 'bold',
            animation: `${pulse} 2s infinite ease-in-out`,
            '&:hover': {
              animation: 'none',
              transform: 'scale(1.02)'
            }
          }}
        >
          Teste 7 dias grátis
        </Button>

        <Button
          fullWidth
          variant="text"
          onClick={onClose}
          sx={{ mt: 1.5 }}
        >
          Continuar com plano gratuito
        </Button>
      </Paper>
    </Modal>
  );
}
