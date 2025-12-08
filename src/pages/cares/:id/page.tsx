import { useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import styled from '@emotion/styled';
import { useAuthSWR } from '@/hooks/authSWR';

import { formatStatus } from '@/utils/misc';
import { fetcher } from '@/api';

import PetsitterCard from './components/PetsitterCard';
import PetContainer from './components/PetContainer';
import DetailReservation from './components/DetailReservation';
import ProgressButton from './components/ProgressButton';
import ClientCard from './components/ClientCard';
import { UserRole } from '@/types/user.type';
import BackHeader from '@/components/headers/BackHeader';
import { SocketContext } from '@/components/contexts/SocketContext';
import type { ReservationStatusType } from '@/types/reservation.type';
import Flex from '@/components/styled/Flex';
import { Text } from '@/components/styled/Text';
import { BottomFixed, Float } from '@/styles/commonStyle';

export default function CarePage() {
  const { id } = useParams();

  const { socketRef } = useContext(SocketContext);

  const { data: me } = useAuthSWR('/users/me', fetcher);
  const { data: reservation, mutate } = useAuthSWR(`/reservations/${id}`, fetcher);
  console.log('reservaiton', reservation);

  // 웹소켓: 예약 상태 변경
  useEffect(() => {
    if (!me || !socketRef.current || !reservation?.id) return;
    const socket = socketRef.current;

    const reservationId = reservation.id.toString();

    socket.emit('joinReservation', reservationId);

    const handleStatusUpdate = (updatedStatus: { newStatus: ReservationStatusType }) => {
      const { newStatus } = updatedStatus;
      mutate(
        (current: { status: ReservationStatusType }) => ({
          ...current,
          status: newStatus,
        }),
        false,
      );
    };

    socket.off('listenStatus').on('listenStatus', handleStatusUpdate);

    return () => {
      socket.off('listenStatus', handleStatusUpdate);
    };
  }, [me, socketRef, reservation, mutate]);

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

      <BottomFixed>
        <FloatButtonContainer>
          <ProgressButton meRole={me?.role} reservation={reservation} />
        </FloatButtonContainer>
      </BottomFixed>
    </>
  );
}

const FloatButtonContainer = styled(Float)`
  bottom: 0;
  left: 0;
  width: 100%;
  padding: ${({ theme }) => theme.space.xl};
  background-color: transparent;
`;
