import { useCallback, useMemo } from 'react';
import type { ChatMessage, Message, PendingMessage } from '@/types/chat.type';
import { fetcher } from '@/api';
import { useAuthSWRInfinite } from '@/hooks/authSWR';
import type { CursorResponse } from '@/types/common.type';

interface IProps {
  chatRoomId: number | undefined;
}

const PAGE_SIZE = 50;

export default function useMessages({ chatRoomId }: IProps) {
  const getKey = (pageIndex: number, previousPageData: CursorResponse<ChatMessage> | null) => {
    if (!chatRoomId) return null;
    const baseKey = `/chats/${chatRoomId}/messages`;
    if (pageIndex === 0 && !previousPageData) return `${baseKey}?pageSize=${PAGE_SIZE}`;
    if (previousPageData?.pagination?.hasNextPage && previousPageData.pagination.nextCursor) {
      return `${baseKey}?cursor=${previousPageData.pagination.nextCursor}&pageSize=${PAGE_SIZE}`;
    }
    return null;
  };

  const { data, size, setSize, isLoading, isValidating, mutate } = useAuthSWRInfinite<CursorResponse<ChatMessage>>(
    getKey,
    fetcher,
  );

  const messages = useMemo(() => (data ? data.flatMap((page) => page.results) : []), [data]);
  const hasNextPage = data?.[data.length - 1]?.pagination?.hasNextPage ?? false;
  // 무한 스크롤 중복 호출 방지를 위한 플래그
  const isCurrentBatchLoaded = (!isLoading && data?.length === size) ?? false;

  const _internalUpsert = useCallback(
    (
      newMsgOrUpdate: Message | PendingMessage | Partial<PendingMessage>,
      tempId?: string,
      newStatus?: 'pending' | 'error',
    ) => {
      mutate(
        (prev) => {
          if (!prev || !prev[0]) return prev;

          const firstPage = { ...prev[0] };
          const messages = [...(firstPage.results || [])];

          // 1. [수정/확정] tempId가 있는 경우
          if (tempId) {
            const idx = messages.findIndex((m) => 'tempId' in m && m.tempId === tempId);
            if (idx !== -1) {
              if (newStatus) {
                // 상태만 바꿀 때는 기존 데이터 유지
                messages[idx] = { ...messages[idx], status: newStatus };
              } else {
                // 서버 데이터로 확정(Commit)할 때는 기존 펜딩 데이터(tempId 포함)를 완전히 버림
                messages[idx] = newMsgOrUpdate as Message;
              }
              return [{ ...firstPage, results: messages }, ...prev.slice(1)];
            }
          }

          // 2. [신규 추가]
          const newMsg = newMsgOrUpdate as Message | PendingMessage;

          if (!('id' in newMsg)) {
            // [변경] 내 펜딩 메시지는 가장 최신이어야 하므로 배열의 '앞'에 삽입
            messages.unshift(newMsg);
          } else {
            // [추가] 이미 존재하는 메시지(id 기준)라면 무시 (중복 방지)
            const isDuplicate = messages.some((m) => 'id' in m && m.id === newMsg.id);
            if (isDuplicate) return prev;

            // 상대방 메시지(id 있음)는 펜딩들보다는 뒤에(위쪽에) 위치해야 함
            const lastRealMsgIdx = messages.findIndex((m) => 'id' in m);

            if (lastRealMsgIdx === -1) {
              // 리스트에 진짜 메시지가 하나도 없으면 펜딩 뒤(배열 끝)에 추가
              messages.push(newMsg);
            } else {
              // 가장 최신 진짜 메시지 바로 앞(화면상으로는 위쪽)에 삽입
              messages.splice(lastRealMsgIdx, 0, newMsg);
            }
          }

          return [{ ...firstPage, results: messages }, ...prev.slice(1)];
        },
        { revalidate: false },
      );
    },
    [mutate],
  );

  const addPendingMessage = useCallback(
    (pendingMessage: PendingMessage) => _internalUpsert(pendingMessage),
    [_internalUpsert],
  );

  const removePendingMessage = useCallback(
    (tempId: string) => {
      mutate((prev) => {
        if (!prev || !prev[0]) return prev;

        const firstPage = { ...prev[0] };

        const filteredMessages = firstPage.results.filter((m) => !('tempId' in m && m.tempId === tempId));

        return [{ ...firstPage, results: filteredMessages }, ...prev.slice(1)];
      });
    },
    [mutate],
  );

  const addIncomingMessage = useCallback((serverMessage: Message) => _internalUpsert(serverMessage), [_internalUpsert]);

  const commitMessage = useCallback(
    (tempId: string, newMessage: Message) => _internalUpsert(newMessage, tempId),
    [_internalUpsert],
  );

  const updatePendingMessageStatus = useCallback(
    (tempId: string, newStatus: 'pending' | 'error') => _internalUpsert({}, tempId, newStatus),
    [_internalUpsert],
  );

  return {
    messages,
    setSize,
    hasNextPage,
    isValidating,
    isCurrentBatchLoaded,
    addPendingMessage,
    removePendingMessage,
    addIncomingMessage,
    commitMessage,
    updatePendingMessageStatus,
  };
}
