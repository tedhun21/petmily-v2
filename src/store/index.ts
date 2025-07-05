import { configureStore } from '@reduxjs/toolkit';

import newMessageReducer from './newMessageSlice';
import notificationReducer from './notificationSlice';
import modalReducer from './modalSlice';
import contextReducer from './contextSlice';

const store = configureStore({
  reducer: {
    newMessage: newMessageReducer,
    notification: notificationReducer,
    modal: modalReducer,
    context: contextReducer,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
