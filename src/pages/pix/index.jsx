import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { PixView } from 'src/sections/pix/view';

// ----------------------------------------------------------------------

const metadata = { title: `Pagamento Pix - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <PixView />
    </>
  );
}
