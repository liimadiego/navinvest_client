import { Box, Container, Paper, Typography, Divider } from '@mui/material';
import { alpha } from '@mui/material/styles';

export function PrivacyPolicyView() {
  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 2,
          boxShadow: (theme) => `0 8px 24px ${alpha(theme.palette.primary.main, 0.1)}`
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold" color="primary">
          Política de Privacidade
        </Typography>

        <Box sx={{ my: 3 }}>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            1. Introdução
          </Typography>
          <Typography paragraph>
            Bem-vindo à NavinvestAI! Esta Política de Privacidade explica como coletamos, usamos, armazenamos, compartilhamos e protegemos os seus dados pessoais quando você utiliza nossos serviços.
          </Typography>
          <Typography paragraph>
            Ao acessar ou usar nossa plataforma, você concorda com esta Política de Privacidade.
          </Typography>
        </Box>

        <Divider />

        <Box sx={{ my: 3 }}>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            2. Quais dados coletamos
          </Typography>
          <Typography paragraph>
            Coletamos informações que você fornece diretamente e dados gerados automaticamente ao usar nossos serviços, incluindo:
          </Typography>
          <Typography paragraph component="div" sx={{ pl: 2 }}>
            Dados de cadastro: nome, e-mail, telefone, CPF (quando necessário).
          </Typography>
          <Typography paragraph component="div" sx={{ pl: 2 }}>
            Dados financeiros: informações de investimentos, carteiras e preferências financeiras, caso você utilize funcionalidades de importação ou análise.
          </Typography>
          <Typography paragraph component="div" sx={{ pl: 2 }}>
            Dados de uso: registros de acesso, interações com a plataforma e dados técnicos do dispositivo (IP, navegador, sistema operacional).
          </Typography>
          <Typography paragraph component="div" sx={{ pl: 2 }}>
            Cookies e tecnologias similares: para melhorar sua experiência e segurança.
          </Typography>
        </Box>

        <Divider />

        <Box sx={{ my: 3 }}>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            3. Como usamos seus dados
          </Typography>
          <Typography paragraph>
            Usamos seus dados para:
          </Typography>
          <Typography paragraph component="div" sx={{ pl: 2 }}>
            Prestar e aprimorar nossos serviços;
          </Typography>
          <Typography paragraph component="div" sx={{ pl: 2 }}>
            Personalizar sua experiência na plataforma;
          </Typography>
          <Typography paragraph component="div" sx={{ pl: 2 }}>
            Cumprir obrigações legais e regulatórias;
          </Typography>
          <Typography paragraph component="div" sx={{ pl: 2 }}>
            Enviar comunicações importantes sobre a plataforma;
          </Typography>
          <Typography paragraph component="div" sx={{ pl: 2 }}>
            Garantir a segurança e integridade do serviço.
          </Typography>
        </Box>

        <Divider />

        <Box sx={{ my: 3 }}>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            4. Compartilhamento de dados
          </Typography>
          <Typography paragraph>
            Seus dados não são vendidos. O compartilhamento ocorre apenas:
          </Typography>
          <Typography paragraph component="div" sx={{ pl: 2 }}>
            Com parceiros responsáveis pelo processamento de pagamentos, sempre sob acordos de confidencialidade;
          </Typography>
          <Typography paragraph component="div" sx={{ pl: 2 }}>
            Quando exigido por lei ou por autoridades competentes;
          </Typography>
          <Typography paragraph component="div" sx={{ pl: 2 }}>
            Em caso de operações societárias, como fusão ou aquisição, desde que preservada a confidencialidade.
          </Typography>
        </Box>

        <Divider />

        <Box sx={{ my: 3 }}>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            5. Armazenamento e segurança
          </Typography>
          <Typography paragraph>
            Seus dados são armazenados em servidores seguros e adotamos as melhores práticas de segurança para proteger suas informações contra acessos não autorizados, perda ou divulgação indevida.
          </Typography>
        </Box>

        <Divider />

        <Box sx={{ my: 3 }}>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            6. Seus direitos
          </Typography>
          <Typography paragraph>
            Você pode, a qualquer momento:
          </Typography>
          <Typography paragraph component="div" sx={{ pl: 2 }}>
            Acessar, corrigir ou atualizar seus dados pessoais;
          </Typography>
          <Typography paragraph component="div" sx={{ pl: 2 }}>
            Solicitar a exclusão dos seus dados (quando permitido por lei);
          </Typography>
          <Typography paragraph component="div" sx={{ pl: 2 }}>
            Revogar o consentimento para uso de dados;
          </Typography>
          <Typography paragraph component="div" sx={{ pl: 2 }}>
            Solicitar informações sobre o tratamento dos seus dados.
          </Typography>
          <Typography paragraph>
            Para exercer seus direitos, entre em contato pelo e-mail: contato@navinvest.com.br
          </Typography>
        </Box>

        <Divider />

        <Box sx={{ my: 3 }}>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            7. Retenção dos dados
          </Typography>
          <Typography paragraph>
            Mantemos seus dados pelo tempo necessário para cumprir as finalidades descritas nesta política e conforme exigido por obrigações legais e regulatórias.
          </Typography>
        </Box>

        <Divider />

        <Box sx={{ my: 3 }}>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            8. Cookies
          </Typography>
          <Typography paragraph>
            Utilizamos cookies para garantir o funcionamento adequado da plataforma, melhorar sua experiência e coletar estatísticas de uso. Você pode gerenciar as preferências de cookies no seu navegador.
          </Typography>
        </Box>

        <Divider />

        <Box sx={{ my: 3 }}>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            9. Alterações nesta política
          </Typography>
          <Typography paragraph>
            Podemos atualizar esta Política de Privacidade periodicamente. A versão mais recente estará sempre disponível em nosso site. Avisaremos sobre alterações relevantes.
          </Typography>
        </Box>

        <Divider />

        <Box>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            10. Contato
          </Typography>
          <Typography paragraph>
            Em caso de dúvidas, entre em contato pelo e-mail: contato@navinvest.com.br
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}
