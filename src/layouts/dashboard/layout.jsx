import { merge } from 'es-toolkit';
import { useBoolean } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import { useTheme } from '@mui/material/styles';
import IconButton, { iconButtonClasses } from '@mui/material/IconButton';
import { Search as SearchIcon, AddCircle, Edit } from '@mui/icons-material';

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
import { MenuButton } from '../components/menu-button';
import { HeaderSection } from '../core/header-section';
import { LayoutSection } from '../core/layout-section';
import { AccountDrawer } from '../components/account-drawer';
import { SettingsButton } from '../components/settings-button';
import { WalletsPopover } from '../components/wallets-popover';
import { navData as dashboardNavData } from '../nav-config-dashboard';
import { dashboardLayoutVars, dashboardNavColorVars } from './css-vars';
import { NotificationsDrawer } from '../components/notifications-drawer';
import { SearchModal } from 'src/components/search-modal';
import { useEffect, useState } from 'react';
import AddEditWalletModal from 'src/components/create-edit-wallet-modal';
import { useWallet } from 'src/context/WalletContext';
import { Button, Modal, Paper, styled, Typography, useColorScheme } from '@mui/material';
import { useWallets } from 'src/context/WalletsContext';
import { useAuthContext } from 'src/auth/hooks';
import axios from 'src/lib/axios';
import { useChat } from 'src/context/ChatContext';
import { TokenProgress } from 'src/components/token-progress';
import BedtimeIcon from '@mui/icons-material/Bedtime';
import BrightnessHighIcon from '@mui/icons-material/BrightnessHigh';

// ----------------------------------------------------------------------

export function DashboardLayout({ sx, cssVars, children, slotProps, layoutQuery = 'lg' }) {
  const theme = useTheme();
  const { currentWallet, setCurrentWallet } = useWallet();
  const { _wallets, _setWallets } = useWallets();
  const { mode, setMode } = useColorScheme();

  const { chatId, setChatId, chatHistory, setChatHistory } = useChat();
  const { user } = useAuthContext();



  useEffect(() => {
    if (!user) {
      return;
    }

    axios.get(`/investment-portfolio`)
      .then(({ data }) => {
        const wallets = data.map(wallet => ({
          id: wallet.id,
          name: wallet.name,
          objective: wallet.objective,
        }));

        _setWallets(wallets);
      }).catch(error => {
        console.error(error);
      });

    if (!chatId && user && user.plan !== null) {
      axios.get('/investment-assistant/get-chat')
        .then(({ data }) => {
          const { data: chatInfo } = data;
          if (chatInfo) {
            setChatHistory(chatInfo.messages);
            setChatId(chatInfo.chat_id);
          }
        }).catch(error => {
          console.error(error);
        });
    }
  }, []);

  const settings = useSettingsContext();

  const navVars = dashboardNavColorVars(theme, settings.state.navColor, settings.state.navLayout);

  const { value: open, onFalse: onClose, onTrue: onOpen } = useBoolean();
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [walletModalLoading, setWalletModalLoading] = useState(false);
  const [_, setWalletModalError] = useState(false);
  const [editWalletData, setEditWalletData] = useState(null);

  const [modalSureDeleteOpened, setModalSureDeleteOpen] = useState(false);

  const modalSureDelete = () => {
    setModalSureDeleteOpen(true);
  }

  const handleCloseModalSearch = () => {
    setSearchModalOpen(false);
  };

  const handleOpenModalSearch = () => {
    setSearchModalOpen(true);
  };

  const handleOpenWalletModal = (editData = {}) => {
    setEditWalletData(editData);
    setWalletModalOpen(true);
  }

  const handleCloseWalletModal = () => {
    setEditWalletData(null);
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

    if (editWalletData && (!!editWalletData?.id || false)) {
      const updateWalletData = {
        name: wallet.name,
        objective: wallet.objective
      };
      await axios.put(`/investment-portfolio/${editWalletData.id}`, updateWalletData)
        .then(({ data }) => {
          _setWallets(data);
          setCurrentWallet(data.find(w => w.id === editWalletData.id));

          setWalletModalLoading(false);
          setWalletModalError(false);
          setWalletModalOpen(false);
        })
        .catch(error => {
          console.error(error);
          setWalletModalLoading(false);
          setWalletModalError(true);
          return;
        });

      return;
    }

    await axios.post(`/investment-portfolio`, {
      "name": wallet.name,
      "objective": wallet.objective
    },
    ).then(({ data }) => {
      _setWallets(data);
      setCurrentWallet(data[0]);

      setWalletModalLoading(false);
      setWalletModalError(false);
      setWalletModalOpen(false);
    }).catch(error => {
      console.error(error)
      setWalletModalLoading(false);
      setWalletModalError(true);
      return;
    })


  };

  const handleDeleteWallet = async (walletId) => {
    setWalletModalLoading(true);
    setWalletModalError(false);
    if (!walletId) {
      setWalletModalLoading(false);
      setWalletModalError(true);
      return;
    }

    setModalSureDeleteOpen(false);

    await axios.delete(`/investment-portfolio/${walletId}`)
      .then(({ data }) => {
        _setWallets(data);
        setCurrentWallet(data[0]);
        setWalletModalLoading(false);
        setWalletModalError(false);
        setWalletModalOpen(false);
      })
      .catch(error => {
        console.error(error);
        setWalletModalLoading(false);
        setWalletModalError(true);
        return;
      });
  };



  const navData = slotProps?.nav?.data ?? dashboardNavData;

  const isNavMini = settings.state.navLayout === 'mini';
  const isNavHorizontal = settings.state.navLayout === 'horizontal';
  const isNavVertical = isNavMini || settings.state.navLayout === 'vertical';

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
          {!!_wallets.length > 0 && <WalletsPopover
            data={_wallets}
          />}
          {/* icone circle edit mui */}
          {currentWallet && (
            <IconButton
              onClick={() => handleOpenWalletModal(currentWallet)}
              sx={{
                [theme.breakpoints.up(layoutQuery)]: { display: 'flex' },
              }}
            >
              <Edit />
            </IconButton>
          )}

          {/* icone circle plus mui */}
          {!_wallets.length > 0 ?
            //botao de adicionar só que com Criar Carteira + icone
            <Button
              onClick={handleOpenWalletModal}
              variant="contained"
              startIcon={<AddCircle />}
            >
              Criar carteira
            </Button>
            : _wallets.length < 3 && <IconButton
              onClick={handleOpenWalletModal}
              sx={{
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
          {/* <LanguagePopover
            data={[
              { value: 'pt-br', label: 'Português', countryCode: 'BR' },
              { value: 'en', label: 'English', countryCode: 'US' }
            ]}
          /> */}

          <TokenProgress sx={{ display: { xs: 'none', sm: 'none', md: 'none', lg: 'flex', xl: 'flex' } }} />

          {/* iconbutton de pesquisar */}
          <IconButton onClick={handleOpenModalSearch}>
            <SearchIcon />
          </IconButton>


          {/** @slot Notifications popover */}
          {/* <NotificationsDrawer data={_notifications} /> */}

          <IconButton
            onClick={() => {
              setMode(mode === 'light' ? 'dark' : 'light');
              settings.setState({ colorScheme: mode === 'light' ? 'dark' : 'light' });
            }}
            sx={(theme) => ({
              mr: 1,
              color: theme.palette.mode === 'dark' ? '#fff' : theme.palette.primary.main,
              borderColor: theme.palette.mode === 'dark' ? '#fff' : theme.palette.primary.main,
              // display: 'none',
              [theme.breakpoints.up(layoutQuery)]: { display: 'inline-flex' },
            })}
          >
            {mode === 'light' ? <BedtimeIcon sx={{ transform: 'scale(0.8)' }} /> : <BrightnessHighIcon sx={{ transform: 'scale(0.8)' }} />}

            {/*  */}
          </IconButton>

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
      <AddEditWalletModal open={walletModalOpen} onClose={handleCloseWalletModal} onSave={handleSaveWallet} onDelete={modalSureDelete} isLoading={walletModalLoading} editData={editWalletData} />
      <Modal
        open={modalSureDeleteOpened}
        onClose={() => { setModalSureDeleteOpen(false); }}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        sx={{ backdrop: { backdropFilter: 'blur(4px)' } }}
      >
        <Paper sx={{ p: 4, bgcolor: 'background.paper', borderRadius: 2, maxWidth: 400, margin: 'auto', mt: '25vh' }} elevation={3}>
          <Typography id="modal-title" variant="h6" component="h2">
            Atenção
          </Typography>
          <Typography id="modal-description" sx={{ mt: 2 }}>
            Tem certeza que deseja excluir esta carteira? Esta ação não pode ser desfeita.
          </Typography>
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={() => { setModalSureDeleteOpen(false) }} color="primary" variant="contained" sx={{ mr: 2 }}>Cancelar</Button>
            <Button onClick={() => handleDeleteWallet(editWalletData.id || null)} variant="outlined">Confirmar</Button>
          </Box>
        </Paper>
      </Modal>
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
