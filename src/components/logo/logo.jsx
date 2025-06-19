import { useId, forwardRef } from 'react';
import { mergeClasses } from 'minimal-shared/utils';

import Link from '@mui/material/Link';
import { styled, useColorScheme, useTheme } from '@mui/material/styles';

import { RouterLink } from 'src/routes/components';

import { logoClasses } from './classes';

import { CONFIG } from 'src/global-config';


// ----------------------------------------------------------------------

export const Logo = forwardRef((props, ref) => {
  const { mode } = useColorScheme();

  const { className, href = '/dashboard', isSingle = false, disabled, sx, ...other } = props;

  const singleLogo = (
    <img
      alt="Single logo"
      src={mode === 'dark' ? `${CONFIG.assetsDir}/logo/logo-roxo-claro-single.png` : `${CONFIG.assetsDir}/logo/logo-azul-single.png`}
      width="100%"
      height="100%"
    />
  );

  const fullLogo = (
    <img
      alt="Full logo"
      src={mode === 'dark' ? `${CONFIG.assetsDir}/logo/logo-roxo-claro-full.png` : `${CONFIG.assetsDir}/logo/logo-azul-full.png`}
      width="100%"
      height="100%"
    />
  );

  return (
    <LogoRoot
      ref={ref}
      component={RouterLink}
      href={href}
      aria-label="Logo"
      underline="none"
      className={mergeClasses([logoClasses.root, className])}
      sx={[
        () => ({
          width: 56,
          height: 52,
          ...(!isSingle && { width: 150, height: 52 }),
          ...(disabled && { pointerEvents: 'none' }),
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      {isSingle ? singleLogo : fullLogo}
    </LogoRoot>
  );
});

// ----------------------------------------------------------------------

const LogoRoot = styled(Link)(() => ({
  flexShrink: 0,
  color: 'transparent',
  display: 'inline-flex',
  verticalAlign: 'middle',
}));
