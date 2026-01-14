import { useMemo } from 'react';

import { useAuthSWRInfinite } from '../../../hooks/authSWR';
import { fetcher } from '@/api';
import type { ChatRoom } from '@/types/chat.type';

interface IProps {
  pageSize: number;
}

export default function useChatRooms({ pageSize }: IProps) {
  const getKey = (pageIndex: number, previousPageData: any) => {
    if (previousPageData && previousPageData.results?.length === 0) return null;
    if (pageIndex === 0) return `/chats?pageSize=${pageSize}`;
    const { nextCursor } = previousPageData.pagination;
    return `/chats?cursorId=${nextCursor.id}&cursorDate=${nextCursor.createdAt}&pageSize=${pageSize}`;
  };

  const { data, isLoading, isValidating, setSize } = useAuthSWRInfinite(getKey, fetcher);

  const lastPage = data?.[data.length - 1];
  const isEnd = lastPage ? !lastPage.pagination?.nextCursor : false;

  const chatRooms: ChatRoom[] = useMemo(() => (data ? data.flatMap((page) => page.results) : []), [data]);

  return { chatRooms, isLoading, isValidating, isEnd, setSize };
}
