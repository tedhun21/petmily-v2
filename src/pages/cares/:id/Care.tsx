import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useSWR from 'swr';

import styled from 'styled-components';
import { io } from 'socket.io-client';

import { formatStatus } from 'utils/misc';
import { fetcherWithCookie } from 'api';

import PetsitterCard from './component/PetsitterCard';
import PetContainer from './component/PetContainer';
import DetailReservation from './component/DetailReservation';
import ProgressButton from './component/ProgressButton';
import ClientCard from './component/ClientCard';
import { UserRole } from 'types/user.type';
import { getCookie } from 'utils/cookie';
import { CenterContainer } from 'styles/commonStyle';
import BackHeader from '@components/headers/BackHeader';

const API_URL = process.env.REACT_APP_API_URL;
const SOCKET_URL = process.env.REACT_APP_WEBSOCKET_URL;

export default function Care() {
  const { id } = useParams();

  const [socket, setSocket] = useState<any>(null);

  const { data: me } = useSWR(`${API_URL}/users/me`, fetcherWithCookie);
  const { data: reservation, mutate } = useSWR(`${API_URL}/reservations/${id}`, fetcherWithCookie);

  // 웹소켓: 예약 상태 변경
  useEffect(() => {
    const token = getCookie('access_token');

    if (!token) return;

    if (reservation) {
      // 웹소켓 연결 설정
      const socket = io(`${SOCKET_URL}`, { auth: { token } });

      // 웹소켓이 연결되면 실행
      socket.on('connect', () => {
        // 서버로 joinReservation 이벤트 전송
        socket.emit('joinReservation', reservation.id?.toString());
      });

      // 서버로부터 listenStatus 이벤트 수신
      socket.on('listenStatus', (updatedStatus) => {
        const { newStatus } = updatedStatus;

        // SWR 캐시 업데이트
        mutate(async (currentData: typeof reservation) => {
          // 성공적으로 상태를 업데이트하고 캐시만 업데이트
          return { ...currentData, status: newStatus };
        }, false);
      });

      // 소켓 상태 저장
      setSocket(socket);

      // 컴포넌트 언마운트 시 웹소켓 연결 해제
      return () => {
        socket.off('listenStatus');
        socket.disconnect();
      };
    }
  }, [reservation]);

  return (
    <Main>
      <BackHeader />
      <Section>
        <TitleStatus>
          <span>{formatStatus(reservation?.status)}...</span>
        </TitleStatus>
        {me?.role === UserRole.PETSITTER ? (
          <ClientCard client={reservation?.client} />
        ) : me?.role === UserRole.CLIENT ? (
          <PetsitterCard petsitter={reservation?.petsitter} />
        ) : null}

        <PetContainer pets={reservation?.pets} />

        <DetailReservation reservation={reservation} />
      </Section>

      <ButtonContainer>
        <ProgressButton meRole={me?.role} reservation={reservation} socket={socket} />
      </ButtonContainer>
    </Main>
  );
}

const Main = styled.main`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const Section = styled.section`
  flex: auto;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  padding: 20px;
  height: 100%;
  gap: 20px;
`;

const TitleStatus = styled(CenterContainer)`
  span:first-child {
    color: ${({ theme }) => theme.text.highlight};
    font-weight: ${({ theme }) => theme.fontWeight.extrabold};
    ${({ theme }) => theme.fontSize.s20h30}
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
  background-color: ${({ theme }) => theme.background.box.blue.primary};
  ${({ theme }) => theme.fontSize.s14h21};
`;

const ButtonContainer = styled.div`
  flex: 1;
  padding: 20px;
`;
