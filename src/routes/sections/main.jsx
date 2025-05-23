import { Outlet } from 'react-router';
import { lazy, Suspense } from 'react';

import { MainLayout } from 'src/layouts/main';
import { SimpleLayout } from 'src/layouts/simple';

import { SplashScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

// const FaqsPage = lazy(() => import('src/pages/faqs'));
// const AboutPage = lazy(() => import('src/pages/about-us'));
// const ContactPage = lazy(() => import('src/pages/contact-us'));
const PricingPage = lazy(() => import('src/pages/pricing'));
const PrivacyPolicy = lazy(() => import('src/pages/privacy_policy'));
const TermsService = lazy(() => import('src/pages/terms_service'));
const PaymentPage = lazy(() => import('src/pages/payment'));
const Page404 = lazy(() => import('src/pages/error/404'));

// ----------------------------------------------------------------------

export const mainRoutes = [
  {
    element: (
      <Suspense fallback={<SplashScreen />}>
        <Outlet />
      </Suspense>
    ),
    children: [
      // {
      //   element: (
      //     <MainLayout>
      //       <Outlet />
      //     </MainLayout>
      //   ),
      //   children: [
      //     { path: 'about-us', element: <AboutPage /> },
      //     { path: 'contact-us', element: <ContactPage /> },
      //     { path: 'faqs', element: <FaqsPage /> },
      //   ],
      // },
      {
        path: 'planos',
        element: (
          <SimpleLayout>
            <PricingPage />
          </SimpleLayout>
        ),
      },
      {
        path: 'politica-privacidade',
        element: (
          <SimpleLayout>
            <PrivacyPolicy />
          </SimpleLayout>
        ),
      },
      {
        path: 'termos-servicos',
        element: (
          <SimpleLayout>
            <TermsService />
          </SimpleLayout>
        ),
      },
      {
        path: 'checkout-pagamento',
        element: (
          <SimpleLayout>
            <PaymentPage />
          </SimpleLayout>
        ),
      },
      {
        path: 'error',
        children: [
          { path: '404', element: <Page404 /> },
        ],
      },
    ],
  },
];
