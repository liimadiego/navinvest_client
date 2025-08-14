import { z as zod } from 'zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useBoolean } from 'minimal-shared/hooks';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';
import { PasswordChecklist } from 'src/components/password-checklist';

import { signUp } from '../../context/jwt';
import { useAuthContext } from '../../hooks';
import { getErrorMessage } from '../../utils';
import { FormHead } from '../../components/form-head';
import { SignUpTerms } from '../../components/sign-up-terms';
// ----------------------------------------------------------------------

export const SignUpSchema = zod.object({
  firstName: zod.string().min(1, { message: 'Campo obrigatório' }),
  lastName: zod.string().min(1, { message: 'Campo obrigatório' }),
  email: zod
    .string()
    .min(1, { message: 'Campo obrigatório' })
    .email({ message: 'O campo email precisa ser um email válido' }),
  password: zod
    .string()
    .min(1, { message: 'Campo obrigatório' })
    .min(8, { message: 'A senha precisa ter ao menos 8 caracteres' })
    .regex(/[a-z]/, { message: 'A senha precisa conter pelo menos uma letra minúscula' })
    .regex(/[A-Z]/, { message: 'A senha precisa conter pelo menos uma letra maiúscula' })
    .regex(/[0-9]/, { message: 'A senha precisa conter pelo menos um número' })
    .regex(/[^a-zA-Z0-9]/, { message: 'A senha precisa conter pelo menos um caractere especial' }),
  phone: zod
    .string()
    .min(1, { message: 'Campo obrigatório' })
    .regex(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, { message: 'O campo telefone precisa ser um telefone válido' }),
});

// ----------------------------------------------------------------------

export function JwtSignUpView() {
  const router = useRouter();

  const showPassword = useBoolean();

  const { checkUserSession } = useAuthContext();

  const [errorMessage, setErrorMessage] = useState('');

  const defaultValues = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  };

  const methods = useForm({
    resolver: zodResolver(SignUpSchema),
    defaultValues,
  });
  const passwordValue = methods.watch('password');

  const mostCompletePhoneMaskHandler = (value) => {
    const digits = value.replace(/\D/g, '');

    if (!digits) return '';

    if (digits.length <= 2) {
      return `(${digits}`;
    } else if (digits.length <= 6) {
      return `(${digits.substring(0, 2)}) ${digits.substring(2)}`;
    } else if (digits.length <= 10) {
      const areaCode = digits.substring(0, 2);
      const firstPart = digits.substring(2, 6);
      const secondPart = digits.substring(6);
      return `(${areaCode}) ${firstPart}-${secondPart}`;
    } else {
      const areaCode = digits.substring(0, 2);
      const firstPart = digits.substring(2, 7);
      const secondPart = digits.substring(7, 11);
      return `(${areaCode}) ${firstPart}-${secondPart}`;
    }
  };

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await signUp({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone.replaceAll(/[^0-9]/g, ''),
      });

      await checkUserSession?.();

      router.push(paths.dashboard.root);
    } catch (error) {
      console.error(error);
      const feedbackMessage = getErrorMessage(error);
      setErrorMessage(feedbackMessage);
    }
  });

  const renderForm = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Box
        sx={{ display: 'flex', gap: { xs: 3, sm: 2 }, flexDirection: { xs: 'column', sm: 'row' } }}
      >
        <Field.Text
          name="firstName"
          label="Primeiro nome"
          placeholder="Nome"
          slotProps={{ inputLabel: { shrink: true } }}
          sx={{ mb: 3 }}
        />
        <Field.Text
          name="lastName"
          label="Sobrenome"
          placeholder="Sobrenome"
          slotProps={{ inputLabel: { shrink: true } }}
          sx={{ mb: 3 }}
        />
      </Box>

      <Field.Text
        name="phone"
        label="Telefone"
        placeholder="(00) 00000-0000"
        slotProps={{ inputLabel: { shrink: true } }}
        InputProps={{
          inputComponent: 'input',
          inputProps: {
            maxLength: 15,
            pattern: '\\d{2}\\s\\d{5}-\\d{4}',
          },
        }}
        helperText="Formato: (00) 00000-0000"
        InputLabelProps={{
          shrink: true,
        }}
        onInput={(e) => {
          e.target.value = mostCompletePhoneMaskHandler(e.target.value.replace(/[^0-9\s-]/g, ''));
        }}
        sx={{ mb: 3 }}
      />

      <Field.Text name="email" label="Email" placeholder="Email" slotProps={{ inputLabel: { shrink: true } }} sx={{ mb: 3 }} />

      <Field.Text
        name="password"
        label="Senha"
        placeholder="8+ caracteres"
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

      <PasswordChecklist password={passwordValue} />

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        loadingIndicator="Criar conta..."
      >
        Criar conta
      </LoadingButton>
    </Box>
  );

  return (
    <>
      <FormHead
        title="Registre-se de graça"
        description={
          <>
            {`Já possui uma conta? Acesse o seu `}
            <Link component={RouterLink} href={paths.auth.jwt.signIn} variant="subtitle2" sx={(theme) => ({
              color: theme.palette.mode === 'dark' ? '#fff' : theme.palette.primary.main,
              borderColor: theme.palette.mode === 'dark' ? '#fff' : theme.palette.primary.main,
            })}>
              Login
            </Link>
          </>
        }
        sx={{ textAlign: { xs: 'center', md: 'left' } }}
      />

      {!!errorMessage && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMessage}
        </Alert>
      )}

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm()}
      </Form>

      <SignUpTerms />
    </>
  );
}
