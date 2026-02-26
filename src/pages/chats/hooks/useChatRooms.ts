import { useMemo } from 'react';

import { useAuthSWRInfinite } from '../../../hooks/authSWR';
import { fetcher } from '@/api';
import type { ChatRoom } from '@/types/chat.type';
import type { CursorResponse } from '@/types/common.type';

const PAGE_SIZE = 20;

export default function useChatRooms() {
  const getKey = (pageIndex: number, previousPageData: CursorResponse<ChatRoom> | null): string | null => {
    // 1. 끝에 도달했는지 확인
    if (previousPageData && previousPageData.results?.length === 0) return null;

    // 2. 첫 페이지 요청
    if (pageIndex === 0) return `/chats?pageSize=${PAGE_SIZE}`;

    // 3. 이전 데이터가 있고, 다음 커서 정보가 있는 경우
    if (previousPageData && previousPageData.pagination?.nextCursor) {
      const { nextCursor } = previousPageData.pagination;
      return `/chats?cursorId=${nextCursor.id}&cursorDate=${nextCursor.createdAt}&pageSize=${PAGE_SIZE}`;
    }

    // 4. ★ 위 모든 조건에 해당하지 않으면 반드시 null을 반환 (undefined 방지)
    return null;
  };

  const { data, isLoading, isValidating, setSize, error } = useAuthSWRInfinite<CursorResponse<ChatRoom>>(
    getKey,
    fetcher,
  );

  const lastPage = data?.[data.length - 1];
  const isEnd = lastPage ? !lastPage.pagination?.nextCursor : false;

  const chatRooms: ChatRoom[] = useMemo(() => (data ? data.flatMap((page) => page.results) : []), [data]);

  return { chatRooms, isLoading, isValidating, isEnd, setSize, error };
}
