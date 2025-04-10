import { merge } from 'es-toolkit';
import { useBoolean } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import { useTheme } from '@mui/material/styles';
import IconButton, { iconButtonClasses } from '@mui/material/IconButton';
import { Search as SearchIcon, AddCircle } from '@mui/icons-material';

import { _notifications } from 'src/_mock';

import { Logo } from 'src/components/logo';
import { useSettingsContext } from 'src/components/settings';

import { NavMobile } from './nav-mobile';
import { VerticalDivider } from './content';
import { NavVertical } from './nav-vertical';
import { layoutClasses } from '../core/classes';
import { NavHorizontal } from './nav-horizontal';
import { _account } from '../nav-config-account';
import { MainSection } from '../core/main-section';
import { _wallets } from '../nav-config-workspace';
import { MenuButton } from '../components/menu-button';
import { HeaderSection } from '../core/header-section';
import { LayoutSection } from '../core/layout-section';
import { AccountDrawer } from '../components/account-drawer';
import { SettingsButton } from '../components/settings-button';
import { LanguagePopover } from '../components/language-popover';
// import { ContactsPopover } from '../components/contacts-popover';
import { WalletsPopover } from '../components/wallets-popover';
import { navData as dashboardNavData } from '../nav-config-dashboard';
import { dashboardLayoutVars, dashboardNavColorVars } from './css-vars';
import { NotificationsDrawer } from '../components/notifications-drawer';
import { SearchModal } from 'src/components/search-modal';
import { useEffect, useState } from 'react';
import AddEditWalletModal from 'src/components/create-edit-wallet-modal';
import { useWallet } from 'src/context/WalletContext';
import { Button, Typography } from '@mui/material';

// ----------------------------------------------------------------------

export function DashboardLayout({ sx, cssVars, children, slotProps, layoutQuery = 'lg' }) {
  const theme = useTheme();
  const { currentWallet, setCurrentWallet } = useWallet();

  const settings = useSettingsContext();

  const navVars = dashboardNavColorVars(theme, settings.state.navColor, settings.state.navLayout);

  const { value: open, onFalse: onClose, onTrue: onOpen } = useBoolean();
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [wallets, setWallets] = useState([]);
  const [walletModalLoading, setWalletModalLoading] = useState(false);
  const [walletModalError, setWalletModalError] = useState(false);

  const handleCloseModalSearch = () => {
    setSearchModalOpen(false);
  };

  const handleOpenModalSearch = () => {
    setSearchModalOpen(true);
  };

  const handleOpenWalletModal = () => {
    setWalletModalOpen(true);
  }

  const handleCloseWalletModal = () => {
    setWalletModalOpen(false);
  }

  const handleSaveWallet = async (wallet) => {
    wallet = wallet?.data;
    setWalletModalLoading(true);
    setWalletModalError(false);

    if (!wallet || !wallet.name || !wallet.objective) {
      setWalletModalLoading(false);
      setWalletModalError(true);
      return;
    }

    const response = await fetch(`${import.meta.env.VITE_SERVER_URL2}/investment-portfolio`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "userId": "0737f150-0561-49c7-a59c-f61e0fc59cc6",
        "name": wallet.name,
        "objective": wallet.objective
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      setWalletModalLoading(false);
      setWalletModalError(true);
      return;
    }

    setWallets(data);
    setCurrentWallet(data[0]);

    setWalletModalLoading(false);
    setWalletModalError(false);
    setWalletModalOpen(false);
  };

  const navData = slotProps?.nav?.data ?? dashboardNavData;

  const isNavMini = settings.state.navLayout === 'mini';
  const isNavHorizontal = settings.state.navLayout === 'horizontal';
  const isNavVertical = isNavMini || settings.state.navLayout === 'vertical';

  useEffect(() => {
    //faz a pesquisa de wallets
    setWallets(_wallets);
  }, [_wallets]);

  const renderHeader = () => {
    const headerSlotProps = {
      container: {
        maxWidth: false,
        sx: {
          ...(isNavVertical && { px: { [layoutQuery]: 5 } }),
          ...(isNavHorizontal && {
            bgcolor: 'var(--layout-nav-bg)',
            height: { [layoutQuery]: 'var(--layout-nav-horizontal-height)' },
            [`& .${iconButtonClasses.root}`]: { color: 'var(--layout-nav-text-secondary-color)' },
          }),
        },
      },
    };

    const headerSlots = {
      topArea: (
        <Alert severity="info" sx={{ display: 'none', borderRadius: 0 }}>
          This is an info Alert.
        </Alert>
      ),
      bottomArea: isNavHorizontal ? (
        <NavHorizontal data={navData} layoutQuery={layoutQuery} cssVars={navVars.section} />
      ) : null,
      leftArea: (
        <>
          {/** @slot Nav mobile */}
          <MenuButton
            onClick={onOpen}
            sx={{ mr: 1, ml: -1, [theme.breakpoints.up(layoutQuery)]: { display: 'none' } }}
          />
          <NavMobile data={navData} open={open} onClose={onClose} cssVars={navVars.section} />

          {/** @slot Logo */}
          {isNavHorizontal && (
            <Logo
              sx={{
                display: 'none',
                [theme.breakpoints.up(layoutQuery)]: { display: 'inline-flex' },
              }}
            />
          )}

          {/** @slot Divider */}
          {isNavHorizontal && (
            <VerticalDivider sx={{ [theme.breakpoints.up(layoutQuery)]: { display: 'flex' } }} />
          )}

          {/** @slot Workspace popover */}
          {!!wallets.length && <WalletsPopover
            data={wallets}
            sx={{ color: 'var(--layout-nav-text-primary-color)' }}
          />}
          {/* icone circle plus mui */}
          {!wallets.length ?
            //botao de adicionar só que com Criar Carteira + icone
            <Button
              onClick={handleOpenWalletModal}
              variant="contained"
              startIcon={<AddCircle />}
            >
              Criar carteira
            </Button>
            : <IconButton
              onClick={handleOpenWalletModal}
              sx={{
                color: 'var(--layout-nav-text-primary-color)',
                [theme.breakpoints.up(layoutQuery)]: { display: 'flex' },
              }}
            >
              <AddCircle />
            </IconButton>}
        </>
      ),
      rightArea: (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0, sm: 0.75 } }}>
          {/** @slot Language popover */}
          <LanguagePopover
            data={[
              { value: 'pt-br', label: 'Português', countryCode: 'BR' },
              { value: 'en', label: 'English', countryCode: 'US' }
            ]}
          />

          {/* iconbutton de pesquisar */}
          <IconButton onClick={handleOpenModalSearch}>
            <SearchIcon />
          </IconButton>

          {/** @slot Notifications popover */}
          <NotificationsDrawer data={_notifications} />

          {/** @slot Settings button */}
          <SettingsButton />

          {/** @slot Account drawer */}
          <AccountDrawer data={_account} />
        </Box>
      ),
    };

    return (
      <HeaderSection
        layoutQuery={layoutQuery}
        disableElevation={isNavVertical}
        {...slotProps?.header}
        slots={{ ...headerSlots, ...slotProps?.header?.slots }}
        slotProps={merge(headerSlotProps, slotProps?.header?.slotProps ?? {})}
        sx={slotProps?.header?.sx}
      />
    );
  };

  const renderSidebar = () => (
    <NavVertical
      data={navData}
      isNavMini={isNavMini}
      layoutQuery={layoutQuery}
      cssVars={navVars.section}
      onToggleNav={() =>
        settings.setField(
          'navLayout',
          settings.state.navLayout === 'vertical' ? 'mini' : 'vertical'
        )
      }
    />
  );

  const renderFooter = () => null;

  const renderMain = () => <MainSection {...slotProps?.main}>{children}</MainSection>;

  return (
    <>
      <AddEditWalletModal open={walletModalOpen} onClose={handleCloseWalletModal} onSave={handleSaveWallet} isLoading={walletModalLoading} />
      <SearchModal handleClose={handleCloseModalSearch} isOpen={searchModalOpen}></SearchModal>
      <LayoutSection
        /** **************************************
         * @Header
         *************************************** */
        headerSection={renderHeader()}
        /** **************************************
         * @Sidebar
         *************************************** */
        sidebarSection={isNavHorizontal ? null : renderSidebar()}
        /** **************************************
         * @Footer
         *************************************** */
        footerSection={renderFooter()}
        /** **************************************
         * @Styles
         *************************************** */
        cssVars={{ ...dashboardLayoutVars(theme), ...navVars.layout, ...cssVars }}
        sx={[
          {
            [`& .${layoutClasses.sidebarContainer}`]: {
              [theme.breakpoints.up(layoutQuery)]: {
                pl: isNavMini ? 'var(--layout-nav-mini-width)' : 'var(--layout-nav-vertical-width)',
                transition: theme.transitions.create(['padding-left'], {
                  easing: 'var(--layout-transition-easing)',
                  duration: 'var(--layout-transition-duration)',
                }),
              },
            },
          },
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
      >
        {renderMain()}
      </LayoutSection>
    </>
  );
}
