import styled from 'styled-components';

import useSWRMutation from 'swr/mutation';

import { updaterWithCookie } from 'api';

import { useNavigate } from 'react-router-dom';
import Loading from '@components/Loading';

const API_URL = process.env.REACT_APP_API_URL;

export default function ProgressButton({ meRole, reservation }: any) {
  const navigate = useNavigate();
  const { isMutating, trigger } = useSWRMutation(`${API_URL}/reservations/${reservation?.id}`, updaterWithCookie);

  // 예약 수락
  const handleAccept = async () => {
    await trigger(
      { formData: { status: 'Accepted' } },
      {
        optimisticData: { ...reservation, status: 'Accepted' },
        rollbackOnError: true,
        onSuccess: () => {
          // 성공 시 추가 작업
        },
        onError: () => {
          // 에러 발생 시 처리 (rollback이 자동으로 됨)
        },
      },
    );
  };

  // 예약 취소
  const handleCancel = async () => {
    await trigger(
      { formData: { status: 'Canceled' } },
      {
        optimisticData: { ...reservation, status: 'Canceled' },
        rollbackOnError: true,
        onSuccess: () => {
          // 성공 시 추가 작업
        },
        onError: () => {
          // 에러 발생 시 처리 (rollback이 자동으로 됨)
        },
      },
    );
  };

  const handleLinkCreateReview = () => {
    navigate(`/cares/${reservation?.id}/review/create`);
  };

  const handleLinkReview = () => {
    navigate(`/cares/${reservation?.id}/review`);
  };

  const handleLinkJournal = () => {
    navigate(`/cares/${reservation?.id}/journal/create`);
  };
  const renderButton = () => {
    if (meRole === 'Petsitter') {
      // 펫시터
      switch (reservation?.status) {
        case 'Pending':
          return (
            <Button disabled={isMutating} onClick={handleAccept}>
              {isMutating ? <Loading /> : '수락'}
            </Button>
          );
        case 'Accepted':
          // CONFIRMED => "FINISHED"
          return (
            <Button disabled={isMutating} onClick={handleCancel}>
              {isMutating ? <Loading /> : '취소'}
            </Button>
          );
        case 'Canceled':
          return <Button disabled>취소됨</Button>;
        case 'Completed':
          return (
            <Button disabled={isMutating} onClick={handleLinkJournal}>
              {isMutating ? <Loading /> : '일지 작성'}
            </Button>
          );
        default:
          return null;
      }
    } else if (meRole === 'Client') {
      // 고객
      switch (reservation?.status) {
        case 'Pending':
          // "PENDING" => "CANCELED"
          return (
            <Button disabled={isMutating} onClick={handleCancel}>
              {isMutating ? <Loading /> : '취소'}
            </Button>
          );
        case 'Accepted':
          return (
            <Button disabled onClick={handleCancel}>
              {isMutating ? <Loading /> : '진행중'}
            </Button>
          );
        case 'Canceled':
          return <Button disabled>취소됨</Button>;
        case 'Completed':
          return (
            <>
              {reservation.review ? (
                <Button disabled={false} onClick={handleLinkReview}>
                  리뷰 보기
                </Button>
              ) : (
                <Button disabled={isMutating} onClick={handleLinkCreateReview}>
                  {isMutating ? <Loading /> : '리뷰 작성'}
                </Button>
              )}
            </>
          );
        default:
          return null;
      }
    }
  };
  return <ButtonContainer>{renderButton()}</ButtonContainer>;
}

const ButtonContainer = styled.div`
  width: 100%;
`;

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

const Button = styled.button<{ disabled: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  color: white;
  border-radius: 16px;
  padding: 8px;
  border: none;
  font-family: inherit;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  background-color: ${({ theme, disabled }) => (disabled ? theme.colors.skyBlue : theme.colors.mainBlue)};

  ${({ theme }) => theme.fontSize.s20h30};

  &:hover {
    background-color: ${({ theme, disabled }) => (disabled ? null : theme.colors.subBlue)};
  }

  &:active {
    background-color: ${({ theme, disabled }) => (disabled ? null : theme.colors.darkBlue)};
    box-shadow: ${({ theme, disabled }) => (disabled ? null : theme.shadow.inset)};
  }
`;
