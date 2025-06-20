import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';

import { PasswordIcon } from 'src/assets/icons';

import { Form, Field } from 'src/components/hook-form';

import { FormHead } from '../../../auth/components/form-head';
import { FormReturnLink } from '../../../auth/components/form-return-link';

import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';
import { Alert, Snackbar } from '@mui/material';

// ----------------------------------------------------------------------

export const ResetPasswordSchema = zod.object({
  email: zod
    .string()
    .min(1, { message: 'Email é obrigatório' })
    .email({ message: 'Email deve ser válido' }),
});

// ----------------------------------------------------------------------

export function SplitResetPasswordView() {
  const navigate = useNavigate();
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'info'
  });

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const defaultValues = {
    email: '',
  };

  const methods = useForm({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (!data.email) {
        setNotification({
          open: true,
          message: `Email é obrigatório`,
          severity: 'error'
        });
      }


      await axios.post(`${import.meta.env.VITE_SERVER_URL2}/auth/reset-password`, {
        email: data.email,
      })
        .then(async () => {
          localStorage.setItem('reset_password_mail', data.email);
          setNotification({
            open: true,
            message: `Pedido de redefinição de senha enviado com sucesso!`,
            severity: 'success'
          });
          //coloca o email no local storage
          await new Promise((resolve) => setTimeout(resolve, 2000));
          await navigate(paths.auth.jwt.updatePassword);
        }).catch((error) => {
          console.error('Error:', error);
        });

    } catch (error) {
      setNotification({
        open: true,
        message: `Erro ao enviar o pedido de redefinição de senha: ${error.message}`,
        severity: 'error'
      });
    }
  });

  const renderForm = () => (
    <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
      <Field.Text
        autoFocus
        name="email"
        label="Email"
        autocomplete="on"
        placeholder="exemplo@email.com"
        slotProps={{ inputLabel: { shrink: true } }}
      />

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        // variant="contained"
        loading={isSubmitting}
        loadingIndicator="Enviar pedido..."
        sx={(theme) => ({
          backgroundColor: theme.palette.primary.main,
          color: '#fff',
          '&:hover': {
            backgroundColor: theme.palette.primary.dark,
          },
        })}
      >
        Enviar pedido
      </LoadingButton>
    </Box>
  );

  return (
    <>
      <FormHead
        icon={<PasswordIcon />}
        title="Esqueceu sua senha?"
        description={`Por favor, digite o endereço de e-mail associado à sua conta e nós enviaremos um link para redefinir sua senha.`}
      />

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm()}
      </Form>

      <FormReturnLink href={paths.auth.jwt.signIn} />

      <Snackbar
        open={notification.open}
        autoHideDuration={30000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
}
