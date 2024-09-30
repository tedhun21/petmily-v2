import axios from 'axios';
import { getCookie } from 'utils/cookie';

// get fetcher
export const fetcher = async (url: string) => {
  try {
    const { data } = await axios.get(`${url}`);
    return data;
  } catch (e) {
    return null;
  }
};

// get fetcher with token (getMe,)
export const fetcherWithCookie = async (url: string) => {
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
export const infiniteFetcher = async (url: string) => {
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
export const infiniteFetcherWithCookie = async (url: string) => {
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

export const poster = async (url: string, { arg }: { arg: any }) => {
  try {
    const { data } = await axios.post(`${url}`, arg);
    return data;
  } catch (e: any) {
    throw new Error(e);
  }
};

// create with Cookie
export const posterWithCookie = async (url: string, { arg: { formData } }: { arg: { formData: any } }) => {
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
