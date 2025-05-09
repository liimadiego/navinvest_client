import { Outlet } from 'react-router';
import { lazy, Suspense } from 'react';

import { AuthSplitLayout } from 'src/layouts/auth-split';

import { SplashScreen } from 'src/components/loading-screen';

import { GuestGuard } from 'src/auth/guard';

// ----------------------------------------------------------------------

/** **************************************
 * Jwt
 *************************************** */
const Jwt = {
  SignInPage: lazy(() => import('src/pages/auth/jwt/sign-in')),
  SignUpPage: lazy(() => import('src/pages/auth/jwt/sign-up')),
  ResetPasswordPage: lazy(() => import('src/pages/auth/jwt/reset-password')),
  UpdatePasswordPage: lazy(() => import('src/pages/auth/jwt/update-password')),
};

const authJwt = {
  path: 'jwt',
  children: [
    {
      path: 'sign-in',
      element: (
        <GuestGuard>
          <AuthSplitLayout
            slotProps={{
              section: { title: 'Olá, bem vindo(a) de volta' },
            }}
          >
            <Jwt.SignInPage />
          </AuthSplitLayout>
        </GuestGuard>
      ),
    },
    {
      path: 'sign-up',
      element: (
        <GuestGuard>
          <AuthSplitLayout>
            <Jwt.SignUpPage />
          </AuthSplitLayout>
        </GuestGuard>
      ),
    },
    {
      path: 'reset-password',
      element: (
        <GuestGuard>
          <AuthSplitLayout
            slotProps={{
              section: { title: 'Recuperar a senha' },
            }}
          >
            <Jwt.ResetPasswordPage />
          </AuthSplitLayout>
        </GuestGuard>
      ),
    },
    {
      path: 'update-password',
      element: (
        <GuestGuard>
          <AuthSplitLayout
            slotProps={{
              section: { title: 'Atualizar a senha' },
            }}
          >
            <Jwt.UpdatePasswordPage />
          </AuthSplitLayout>
        </GuestGuard>
      ),
    },
  ],
};

// ----------------------------------------------------------------------

export const authRoutes = [
  {
    path: 'auth',
    element: (
      <Suspense fallback={<SplashScreen />}>
        <Outlet />
      </Suspense>
    ),
    children: [authJwt],
  },
];
