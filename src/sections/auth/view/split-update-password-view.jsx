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
  const showPassword = useBoolean();

  const defaultValues = {
    code: '',
    password: '',
    confirmPassword: '',
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
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
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
    </>
  );
}
