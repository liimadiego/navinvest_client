import { DashboardContent } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { paths } from 'src/routes/paths';
import { NewsList } from '../news-list';

export function NewsListView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Portal de notícias"
        links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'Notícias' }]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <NewsList />
    </DashboardContent>
  );
}
