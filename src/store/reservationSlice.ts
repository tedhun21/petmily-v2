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
    pets: number[];
    petsitterId: string;
  };
}

export const reservationSlice = createSlice({
  name: 'reservation',
  initialState: {
    date: '',
    startTime: '',
    endTime: '',
    address: '',
    detailAddress: '',
    body: '',
    pets: [],
    petsitterId: '',
  },
  reducers: {
    setReservation: (state, action) => {
      state.date = action.payload.date;
      state.startTime = action.payload.startTime;
      state.endTime = action.payload.endTime;
      state.address = action.payload.address;
      state.detailAddress = action.payload.detailAddress;
      state.pets = action.payload.pets;
    },
    setPetsitterId: (state, action) => {
      state.petsitterId = action.payload.petsitterId;
    },
    addBody: (state, action) => {
      state.body = action.payload.body;
    },
    deleteReservation: (state) => {
      state.date = '';
      state.startTime = '';
      state.endTime = '';
      state.address = '';
      state.detailAddress = '';
      state.body = '';
      state.pets = [];
      state.petsitterId = '';
    },
  },
});

export const { setReservation, addBody, deleteReservation, setPetsitterId } = reservationSlice.actions;
export default reservationSlice.reducer;
