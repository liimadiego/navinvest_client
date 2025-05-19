import { paths } from 'src/routes/paths';
import { DashboardContent } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { DividendCalendar } from '../dividend-calendar';

// ----------------------------------------------------------------------

export function DividendCalendarView() {
    return (
        <DashboardContent>
            <CustomBreadcrumbs
                heading="Agenda de Dividendos" links={[
                    { name: 'Dashboard', href: paths.dashboard.root },
                    { name: 'Agenda de Dividendos', href: paths.dashboard.investor_glossary }
                ]}
                sx={{ mb: { xs: 3, md: 5 } }}
            />
            <DividendCalendar />

        </DashboardContent>
    );
}
