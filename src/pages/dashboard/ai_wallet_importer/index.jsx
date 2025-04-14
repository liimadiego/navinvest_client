import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/global-config';
import { AiWalletImporterView } from 'src/sections/ai_wallet_importer/view/ai-wallet-importer-view';

export default function Page() {
  const metadata = { title: `Importar carteira | ${CONFIG.appName.toUpperCase()}` };

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <AiWalletImporterView />
    </>
  );
}
