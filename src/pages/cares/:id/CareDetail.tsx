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
import { BottomFixed, CenterContainer, Column, Float } from 'styles/commonStyle';

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
    <main>
      <Container>
        <TitleStatus>
          <span>{formatStatus(reservation?.status)}...</span>
        </TitleStatus>
        {me?.role === UserRole.PETSITTER ? (
          <ClientCard client={reservation?.client} />
        ) : me?.role === UserRole.CLIENT ? (
          <PetsitterCard petsitter={reservation?.petsitter} />
        ) : null}

        <PetContainer pets={reservation?.pets} />

        {/* <Maps reservation={reservation} /> */}

        <DetailReservation reservation={reservation} />
      </Container>

      <BottomFixed>
        <FloatButtonContainer>
          <ProgressButton meRole={me?.role} reservation={reservation} socket={socket} />
        </FloatButtonContainer>
      </BottomFixed>
    </main>
  );
}

const TitleStatus = styled(CenterContainer)`
  span:first-child {
    color: ${({ theme }) => theme.text.highlight};
    font-weight: ${({ theme }) => theme.fontWeight.extrabold};
    ${({ theme }) => theme.fontSize.s20h30}
  }
`;

const Container = styled(Column)`
  padding: 20px;
  gap: 20px;
  margin-bottom: 86px;
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
  background-color: ${({ theme }) => theme.background.box.blue.primary};
  ${({ theme }) => theme.fontSize.s14h21};
`;

const FloatButtonContainer = styled(Float)`
  display: flex;
  align-items: center;
  justify-content: center;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 20px;
  background-color: ${({ theme }) => theme.background.primary};
`;
