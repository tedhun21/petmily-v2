import { useMemo, useCallback, useState } from 'react';
import { fetcher } from '@/api';
import { useAuthSWRInfinite } from '@/hooks/authSWR';
import type { ChatRoom, Message, PendingMessage } from '@/types/chat.type';

interface IProps {
  chatRoom: ChatRoom | null;
}

export type UseMessagesReturn = {
  serverMessages: Message[];
  pendingMessages: PendingMessage[];
  isLoading: boolean;
  isValidating: boolean;
  hasNextPage: boolean;
  setSize: (_size: number | ((_size: number) => number)) => Promise<any[] | undefined>;
  addPendingMessage: (newMessage: PendingMessage) => void;
  updatePendingMessageStatus: (tempId: string, status: 'error') => void;
  replaceMessage: (tempId: string, newMessage: Message) => void;
  removePendingMessage: (tempId: string) => void;
  addIncomingMessage: (newMessage: Message) => void;
};

const PAGE_SIZE = 50;

export default function useMessages({ chatRoom }: IProps): UseMessagesReturn {
  const [pendingMessages, setPendingMessages] = useState<PendingMessage[]>([]);

  const getKey = (pageIndex: number, previousPageData: any) => {
    if (!chatRoom || chatRoom?.id === -1) return null;
    const baseKey = `/chats/${chatRoom.id}/messages`;
    if (pageIndex === 0 && !previousPageData) return `${baseKey}?pageSize=${PAGE_SIZE}`;

    if (previousPageData?.pagination?.hasNextPage && previousPageData.pagination.nextCursor) {
      const nextCursor = previousPageData.pagination.nextCursor;
      return `${baseKey}?cursor=${nextCursor}&pageSize=${PAGE_SIZE}`;
    }
    return null;
  };

  const { data, isLoading, isValidating, setSize, mutate } = useAuthSWRInfinite<any>(getKey, fetcher);

  const serverMessages: Message[] = useMemo(() => (data ? data.flatMap((page) => page.results) : []), [data]);

  const lastPage = data?.[data.length - 1];
  const hasNextPage = lastPage?.pagination ? lastPage?.pagination.hasNextPage : false;

  const addIncomingMessage = useCallback(
    (newMessage: Message) => {
      mutate(
        (cachedData) => {
          if (!cachedData) return;
          const newData = [...cachedData];
          newData[0] = {
            ...newData[0],
            results: [newMessage, ...newData[0].results],
          };
          return newData;
        },
        { revalidate: false },
      );
    },
    [mutate],
  );

  const addPendingMessage = useCallback((newMessage: PendingMessage) => {
    setPendingMessages((prev) => [newMessage, ...prev]);
  }, []);

  const removePendingMessage = useCallback((tempId: string) => {
    setPendingMessages((prev) => prev.filter((msg) => msg.tempId !== tempId));
  }, []);

  const replaceMessage = useCallback(
    (tempId: string, newMessage: Message) => {
      removePendingMessage(tempId);
      addIncomingMessage(newMessage);
    },
    [removePendingMessage, addIncomingMessage],
  );

  const updatePendingMessageStatus = useCallback((tempId: string, status: 'error') => {
    setPendingMessages((prev) => prev.map((msg) => (msg.tempId === tempId ? { ...msg, status } : msg)));
  }, []);

  return {
    serverMessages,
    pendingMessages,
    isLoading,
    isValidating,
    hasNextPage,
    setSize,
    addPendingMessage,
    removePendingMessage,
    updatePendingMessageStatus,
    replaceMessage,
    addIncomingMessage,
  };
}
