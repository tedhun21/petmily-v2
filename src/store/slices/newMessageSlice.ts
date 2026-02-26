import { createSlice, createSelector, type PayloadAction } from '@reduxjs/toolkit';
import type { Message } from '@/types/chat.type';
import type { RootState } from '..';

export interface NewMessageState {
  messagesByRoom: Record<string, Message[]>;
}

const initialState: NewMessageState = {
  messagesByRoom: {},
};

const newMessageSlice = createSlice({
  name: 'newMessage',
  initialState,
  reducers: {
    addNewMessage: (state, action: PayloadAction<Message>) => {
      const message = action.payload;
      const roomId = message.chatRoom.id;

      if (!state.messagesByRoom[roomId]) {
        state.messagesByRoom[roomId] = [];
      }

      state.messagesByRoom[roomId].unshift(message);
    },
    removeMessagesByChatRoom: (state, action: PayloadAction<string>) => {
      const roomId = action.payload;
      delete state.messagesByRoom[roomId];
    },
  },
});

// --- Selectors ---

/** 1. 기본 원본 데이터를 가져오는 셀렉터 */
const selectMessagesByRoom = (state: RootState) => state.newMessage.messagesByRoom;

/** 2. 모든 방의 새 메시지 총 합계를 계산하는 셀렉터 (메모이제이션 적용) */
export const selectTotalNewMessageCount = createSelector([selectMessagesByRoom], (messagesByRoom) => {
  return Object.values(messagesByRoom || {}).reduce((acc, messages) => acc + (messages?.length || 0), 0);
});

export const { addNewMessage, removeMessagesByChatRoom } = newMessageSlice.actions;
export default newMessageSlice.reducer;
