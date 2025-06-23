import { href, useParams } from 'react-router-dom';
import { paths } from 'src/routes/paths';
import { DashboardContent } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { News } from 'src/sections/news/news';
import { LocalizationProvider } from 'src/locales';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

export function NewsView({ news, otherNews }) {

    return (
        <DashboardContent>
            <CustomBreadcrumbs
                heading={"Portal de notícias"}
                links={[
                    { name: 'Dashboard', href: paths.dashboard.root },
                    { name: 'Notícias', href: paths.dashboard.news },
                    { name: `${news?.title ?? ""}` }
                ]}
                sx={{ mb: { xs: 3, md: 0 } }}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <News news={news} otherNews={otherNews} />
            </LocalizationProvider>
        </DashboardContent>
    );
}