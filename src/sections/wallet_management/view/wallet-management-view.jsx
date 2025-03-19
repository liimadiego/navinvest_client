import { useParams } from 'react-router-dom';
import { paths } from 'src/routes/paths';
import { DashboardContent } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { WalletManagement } from 'src/sections/wallet_management/wallet-management';
import { LocalizationProvider } from 'src/locales';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

export function WalletManagementView() {

    return (
        <DashboardContent>
            <CustomBreadcrumbs
                heading={"Gerenciar carteira"}
                links={[
                    { name: 'Dashboard', href: paths.dashboard.root },
                    { name: 'Gerenciar carteira' },
                    { name: `${'nome da carteira' ?? ""}` }
                ]}
                sx={{ mb: { xs: 3, md: 0 } }}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <WalletManagement />
            </LocalizationProvider>
        </DashboardContent>
    );
}