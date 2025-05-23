import { Box, Container, Paper, Typography, Divider } from '@mui/material';
import { alpha } from '@mui/material/styles';

export function TermsServiceView() {
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
          Termos de Uso
        </Typography>

        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 3 }}>
          Última atualização: 22/05/2025
        </Typography>

        <Typography variant="body1" paragraph>
          Bem-vindo à Navinvest!
        </Typography>

        <Typography variant="body1" paragraph>
          Ao acessar ou utilizar nossos serviços, você concorda com estes Termos de Uso. Leia atentamente antes de utilizar a plataforma. Caso não concorde com estes termos, não utilize os serviços.
        </Typography>

        <Box sx={{ my: 3 }}>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            1. Definições
          </Typography>
          <Typography variant="body1" paragraph>
            Plataforma: Refere-se ao site, aplicativos e demais serviços oferecidos por NAVINVEST TECNOLOGIA.
            Usuário: Qualquer pessoa física ou jurídica que acesse ou utilize a Plataforma.
          </Typography>
        </Box>

        <Divider />

        <Box sx={{ my: 3 }}>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            2. Aceitação dos Termos
          </Typography>
          <Typography variant="body1" paragraph>
            Ao criar uma conta ou utilizar nossos serviços, o Usuário declara que leu, compreendeu e aceitou integralmente estes Termos de Uso e demais políticas aplicáveis.
          </Typography>
        </Box>

        <Divider />

        <Box sx={{ my: 3 }}>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            3. Serviços Prestados
          </Typography>
          <Typography variant="body1" paragraph>
            A Plataforma oferece ferramentas para análise, acompanhamento e organização de investimentos, utilizando tecnologia de inteligência artificial e dados do mercado financeiro, incluindo dados provenientes de APIs de terceiros, como a B3. Os serviços têm caráter informativo e educativo, não constituindo recomendação personalizada de investimentos.
          </Typography>
        </Box>

        <Divider />

        <Box sx={{ my: 3 }}>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            4. Cadastro e Conta do Usuário
          </Typography>
          <Typography variant="body1" paragraph>
            O Usuário deve fornecer informações verdadeiras e atualizadas.

            O Usuário é responsável por manter a confidencialidade de suas credenciais de acesso.

            Em caso de uso não autorizado da conta, o Usuário deve comunicar imediatamente a equipe da Plataforma.
          </Typography>
        </Box>

        <Divider />

        <Box sx={{ my: 3 }}>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            5. Planos e Pagamentos
          </Typography>
          <Typography variant="body1" paragraph>
            Alguns serviços são pagos, conforme descrito na página de preços da Plataforma.

            Os pagamentos são processados por empresas terceirizadas especializadas, de forma segura.

            Em caso de inadimplência, a Plataforma poderá suspender o acesso do Usuário aos serviços contratados.
          </Typography>
        </Box>

        <Divider />

        <Box sx={{ my: 3 }}>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            6. Limites de Uso
          </Typography>
          <Typography variant="body1" paragraph>
            A Plataforma pode estabelecer limites de uso mensal dos recursos de IA, conforme informado na página de preços ou no painel do usuário.

            Caso o limite seja atingido, parte das funcionalidades pode ser temporariamente restrita até o próximo ciclo.
          </Typography>
        </Box>

        <Divider />

        <Box sx={{ my: 3 }}>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            7. Propriedade Intelectual
          </Typography>
          <Typography variant="body1" paragraph>
            Todo o conteúdo, marcas, design, softwares e demais elementos da Plataforma são de propriedade exclusiva de NAVINVEST TECNOLOGIA, salvo quando indicado o contrário. É vedada a reprodução, distribuição ou qualquer uso não autorizado.
          </Typography>
        </Box>

        <Divider />

        <Box sx={{ my: 3 }}>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            8. Privacidade e Proteção de Dados
          </Typography>
          <Typography variant="body1" paragraph>
            Os dados pessoais dos usuários são tratados conforme a Política de Privacidade. A Plataforma utiliza dados de terceiros e processa informações financeiras para oferecer seus serviços, respeitando todas as leis aplicáveis.
          </Typography>
        </Box>

        <Divider />

        <Box sx={{ my: 3 }}>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            9. Responsabilidades e Isenções
          </Typography>
          <Typography variant="body1" paragraph>
            A Plataforma não garante a exatidão, atualidade ou completude das informações fornecidas.

            O Usuário é o único responsável por suas decisões de investimento.

            A Plataforma não responde por eventuais perdas financeiras, danos ou prejuízos decorrentes do uso das informações e serviços oferecidos.
          </Typography>
        </Box>

        <Divider />

        <Box sx={{ my: 3 }}>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            10. Modificações dos Termos
          </Typography>
          <Typography variant="body1" paragraph>
            A Plataforma pode alterar estes Termos a qualquer momento, mediante aviso prévio por meio do site ou por e-mail. O uso continuado após as alterações constitui aceitação dos novos termos.
          </Typography>
        </Box>

        <Divider />

        <Box sx={{ my: 3 }}>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            11. Cancelamento e Encerramento
          </Typography>
          <Typography variant="body1" paragraph>
            O Usuário pode cancelar sua conta a qualquer momento, mediante solicitação pela Plataforma. A Plataforma reserva-se o direito de encerrar contas que violem estes Termos ou qualquer legislação aplicável.
          </Typography>
        </Box>

        <Divider />

        <Box sx={{ my: 3 }}>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            12. Lei Aplicável e Foro
          </Typography>
          <Typography variant="body1" paragraph>
            Estes Termos são regidos pelas leis da República Federativa do Brasil. Quaisquer controvérsias serão dirimidas no foro da comarca de São Paulo/SP, com exclusão de qualquer outro.
          </Typography>
        </Box>

        <Divider />

        <Box sx={{ my: 3 }}>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            13. Contato
          </Typography>
          <Typography variant="body1">
            Em caso de dúvidas, sugestões ou solicitações, entre em contato conosco pelo e-mail: contato@navinvest.com.br
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}
