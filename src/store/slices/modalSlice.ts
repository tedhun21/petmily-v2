import { createSlice } from '@reduxjs/toolkit';

export const ModalType = {
  POSTCODE: 'postcode',
} as const;

export type ModalType = (typeof ModalType)[keyof typeof ModalType];

export interface ModalState {
  currentModal: ModalType | null;
  previousModal: ModalType | null;
}

const initialState: ModalState = {
  currentModal: null,
  previousModal: null,
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal: (state, action) => {
      state.previousModal = state.currentModal;
      state.currentModal = action.payload;
    },
    closeModal: (state) => {
      state.previousModal = state.currentModal;
      state.currentModal = null;
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer;
