import { createSlice } from "@reduxjs/toolkit";
import type { Notification } from "@/types/notification.type";

export interface NotificationState {
  newNotifications: Notification[];
}

const initialState: NotificationState = {
  newNotifications: [],
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    addNewNotification: (state, action) => {
      state.newNotifications.unshift(action.payload);
    },
    markAsRead: (state, action) => {
      // newNotifications에서 읽음 처리
      state.newNotifications = state.newNotifications.map((noti) =>
        noti.id === action.payload
          ? { ...noti, readStatus: [{ ...noti.readStatus[0], isRead: true }] }
          : noti
      );
    },
    clearNewNotifications: (state) => {
      state.newNotifications = [];
    },
  },
});

export const { addNewNotification, markAsRead, clearNewNotifications } =
  notificationSlice.actions;
export default notificationSlice.reducer;
