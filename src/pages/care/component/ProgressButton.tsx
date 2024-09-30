import styled from 'styled-components';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { updateReservation } from '../api';
import { getFethcerWithCookie } from 'api';

const API_URL = process.env.REACT_APP_API_URL;

export default function ProgressButton({ reservation }: any) {
  const {
    data: { isPetsitter, progress },
  } = useSWR(`${API_URL}/users/me`, getFethcerWithCookie);

  const { trigger } = useSWRMutation(`${API_URL}/reservations/${reservation.id}`, updateReservation);

  // 예약 취소
  const handleCancel = async () => {
    await trigger(
      { action: 'cancel' },
      {
        optimisticData: (currentData: any) => ({ ...currentData, progress: 'CANCELED' }),
        rollbackOnError: true,
        populateCache: true,
        revalidate: false,
      },
    );
  };
  // 예약 확정
  const handleConfirm = () => {
    // trigger({ action: 'confirm' });
  };

  const renderButton = () => {
    if (isPetsitter) {
      // 펫시터
      switch (reservation.progress) {
        case 'PENDING':
          // "PENDING" => "CONFIRMED"
          return <ActiveButton onClick={handleConfirm}>수락</ActiveButton>;
        case 'CONFIRMED':
          // CONFIRMED => "FINISHED"
          return <ActiveButton>진행중</ActiveButton>;
        case 'CANCELED':
          return <InActiveButton>취소됨</InActiveButton>;
        case 'FINISHED':
          return <ActiveButton>일지 작성하기</ActiveButton>;
        default:
          return null;
      }
    } else {
      // 고객
      switch (reservation.progress) {
        case 'PENDING':
          // "PENDING" => "CANCELED"
          return <ActiveButton onClick={handleCancel}>취소</ActiveButton>;
        case 'CONFIRMED':
          return <InActiveButton>진행중</InActiveButton>;
        case 'CANCELED':
          return <InActiveButton>취소됨</InActiveButton>;
        case 'FINISHED':
          return <ActiveButton>리뷰 작성하기</ActiveButton>;
        default:
          return null;
      }
    }
  };
  return <div>{renderButton()}</div>;
}

// 1. 고객
// 1-1. progress === "PENDING" => 취소 active
// 1-2. progress === "CONFIRMED" => 진행중 inActive
// 1-3. progress === "CANCELED" => 취소됨 inActive
// 1-4. progress === "FINISHED" => 리뷰 작성하기 active

// 2. 펫시터
// 1-1. progress === "PENDING" => 수락 active
// 1-2. progress === "CONFIRMED" => 진행중 inActive
// 1-3. progress === "CANCELED" => 취소됨 inActive
// 1-4. progress === "FINISHED" => 일지 작성하기 active

const InActiveButton = styled.div`
  background-color: white;
  padding: 4px 8px;
  border: 1px solid ${(props) => props.theme.colors.mainBlue};
  border-radius: 4px;
  font-family: inherit;
  ${(props) => props.theme.fontSize.s14h21}
`;

const ActiveButton = styled.button`
  cursor: pointer;
  background-color: ${(props) => props.theme.colors.mainBlue};
  color: white;
  border-radius: 4px;
  padding: 4px 8px;
  border: none;
  ${({ theme }) => theme.fontSize.s14h21}
  font-family:inherit;

  &:hover {
    background-color: ${({ theme }) => theme.colors.subBlue};
  }

  &:active {
    background-color: ${({ theme }) => theme.colors.darkBlue};
    box-shadow: ${({ theme }) => theme.shadow.inset};
  }
`;
