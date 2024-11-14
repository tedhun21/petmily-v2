import { useParams } from 'react-router-dom';
import useSWR from 'swr';

import styled from 'styled-components';

import { formatStatus } from 'utils/misc';
import { fetcherWithCookie } from 'api';

import PetsitterCard from './component/PetsitterCard';
import PetContainer from './component/PetContainer';
import DetailReservation from './component/DetailReservation';
import ProgressButton from './component/ProgressButton';
import ClientCard from './component/ClientCard';
import { UserRole } from 'types/user.type';
import Maps from './component/Maps';
import { useEffect, useState } from 'react';
import { getCookie } from 'utils/cookie';
import { io } from 'socket.io-client';

const API_URL = process.env.REACT_APP_API_URL;
const SOCKET_URL = process.env.REACT_APP_WEBSOCKET_URL;

export default function CareDetail() {
  const { id } = useParams();

  const [socket, setSocket] = useState<any>(null);

  const { data: me } = useSWR(`${API_URL}/users/me`, fetcherWithCookie);
  const { data: reservation, mutate } = useSWR(`${API_URL}/reservations/${id}`, fetcherWithCookie);

  useEffect(() => {
    const token = getCookie('access_token');
    if (reservation && token) {
      const socketConnection = io(`${SOCKET_URL}`, { auth: { token } });

      // 채팅방 연결 웹소켓
      socketConnection.on('connect', () => {
        socketConnection.emit('joinReservation', reservation.id?.toString());
      });

      // status 변경 웹소켓
      socketConnection.on('listenStatus', (updatedStatus) => {
        const { newStatus } = updatedStatus;

        // reservation status 캐시 변경

        mutate(`${API_URL}/reservations/${id}`, { ...reservation, status: newStatus });
      });

      setSocket(socketConnection);

      return () => {
        socketConnection.disconnect();
      };
    }
  }, [reservation]);

  return (
    <ReservationContainer>
      <Status>
        <span>{formatStatus(reservation?.status)}...</span>
      </Status>
      {me?.role === UserRole.PETSITTER ? (
        <ClientCard client={reservation?.client} />
      ) : me?.role === UserRole.CLIENT ? (
        <PetsitterCard petsitter={reservation?.petsitter} />
      ) : null}

      <PetContainer pets={reservation?.pets} />

      {/* <Maps reservation={reservation} /> */}

      <DetailReservation reservation={reservation} />

      <ProgressButton meRole={me?.role} reservation={reservation} socket={socket} />
    </ReservationContainer>
  );
}

const ReservationContainer = styled.main`
  display: flex;
  flex-direction: column;
  padding: 20px;
  border-radius: 20px;
  gap: 20px;
`;

const Status = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  > span {
    color: ${(props) => props.theme.colors.mainBlue};
    font-weight: ${(props) => props.theme.fontWeights.extrabold};
    ${(props) => props.theme.fontSize.s20h30};
  }
`;

export const PetInfoContainer = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
`;

export const PetInfoCapsule = styled.li`
  padding: 4px 8px;
  border-radius: 16px;
  color: white;
  background-color: ${(props) => props.theme.colors.subBlue};
  ${(props) => props.theme.fontSize.s14h21};
`;
