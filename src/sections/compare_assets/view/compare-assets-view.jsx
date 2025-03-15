import { paths } from 'src/routes/paths';
import { DashboardContent } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { CompareAssets } from '../compare-assets';
import { LocalizationProvider } from 'src/locales';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

// ----------------------------------------------------------------------

export function CompareAssetsView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Comparar ativos"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Comparar ativos', href: paths.dashboard.compare_assets }
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <CompareAssets />
      </LocalizationProvider>

    </DashboardContent>
  );
}
