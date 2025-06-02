import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { MyProfileView } from 'src/sections/my_profile/view';

// ----------------------------------------------------------------------

const metadata = { title: `Meu perfil - ${CONFIG.appName}` };

export default function Page() {
    return (
        <>
            <Helmet>
                <title> {metadata.title}</title>
            </Helmet>

            <MyProfileView />
        </>
    );
}
