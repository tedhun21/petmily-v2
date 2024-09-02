import { createSlice, createSelector } from '@reduxjs/toolkit';
import { RootState } from 'store';

export interface IPet {
  name: string;
  age: number;
  petId: number;
  male: boolean;
  photo: string;
  species: string;
}

export interface IReservation {
  reservation: {
    date: string;
    startTime: string;
    endTime: string;
    address: string;
    detailAddress: string;
    body: string;
    checkedPets: number[];
    petsitterId: string;
  };
}

export const reservationSlice = createSlice({
  name: 'reservation',
  initialState: {
    date: null,
    startTime: null,
    endTime: null,
    address: '',
    detailAddress: '',
    body: '',
    checkedPets: [],
    petsitterId: '',
  },
  reducers: {
    setReservation: (state, action) => {
      state.date = action.payload.date;
      state.startTime = action.payload.startTime;
      state.endTime = action.payload.endTime;
      state.address = action.payload.address;
      state.detailAddress = action.payload.detailAddress;
      state.checkedPets = action.payload.checkedPets;
    },
    setPetsitterId: (state, action) => {
      state.petsitterId = action.payload.petsitterId;
    },
    addBody: (state, action) => {
      state.body = action.payload.body;
    },
    deleteReservation: (state) => {
      state.date = null;
      state.startTime = null;
      state.endTime = null;
      state.address = '';
      state.detailAddress = '';
      state.body = '';
      state.checkedPets = [];
      state.petsitterId = '';
    },
  },
});

export const { setReservation, addBody, deleteReservation, setPetsitterId } = reservationSlice.actions;
export default reservationSlice.reducer;
