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
import { BottomFixed, CenterContainer, Float, Texts20h30 } from 'commonStyle';

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
    <Main>
      <Container>
        <CenterContainer>
          <Status>{formatStatus(reservation?.status)}...</Status>
        </CenterContainer>
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
    </Main>
  );
}

const Main = styled.main`
  display: flex;
  flex-direction: column;
  border-radius: 20px;
  gap: 20px;
`;

const Container = styled.div`
  padding: 20px;
  gap: 16px;
`;

const Status = styled(Texts20h30)`
  color: ${({ theme }) => theme.text.highlight};
  font-weight: ${({ theme }) => theme.fontWeight.extrabold};
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
  left: 0;
  bottom: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;
