import { configureStore } from '@reduxjs/toolkit';

import messageReducer from './messageSlice';
import notificationReducer from './notificationSlice';
import modalReducer from './modalSlice';
import contextReducer from './contextSlice';

const store = configureStore({
  reducer: { message: messageReducer, notification: notificationReducer, modal: modalReducer, context: contextReducer },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
