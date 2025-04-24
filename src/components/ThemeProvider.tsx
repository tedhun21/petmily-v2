import { createContext, useEffect, useState } from 'react';
import { ThemeProvider as StyledComponentsThemeProvider } from 'styled-components';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { darkTheme, lightTheme } from 'styles/theme';
import { ToastContainer } from 'react-toastify';

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

export default function ThemeProvider({ children }: any) {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // dark mode 이벤트
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <ThemeContext.Provider value={{ isDarkMode, setIsDarkMode }}>
      <StyledComponentsThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
        <MuiThemeProvider theme={isDarkMode ? muiDarkTheme : muiLightTheme}>
          {children}
          <ToastContainer
            position="top-right"
            autoClose={2000}
            theme={isDarkMode ? 'dark' : 'light'}
            hideProgressBar={true}
            closeOnClick={true}
            pauseOnFocusLoss={false}
          />
        </MuiThemeProvider>
      </StyledComponentsThemeProvider>
    </ThemeContext.Provider>
  );
}
