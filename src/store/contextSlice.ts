import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  reservation: { month: '', filter: 'all' },
};

const contextSlice = createSlice({
  name: 'context',
  initialState,
  reducers: {
    setMonth: (state, action) => {
      state.reservation.month = action.payload;
    },
    setFilter: (state, action) => {
      state.reservation.filter = action.payload;
    },
  },
});

export const { setMonth, setFilter } = contextSlice.actions;
export default contextSlice.reducer;
