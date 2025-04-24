import { createSlice } from '@reduxjs/toolkit';
import { Notification } from 'types/notification.type';

export interface NotificationState {
  notifications: Notification[];
}

const initialState: NotificationState = {
  notifications: [],
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
    },
    setNotifications: (state, action) => {
      state.notifications = action.payload;
    },
    markNotificationsAsRead: (state, action) => {
      state.notifications = state.notifications.map((noti) =>
        action.payload.includes(noti.id)
          ? { ...noti, readStatus: noti.readStatus.map((status) => ({ ...status, isRead: true })) }
          : noti,
      );
    },
  },
});

export const { addNotification, setNotifications, markNotificationsAsRead } = notificationSlice.actions;
export default notificationSlice.reducer;
