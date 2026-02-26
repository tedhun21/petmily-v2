import { configureStore } from '@reduxjs/toolkit';

import authReducer from './slices/authSlice';
import contextReducer from './slices/contextSlice';
import modalReducer from './slices/modalSlice';
import newMessageReducer from './slices/newMessageSlice';
import notificationReducer from './slices/notificationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    context: contextReducer,
    modal: modalReducer,
    newMessage: newMessageReducer,
    notification: notificationReducer,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
