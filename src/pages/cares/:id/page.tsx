import { useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { useAuthSWR } from '@/hooks/authSWR';
import { SocketContext } from '@/components/contexts/SocketProvider';

import { formatStatus } from '@/utils/misc';
import { fetcher } from '@/api';
import PetsitterCard from './components/PetsitterCard';
import PetContainer from './components/PetContainer';
import DetailReservation from './components/DetailReservation';
import ProgressButton from './components/ProgressButton';
import ClientCard from './components/ClientCard';
import { UserRole } from '@/types/user.type';

import type { ReservationStatusType } from '@/types/reservation.type';
import Flex from '@/components/styled/Flex';
import Text from '@/components/styled/Text';
import FixedBottom from '@/components/BottomCTA';
import Header from '@/components/headers/Header';
import BackButton from '@/components/buttons/BackButton';

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
  }, [me, socket, reservation, mutate]);

  return (
    <>
      <Header left={<BackButton />} />
      <Flex as="section" direction="column" gap="xl">
        <Flex justifyContent="center">
          <Text size="xl" weight="semibold" color="accent">
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

      <FixedBottom>
        <ProgressButton meRole={me?.role} reservation={reservation} />
      </FixedBottom>
    </>
  );
}
