import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { BlankView } from 'src/sections/blank/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title>{`${globalThis.getTranslation('page-one-title')} | Dashboard - ${CONFIG.appName}`}</title>
      </Helmet>

      <BlankView title={globalThis.getTranslation('page-one-title')} />
    </>
  );
}
