import axios from 'axios';
import { getCookie } from 'utils/cookie';

interface IPagination {
  page: number;
  pageSize: number;
}
const API_URL = process.env.REACT_APP_API_URL;

export const updateMe = async (url: string, { arg: { formData } }: { arg: { formData: FormData } }) => {
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

export const deleteMe = async (url: string) => {
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
};

export const createPet = async (url: string, { arg: { formData } }: { arg: { formData: FormData } }) => {
  const access_token = getCookie('access_token');

  if (access_token) {
    try {
      const { data } = await axios.post(`${url}`, formData, {
        headers: { Authorization: `Bearer ${access_token}` },
      });

      return data;
    } catch (e) {
      return null;
    }
  }
};

export const getPets = async (url: string) => {
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

export const getPet = async (url: string) => {
  try {
    const { data } = await axios.get(`${url}`);
    return data;
  } catch (e) {
    return null;
  }
};

export const updatePet = async (url: string, { arg: { formData } }: { arg: { formData: FormData } }) => {
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

export const deletePet = async (url: string) => {
  const access_token = getCookie('access_token');

  if (access_token) {
    try {
      const { data } = await axios.delete(url, { headers: { Authorization: `Bearer ${access_token}` } });
      return data;
    } catch (e) {
      return null;
    }
  }
};
