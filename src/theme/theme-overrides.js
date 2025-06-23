import { createPaletteChannel } from 'minimal-shared/utils';

// ----------------------------------------------------------------------

export const themeOverrides = {
  colorSchemes: {
    light: {
      palette: {
        primary: createPaletteChannel({
          lighter: '#b3c2fe',
          light: '#809afd',
          main: '#0236fc',
          dark: '#012bc9',
          darker: '#012097',
          contrastText: '#FFFFFF',
        }),
        secondary: createPaletteChannel({
          lighter: '#ded7fe',
          light: '#c9bdfe',
          main: '#947bfd',
          dark: '#7662ca',
          darker: '#584997',
          contrastText: '#FFFFFF',
        }),
      },
    },
    dark: {
      palette: {
        primary: createPaletteChannel({
          lighter: '#ded7fe',
          light: '#c9bdfe',
          main: '#947bfd',
          dark: '#7662ca',
          darker: '#584997',
          contrastText: '#FFFFFF',
        }),
        secondary: createPaletteChannel({
          lighter: '#b3c2fe',
          light: '#809afd',
          main: '#0236fc',
          dark: '#012bc9',
          darker: '#012097',
          contrastText: '#FFFFFF',
        }),
      },
    },
  },
};
