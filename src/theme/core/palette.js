import { varAlpha, createPaletteChannel } from 'minimal-shared/utils';

import { themeConfig } from '../theme-config';

// ----------------------------------------------------------------------

// Primary color
export const primary = createPaletteChannel(themeConfig.palette.primary);

// Secondary color
export const secondary = createPaletteChannel(themeConfig.palette.secondary);

// Info color
export const info = createPaletteChannel(themeConfig.palette.info);

// Success color
export const success = createPaletteChannel(themeConfig.palette.success);

// Warning color
export const warning = createPaletteChannel(themeConfig.palette.warning);

// Error color
export const error = createPaletteChannel(themeConfig.palette.error);

// Common color
export const common = createPaletteChannel(themeConfig.palette.common);

// Grey color
export const grey = createPaletteChannel(themeConfig.palette.grey);

// Text color
export const text = {
  light: createPaletteChannel({
    primary: '#1a1a1a',
    secondary: '#02043f',
    disabled: grey[500],
    light: '#ffffff',
    link: '#0236fc'
  }),
  dark: createPaletteChannel({
    primary: '#FFFFFF',
    secondary: '#f1e4ed',
    disabled: grey[600],
  }),
};

// Background color
export const background = {
  light: createPaletteChannel({
    paper: '#f2f2f2',
    default: '#FFFFFF',
    neutral: '#e5e5e5',
    darker: '#d8d8d8',
  }),
  dark: createPaletteChannel({
    paper: '#262626',
    default: '#1a1a1a',
    neutral: '#0d0d0d',
    darker: '#000000',
  }),
};

// Base action color
export const baseAction = {
  hover: varAlpha(grey['500Channel'], 0.08),
  selected: varAlpha(grey['500Channel'], 0.16),
  focus: varAlpha(grey['500Channel'], 0.24),
  disabled: varAlpha(grey['500Channel'], 0.8),
  disabledBackground: varAlpha(grey['500Channel'], 0.24),
  hoverOpacity: 0.08,
  disabledOpacity: 0.48,
};

// Action color
export const action = {
  light: { ...baseAction, active: grey[600] },
  dark: { ...baseAction, active: grey[500] },
};

// ----------------------------------------------------------------------

// Base palette
export const basePalette = {
  primary,
  secondary,
  info,
  success,
  warning,
  error,
  common,
  grey,
  divider: varAlpha(grey['500Channel'], 0.2),
  dividerLowOpacity: varAlpha(grey['500Channel'], 0.17),
};

export const palette = {
  light: {
    ...basePalette,
    divider: varAlpha('2 54 252', 0.2),
    text: text.light,
    background: background.light,
    action: action.light,
  },
  dark: {
    ...basePalette,
    divider: varAlpha('241 228 237', 0.2),
    text: text.dark,
    background: background.dark,
    action: action.dark,
  },
};
