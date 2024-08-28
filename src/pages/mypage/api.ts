import axios from 'axios';
import { getCookie } from 'utils/cookie';

const API_URL = process.env.REACT_APP_API_URL;

export const getMe = async () => {
  const access_token = getCookie('access_token');
  if (access_token) {
    try {
      const { data } = await axios.get(`${API_URL}/users/me`, { headers: { Authorization: `Bearer ${access_token}` } });
      return data;
    } catch (e) {
      return null;
    }
  }
};
