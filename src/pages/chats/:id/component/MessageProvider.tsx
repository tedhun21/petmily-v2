import { createContext, useContext, useEffect, useState } from 'react';
import { Message } from 'types/chat.type';
import { ChatRoomContext } from './ChatRoomProvider';
import { SocketContext } from '@components/SocketProvider';
import useSWRInfinite from 'swr/infinite';
import { fetcherWithCookie } from 'api';
import { API_URL } from 'config';

interface MessageContextType {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  newMessages: Message[];
  setNewMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setSize: (size: number | ((_size: number) => number)) => Promise<any[] | undefined>;
  isLoading: boolean;
}

// 서버 메시지 (페이징 포함) 상태 관리만 담당
export const MessageContext = createContext<MessageContextType>({
  messages: [],
  setMessages: () => null,
  newMessages: [],
  setNewMessages: () => null,
  setSize: async () => [],
  isLoading: false,
});

export default function MessageProvider({ children }: any) {
  const pageSize = 50;
  const { socket } = useContext(SocketContext);
  const { chatRoom } = useContext(ChatRoomContext);

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessages, setNewMessages] = useState<Message[]>([]);

  // getKey는 setSize로 다시 불릴 때, pageIndex = 0 부터 캐시되어 있는 것을 다시 반복해서 부른다.
  // 하지만 pageIndex = 0인 부분은 "최신 데이터를 보장하는 위한 SWR의 기본 전략"이기 때문에 첫번째 페이지는 백엔드에 통신을 보낸다.
  // 그러나 캐시만 사용하고 싶은면   revalidateFirstPage: false => 첫 페이지 재검증 비활성화 옵션을 키는 것이 좋다
  const getKey = (pageIndex: number, previousPageData: any) => {
    if (!chatRoom?.id) return null;

    const baseKey = `${API_URL}/chats/${chatRoom.id}/messages`;
    // 끝났으면 요청하지 않음
    if (pageIndex === 0 && !previousPageData) {
      return `${baseKey}?pageSize=${pageSize}`;
    }
    // 다음 페이지가 있고 hasNextPage가 true일 때만 cursor를 포함한 URL 반환
    if (previousPageData?.pagination?.hasNextPage && previousPageData.pagination.nextCursor) {
      const nextCursor = previousPageData.pagination.nextCursor;
      return `${baseKey}?cursor=${nextCursor}&pageSize=${pageSize}`;
    }
    return null; // hasNextPage가 false이거나 previousPageData가 없는 경우 null 반환
  };

  // 채팅방 메세지 가져오기
  const { data, setSize, isLoading } = useSWRInfinite(getKey, fetcherWithCookie);

  // 프론트 읽음 처리 함수
  const markMessagesAsRead = (prevMessages: Message[], userId: number, untilMessage: Message): Message[] => {
    return prevMessages.map((msg) => {
      const isBeforeOrEqual =
        new Date(msg.createdAt) < new Date(untilMessage.createdAt) ||
        (new Date(msg.createdAt).getTime() === new Date(untilMessage.createdAt).getTime() && msg.id <= untilMessage.id);

      if (isBeforeOrEqual && !msg.readBy.includes(userId)) {
        return {
          ...msg,
          readBy: [...msg.readBy, userId],
        };
      }

      return msg;
    });
  };

  //  SWR 데이터를 메시지 state에 반영
  useEffect(() => {
    if (data) {
      const flat = data.flatMap((page) => page.results);
      setMessages(flat);
    }
  }, [data]);

  // 소켓 메시지 수신 핸들링
  useEffect(() => {
    if (!socket || !chatRoom?.id) return;

    const chatRoomId = chatRoom.id.toString();
    const meUser = chatRoom.chatMembers.me.user;

    const handleNewMessage = (newMessage: Message) => {
      const isFromOtherUser = newMessage.sender?.id !== meUser.id;

      // 읽음 처리 통합
      const updatedMessages = isFromOtherUser ? markMessagesAsRead([newMessage], meUser.id, newMessage) : [newMessage];

      setMessages((prev) => [...updatedMessages, ...prev]);
      setNewMessages((prev) => [newMessage, ...prev]);
    };

    socket.emit('chat:room:join', chatRoomId);
    socket.on('chat:room:message:new', handleNewMessage);

    return () => {
      socket.off('chat:room:message:new', handleNewMessage);
    };
  }, [socket, chatRoom?.id]);

  //  상대방의 읽음 처리 수신
  useEffect(() => {
    if (!socket || !chatRoom?.id) return;

    const handleReadMessage = (data: { lastSeenMessage: Message; userId: number }) => {
      const { lastSeenMessage, userId } = data;
      if (!lastSeenMessage) return;

      setMessages((prev) => markMessagesAsRead(prev, userId, lastSeenMessage));
    };

    socket.on('chat:room:read:update', handleReadMessage);
    return () => {
      socket.off('chat:room:read:update', handleReadMessage);
    };
  }, [socket, chatRoom?.id]);

  return (
    <MessageContext.Provider value={{ messages, setMessages, newMessages, setNewMessages, isLoading, setSize }}>
      {children}
    </MessageContext.Provider>
  );
}
