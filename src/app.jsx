import 'src/global.css';

import { useEffect } from 'react';

import { usePathname } from 'src/routes/hooks';

import { themeConfig, ThemeProvider } from 'src/theme';

import { ProgressBar } from 'src/components/progress-bar';
import { MotionLazy } from 'src/components/animate/motion-lazy';
import { SettingsDrawer, defaultSettings, SettingsProvider } from 'src/components/settings';
/* eslint-disable */
import { LanguageProvider } from 'src/utils/languageContext.jsx';
import { AuthProvider } from 'src/auth/context/jwt';
import { getTranslation } from 'src/assets/data/languages';

globalThis.getTranslation = getTranslation;


// ----------------------------------------------------------------------

export default function App({ children }) {
  useScrollToTop();

  return (
    <AuthProvider>
      <SettingsProvider defaultSettings={defaultSettings}>
      <LanguageProvider>
          <ThemeProvider
            noSsr
            defaultMode={themeConfig.defaultMode}
            modeStorageKey={themeConfig.modeStorageKey}
          >
            <MotionLazy>
              <ProgressBar />
              <SettingsDrawer defaultSettings={defaultSettings} />
              {children}
            </MotionLazy>
          </ThemeProvider>
        </LanguageProvider>
      </SettingsProvider>
    </AuthProvider>
  );
}

// ----------------------------------------------------------------------

function useScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
