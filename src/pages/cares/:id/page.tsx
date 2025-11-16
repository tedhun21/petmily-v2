import { useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import styled from 'styled-components';
import { useAuthSWR } from 'hooks/authSWR';

import { formatStatus } from 'utils/misc';
import { fetcher } from 'api';

import PetsitterCard from './components/PetsitterCard';
import PetContainer from './components/PetContainer';
import DetailReservation from './components/DetailReservation';
import ProgressButton from './components/ProgressButton';
import ClientCard from './components/ClientCard';
import { UserRole } from 'types/user.type';
import BackHeader from '@components/headers/BackHeader';
import { SocketContext } from '@components/contexts/SocketProvider';
import { ReservationStatus } from 'types/reservation.type';

import { Flex } from '@components/Flex';
import { Text } from '@components/Text';

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
    <>
      <BackHeader />
      <Flex as="section" direction="column" gap="xl">
        <Flex justifyContent="center">
          <Text size="xl" weight="semibold" color="highlight">
            {formatStatus(reservation?.status)}...
          </Text>
        </Flex>
        {me?.role === UserRole.PETSITTER ? (
          <ClientCard client={reservation?.client} />
        ) : me?.role === UserRole.CLIENT ? (
          <PetsitterCard petsitter={reservation?.petsitter} />
        ) : null}

        <PetContainer pets={reservation?.pets} />

        <DetailReservation reservation={reservation} />
      </Flex>

      <ButtonContainer>
        <ProgressButton meRole={me?.role} reservation={reservation} />
      </ButtonContainer>
    </>
  );
}

const PetInfoContainer = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const PetInfoCapsule = styled.li`
  padding: 4px 8px;
  background-color: ${({ theme }) => theme.colors.background.box.accent.primary};
  border-radius: ${({ theme }) => theme.radius.lg};
  color: ${({ theme }) => theme.colors.text.white};
  ${({ theme }) => theme.typeScale.sm};
`;

const ButtonContainer = styled.div`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.xl};
`;
