import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/global-config';
import { WalletManagementView } from 'src/sections/wallet_management/view';

export default function Page() {

    const metadata = { title: `Gerenciar carteira | ${CONFIG.appName.toUpperCase()}` };

    return (
        <>
            <Helmet>
                <title> {metadata.title}</title>
            </Helmet>

            <WalletManagementView />
        </>
    );
}
