import axios from 'axios';

const APIUrl = process.env.REACT_APP_API_URL;

interface ILogin {
  email: string;
  password: string;
}

interface ICreateUser {
  username: string;
  phone: string;
  address: string;
  email: string;
  nickname: string;
  password: string;
  isPetsitter: boolean;
}

// 유저 로그인
export async function login({ email, password }: ILogin) {
  const data = { identifier: email, password };
  try {
    const res = await axios.post(`${APIUrl}/auth/local`, data);

    return res;
  } catch (e) {
    return null;
  }
}

// 유저 생성
export async function createUser({ username, phone, address, email, nickname, password, isPetsitter }: ICreateUser) {
  const data = { username, phone, address, email, nickname, password, isPetsitter };

  try {
    const response = await axios.post(`${APIUrl}/auth/local/register`, data);

    return response;
  } catch (e) {
    return null;
  }
}
