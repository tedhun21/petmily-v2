import axios from 'axios';

const APIUrl = process.env.REACT_APP_API_URL;

interface ILoginForm {
  email: string;
  password: string;
}

// 유저 로그인
export async function login({ email, password }: ILoginForm) {
  const data = { identifier: email, password };
  try {
    const res = await axios.post(`${APIUrl}/auth/local`, data);

    return res;
  } catch (e) {
    return null;
  }
}
