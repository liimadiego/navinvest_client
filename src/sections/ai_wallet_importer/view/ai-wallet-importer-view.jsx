import { paths } from 'src/routes/paths';
import { DashboardContent } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { AiWalletImporter } from 'src/sections/ai_wallet_importer/ai-wallet-importer';
import { LocalizationProvider } from 'src/locales';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

export function AiWalletImporterView({ }) {

    return (
        <DashboardContent>
            <CustomBreadcrumbs
                heading={"Importar carteira com IA"}
                links={[
                    { name: 'Dashboard', href: paths.dashboard.root },
                    { name: 'Importar Carteira com IA' }
                ]}
                sx={{ mb: { xs: 3, md: 0 } }}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <AiWalletImporter />
            </LocalizationProvider>
        </DashboardContent>
    );
}