import { useEffect, useMemo } from 'react';

import { useScroll } from '@/hooks/useScroll';

import dayjs from 'dayjs';
import type { UseMessagesReturn } from './useMessages';
import { useChat } from '../contexts/ChatProvider';
import type { UseChatRoomReturn } from './useChatRoom';

interface IProps {
  scrollRef: React.RefObject<HTMLElement | null>;
  chatRoomOptions: Pick<UseChatRoomReturn, 'meMember'>;
  messageOptions: Pick<UseMessagesReturn, 'serverMessages' | 'setSize' | 'isValidating' | 'hasNextPage'>;
}

/**
 * @function useChatUIEffects
 * @description
 * 채팅방 UI의 복잡한 스크롤 및 메시지 관련 효과를 관리하는 훅.
 * - 무한 스크롤 (이전 메시지 불러오기)
 * - 스크롤 위치 관리 (자동 스크롤, 무한 스크롤, 스크롤 위치 고정).
 * - '아래로 스크롤' 버튼 상태 관리 (새 메시지 알림, 기본 버튼).
 */
export const useChatUIEffects = ({ scrollRef, messageOptions }: IProps) => {
  const { meMember } = useChat();
  const { serverMessages, setSize, isValidating, hasNextPage } = messageOptions;

  const { isAtBottom, isNearTop, isFarFromBottom, scrollToBottom } = useScroll({
    ref: scrollRef,
    direction: 'reverse',
    enabled: serverMessages.length > 0,
    thresholds: { nearTop: { value: 30, unit: '%' }, farFromBottom: { value: 100, unit: 'px' } },
  });

  const lastestNewMessages = serverMessages[0] ?? null;

  // --- "Scroll to Bottom" 버튼의 표시 상태를 결정 ---
  const downButtonState = useMemo(() => {
    const isLatestMine = lastestNewMessages?.sender.id === meMember?.user.id;
    const isUnread = lastestNewMessages
      ? dayjs(lastestNewMessages.createdAt).isAfter(meMember?.lastReadMessage?.createdAt)
      : false;

    // 새 읽지 않은 메시지가 있고 (내가 보낸 것이 아니며) 하단에서 멀리 떨어져 있으면 "새 메시지" 표시
    if (!!lastestNewMessages && !isLatestMine && isUnread && isFarFromBottom === true) {
      return { state: 'newMessage', lastestNewMessages };
    }
    // 단순히 하단에서 멀리 떨어져 있으면 "기본" 스크롤 버튼 표시
    if (isFarFromBottom === true) {
      return { state: 'default' };
    }
    return { state: 'none' }; // 버튼 숨김
  }, [lastestNewMessages, meMember, isFarFromBottom]);

  useEffect(() => {
    if (isNearTop && !isValidating && hasNextPage) {
      setSize((prev) => prev + 1);
    }
  }, [isNearTop, isValidating, hasNextPage]);

  useEffect(() => {
    if (!lastestNewMessages) return;

    const isLatestMine = lastestNewMessages?.sender.id === meMember?.user.id;

    if (isLatestMine || isAtBottom) {
      scrollToBottom({ behavior: 'smooth' });
    }
  }, [lastestNewMessages, isAtBottom, meMember, scrollToBottom]);

  return { scrollToBottom, downButtonState };
};
