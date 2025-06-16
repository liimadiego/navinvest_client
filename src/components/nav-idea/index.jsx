import { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import { FeatureRequestModal } from '../feature-request-modal';

export function NavIdea() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <FeatureRequestModal open={open} onClose={() => setOpen(false)} />
      <Box sx={{ mb: 1 }}>
        <Button
          onClick={() => setOpen(true)}
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'flex-start',
            mt: .5,
            pl: 1.5,
            pb: 1,
            pt: 1,
            alignItems: 'center',
            borderRadius: 1,
            '&:hover': {
              backgroundColor: 'rgba(145 158 171 / 0.08)',
              cursor: 'pointer',
              borderRadius: 1,
            },
          }}
        >
          <LightbulbIcon sx={{ width: 24, height: 24, color: 'rgba(145 158 171 / 0.7)' }} />
          <Typography
            variant="body2"
            sx={{
              fontSize: '0.875rem',
              fontWeight: 500,
              ml: 1.5,
              color: 'text.secondary',
            }}
          >
            Enviar Ideia
          </Typography>
        </Button>
      </Box>
    </>
  );
}
