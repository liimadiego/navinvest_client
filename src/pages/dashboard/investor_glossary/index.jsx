import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { InvestorGlossaryView } from 'src/sections/investor_glossary/view';

// ----------------------------------------------------------------------

const metadata = { title: `Glossário do Investidor | ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <InvestorGlossaryView />
    </>
  );
}
