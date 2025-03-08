import { paths } from 'src/routes/paths';
import { DashboardContent } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { BacktestForm } from '../new-backtest-form';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

// ----------------------------------------------------------------------

export function BacktestTestView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Backtest de portfólio"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Backtest', href: paths.dashboard.backtest }
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <BacktestForm />
      </LocalizationProvider>

    </DashboardContent>
  );
}
