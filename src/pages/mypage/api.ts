import axios from 'axios';
import { getCookie } from 'utils/cookie';

interface IPagination {
  page: number;
  pageSize: number;
}
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

export const updateMe = async ({ id: userId, formData }: { id: number; formData: FormData }) => {
  const access_token = getCookie('access_token');

  if (access_token) {
    try {
      const { data } = await axios.put(`${API_URL}/users/${userId}`, formData, {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      return data;
    } catch (e) {
      return null;
    }
  }
};

export const deleteMe = async ({ id: userId }: { id: number }) => {
  const access_token = getCookie('access_token');

  if (access_token) {
    try {
      const { data } = await axios.delete(`${API_URL}/users/${userId}`, {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      return data;
    } catch (e) {
      return null;
    }
  }
};

export const createPet = async ({ formData }: { formData: FormData }) => {
  const access_token = getCookie('access_token');

  if (access_token) {
    try {
      const { data } = await axios.post(`${API_URL}/pets`, formData, {
        headers: { Authorization: `Bearer ${access_token}` },
      });

      return data;
    } catch (e) {
      return null;
    }
  }
};

export const getPets = async ({ page, pageSize }: IPagination) => {
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

export const getPet = async ({ id: petId }: { id: number }) => {
  try {
    const { data } = await axios.get(`${API_URL}/pets/${petId}`);

    return data;
  } catch (e) {
    return null;
  }
};

export const updatePet = async ({ id: petId, formData }: { id: number; formData: FormData }) => {
  const access_token = getCookie('access_token');

  if (access_token) {
    try {
      const { data } = await axios.put(`${API_URL}/pets/${petId}`, formData, {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      return data;
    } catch (e) {
      return null;
    }
  }
};
