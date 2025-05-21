import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { AIAssistantView } from 'src/sections/ai_assistant/view';

import { useAuthContext } from 'src/auth/hooks';

import ForbiddenIllustration from "src/assets/illustrations/forbidden-illustration";
import { Box, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// ----------------------------------------------------------------------

const metadata = { title: `Assistente IA | ${CONFIG.appName}` };

export default function Page() {
  const { user } = useAuthContext();
  const userHasPlan = user?.plan !== null;
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.plan === null) {
      navigate('/dashboard', { replace: true });
    }
  }, [user]);


  return (
    user && user.plan !== null ? <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <AIAssistantView />
    </> : <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', flexDirection: 'column' }}>
      <ForbiddenIllustration />
      <Typography variant="h4" sx={{ mt: 5 }}>
        Você precisa de um plano pago para acessar essa funcionalidade.
      </Typography>
    </Box>
  );
}
