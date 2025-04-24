import { configureStore } from '@reduxjs/toolkit';

import messageReducer from './messageSlice';
import notificationReducer from './notificationSlice';
import modalReducer from './modalSlice';

const store = configureStore({
  reducer: { message: messageReducer, notification: notificationReducer, modal: modalReducer },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
