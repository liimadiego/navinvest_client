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
const WalletManagementPage = lazy(() => import('src/pages/dashboard/wallet_management'));
const WalletManagementTransactionsPage = lazy(() => import('src/pages/dashboard/wallet_management_individual_transactions'));
const AiWalletImporter = lazy(() => import('src/pages/dashboard/ai_wallet_importer'));
const CurrencyConverter = lazy(() => import('src/pages/dashboard/currency_converter'));
const InvestorGlossary = lazy(() => import('src/pages/dashboard/investor_glossary'));
const DividendCalendar = lazy(() => import('src/pages/dashboard/dividend_calendar'));

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
      { path: 'assistente-ia', element: <AIAssistantPage /> },
      { path: 'backtest', element: <BacktestPage /> },
      { path: 'resultado-backtest', element: <BacktestResults /> },
      { path: 'comparar-ativos', element: <CompareAssets /> },
      { path: 'detalhes-ativo/:ticker', element: <AssetDetails /> },
      { path: 'noticias/:news_id', element: <NewsPage /> },
      { path: 'gerenciar-carteira', element: <WalletManagementPage /> },
      { path: 'gerenciar-carteira/transacoes-individuais', element: <WalletManagementTransactionsPage /> },
      { path: 'importar-carteira', element: <AiWalletImporter /> },
      { path: 'conversor-moedas', element: <CurrencyConverter /> },
      { path: 'glossario-investidor', element: <InvestorGlossary /> },
      { path: 'agenda-dividendos', element: <DividendCalendar /> },
    ],
  },
];
