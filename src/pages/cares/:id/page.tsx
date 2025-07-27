import { useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import styled from 'styled-components';
import { useAuthSWR } from 'hooks/authSWR';

import { formatStatus } from 'utils/misc';
import { fetcher } from 'api';

import PetsitterCard from './component/PetsitterCard';
import PetContainer from './component/PetContainer';
import DetailReservation from './component/DetailReservation';
import ProgressButton from './component/ProgressButton';
import ClientCard from './component/ClientCard';
import { UserRole } from 'types/user.type';
import BackHeader from '@components/headers/BackHeader';
import { SocketContext } from '@components/provider/SocketProvider';
import { ReservationStatus } from 'types/reservation.type';

export default function CarePage() {
  const { id } = useParams();

  const { socket } = useContext(SocketContext);

  const { data: me } = useAuthSWR('/users/me', fetcher);
  const { data: reservation, mutate } = useAuthSWR(`/reservations/${id}`, fetcher);

  // 웹소켓: 예약 상태 변경
  useEffect(() => {
    if (!me || !socket || !reservation?.id) return;

    const reservationId = reservation.id.toString();

    socket.emit('joinReservation', reservationId);

    const handleStatusUpdate = (updatedStatus: { newStatus: ReservationStatus }) => {
      const { newStatus } = updatedStatus;
      mutate((current: { status: ReservationStatus }) => ({ ...current, status: newStatus }), false);
    };

    socket.off('listenStatus').on('listenStatus', handleStatusUpdate);

    return () => {
      socket.off('listenStatus', handleStatusUpdate);
    };
  }, [reservation?.id]);

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
        <ProgressButton meRole={me?.role} reservation={reservation} />
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

const TitleStatus = styled.div`
  display: flex;
  justify-content: center;

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
