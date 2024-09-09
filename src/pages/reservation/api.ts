import axios from 'axios';
import dayjs, { Dayjs } from 'dayjs';
import { getCookie } from 'utils/cookie';

interface IPagination {
  page: number;
  pageSize: number;
}

export interface IFormInput {
  date: string | null;
  startTime: Dayjs | null;
  endTime: Dayjs | null;
  address: string;
  detailAddress: string;
}

const API_URL = process.env.REACT_APP_API_URL;

// 나의 펫
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

// 필터에 맞는 펫시터 가져오기
export const getPetsitters = async ({
  date,
  startTime,
  endTime,
  address,
  petType,
  page,
  pageSize,
}: any & IPagination) => {
  const formattedDate = dayjs(date).format('YYYY-MM-DD');
  const formattedStart = dayjs(startTime).format('HH:mm:ss');
  const formattedEnd = dayjs(endTime).format('HH:mm:ss');
  const formattedAddress = address.split(' ').slice(1, 3).join(' ');
  const formattedPetType = petType.join(',');

  try {
    const { data } = await axios.get(
      `${API_URL}/user/possiblePetsitter?page=${page}&pageSize=${pageSize}&date=${formattedDate}&startTime=${formattedStart}&endTime=${formattedEnd}&address=${formattedAddress}&petType=${formattedPetType}`,
    );

    return data;
  } catch (e) {
    return null;
  }
};

// 펫시터 정보
export const getPetsitter = async ({ id: petsitterId }: { id: number }) => {
  try {
    const { data } = await axios.get(`${API_URL}/users/${petsitterId}`);
    return data;
  } catch (e) {
    return null;
  }
};

// 예약 생성
export const createReservation = async ({ data: formattedData }: { data: any }) => {
  const access_token = getCookie('access_token');
  if (access_token) {
    try {
      const { data } = await axios.post(`${API_URL}/reservations`, formattedData, {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      return data;
    } catch (e) {
      return null;
    }
  }
};
