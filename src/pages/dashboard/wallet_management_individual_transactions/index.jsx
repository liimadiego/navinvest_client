import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/global-config';
import { WalletManagementIndividualTransactionsView } from 'src/sections/wallet_management_individual_transactions/view';

export default function Page() {

    const metadata = { title: `Lançamentos na carteira | ${CONFIG.appName.toUpperCase()}` };

    return (
        <>
            <Helmet>
                <title> {metadata.title}</title>
            </Helmet>

            <WalletManagementIndividualTransactionsView />
        </>
    );
}
