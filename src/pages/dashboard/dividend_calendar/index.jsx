import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { DividendCalendarView } from 'src/sections/dividend_calendar/view';

// ----------------------------------------------------------------------

const metadata = { title: `Agenda de Dividendos | ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <DividendCalendarView />
    </>
  );
}
