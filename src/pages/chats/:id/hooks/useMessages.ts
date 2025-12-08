import { useMemo, useState } from 'react';
import { fetcher } from '@/api';
import { useAuthSWRInfinite } from '@/hooks/authSWR';
import type { ChatMessage, ChatRoom, Message } from '@/types/chat.type';

interface UseMessagesOptions {
  chatRoom: ChatRoom | null;
}

export type UseMessagesReturn = {
  messages: Message[];
  newMessages: ChatMessage[];
  setNewMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  isLoading: boolean;
  isValidating: boolean;
  isEnd: boolean;
  setSize: (_size: number | ((_size: number) => number)) => Promise<any[] | undefined>;
};

export type MessagePayload =
  | { content: string; chatRoomId: number; tempMessageId: string; opponentIds?: undefined }
  | { content: string; opponentIds: string[] | null; tempMessageId: string; chatRoomId?: undefined };

const PAGE_SIZE = 50;

export default function useMessages({ chatRoom }: UseMessagesOptions): UseMessagesReturn {
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

  const { data, isLoading, isValidating, setSize } = useAuthSWRInfinite(getKey, fetcher);

  const messages: Message[] = useMemo(() => (data ? data.flatMap((page) => page.results) : []), [data]);
  const [newMessages, setNewMessages] = useState<ChatMessage[]>([]);

  const isEnd = useMemo(() => {
    if (!data) return false;
    const lastPage = data[data.length - 1];
    return !lastPage?.pagination?.hasNextPage;
  }, [data]);

  return { messages, newMessages, setNewMessages, isLoading, isValidating, isEnd, setSize };
}
