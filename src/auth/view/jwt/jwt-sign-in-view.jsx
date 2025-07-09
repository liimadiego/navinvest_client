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

import { useAuthContext } from '../../hooks';
import { getErrorMessage } from '../../utils';
import { FormHead } from '../../components/form-head';
import { signInWithPassword } from '../../context/jwt';

// ----------------------------------------------------------------------

const SignInSchema = zod.object({
  email: zod
    .string()
    .min(1, { message: 'O campo email é obrigatório!' })
    .email({ message: 'Email must be a valid email address!' }),
  password: zod
    .string()
    .min(1, { message: 'O campo senha é obrigatório!' })
});

// ----------------------------------------------------------------------

export function JwtSignInView() {
  const router = useRouter();

  const showPassword = useBoolean();

  const { checkUserSession } = useAuthContext();

  const [errorMessage, setErrorMessage] = useState('');

  const methods = useForm({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (checkUserSession) {
      checkUserSession();
    }
  }, [checkUserSession]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      await signInWithPassword({ email: data.email, password: data.password });
      await checkUserSession?.();

      router.refresh();
    } catch (error) {
      console.error(error);
      const feedbackMessage = getErrorMessage(error);
      setErrorMessage(feedbackMessage);
    }
  });

  const renderForm = () => (
    <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
      <Field.Text autocomplete="on" name="email" placeholder="exemplo@email.com" label="Email" slotProps={{ inputLabel: { shrink: true } }} />

      <Box sx={{ gap: 1.5, display: 'flex', flexDirection: 'column' }}>
        <Link
          component={RouterLink}
          href={paths.auth.jwt.resetPassword}
          variant="body2"
          color="inherit"
          sx={{ alignSelf: 'flex-end' }}
        >
          Esqueceu a senha?
        </Link>

        <Field.Text
          name="password"
          label="Senha"
          placeholder="********"
          type={showPassword.value ? 'text' : 'password'}
          slotProps={{
            inputLabel: { shrink: true },
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={showPassword.onToggle} edge="end">
                    <Iconify
                      icon={showPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                    />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>

      <LoadingButton
        fullWidth
        // color="inherit"
        size="large"
        type="submit"
        // variant="contained"
        loading={isSubmitting}
        loadingIndicator="Entrando..."
        sx={(theme) => ({
          backgroundColor: theme.palette.primary.main,
          color: '#fff',
          '&:hover': {
            backgroundColor: theme.palette.primary.dark,
          },
        })}
      >
        Entrar
      </LoadingButton>
    </Box >
  );

  return (
    <>
      <FormHead
        title="Entre na sua conta"
        description={
          <>
            {`Ainda não tem uma conta? `}
            <Link component={RouterLink} href={paths.payment} variant="subtitle2"
              sx={(theme) => ({
                mr: 1,
                color: theme.palette.mode === 'dark' ? '#fff' : theme.palette.primary.main,
                borderColor: theme.palette.mode === 'dark' ? '#fff' : theme.palette.primary.main,
              })}>
              Registrar
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

      {/* <SignUpTerms /> */}

      {/* <FormDivider />

      <FormSocials
        signInWithGoogle={() => { }}
        singInWithGithub={() => { }}
        signInWithTwitter={() => { }}
      /> */}
    </>
  );
}
