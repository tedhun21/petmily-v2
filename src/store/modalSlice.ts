import { createSlice } from '@reduxjs/toolkit';

export enum ModalType {
  ADDRESS = 'address',
  MEBUTTON = 'meButton',
  NOTIFICATION = 'notification',
}

export interface ModalState {
  currentModal: ModalType | null;
}

const initialState: ModalState = {
  currentModal: null,
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal: (state, action) => {
      state.currentModal = action.payload;
    },
    closeModal: (state) => {
      state.currentModal = null;
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer;
