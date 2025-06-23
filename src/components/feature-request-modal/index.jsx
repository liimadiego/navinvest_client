import { useState } from 'react';
import {
  Box,
  Button,
  IconButton,
  Modal,
  Paper,
  TextField,
  Typography,
  Snackbar,
  Alert,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import ForumIcon from '@mui/icons-material/Forum';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import axios from 'src/lib/axios';

export function FeatureRequestModal({ open, onClose }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [alert, setAlert] = useState({ open: false, severity: 'success', message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { title, description };
    try {
      await axios.post('/user-ideas/create', payload);
      setAlert({
        open: true,
        severity: 'success',
        message: 'Obrigado por contribuir com a comunidade Navinvest!',
      });
      setTitle('');
      setDescription('');
      onClose();
    } catch (err) {
      setTitle('');
      setDescription('');
      onClose();
      if (err.statusCode && err.statusCode === 429) {
        setAlert({
          open: true,
          severity: 'error',
          message: 'Infelizmente você atingiu o limite de ideias diárias. Criamos esse limite para evitar spam e garantir que todas as sugestões sejam analisadas com atenção.',
        });
        return;
      }

      setAlert({
        open: true,
        severity: 'error',
        message: 'Não foi possível enviar sua ideia.',
      });
    }
  };

  return (
    <Box>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="feature-modal-title"
        sx={{ backdropFilter: 'blur(2px)' }}
      >
        <Paper
          component="form"
          onSubmit={handleSubmit}
          elevation={3}
          sx={{
            width: 800,
            maxWidth: '90%',
            p: 3,
            m: 'auto',
            mt: '5vh',
            height: { xs: '90vh', md: 'auto' },
            position: 'relative',
            borderRadius: 1,
            overflowY: 'auto'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <IconButton onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
            <CloseIcon />
          </IconButton>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <LightbulbIcon sx={{ mr: 1 }} />
            <Typography id="feature-modal-title" variant="h6">
              Envie sua ideia
            </Typography>
          </Box>

          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <EmojiPeopleIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="subtitle1" fontWeight="bold">
                  Sua voz é importante para nós!
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Como membro valioso da comunidade Navinvest, suas ideias ajudam a moldar o futuro da plataforma.
              </Typography>
              <Divider sx={{ my: 1.5 }} />
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <ForumIcon fontSize="small" color="primary" sx={{ mr: 1 }} />
                <Typography variant="body2" fontWeight="medium">
                  Como funciona:
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ pl: 3, fontSize: '0.85rem' }}>
                • Você pode enviar até 2 ideias por dia<br />
                • Nossa equipe analisa todas as sugestões<br />
                {/* • As mais votadas pela comunidade são implementadas<br /> */}
                • Você recebe notificações caso sua ideia seja selecionada para implementação<br />
              </Typography>
            </CardContent>
          </Card>

          <TextField
            fullWidth
            label="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Descrição"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{ mb: 3 }}
          />
          <Button type="submit" fullWidth sx={(theme) => ({
            backgroundColor: theme.palette.primary.main,
            color: '#fff',
            px: 2,
            '&:hover': {
              backgroundColor: theme.palette.primary.dark,
            },
          })}>
            Contribuir
          </Button>
        </Paper>
      </Modal>
      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={() => setAlert({ ...alert, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ width: '100%', position: 'fixed', left: 0, right: 0, top: 10 }}
      >
        <Alert
          onClose={() => setAlert({ ...alert, open: false })}
          severity={alert.severity}
          sx={{ width: '800px', zIndex: 9999, maxWidth: '90%' }}
          variant="filled"
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
