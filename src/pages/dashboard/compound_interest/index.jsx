import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { CompoundInterestView } from 'src/sections/compound_interest/view';

// ----------------------------------------------------------------------

const metadata = { title: `Calculadora de Juros Compostos | ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <CompoundInterestView />
    </>
  );
}
