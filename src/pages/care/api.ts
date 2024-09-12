import axios from 'axios';
import { getCookie } from 'utils/cookie';

const API_URL = process.env.REACT_APP_API_URL;

export const getReservations = async ({ pageParam, pageSize, filter }: any) => {
  const access_token = getCookie('access_token');
  if (access_token) {
    try {
      const {
        data: { results, pagination },
      } = await axios.get(`${API_URL}/reservations?page=${pageParam}&pageSize=${pageSize}&status=${filter}`, {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      return results;
    } catch (e) {
      return null;
    }
  }
};
