import { createContext, useEffect, useState } from 'react';

import { useSelector } from 'react-redux';
import { useAuthSWRInfinite } from 'hooks/authSWR';

import { RootState } from 'store';
import { fetcher } from 'api';
import { ChatRoom } from 'types/chat.type';

interface ContextProps {
  chatRooms: ChatRoom[];
  isLoading: boolean;
  isEnd: boolean;
  setSize: (size: number | ((_size: number) => number)) => Promise<any[] | undefined>;
}

export const ChatRoomsContext = createContext<ContextProps>({
  chatRooms: [],
  isLoading: true,
  isEnd: false,
  setSize: async () => [],
});

export default function ChatRoomsProvider({ children }: { children: React.ReactNode }) {
  const pageSize = 20;
  const { newMessages } = useSelector((state: RootState) => state.newMessage);

  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);

  const getKey = (pageIndex: number, previousPageData: any) => {
    if (previousPageData && !previousPageData.pagination.hasNextPage) return null;
    if (pageIndex === 0) return `/chats?pageSize=${pageSize}`;
    const { nextCursor } = previousPageData.pagination;
    return `/chats?cursorId=${nextCursor.id}&cursorDate=${nextCursor.createdAt}&pageSize=${pageSize}`;
  };

  const { data, setSize, isLoading, mutate } = useAuthSWRInfinite(getKey, fetcher);

  const isEnd = data ? data[data.length - 1]?.results?.length < pageSize : false;

  useEffect(() => {
    if (data) {
      setChatRooms(data.flatMap((page) => page.results));
    }
  }, [data]);

  // 새 메시지가 왔을 때, 기존의 채팅방이 없다면 캐시에 추가
  useEffect(() => {
    if (newMessages.length > 0) {
      const currentChatRoomIds = new Set(chatRooms.map((room) => room.id));

      const newChatRoomsToAdd: ChatRoom[] = [];
      newMessages.forEach((message) => {
        if (!currentChatRoomIds.has(message.chatRoom.id)) {
          const newRoom: ChatRoom = message.chatRoom;
          newChatRoomsToAdd.push(newRoom);
          currentChatRoomIds.add(newRoom.id);
        }
      });

      if (newChatRoomsToAdd.length > 0) {
        mutate((currentData) => {
          if (!currentData) {
            return [
              {
                results: newChatRoomsToAdd,
                pagination: { hasNextPage: false },
              },
            ];
          }

          // 새 배열을 만들고, 첫 페이지도 새로운 객체로 생성
          const newData = [...currentData];
          const firstPage = newData[0];

          newData[0] = {
            ...firstPage,
            results: [...newChatRoomsToAdd, ...(firstPage?.results || [])],
          };

          return newData;
        }, false);
      }
    }
  }, [newMessages, mutate, chatRooms]); // Keep chatRooms here for currentChatRoomIds

  return (
    <ChatRoomsContext.Provider value={{ chatRooms, isLoading, isEnd, setSize }}>{children}</ChatRoomsContext.Provider>
  );
}
