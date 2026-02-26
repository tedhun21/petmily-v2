import { useState } from 'react';
import { PiPawPrint, PiPawPrintFill } from 'react-icons/pi';

import { useAuthSWR, useAuthSWRMutation } from '@/hooks/authSWR';
import { fetcher, updater } from '@/api';
import Spinner from '@/components/Spinner';
import Text from '@/components/styled/Text';
import Flex from '@/components/styled/Flex';
import Button from '@/components/styled/Button';
import { toast } from 'react-toastify';

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
    onSuccess: (data: { message: 'pawed' | 'unpawed' }) => {
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
    } catch {
      toast.error('실패했습니다. 다시 시도 해주세요');
    }
  };

  return (
    <Button onClick={handlePaw} fullWidth>
      {isMutating && isLoading ? (
        <Spinner />
      ) : isPawed ? (
        <Flex alignItems="center" gap="sm">
          <Text size="lg">unpaw</Text>
          <PiPawPrint size="24px" />
        </Flex>
      ) : (
        <Flex alignItems="center" gap="sm">
          <Text size="lg">paw</Text>
          <PiPawPrintFill size="24px" />
        </Flex>
      )}
    </Button>
  );
}
