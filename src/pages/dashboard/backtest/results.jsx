import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { BacktestResultView } from 'src/sections/backtest/view/backtest-result-view';

// ----------------------------------------------------------------------

const metadata = { title: `Resultado Backtest | Dashboard - ${CONFIG.appName}` };

export default function Page() {
    return (
        <>
            <Helmet>
                <title> {metadata.title}</title>
            </Helmet>

            <BacktestResultView />
        </>
    );
}
