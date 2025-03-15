import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { AssetDetailsView } from 'src/sections/asset_details/view';

import { useParams } from 'react-router-dom';

// ----------------------------------------------------------------------


export default function Page() {
  const { ticker } = useParams();

  const metadata = { title: `${ticker.toUpperCase()} | ${CONFIG.appName.toUpperCase()}` };

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <AssetDetailsView />
    </>
  );
}
