import { useMemo } from 'react';

import { useAuthSWRInfinite } from '../../../hooks/authSWR';
import { fetcher } from 'api';
import { ChatRoom } from 'types/chat.type';

const PAGE_SIZE = 20;

export default function useChatRooms() {
  const getKey = (pageIndex: number, previousPageData: any) => {
    if (previousPageData && !previousPageData.pagination.hasNextPage) return null;
    if (pageIndex === 0) return `/chats?pageSize=${PAGE_SIZE}`;
    const { nextCursor } = previousPageData.pagination;
    return `/chats/cursorId=${nextCursor.id}&cursorDate=${nextCursor.createdAt}&pageSize=${PAGE_SIZE}`;
  };

  const { data, isLoading, setSize } = useAuthSWRInfinite(getKey, fetcher);

  const isEnd = data ? data[data.length - 1]?.results?.length < PAGE_SIZE : false;

  const chatRooms: ChatRoom[] = useMemo(() => (data ? data.flatMap((page) => page.results) : []), [data]);

  return { chatRooms, isLoading, isEnd, setSize };
}
