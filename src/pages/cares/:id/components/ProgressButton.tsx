import { useCallback, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import styled from '@emotion/styled';
import { SocketContext } from '@/components/contexts/SocketProvider';

import Spinner from '@/components/Spinner';
import { ReservationStatus, type Reservation } from '@/types/reservation.type';
import { UserRole, type UserRoleType } from '@/types/user.type';
import Button from '@/components/styled/Button';

interface ProgressButtonProps {
  meRole: UserRoleType;
  reservation: Reservation;
}

export default function ProgressButton({ meRole, reservation }: ProgressButtonProps) {
  const navigate = useNavigate();
  const { socket } = useContext(SocketContext);
  const [isLoading, setIsLoading] = useState(false);

  // 예약 수락
  const handleAccept = useCallback(() => {
    setIsLoading(true);
    if (reservation && socket) {
      socket.emit('updateStatus', {
        reservationId: reservation.id,
        newStatus: ReservationStatus.ACCEPTED,
      });
    }
    setIsLoading(false);
  }, [socket, reservation]);

  // 예약 취소
  const handleCancel = useCallback(() => {
    setIsLoading(true);
    if (reservation && socket) {
      socket.emit('updateStatus', {
        reservationId: reservation.id,
        newStatus: ReservationStatus.CANCELED,
      });
    }

    setIsLoading(false);
  }, [socket, reservation]);

  const handleLinkReview = () => {
    navigate(`/cares/${reservation?.id}/review`);
  };

  const handleLinkJournal = () => {
    navigate(`/cares/${reservation?.id}/journal`);
  };

  const renderButton = () => {
    if (meRole === UserRole.PETSITTER) {
      // 펫시터
      switch (reservation?.status) {
        case ReservationStatus.PENDING:
          return (
            <Button type="button" disabled={isLoading} onClick={handleAccept} size="lg">
              {isLoading ? <Spinner /> : '수락'}
            </Button>
          );
        case ReservationStatus.ACCEPTED:
          // CONFIRMED => "FINISHED"
          return (
            <Button type="button" disabled={isLoading} onClick={handleCancel} size="lg">
              {isLoading ? <Spinner /> : '취소'}
            </Button>
          );
        case ReservationStatus.CANCELED:
          return (
            <Button disabled size="lg">
              취소됨
            </Button>
          );
        case ReservationStatus.COMPLETED:
          return (
            <>
              <Button type="button" onClick={handleLinkJournal} size="lg">
                {reservation?.journal ? '케어일지 수정' : '케어일지 작성'}
              </Button>
              <Button disabled size="lg">
                완료됨
              </Button>
            </>
          );
        default:
          return null;
      }
    } else if (meRole === UserRole.CLIENT) {
      // 고객
      switch (reservation?.status) {
        case ReservationStatus.PENDING:
          // "PENDING" => "CANCELED"
          return (
            <Button type="button" disabled={isLoading} onClick={handleCancel} variant="primary" size="lg">
              {isLoading ? <Spinner /> : '취소'}
            </Button>
          );
        case ReservationStatus.ACCEPTED:
          return (
            <Button type="button" disabled onClick={handleCancel} size="lg">
              {isLoading ? <Spinner /> : '진행중'}
            </Button>
          );
        case ReservationStatus.CANCELED:
          return (
            <Button disabled size="lg">
              취소됨
            </Button>
          );
        case ReservationStatus.COMPLETED:
          return (
            <>
              <Button type="button" onClick={handleLinkReview} variant="primary" size="lg" borderRadius="lg">
                {reservation?.review ? '후기 수정' : '후기 작성'}
              </Button>
              <Button disabled size="lg" borderRadius="lg">
                완료됨
              </Button>
            </>
          );
        default:
          return null;
      }
    }
  };
  return <ButtonContainer>{renderButton()}</ButtonContainer>;
}

// TODO
const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  gap: ${({ theme }) => theme.space.sm};

  & > button {
    flex: 1;
  }
`;

// 1. 고객
// 1-1. status => "PENDING" --- 예약 신청
// 1-2. status === "CANCELED" --- PENDING 상태에서 취소할 수 있음
// 1-3. status === "CANCELED" => 취소됨 inActive
// 1-4. status === "FINISHED" => 리뷰 작성하기 active

// 2. 펫시터
// 1-1. status === "PENDING" => 수락 active
// 1-2. status === "CONFIRMED" => 진행중 inActive
// 1-3. status === "CANCELED" => 취소됨 inActive
// 1-4. status === "FINISHED" => 일지 작성하기 active

// const Button = styled(BlueButton)<{ disabled?: boolean }>`
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   width: 100%;
//   padding: ${({ theme }) => theme.space.sm};
//   background-color: ${({ theme, disabled }) =>
//     disabled ? theme.colors.background.box.accent.disabled : theme.colors.background.box.accent.primary};
//   border-radius: ${({ theme }) => theme.radius.md};

//   /* hover와 active 스타일을 disabled일 때 비활성화 */
//   pointer-events: ${({ disabled }) => (disabled ? 'none' : 'auto')};
//   ${({ theme }) => theme.typeScale.xl};
// `;
