import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';

import { useScroll } from '@/hooks/useScroll';
import type { ChatMember, ChatMessage } from '@/types/chat.type';
import dayjs from 'dayjs';

interface UseChatUIEffectsOptions {
  scrollRef: React.RefObject<HTMLElement | null>;
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
  const prevScrollHeightRef = useRef<number>(0); // 이전 스크롤 높이 저장 (메시지 로드 후 위치 보정용)
  const isInitialLoad = useRef(true); // 컴포넌트 첫 로딩 여부 (true: 초기 로딩 중, false: 초기 로딩 완료)
  const isFetchingMore = useRef(false); // 이전 메시지 로딩 중인지 (true: 로딩 중, 추가 요청 방지하는 잠금 장치)

  const { meMember } = chatRoomOptions;
  const { messages, isLoading, isValidating, isEnd, setSize, newMessages } = messageOptions;

  // Effect 내부에서 isNearTop만 의존하도록 하기 위해, isEnd, isValidating, setSize의 최신 값을 유지하는 ref
  // useLayoutEffect를 사용하여 항상 최신 값을 즉시 반영
  const latestStatesRef = useRef({ isEnd, isValidating, setSize });
  useLayoutEffect(() => {
    latestStatesRef.current = { isEnd, isValidating, setSize };
  });

  // useScroll 훅으로부터 스크롤 상태와 스크롤 제어 함수들을 가져옴
  const { isAtBottom, isNearTop, isFarFromBottom, scrollToBottom } = useScroll({
    ref: scrollRef,
    thresholds: {
      nearTop: { value: 20, unit: '%' },
      farFromBottom: { value: 5, unit: '%' },
    },
  });

  const lastestNewMessages = newMessages[0] ?? null; // 새 메시지 중 가장 최신 메시지

  // --- UI State Calculation: "Scroll to Bottom" 버튼의 표시 상태를 결정 ---
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

  // --- Effect 1: Initial Load - 컴포넌트 첫 로딩 시 스크롤을 맨 아래로 이동 ---
  // (Flicker 방지를 위해 useLayoutEffect 사용)
  useLayoutEffect(() => {
    // 초기 로딩 중이고, 데이터가 있으며, 아직 스크롤을 하지 않았다면 맨 아래로 이동
    if (isInitialLoad.current && !isLoading && messages.length > 0) {
      scrollToBottom();
      isInitialLoad.current = false; // 초기 로딩 완료 표시
    }
  }, [isLoading, messages, scrollToBottom]);

  // --- Effect 2: Infinite Scroll Trigger - 이전 메시지 로딩을 트리거 ---
  // (사용자 요청에 따라 isNearTop 변화에만 반응하도록 의존성 배열 구성)
  useEffect(() => {
    const chatEl = scrollRef.current;
    // 초기 로딩 중이거나, 이미 다른 요청으로 잠겨있거나, 스크롤 요소가 없으면 실행하지 않음
    if (isInitialLoad.current || isFetchingMore.current || !chatEl) return;

    // isEnd, isValidating, setSize의 최신 값을 useRef에서 가져옴 (Stale Closure 방지)
    const { isEnd: latestIsEnd, isValidating: latestIsValidating, setSize: latestSetSize } = latestStatesRef.current;

    // 트리거 조건: 최상단 근처에 있고 (null이 아닌 true), 더 로드할 게 있고, 현재 로딩 중이 아닐 때
    if (isNearTop === true && !latestIsEnd && !latestIsValidating) {
      isFetchingMore.current = true; // 잠금: 중복 요청 방지
      prevScrollHeightRef.current = chatEl.scrollHeight; // 스크롤 위치 보정을 위한 현재 높이 저장
      latestSetSize((prev) => prev + 1); // 다음 페이지 데이터 요청
    }
  }, [isNearTop, scrollRef]);

  // --- Effect 2.1: Infinite Scroll - 이전 메시지 로드 후 스크롤 위치 보정 및 잠금 해제 ---
  // (useLayoutEffect를 사용하여 DOM 업데이트 직후 스크롤 보정)
  useLayoutEffect(() => {
    const chatEl = scrollRef.current;
    if (isInitialLoad.current || !chatEl) return;

    // isValidating의 최신 값을 useRef에서 가져옴
    const { isValidating: latestIsValidating } = latestStatesRef.current;

    // 보정 조건: 이전 높이값이 기록되어 있고 (즉, 로딩이 발생했고), 로딩이 막 끝났을 때
    if (prevScrollHeightRef.current > 0 && !latestIsValidating) {
      const diff = chatEl.scrollHeight - prevScrollHeightRef.current;
      if (diff > 0) {
        chatEl.scrollTop += diff; // 새 메시지가 추가된 만큼 스크롤 위치 보정
      }
      prevScrollHeightRef.current = 0; // 사용 후 초기화

      // 잠금 해제: setTimeout(0)을 사용하여 다음 이벤트 루프 틱에 실행
      // (스크롤 상태가 완전히 안정되고 브라우저가 변경사항을 인지한 후 isFetchingMore를 해제하여
      // 불필요한 재요청 및 타이밍 레이스 컨디션 방지)
      setTimeout(() => {
        isFetchingMore.current = false;
      }, 0);
    }
  }, [messages, latestStatesRef]); // messages가 렌더링된 후 실행되어야 하므로 의존성 유지

  // --- Effect 3: New Message - 새 메시지 도착 시 자동으로 맨 아래로 스크롤 ---
  useEffect(() => {
    if (!lastestNewMessages) return;

    const isLatestMine = lastestNewMessages?.sender.id === meMember?.user.id;

    // 최신 메시지가 내가 보낸 것이거나, 이미 스크롤이 하단에 있다면 자동 스크롤
    if (isLatestMine || isAtBottom === true) {
      scrollToBottom({ behavior: 'smooth' });
    }
  }, [lastestNewMessages, meMember, isAtBottom, scrollToBottom]);

  return {
    downButtonState,
    scrollToBottom,
  };
};
