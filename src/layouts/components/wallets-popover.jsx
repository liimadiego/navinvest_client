import { useState, useCallback, useEffect } from 'react';
import { usePopover } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ButtonBase from '@mui/material/ButtonBase';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { CustomPopover } from 'src/components/custom-popover';
import { useWallet } from 'src/context/WalletContext';

// ----------------------------------------------------------------------

export function WalletsPopover({ data = [], sx, ...other }) {
  const { currentWallet, setCurrentWallet } = useWallet();
  const mediaQuery = 'sm';

  const { open, anchorEl, onClose, onOpen } = usePopover();
  const [wallet, setWallet] = useState(null);

  useEffect(() => {
    if (data.length > 0) {
      if (currentWallet) {
        const selectedWallet = data.find((item) => item.id === currentWallet.id);
        setWallet(selectedWallet || data[0]);
      }
      else {
        setWallet(data[0]);
        setCurrentWallet(data[0]);
      }
    }
  }, [data]);

  const handleChangeWallet = useCallback(
    (newValue) => {
      setCurrentWallet(newValue);
      setWallet(newValue);
      onClose();
    },
    [onClose]
  );

  const buttonBg = {
    height: 1,
    zIndex: -1,
    opacity: 0,
    content: "''",
    borderRadius: 1,
    position: 'absolute',
    visibility: 'hidden',
    bgcolor: 'action.hover',
    width: 'calc(100% + 8px)',
    transition: (theme) =>
      theme.transitions.create(['opacity', 'visibility'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.shorter,
      }),
    ...(open && {
      opacity: 1,
      visibility: 'visible',
    }),
  };

  const renderButton = () => (
    <ButtonBase
      disableRipple
      onClick={onOpen}
      sx={[
        {
          py: 0.5,
          gap: { xs: 0.5, [mediaQuery]: 1 },
          '&::before': buttonBg,
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Box
        component="span"
        sx={{ typography: 'subtitle2', display: { xs: 'none', [mediaQuery]: 'inline-flex' } }}
      >
        {wallet?.name}
      </Box>

      <Label
        color={wallet?.objective === 'Free' ? 'default' : 'info'}
        sx={{
          height: 22,
          cursor: 'inherit',
          display: { xs: 'none', [mediaQuery]: 'inline-flex' },
        }}
      >
        {wallet?.objective}
      </Label>

      <Iconify width={16} icon="carbon:chevron-sort" sx={{ color: 'text.disabled' }} />
    </ButtonBase>
  );

  const renderMenuList = () => (
    <CustomPopover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      slotProps={{
        arrow: { placement: 'top-left' },
        paper: { sx: { mt: 0.5, ml: -1.55 } },
      }}
    >
      <MenuList >
        {data.map((option) => (
          <MenuItem
            key={option.id}
            selected={option.id === currentWallet?.id}
            onClick={() => handleChangeWallet(option)}
            sx={{ height: 48 }}
          >
            {/* <Avatar alt={option.name} src={option.logo} sx={{ width: 24, height: 24 }} /> */}

            <Box component="span" sx={{ flexGrow: 1, fontWeight: 'fontWeightMedium' }}>
              {option.name}
            </Box>

            <Label color={'info'}>{option.objective}</Label>
          </MenuItem>
        ))}
      </MenuList>
    </CustomPopover>
  );

  return (
    <>
      {renderButton()}
      {renderMenuList()}
    </>
  );
}
