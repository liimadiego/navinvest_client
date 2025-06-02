import { varAlpha } from 'minimal-shared/utils';
import { useBoolean } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Avatar from '@mui/material/Avatar';
import Drawer from '@mui/material/Drawer';
import Tooltip from '@mui/material/Tooltip';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { paths } from 'src/routes/paths';
import { usePathname } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { _mock } from 'src/_mock';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { AnimateBorder } from 'src/components/animate';

import { useAuthContext } from 'src/auth/hooks';

import { UpgradeBlock } from './nav-upgrade';
import { AccountButton } from './account-button';
import { SignOutButton } from './sign-out-button';
import MyProfile from 'src/components/my-profile';

// ----------------------------------------------------------------------

export function AccountDrawer({ data = [], sx, ...other }) {
  const { user } = useAuthContext();

  const { value: open, onFalse: onClose, onTrue: onOpen } = useBoolean();

  const renderAvatar = () => (
    <AnimateBorder
      sx={{ mb: 2, p: '6px', width: 96, height: 96, borderRadius: '50%' }}
      slotProps={{
        primaryBorder: { size: 120, sx: { color: 'primary.main' } },
      }}
    >
      <Avatar src={user?.photoURL} alt={user?.displayName} sx={{ width: 1, height: 1 }}>
        {user?.displayName?.charAt(0).toUpperCase()}
      </Avatar>
    </AnimateBorder>
  );

  return (
    <>
      <AccountButton
        onClick={onOpen}
        photoURL={user?.photoURL}
        displayName={user?.displayName}
        sx={sx}
        {...other}
      />

      <Drawer
        open={open}
        onClose={onClose}
        anchor="right"
        slotProps={{ backdrop: { invisible: true } }}
        PaperProps={{ sx: { width: 320 } }}
      >
        <Box
          sx={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>

          <IconButton
            onClick={onClose}
            sx={{
              top: 12,
              left: 12,
              zIndex: 9,
              position: 'absolute',
            }}
          >
            <Iconify icon="mingcute:close-line" />
          </IconButton>

          <Box>
            <Box
              sx={{
                pt: 8,
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
              }}
            >
              {renderAvatar()}

              <Typography variant="subtitle1" noWrap sx={{ mt: 2 }}>
                {user?.displayName}
              </Typography>

              <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }} noWrap>
                {user?.email}
              </Typography>
            </Box>

          </Box>

          <Box sx={{ p: 2.5 }}>
            <Box sx={{ py: 3 }}>
              <UpgradeBlock />
            </Box>
            <MyProfile onClose={onClose} />
            <SignOutButton onClose={onClose} />
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
