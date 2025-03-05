import { paths } from 'src/routes/paths';
import { DashboardContent } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { BacktestResults } from '../backtest-results';

// ----------------------------------------------------------------------

export function BacktestResultView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Resultado do backtest"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Backtest', href: paths.dashboard.backtest },
          { name: 'Resultado' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <BacktestResults />

    </DashboardContent>
  );
}
