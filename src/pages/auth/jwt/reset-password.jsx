import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { SplitResetPasswordView } from 'src/sections/auth/view/split-reset-password-view';

// ----------------------------------------------------------------------

const metadata = { title: `Redefinir senha | ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <SplitResetPasswordView />
    </>
  );
}
