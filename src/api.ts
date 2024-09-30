import axios from 'axios';
import dayjs from 'dayjs';
import { getCookie } from 'utils/cookie';

interface IPagination {
  page: number;
  pageSize: number;
}
const API_URL = process.env.REACT_APP_API_URL;

// get fetcher
export const getFetcher = async (url: string) => {
  try {
    const { data } = await axios.get(`${url}`);
    return data;
  } catch (e) {
    return null;
  }
};

// get fetcher with token (getMe,)
export const getFethcerWithCookie = async (url: string) => {
  const access_token = getCookie('access_token');

  if (access_token) {
    try {
      const { data } = await axios.get(`${url}`, { headers: { Authorization: `Bearer ${access_token}` } });
      return data;
    } catch (e) {
      return null;
    }
  }
};

// infinite fetcher
export const getInfiniteFetcher = async (url: string) => {
  try {
    const {
      data: { results },
    } = await axios.get(`${url}`);
    return results;
  } catch (e) {
    return null;
  }
};

// infinite fetcher with token
export const getInfiniteFetcherWithCookie = async (url: string) => {
  const access_token = getCookie('access_token');
  if (access_token) {
    try {
      const {
        data: { results },
      } = await axios.get(`${url}`, { headers: { Authorization: `Bearer ${access_token}` } });
      return results;
    } catch (e) {
      return null;
    }
  }
};

// create with Cookie
export const createrWithCookie = async (url: string, { arg: { formData } }: { arg: { formData: any } }) => {
  const access_token = getCookie('access_token');

  if (access_token) {
    try {
      const { data } = await axios.post(`${url}`, formData, { headers: { Authorization: `Bearer ${access_token}` } });

      return data;
    } catch (e) {
      return null;
    }
  }
};

export const updaterWithCookie = async (url: string, { arg: { formData } }: { arg: { formData: any } }) => {
  const access_token = getCookie('access_token');
  if (access_token) {
    try {
      const { data } = await axios.put(`${url}`, formData, { headers: { Authorization: `Bearer ${access_token}` } });
      return data;
    } catch (e) {
      return null;
    }
  }
};

// delete with Cookie
export async function deleterWithCookie(url: string) {
  const access_token = getCookie('access_token');
  if (access_token) {
    try {
      const { data } = await axios.delete(`${url}`, {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      return data;
    } catch (e) {
      return null;
    }
  }
}
