import axios from 'axios';
import { getCookie } from 'utils/cookie';

interface IPagination {
  page: number;
  pageSize: number;
}

const API_URL = process.env.REACT_APP_API_URL;

export const getMyPets = async ({ page, pageSize }: IPagination) => {
  const access_token = getCookie('access_token');
  if (access_token) {
    try {
      const { data } = await axios.get(`${API_URL}/pets?page=${page}&pageSize=${pageSize}`, {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      return data;
    } catch (e) {
      return null;
    }
  }
};
