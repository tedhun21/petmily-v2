import { RefObject, useEffect, useLayoutEffect, useMemo, useRef } from 'react';

import { useScroll } from 'hooks/useScroll';
import { ChatMember, ChatMessage } from 'types/chat.type';
import dayjs from 'dayjs';

interface UseChatUIEffectsOptions {
  scrollRef: RefObject<HTMLElement>;
  chatRoomOptions: ChatRoomOptions;
  messageOptions: MessageOptions;
}

type ChatRoomOptions = {
  meMember?: ChatMember;
};

type MessageOptions = {
  messages: ChatMessage[];
  isLoading: boolean;
  isValidating: boolean;
  isEnd: boolean;
  setSize: (size: number | ((s: number) => number)) => void;
  newMessages: ChatMessage[];
};

export const useChatUIEffects = ({ scrollRef, chatRoomOptions, messageOptions }: UseChatUIEffectsOptions) => {
  const prevScrollHeightRef = useRef<number>(0);
  const isInitialLoad = useRef(true);

  const { meMember } = chatRoomOptions;
  const { messages, isLoading, isValidating, isEnd, setSize, newMessages } = messageOptions;

  const { isAtBottom, isNearTop, isFarFromBottom, scrollToBottom } = useScroll({
    ref: scrollRef,
    thresholds: {
      nearTop: { value: 20, unit: '%' },
      farFromBottom: { value: 5, unit: '%' },
    },
  });

  // 새 메시지에서 가장 최신 메시지
  const lastestNewMessages = newMessages[0] ?? null;

  // --- 버튼 표시 로직 --- //
  const downButtonState = useMemo(() => {
    const isLatestMine = lastestNewMessages?.sender.id === meMember?.user.id;
    const isUnread = lastestNewMessages
      ? dayjs(lastestNewMessages.createdAt).isAfter(meMember?.lastReadMessage?.createdAt)
      : false;

    if (!!lastestNewMessages && !isLatestMine && isUnread && isFarFromBottom) {
      return { state: 'newMessage', lastestNewMessages };
    }
    if (isFarFromBottom) {
      return { state: 'default' };
    }
    return { state: 'none' };
  }, [newMessages, isFarFromBottom]);

  // Effect 1: 초기 로딩 시 스크롤 맨 아래로 이동 (Flicker 방지)
  useLayoutEffect(() => {
    if (isInitialLoad.current && !isLoading && messages.length > 0) {
      scrollToBottom();
      isInitialLoad.current = false;
    }
  }, [isLoading, messages, scrollToBottom]);

  // Effect 2: 이전 메시지 로드 (트리거 + 스크롤 위치 보정)
  useLayoutEffect(() => {
    const chatEl = scrollRef.current;
    if (!chatEl) return;

    // 트리거: 최상단 근처에 있고, 더 로드할 게 있고, 현재 로딩 중이 아닐 때
    if (isNearTop && !isEnd && !isValidating) {
      prevScrollHeightRef.current = chatEl.scrollHeight;
      setSize((prev) => prev + 1);
    }

    // 보정: 로딩이 막 끝났을 때
    if (prevScrollHeightRef.current > 0 && !isValidating) {
      const diff = chatEl.scrollHeight - prevScrollHeightRef.current;
      if (diff > 0) {
        chatEl.scrollTop += diff;
      }
      prevScrollHeightRef.current = 0; // 사용 후 초기화
    }
  }, [isNearTop, isEnd, isValidating, setSize]);

  // Effect 3: 새 메시지 도착 시 자동 스크롤
  useEffect(() => {
    if (!lastestNewMessages) return;

    const isLatestMine = lastestNewMessages?.sender.id === meMember?.user.id;

    if (isLatestMine || isAtBottom) {
      scrollToBottom({ behavior: 'smooth' });
    }
  }, [newMessages]);

  return {
    downButtonState,
    scrollToBottom,
  };
};
