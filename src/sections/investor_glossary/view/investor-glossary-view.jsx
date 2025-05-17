import { paths } from 'src/routes/paths';
import { DashboardContent } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { InvestorGlossary } from '../investor-glossary';

// ----------------------------------------------------------------------

export function InvestorGlossaryView() {
    return (
        <DashboardContent>
            <CustomBreadcrumbs
                heading="Glossário do Investidor" links={[
                    { name: 'Dashboard', href: paths.dashboard.root },
                    { name: 'Glossário do Investidor', href: paths.dashboard.investor_glossary }
                ]}
                sx={{ mb: { xs: 3, md: 5 } }}
            />
            <InvestorGlossary />

        </DashboardContent>
    );
}
