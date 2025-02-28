import { useEffect } from 'react';
import { hasKeys, varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import { useColorScheme } from '@mui/material/styles';

import { Iconify } from 'src/components/iconify';

import { BaseOption } from './base-option';
import { Scrollbar } from '../../scrollbar';
import { useSettingsContext } from '../context/use-settings-context';

// ----------------------------------------------------------------------

export function SettingsDrawer({ sx, defaultSettings }) {
  const settings = useSettingsContext();

  const { mode, setMode, systemMode } = useColorScheme();

  useEffect(() => {
    if (mode === 'system' && systemMode) {
      settings.setState({ colorScheme: systemMode });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, systemMode]);

  const isColorSchemeVisible = hasKeys(defaultSettings, ['colorScheme']);



  const renderHead = () => (
    <Box
      sx={{
        py: 2,
        pr: 1,
        pl: 2.5,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        {globalThis.getTranslation('settings')}
      </Typography>

      <button onClick={settings.onCloseDrawer} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
        <Iconify icon="mingcute:close-line" />
      </button>
    </Box>
  );

  const renderMode = () => (
    <BaseOption
      label={globalThis.getTranslation('dark-mode')}
      icon="moon"
      selected={settings.state.colorScheme === 'dark'}
      onChangeOption={() => {
        setMode(mode === 'light' ? 'dark' : 'light');
        settings.setState({ colorScheme: mode === 'light' ? 'dark' : 'light' });
      }}
    />
  );

  return (
    <Drawer
      anchor="right"
      open={settings.openDrawer}
      onClose={settings.onCloseDrawer}
      slotProps={{ backdrop: { invisible: true } }}
      PaperProps={{
        sx: [
          (theme) => ({
            ...theme.mixins.paperStyles(theme, {
              color: varAlpha(theme.vars.palette.background.defaultChannel, 0.9),
            }),
            width: 360,
          }),
          ...(Array.isArray(sx) ? sx : [sx]),
        ],
      }}
    >
      {renderHead()}

      <Scrollbar>
        <Box
          sx={{
            pb: 5,
            gap: 6,
            px: 2.5,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box
            sx={{
              gap: 2,
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
            }}
          >
            {isColorSchemeVisible && renderMode()}
          </Box>
        </Box>
      </Scrollbar>
    </Drawer>
  );
}
