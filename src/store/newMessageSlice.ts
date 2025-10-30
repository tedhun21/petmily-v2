import { createSelector, createSlice } from '@reduxjs/toolkit';
import { RootState } from 'store';
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
    removeMessagesByChatRoom: (state, action) => {
      state.newMessages = state.newMessages.filter((msg) => msg.chatRoom.id !== action.payload);
    },
  },
});

export const { addNewMessage, removeMessagesByChatRoom } = newMessageSlice.actions;
export default newMessageSlice.reducer;

// RootState에서 newMessage slice의 상태를 가져오는 기본 선택자
const allNewMessages = (state: RootState) => state.newMessage.newMessages;

// chatRoomId를 인자로 받아 해당 채팅방의 메시지만 필터링하는 선택자
export const selectNewMessagesByChatRoom = createSelector(
  [allNewMessages, (_, chatRoomId) => chatRoomId],
  (newMessages, chatRoomId) => {
    return newMessages.filter((message) => message.chatRoom.id === chatRoomId);
  },
);
