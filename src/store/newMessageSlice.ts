import { createSlice } from '@reduxjs/toolkit';
import dayjs from 'dayjs';
import { Message } from 'types/chat.type';

export interface NewMessageState {
  newMessages: Message[];
}

const initialState: NewMessageState = {
  newMessages: [],
};

const newMessageSlice = createSlice({
  name: 'newMessage',
  initialState,
  reducers: {
    addNewMessage: (state, action) => {
      state.newMessages.unshift(action.payload);
    },
    removeMessages: (state, action) => {
      const { chatRoomId } = action.payload;
      state.newMessages = state.newMessages.filter((message) => {
        message.chatRoom.id !== chatRoomId;
      });
    },
    markAsRead: (state, action) => {
      const { lastReadMessage } = action.payload;

      state.newMessages = state.newMessages.filter((message) => {
        const isSameRoom = message.chatRoom.id === lastReadMessage.chatRoom.id;

        const isUnread = dayjs(message.createdAt).isAfter(dayjs(lastReadMessage.createdAt));

        return !isSameRoom || isUnread;
      });
    },

    removeMessagesByChatRoom: (state, action) => {
      state.newMessages = state.newMessages.filter((msg) => msg.chatRoom.id !== action.payload);
    },
  },
});

export const { addNewMessage, removeMessages, markAsRead, removeMessagesByChatRoom } = newMessageSlice.actions;
export default newMessageSlice.reducer;
