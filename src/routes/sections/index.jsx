import { lazy, Suspense } from 'react';

import { SplashScreen } from 'src/components/loading-screen';
import { MainLayout } from 'src/layouts/main';

import { authRoutes } from './auth';
import { dashboardRoutes } from './dashboard';
import { mainRoutes } from './main';

// ----------------------------------------------------------------------

const HomePage = lazy(() => import('src/pages/home'));
const Page404 = lazy(() => import('src/pages/error/404'));

export const routesSection = [
  {
    path: '/',
    element: (
      <Suspense fallback={<SplashScreen />}>
        <MainLayout>
          <HomePage />
        </MainLayout>
      </Suspense>
    ),
  },

  // Auth
  ...authRoutes,

  // Dashboard
  ...dashboardRoutes,

  // Main
  ...mainRoutes,

  // No match
  { path: '*', element: <Page404 /> },
];
