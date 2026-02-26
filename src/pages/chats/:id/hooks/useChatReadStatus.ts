import { useCallback, useRef } from 'react';

import dayjs from 'dayjs';
import { useDebounce } from '@/hooks/useDebounce';

interface IProps {
  updateReadStatus: (messageId: number, messageCreatedAt: string) => void;
}

export type UseChatReadStatus = {
  onMessageVisible: (messageId: number, messageCreatedAt: string) => void;
};

export const useChatReadStatus = ({ updateReadStatus }: IProps) => {
  // 읽음 처리 시점을 추적하기 위해 ref
  const latestSeenMessageInfoRef = useRef<{ id: number; createdAt: string } | null>(null);

  //  읽음 처리 디바운스
  // 1초 내에 여러 번 호출되어도 마지막 호출만 실행되도록 지연
  const { debouncedCallback: debouncedSendReadReceipt } = useDebounce(updateReadStatus, 1000);

  // 메시지 가시성 감지 및 읽음 처리 트리거 함수
  // 화면에 보인 메시지 중 가장 최신 메시지를 기준으로 읽음 처리를 수행
  const onMessageVisible = useCallback(
    (messageId: number, messageCreatedAt: string) => {
      if (!messageId || !messageCreatedAt) return;

      const current = latestSeenMessageInfoRef.current;

      const isAfter = dayjs(messageCreatedAt).isAfter(dayjs(current?.createdAt));

      const isNewer = !current || isAfter;

      if (isNewer) {
        latestSeenMessageInfoRef.current = {
          id: messageId,
          createdAt: messageCreatedAt,
        };

        // 메시지가 실제로 최신일 경우에만 debounced 호출
        debouncedSendReadReceipt(messageId, messageCreatedAt);
      }
    },
    [debouncedSendReadReceipt],
  );

  return { onMessageVisible };
};
