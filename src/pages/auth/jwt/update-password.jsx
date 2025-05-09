import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { SplitUpdatePasswordView } from 'src/sections/auth/view/split-update-password-view';

// ----------------------------------------------------------------------

const metadata = { title: `Update password | Layout split - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <SplitUpdatePasswordView />
    </>
  );
}
