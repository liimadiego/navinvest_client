import { Box, Typography } from '@mui/material';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router';
import ForbiddenIllustration from 'src/assets/illustrations/forbidden-illustration';
import { useAuthContext } from 'src/auth/hooks';
import { CONFIG } from 'src/global-config';
import { AiWalletImporterView } from 'src/sections/ai_wallet_importer/view/ai-wallet-importer-view';

export default function Page() {
  const metadata = { title: `Importar carteira | ${CONFIG.appName.toUpperCase()}` };
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

      <AiWalletImporterView />
    </> : <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', flexDirection: 'column' }}>
      <ForbiddenIllustration />
      <Typography variant="h4" sx={{ mt: 5 }}>
        Você precisa de um plano pago para acessar essa funcionalidade.
      </Typography>
    </Box>
  );
}
