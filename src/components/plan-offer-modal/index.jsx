import { Modal, Paper, Typography, Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';

export function PlanOfferModal({ open, onClose }) {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate('/planos');
    if (onClose) onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="plan-offer-title"
      sx={{ backdropFilter: 'blur(2px)' }}
    >
      <Paper
        elevation={3}
        sx={{
          width: 400,
          maxWidth: '90%',
          p: 3,
          m: 'auto',
          mt: '10%',
          position: 'relative',
          borderRadius: 1,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <IconButton onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
          <CloseIcon />
        </IconButton>
        <Typography id="plan-offer-title" variant="h6" sx={{ mb: 2 }}>
          Conheça nossos planos
        </Typography>
        <Typography variant="body2" sx={{ mb: 3 }}>
          {/* Descreva aqui os benefícios do plano pago */}
        </Typography>
        <Button fullWidth variant="contained" onClick={handleNavigate}>
          Ver Planos
        </Button>
      </Paper>
    </Modal>
  );
}
