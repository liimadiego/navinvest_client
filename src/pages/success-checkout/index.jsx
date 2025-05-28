import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { SuccessCheckoutView } from 'src/sections/success-checkout/view';

// ----------------------------------------------------------------------

const metadata = { title: `Sucesso - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <SuccessCheckoutView />
    </>
  );
}
