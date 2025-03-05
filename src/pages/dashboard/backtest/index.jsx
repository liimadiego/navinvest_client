import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { BacktestTestView } from 'src/sections/backtest/view';

// ----------------------------------------------------------------------

const metadata = { title: `Backtest | Dashboard - ${CONFIG.appName}` };

export default function Page() {
    return (
        <>
            <Helmet>
                <title> {metadata.title}</title>
            </Helmet>

            <BacktestTestView />
        </>
    );
}
