import { createContext, useContext, useEffect, useState } from 'react';
import { Message } from 'types/chat.type';
import { ChatRoomContext } from './ChatRoomProvider';
import { SocketContext } from '@components/SocketProvider';
import useSWRInfinite from 'swr/infinite';
import { fetcherWithCookie } from 'api';
import { useDispatch } from 'react-redux';
import { removeMessages } from 'store/messageSlice';
import { API_URL } from 'config';

interface MessageContextType {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  newMessages: Message[];
  setNewMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setSize: (size: number | ((_size: number) => number)) => Promise<any[] | undefined>;
  isLoading: boolean;
  markAsRead: (messageId: number, userId: number) => void;
}

export const MessageContext = createContext<MessageContextType>({
  messages: [],
  setMessages: () => null,
  newMessages: [],
  setNewMessages: () => null,
  setSize: async () => [],
  isLoading: false,
  markAsRead: () => null,
});

export default function MessageProvider({ children }: any) {
  const pageSize = 30;
  const { socket } = useContext(SocketContext);
  const { chatRoom } = useContext(ChatRoomContext);

  const dispatch = useDispatch();

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

  const markAsRead = (messageId: number, userId: number) => {
    setMessages((prev) => {
      return prev.map((message) => {
        if (message.id <= messageId && !message.readBy.includes(userId)) {
          return { ...message, readBy: [...message.readBy, userId] };
        }
        return message;
      });
    });
  };

  // 메세지 state 업데이트
  useEffect(() => {
    if (data) {
      const flat = data.flatMap((page) => page.results);
      setMessages(flat);
    }
  }, [data]);

  //  socket 연결 및 메시지 수신 핸들링
  useEffect(() => {
    if (!socket || !chatRoom?.id) return;

    const chatRoomId = chatRoom.id.toString();
    const handleNewMessage = (newMessage: Message) => {
      setMessages((prev) => [newMessage, ...prev]);
      setNewMessages((prev) => [newMessage, ...prev]);
    };

    socket.emit('joinChatRoom', chatRoomId);
    socket.on('chatRoomMessage', handleNewMessage);

    return () => {
      socket.off('chatRoomMessage', handleNewMessage);
    };
  }, [chatRoom?.id, socket]);

  // socket 상대방이 읽음처리
  useEffect(() => {
    if (!socket || !chatRoom?.id) return;

    const meId = chatRoom.chatMembers.me?.id;

    const handleReadMessage = (data: { messageId: number; userId: number }) => {
      const { messageId, userId } = data;

      if (meId !== userId) {
        markAsRead(messageId, userId);
      }
    };

    socket.on('readMessage', handleReadMessage);

    return () => {
      socket.off('readMessage', handleReadMessage);
    };
  }, [chatRoom?.id, socket]);

  // 채팅방을 나갈 때 처리하는 useEffect
  useEffect(() => {
    if (!chatRoom) return;

    // 채팅방을 나갈 때 상태 초기화 작업
    return () => {
      dispatch(removeMessages({ chatRoomId: chatRoom.id }));
    };
  }, [chatRoom, dispatch]);

  return (
    <MessageContext.Provider
      value={{ messages, setMessages, newMessages, setNewMessages, isLoading, setSize, markAsRead }}
    >
      {children}
    </MessageContext.Provider>
  );
}
