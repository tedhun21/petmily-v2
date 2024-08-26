import axios from 'axios';
import { getCookie } from 'utils/cookie';

interface IPagination {
  page: number;
  size: number;
}

const API_URL = process.env.REACT_APP_API_URL;

export async function getFavoritePetsitters({ page, size }: IPagination) {
  const access_token = getCookie('access_token');
  if (access_token) {
    try {
      const { data } = await axios.get(`${API_URL}/user/favorite?page=${page}&size=${size}`, {
        headers: { Authorization: `Bearer ${access_token}` },
      });

      return data;
    } catch (error) {
      return null;
    }
  }
}

export async function getNewestReviews({ page, size }: IPagination) {
  try {
    const { data } = await axios.get(`${API_URL}/reviews?page=${page}&size=${size}`);
    return data;
  } catch (e) {
    return null;
  }
}
