import { useState } from 'react';
import { Box, Button, IconButton, Modal, Paper, TextField, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import { toast } from 'src/components/snackbar';
// import axios from 'src/lib/axios';

export function FeatureRequestModal({ open, onClose }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { title, description };
    try {
      // await axios.post('/feature-request', payload);
      toast.success('Obrigado por contribuir com a comunidade Navinvest!');
      setTitle('');
      setDescription('');
      onClose();
    } catch (err) {
      console.error(err);
      toast.error('Não foi possível enviar sua ideia.');
    }
  };

  return (
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
          width: 400,
          maxWidth: '90%',
          p: 3,
          m: 'auto',
          mt: '20vh',
          position: 'relative',
          borderRadius: 1,
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
        <Button type="submit" variant="contained" fullWidth>
          Contribuir
        </Button>
      </Paper>
    </Modal>
  );
}
