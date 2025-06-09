import { createSlice } from '@reduxjs/toolkit';
import { Message } from 'types/chat.type';

export interface MessageState {
  newMessages: Message[];
}

const initialState: MessageState = {
  newMessages: [],
};

const messageSlice = createSlice({
  name: 'message',
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
      const { lastSeenMessage } = action.payload;

      state.newMessages = state.newMessages.filter((message) => {
        // 다른 채팅방 메시지는 유지
        const isSameRoom = message.chatRoom.id === lastSeenMessage.chatRoom.userId;
        const isBeforeOrEqual = new Date(message.createdAt) > new Date(lastSeenMessage.created);

        return !isSameRoom || isBeforeOrEqual;
      });
    },
  },
});

export const { addNewMessage, removeMessages, markAsRead } = messageSlice.actions;
export default messageSlice.reducer;
