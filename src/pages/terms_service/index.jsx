import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { TermsServiceView } from 'src/sections/terms_service/view';

// ----------------------------------------------------------------------

const metadata = { title: `Termos e Serviços - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <TermsServiceView />
    </>
  );
}
