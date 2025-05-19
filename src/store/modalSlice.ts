import { createSlice } from '@reduxjs/toolkit';

export enum ModalType {
  ADDRESS = 'address',
  ME_BUTTON = 'me_button',
  NOTIFICATION = 'notification',
  SEARCH_LOCATION = 'search_location',
  SEARCH_DATE = 'search_date',
  SEARCH_START_TIME = 'search_start_time',
  SEARCH_END_TIME = 'search_end_time',
}

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
