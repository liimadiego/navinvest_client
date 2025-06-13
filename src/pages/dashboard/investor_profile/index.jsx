import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/global-config';
import { InvestorProfileView } from 'src/sections/investor_profile/view';

export default function Page() {

  const metadata = { title: `Perfil de Investidor | ${CONFIG.appName.toUpperCase()}` };

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <InvestorProfileView />
    </>
  );
}
