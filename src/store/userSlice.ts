import { createSlice } from '@reduxjs/toolkit';

export interface IUser {
  user: {
    isLogin: boolean;
    id: number;
    username: string;
    phone: string;
    address: string;
    email: string;
    nickname: string;
    body: string;
    photo: string;
    isPetsitter: string;
  };
}

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    isLogin: false,
    id: null,
    username: null,
    phone: null,
    address: null,
    email: null,
    nickname: null,
    body: null,
    photo: null,
    isPetsitter: false,
  },
  reducers: {
    loginUser: (state, action) => {
      state.isLogin = true;
      state.id = action.payload.id;
      state.username = action.payload.username;
      state.phone = action.payload.phone;
      state.address = action.payload.address;
      state.email = action.payload.email;
      state.nickname = action.payload.nickname;
      state.body = action.payload.body;
      state.photo = action.payload.photo && action.payload.photo.url;
      state.isPetsitter = action.payload.isPetsitter;
    },
    logoutUser: (state) => {
      state.isLogin = false;
      state.id = null;
      state.username = null;
      state.phone = null;
      state.address = null;
      state.email = null;
      state.nickname = null;
      state.body = null;
      state.photo = null;
      state.isPetsitter = false;
    },
  },
});

export const { loginUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;
