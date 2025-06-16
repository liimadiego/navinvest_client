import { paths } from 'src/routes/paths';
import { DashboardContent } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { CompoundInterestCalculator } from '../compound-interest-calculator';

export function CompoundInterestView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Calculadora de Juros Compostos"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Calc. Juros Compostos', href: paths.dashboard.compound_interest },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <CompoundInterestCalculator />
    </DashboardContent>
  );
}
