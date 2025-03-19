import { Outlet } from 'react-router';
import { lazy, Suspense } from 'react';

import { CONFIG } from 'src/global-config';
import { DashboardLayout } from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';

import { AuthGuard } from 'src/auth/guard';

import { usePathname } from '../hooks';

// ----------------------------------------------------------------------

const IndexPage = lazy(() => import('src/pages/dashboard'));

const AIAssistantPage = lazy(() => import('src/pages/dashboard/ai_assistant'));
const BacktestPage = lazy(() => import('src/pages/dashboard/backtest'));
const BacktestResults = lazy(() => import('src/pages/dashboard/backtest/results'));
const CompareAssets = lazy(() => import('src/pages/dashboard/compare_assets'));
const AssetDetails = lazy(() => import('src/pages/dashboard/asset_details'));
const NewsPage = lazy(() => import('src/pages/dashboard/news'));

// ----------------------------------------------------------------------

function SuspenseOutlet() {
  const pathname = usePathname();
  return (
    <Suspense key={pathname} fallback={<LoadingScreen />}>
      <Outlet />
    </Suspense>
  );
}

const dashboardLayout = () => (
  <DashboardLayout>
    <SuspenseOutlet />
  </DashboardLayout>
);

export const dashboardRoutes = [
  {
    path: 'dashboard',
    element: CONFIG.auth.skip ? dashboardLayout() : <AuthGuard>{dashboardLayout()}</AuthGuard>,
    children: [
      { element: <IndexPage />, index: true },
      { path: 'ai_assistant', element: <AIAssistantPage /> },
      { path: 'backtest', element: <BacktestPage /> },
      { path: 'backtest_results', element: <BacktestResults /> },
      { path: 'compare_assets', element: <CompareAssets /> },
      { path: 'asset_details/:ticker', element: <AssetDetails /> },
      { path: 'noticias/:news_id', element: <NewsPage /> },
    ],
  },
];
