import axios from 'axios';
import { getCookie } from 'utils/cookie';

export const getReservations = async (url: string) => {
  const access_token = getCookie('access_token');
  if (access_token) {
    try {
      const {
        data: { results },
      } = await axios.get(`${url}`, {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      return results;
    } catch (e) {
      return null;
    }
  }
};

export const updateReservation = async (url: string, { arg: { action } }: { arg: { action: string } }) => {
  const access_token = getCookie('access_token');

  if (access_token) {
    try {
      const { data } = await axios.put(
        `${url}?action=${action}`,
        {},
        {
          headers: { Authorization: `Bearer ${access_token}` },
        },
      );
      return data;
    } catch (e) {
      return null;
    }
  }
};
