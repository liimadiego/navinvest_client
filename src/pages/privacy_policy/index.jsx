import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { PrivacyPolicyView } from 'src/sections/privacy_policy/view';

// ----------------------------------------------------------------------

const metadata = { title: `Política de Privacidade - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <PrivacyPolicyView />
    </>
  );
}
