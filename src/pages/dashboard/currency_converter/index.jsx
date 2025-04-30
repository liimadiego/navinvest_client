import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { CurrencyConverterView } from 'src/sections/currency_converter/view';

// ----------------------------------------------------------------------

const metadata = { title: `Conversor de Moedas | ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <CurrencyConverterView />
    </>
  );
}