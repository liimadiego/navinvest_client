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
      await new Promise((resolve) => setTimeout(resolve, 500));
      await navigate(paths.auth.jwt.updatePassword);
    } catch (error) {
      console.error(error);
    }
  });

  const renderForm = () => (
    <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
      <Field.Text
        autoFocus
        name="email"
        label="Email"
        placeholder="exemplo@email.com"
        slotProps={{ inputLabel: { shrink: true } }}
      />

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        loadingIndicator="Enviar pedido..."
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
    </>
  );
}
