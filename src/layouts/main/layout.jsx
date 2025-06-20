import { useBoolean } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';

import { paths } from 'src/routes/paths';
import { usePathname } from 'src/routes/hooks';

import { Logo } from 'src/components/logo';

import { NavMobile } from './nav/mobile';
import { NavDesktop } from './nav/desktop';
import { Footer, HomeFooter } from './footer';
import { MainSection } from '../core/main-section';
import { MenuButton } from '../components/menu-button';
import { LayoutSection } from '../core/layout-section';
import { HeaderSection } from '../core/header-section';
import { navData as mainNavData } from '../nav-config-main';
import { SignInButton } from '../components/sign-in-button';
import { SettingsButton } from '../components/settings-button';
import { IconButton } from '@mui/material';
import { useColorScheme } from '@mui/material';
import BedtimeIcon from '@mui/icons-material/Bedtime';
import BrightnessHighIcon from '@mui/icons-material/BrightnessHigh';
import { useSettingsContext } from 'src/components/settings';

// ----------------------------------------------------------------------

export function MainLayout({ sx, cssVars, children, slotProps, layoutQuery = 'md' }) {
  const pathname = usePathname();
  const settings = useSettingsContext();
  const { mode, setMode } = useColorScheme();

  const { value: open, onFalse: onClose, onTrue: onOpen } = useBoolean();

  const isHomePage = pathname === '/';

  const navData = slotProps?.nav?.data ?? mainNavData;

  const renderHeader = () => {
    const headerSlots = {
      leftArea: (
        <>
          {/** @slot Nav mobile */}
          <MenuButton
            onClick={onOpen}
            sx={(theme) => ({
              mr: 0,
              ml: -1,
              [theme.breakpoints.up(layoutQuery)]: { display: 'none' },
            })}
          />
          <NavMobile data={navData} open={open} onClose={onClose} />

          {/** @slot Logo */}
          <Logo isSingle={true} sx={{ display: { xs: 'inline-block', md: 'none' } }} />
          <Logo sx={{ display: { xs: 'none', md: 'inline-block' } }} />
        </>
      ),
      rightArea: (
        <>
          {/** @slot Nav desktop */}
          <NavDesktop
            data={navData}
            sx={(theme) => ({
              display: 'none',
              [theme.breakpoints.up(layoutQuery)]: { mr: 2.5, display: 'flex' },
            })}
          />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.5 } }}>
            {/** @slot Settings button */}
            {/* <SettingsButton /> */}

            {/** @slot Sign in button */}
            <SignInButton sx={{ border: 'none', opacity: 0.7 }} />

            {/** @slot Purchase button */}
            <Button
              // variant="contained"
              rel="noopener"
              href={paths.pricing}
              sx={(theme) => ({
                backgroundColor: "#0236fc",
                color: theme.palette.common.white,
                px: 2,
                '&:hover': {
                  ...(theme.palette.mode === 'light' && {
                    background: theme.palette.primary.dark,
                  }),

                },
              })}
            >
              Teste Grátis
            </Button>

            <IconButton
              onClick={() => {
                setMode(mode === 'light' ? 'dark' : 'light');
                settings.setState({ colorScheme: mode === 'light' ? 'dark' : 'light' });
              }}
              sx={(theme) => ({
                color: theme.palette.mode === 'dark' ? '#fff' : theme.palette.primary.main,
                borderColor: theme.palette.mode === 'dark' ? '#fff' : theme.palette.primary.main,
                // display: 'none',
                [theme.breakpoints.up(layoutQuery)]: { display: 'inline-flex' },
              })
              }
            >
              {mode === 'light' ? <BedtimeIcon sx={{ transform: 'scale(0.8)' }} /> : <BrightnessHighIcon sx={{ transform: 'scale(0.8)' }} />}
            </IconButton>
          </Box>
        </>
      ),
    };

    return (
      <HeaderSection
        layoutQuery={layoutQuery}
        {...slotProps?.header}
        slots={{ ...headerSlots, ...slotProps?.header?.slots }}
        slotProps={slotProps?.header?.slotProps}
        sx={slotProps?.header?.sx}
      />
    );
  };

  const renderFooter = () =>
    isHomePage ? (
      <HomeFooter sx={slotProps?.footer?.sx} />
    ) : (
      <Footer sx={slotProps?.footer?.sx} layoutQuery={layoutQuery} />
    );

  const renderMain = () => <MainSection {...slotProps?.main}>{children}</MainSection>;

  return (
    <LayoutSection
      /** **************************************
       * @Header
       *************************************** */
      headerSection={renderHeader()}
      /** **************************************
       * @Footer
       *************************************** */
      footerSection={renderFooter()}
      /** **************************************
       * @Styles
       *************************************** */
      cssVars={cssVars}
      sx={sx}
    >
      {renderMain()}
    </LayoutSection>
  );
}
