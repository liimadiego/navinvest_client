import { useState } from 'react';
import { WalletManagement } from '../wallet-management';
import { _userList } from 'src/_mock';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { paths } from 'src/routes/paths';
import { Button, Box } from '@mui/material';
import { RouterLink } from 'src/routes/components';
import { Iconify } from 'src/components/iconify';
import { DashboardContent } from 'src/layouts/dashboard';

export function WalletManagementView() {
    const tableData = _userList.map((row) => ({
        id: row.id,
        assetImageUrl: "https://investidor10.com.br/storage/companies/63d2c9ead34db.jpg",
        asset: "PETR4",
        quantity: 10,
        averagePrice: 10.95,
        currentPrice: 10.65,
        variation: 0.1,
        companyName: "Petrobras",
        currency: 'BRL',
    }));

    return (

        <DashboardContent>
            <CustomBreadcrumbs
                heading="Minha carteira"
                links={[
                    { name: 'Dashboard', href: paths.dashboard.root },
                    { name: 'Gerenciar carteira', href: paths.dashboard.wallet_management }
                ]}
                action={
                    <Button
                        component={RouterLink}
                        href={"paths.dashboard.user.new"}
                        variant="contained"
                        startIcon={<Iconify icon="mingcute:add-line" />}
                    >
                        Adicionar lançamento
                    </Button>
                }
                sx={{ mb: { xs: 3, md: 5 } }}
            />
            <Box display="flex" flexDirection="column" gap={2}>
                <WalletManagement _tableData={tableData} accordionOpened={true} />
                <WalletManagement _tableData={tableData} />
            </Box>

        </DashboardContent>

    );
}
