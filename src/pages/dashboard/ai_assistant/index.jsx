import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { AIAssistantView } from 'src/sections/ai_assistant/view';

// ----------------------------------------------------------------------

const metadata = { title: `Assistente IA | ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <AIAssistantView />
    </>
  );
}
