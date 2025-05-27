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
  },
});

export const { addNewMessage, removeMessages } = messageSlice.actions;
export default messageSlice.reducer;
