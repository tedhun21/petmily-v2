import { configureStore } from '@reduxjs/toolkit';

import newMessageReducer from './newMessageSlice';
import notificationReducer from './notificationSlice';
import modalReducer from './modalSlice';
import contextReducer from './contextSlice';
import authReducer from './authSlice';

export const store = configureStore({
  reducer: {
    newMessage: newMessageReducer,
    notification: notificationReducer,
    modal: modalReducer,
    context: contextReducer,
    auth: authReducer,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
