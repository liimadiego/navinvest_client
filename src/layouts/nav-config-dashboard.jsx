import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/global-config';

import { SvgColor } from 'src/components/svg-color';

import WalletIcon from '@mui/icons-material/Wallet';
import SimCardDownloadIcon from '@mui/icons-material/SimCardDownload';
import AssistantIcon from '@mui/icons-material/Assistant';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`${CONFIG.assetsDir}/assets/icons/navbar/${name}.svg`} />;

const ICONS = {
  job: icon('ic-job'),
  blog: icon('ic-blog'),
  chat: icon('ic-chat'),
  mail: icon('ic-mail'),
  user: icon('ic-user'),
  file: icon('ic-file'),
  lock: icon('ic-lock'),
  tour: icon('ic-tour'),
  order: icon('ic-order'),
  label: icon('ic-label'),
  blank: icon('ic-blank'),
  kanban: icon('ic-kanban'),
  folder: icon('ic-folder'),
  course: icon('ic-course'),
  banking: icon('ic-banking'),
  booking: icon('ic-booking'),
  invoice: icon('ic-invoice'),
  product: icon('ic-product'),
  calendar: icon('ic-calendar'),
  disabled: icon('ic-disabled'),
  external: icon('ic-external'),
  menuItem: icon('ic-menu-item'),
  ecommerce: icon('ic-ecommerce'),
  analytics: icon('ic-analytics'),
  dashboard: icon('ic-dashboard'),
  parameter: icon('ic-parameter'),
};

// ----------------------------------------------------------------------

export const navData = [
  {
    // subheader: 'Overview',
    items: [
      {
        title: 'Dashboard',
        path: paths.dashboard.root,
        icon: ICONS.dashboard
      },
      { title: 'Assistente IA', path: paths.dashboard.ai_assistant, icon: <AssistantIcon /> },
      { title: 'Backtest', path: paths.dashboard.backtest, icon: ICONS.analytics },
      { title: 'Comparar Ativos', path: paths.dashboard.compare_assets, icon: ICONS.file },
      { title: 'Gerenciar Carteira', path: paths.dashboard.wallet_management, icon: <WalletIcon /> },
      { title: 'Importar Carteira', path: paths.dashboard.ai_wallet_importer, icon: <SimCardDownloadIcon /> }
    ],
  },
];
