import { createContext, useEffect, useState } from 'react';
import { ThemeProvider as StyledComponentsThemeProvider } from 'styled-components';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { darkTheme, lightTheme } from 'styles/theme';
import { ToastContainer } from 'react-toastify';

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

// 1. 초기값 가져오기
// 2. 사용자가 변경할때
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
