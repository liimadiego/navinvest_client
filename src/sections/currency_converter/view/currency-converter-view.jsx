import { paths } from 'src/routes/paths';
import { DashboardContent } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { CurrencyConverter } from 'src/sections/currency_converter/currency-converter';

export function CurrencyConverterView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Conversor de Moedas"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Conversor de moedas', href: paths.dashboard.currency_converter },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <CurrencyConverter />

    </DashboardContent>
  );
}