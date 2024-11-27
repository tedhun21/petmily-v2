import { configureStore } from '@reduxjs/toolkit';

import userReducer from './userSlice';
import themeReducer from './themeSlice';

const store = configureStore({
  reducer: { user: userReducer, theme: themeReducer },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
