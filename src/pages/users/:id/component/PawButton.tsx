import { Button, Row, Texts18h28 } from 'styles/commonStyle';
import { PiPawPrint, PiPawPrintFill } from 'react-icons/pi';
import { useAuthSWR, useAuthSWRMutation } from 'hooks/authSWR';
import { fetcher, updater } from 'api';
import { useState } from 'react';
import styled from 'styled-components';
import Loading from '@components/Loading';

interface IProps {
  userId: number | null;
}

export default function PawButton({ userId }: IProps) {
  const [isPawed, setIsPawed] = useState<boolean>(false);

  // 이 펫시터와 나의 paw관계
  const { isLoading } = useAuthSWR(userId ? `/users/paws/${userId}` : null, fetcher, {
    onSuccess: (data) => {
      if (data.paw) {
        setIsPawed(true);
      } else {
        setIsPawed(false);
      }
    },
  });

  const { isMutating, trigger } = useAuthSWRMutation('/users/me/paws', updater, {
    onSuccess: (data: any) => {
      if (data.message === 'pawed') {
        setIsPawed(true);
      } else if (data.message === 'unpawed') {
        setIsPawed(false);
      }
    },
  });

  const handlePaw = async () => {
    if (!userId) return;
    const formData = {
      action: isPawed ? 'unpaw' : 'paw',
      opponentId: userId,
    };
    try {
      await trigger(formData);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <CustomButton onClick={handlePaw}>
      {isMutating && isLoading ? (
        <Loading />
      ) : isPawed ? (
        <Div>
          <Texts18h28>unpaw</Texts18h28>
          <PiPawPrint size="24px" />
        </Div>
      ) : (
        <Div>
          <Texts18h28>paw</Texts18h28>
          <PiPawPrintFill size="24px" />
        </Div>
      )}
    </CustomButton>
  );
}

const CustomButton = styled(Button)`
  width: 100%;
  padding: 8px;
`;

const Div = styled(Row)`
  align-items: center;
  gap: 8px;
`;
