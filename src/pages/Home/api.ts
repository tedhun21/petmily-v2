import axios from 'axios';
import { getCookieValue } from 'utils/getCookie';

const apiUrl = process.env.REACT_APP_API_URL;

export async function getFavoritePetsitter() {
  const accessToken = getCookieValue('access_token');
  if (accessToken) {
    try {
      const response = await axios.get(`${apiUrl}/members/favorite`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      return response;
    } catch (error) {}
  }
}
