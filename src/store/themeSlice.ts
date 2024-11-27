import { createSlice } from '@reduxjs/toolkit';

export interface ITheme {
  theme: {
    isDarkMode: boolean;
  };
}

const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    isDarkMode: prefersDarkMode, // 시스템의 초기 테마를 설정
  },
  reducers: {
    toggleTheme: (state, action) => {
      if (action.payload === 'dark') {
        state.isDarkMode = true;
      } else {
        state.isDarkMode = false;
      }
    },
  },
});

export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
