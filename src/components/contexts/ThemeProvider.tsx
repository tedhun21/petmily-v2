import { createContext, useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { ThemeProvider as EmotionThemeProvider, Global } from '@emotion/react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';

import { darkTheme, lightTheme } from '@/styles/theme';
import { globalStyles } from '@/styles/Globalstyle';

interface ThemePropviderProps {
  children: React.ReactNode;
}

interface ThemeContextType {
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: false,
  setIsDarkMode: () => null,
});

const muiLightTheme = createTheme({ palette: { mode: 'light' } });
const muiDarkTheme = createTheme({ palette: { mode: 'dark' } });

export default function ThemeProvider({ children }: ThemePropviderProps) {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';

      return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
    }
    return false;
  });

  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  return (
    <ThemeContext.Provider value={{ isDarkMode, setIsDarkMode }}>
      <MuiThemeProvider theme={isDarkMode ? muiDarkTheme : muiLightTheme}>
        <EmotionThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
          <Global styles={globalStyles} />
          {children}
          <ToastContainer
            position="bottom-center"
            autoClose={2000}
            theme={isDarkMode ? 'dark' : 'light'}
            hideProgressBar={true}
            closeOnClick={true}
            pauseOnFocusLoss={false}
          />
        </EmotionThemeProvider>
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}
