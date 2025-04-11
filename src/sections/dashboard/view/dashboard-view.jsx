import { paths } from 'src/routes/paths';
import { DashboardContent } from 'src/layouts/dashboard';
import { Dashboard } from '../dashboard';

// ----------------------------------------------------------------------

export function DashboardView() {
    return (
        <DashboardContent maxWidth='xl'>
            <Dashboard />
        </DashboardContent>
    );
}
