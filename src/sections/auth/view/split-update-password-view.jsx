import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useBoolean } from 'minimal-shared/hooks';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';

import { SentIcon } from 'src/assets/icons';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

import { FormHead } from '../../../auth/components/form-head';
import { FormResendCode } from '../../../auth/components/form-resend-code';
import { FormReturnLink } from '../../../auth/components/form-return-link';
import { useEffect, useState } from 'react';
import { Alert, Snackbar } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { set } from 'nprogress';

// ----------------------------------------------------------------------

export const UpdatePasswordSchema = zod
  .object({
    code: zod
      .string()
      .min(1, { message: 'Code is required!' })
      .min(6, { message: 'Code must be at least 6 characters!' }),
    password: zod
      .string()
      .min(1, { message: 'Password is required!' })
      .min(6, { message: 'Password must be at least 6 characters!' }),
    confirmPassword: zod.string().min(1, { message: 'Confirm password is required!' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match!',
    path: ['confirmPassword'],
  });

// ----------------------------------------------------------------------

export function SplitUpdatePasswordView() {
  const navigate = useNavigate();

  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'info'
  });
  const showPassword = useBoolean();

  const defaultValues = {
    code: '',
    password: '',
    confirmPassword: '',
  };


  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const methods = useForm({
    resolver: zodResolver(UpdatePasswordSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const { code, password } = data;
      const userMail = localStorage.getItem('reset_password_mail');
      if (!userMail) {
        setNotification({
          open: true,
          message: `Ocorreu um erro ao tentar redefinir a senha`,
          severity: 'error'
        });

        return;
      }

      await axios.post(`${import.meta.env.VITE_SERVER_URL2}/auth/update-password`, {
        email: userMail,
        code: code,
        newPassword: password
      })
        .then(async () => {
          setNotification({
            open: true,
            message: `Senha atualizada com sucesso!`,
            severity: 'success'
          });
          localStorage.removeItem('reset_password_mail');
          await new Promise((resolve) => setTimeout(resolve, 2000));

          await navigate(paths.auth.jwt.signIn);
        }).catch((error) => {
          setNotification({
            open: true,
            message: `Erro ao atualizar a senha: Confira se o código está correto`,
            severity: 'error'
          });
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
      <Field.Code name="code" />

      <Field.Text
        name="password"
        label="Password"
        placeholder="6+ caracteres"
        type={showPassword.value ? 'text' : 'password'}
        slotProps={{
          inputLabel: { shrink: true },
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={showPassword.onToggle} edge="end">
                  <Iconify icon={showPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />

      <Field.Text
        name="confirmPassword"
        label="Confirmar senha"
        placeholder="6+ caracteres"
        helperText="As senhas devem ser iguais"
        type={showPassword.value ? 'text' : 'password'}
        slotProps={{
          inputLabel: { shrink: true },
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={showPassword.onToggle} edge="end">
                  <Iconify icon={showPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        loadingIndicator="Atualizar senha..."
      >
        Atualizar senha
      </LoadingButton>
    </Box>
  );

  const [remainingTime, setRemainingTime] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    let interval;
    if (remainingTime > 0) {
      interval = setInterval(() => {
        setRemainingTime((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }

    return () => clearInterval(interval);
  }, [remainingTime]);

  const handleResendCode = () => {
    // Resend logic here
    setRemainingTime(60);
    setCanResend(false);
  };

  return (
    <>
      <FormHead
        icon={<SentIcon />}
        title="Solicitação enviada com sucesso!"
        description={`Enviamos um código de 6 dígitos para o seu e-mail. \nPor favor, digite o código abaixo para verificar seu e-mail.`}
      />

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm()}
      </Form>

      <FormResendCode
        onResendCode={handleResendCode}
        value={remainingTime}
        disabled={!canResend}
      />

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
