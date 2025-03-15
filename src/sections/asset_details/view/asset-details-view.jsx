import { useParams } from 'react-router-dom';
import { paths } from 'src/routes/paths';
import { DashboardContent } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { AssetDetails } from '../asset-details';
import { LocalizationProvider } from 'src/locales';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

// ----------------------------------------------------------------------

export function AssetDetailsView() {
  const { ticker = '' } = useParams();

  const tickerString = String(ticker || '');

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={tickerString ? `Detalhes do ativo: ${tickerString.toUpperCase()}` : "Detalhes do ativo"}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Detalhes do ativo' },
          ...(tickerString ? [{ name: tickerString.toUpperCase() }] : [])
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <AssetDetails ticker={tickerString} />
      </LocalizationProvider>
    </DashboardContent>
  );
}