import { merge } from 'es-toolkit';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { Logo } from 'src/components/logo';

import { SimpleCompactContent } from './content';
import { MainSection } from '../core/main-section';
import { LayoutSection } from '../core/layout-section';
import { HeaderSection } from '../core/header-section';
import IconButton from '@mui/material/IconButton';

import BedtimeIcon from '@mui/icons-material/Bedtime';
import BrightnessHighIcon from '@mui/icons-material/BrightnessHigh';
import { useTheme } from '@emotion/react';
import { useColorScheme } from '@mui/material';
import { useSettingsContext } from 'src/components/settings';

// ----------------------------------------------------------------------

export function SimpleLayout({ sx, cssVars, children, slotProps, layoutQuery = 'md' }) {
  const theme = useTheme();
  const settings = useSettingsContext();
  const { mode, setMode } = useColorScheme();
  const renderHeader = () => {
    const headerSlotProps = { container: { maxWidth: false } };

    const headerSlots = {
      topArea: (
        <Alert severity="info" sx={{ display: 'none', borderRadius: 0 }}>
          This is an info Alert.
        </Alert>
      ),
      leftArea: <Logo />,
      rightArea: (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.5 } }}>
          {/** @slot Help link */}
          <Link
            href={paths.faqs}
            component={RouterLink}
            color="inherit"
            sx={{ typography: 'subtitle2' }}
          >
            Precisa de ajuda?
          </Link>

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
        </Box>
      ),
    };

    return (
      <HeaderSection
        layoutQuery={layoutQuery}
        {...slotProps?.header}
        slots={{ ...headerSlots, ...slotProps?.header?.slots }}
        slotProps={merge(headerSlotProps, slotProps?.header?.slotProps ?? {})}
        sx={slotProps?.header?.sx}
      />
    );
  };

  const renderFooter = () => null;

  const renderMain = () => {
    const { compact, ...restContentProps } = slotProps?.content ?? {};

    return (
      <MainSection {...slotProps?.main}>
        {compact ? (
          <SimpleCompactContent layoutQuery={layoutQuery} {...restContentProps}>
            {children}
          </SimpleCompactContent>
        ) : (
          children
        )}
      </MainSection>
    );
  };

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
      cssVars={{ '--layout-simple-content-compact-width': '448px', ...cssVars }}
      sx={sx}
    >
      {renderMain()}
    </LayoutSection>
  );
}
