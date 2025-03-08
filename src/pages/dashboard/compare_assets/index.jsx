import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { CompareAssetsView } from 'src/sections/compare_assets/view';

// ----------------------------------------------------------------------

const metadata = { title: `Comparar Ativos | ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <CompareAssetsView />
    </>
  );
}
