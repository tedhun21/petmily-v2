import { createContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

import { getCookie } from 'utils/cookie';
import { ChatRoom } from 'types/message.type';
import { fetcherWithCookie, updaterWithCookie } from 'api';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';

const API_URL = process.env.REACT_APP_API_URL;
const SOCKET_URL = process.env.REACT_APP_WEBSOCKET_URL;

interface ContextProps {
  socket: Socket | null;
  setSocket: React.Dispatch<React.SetStateAction<Socket | null>>;
  chatRoom: ChatRoom | null;
  setChatRoom: React.Dispatch<React.SetStateAction<ChatRoom | null>>;
  [key: string]: any;
}

export const ChatContext = createContext<ContextProps>({
  socket: null,
  setSocket: () => null,
  chatRoom: null,
  setChatRoom: () => null,
});

// 1. 기존 채팅방 있음 (chatRoomId로 접근)
// 1. 기존 채팅방 없음 (opponentIds로 접근)
// 1. 기존 채팅방 있음 (opponentIds로 접근) => 기존 chatRoomId 찾아서 사용
// 1. 첫 메세지 보냄 => 새로운 chatRoomId 생성하고 업데이트
export default function ChatRoomProvider({ children, value }: any) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [chatRoom, setChatRoom] = useState<ChatRoom | null>(null);

  const { opponentIds, chatRoomId } = value;

  // 채팅방 chatRoomId
  const { data: chatRoomData } = useSWR(chatRoomId ? `${API_URL}/chats/${chatRoomId}` : null, fetcherWithCookie);

  // 채팅방 opponentIds
  const { data: chatRoomByUsersData } = useSWR(
    opponentIds.length > 0 ? `${API_URL}/chats/by-users?opponentIds=${opponentIds}` : null,
    fetcherWithCookie,
  );

  // opponentIds의 유저
  const { data: chatMembers } = useSWR(
    opponentIds.length > 0 ? `${API_URL}/users/by-ids?ids=${opponentIds}` : null,
    fetcherWithCookie,
  );

  // unreadCount reset
  const { trigger } = useSWRMutation(`${API_URL}/chats/unread?action=reset`, updaterWithCookie);

  // 챗룸을 가져오면
  // 1.챗룸 업데이트
  // 2. unreadCount 초기화
  useEffect(() => {
    if (chatRoomData) {
      setChatRoom(chatRoomData);
      trigger({ formData: { chatRoomId: chatRoomData.id } });
    } else if (chatRoomByUsersData) {
      setChatRoom(chatRoomByUsersData);
      trigger({ formData: { chatRoomId: chatRoomByUsersData.id } });
    }
  }, [chatRoomData, chatRoomByUsersData]);

  useEffect(() => {
    if (chatMembers) {
      setChatRoom((prev) => ({
        ...prev,
        chatMembers: {
          ...prev?.chatMembers,
          others: chatMembers,
        },
        // 기본값을 설정하고 싶은 다른 필드가 있다면 추가
        id: prev?.id || null,
        createdAt: prev?.createdAt || '',
        updatedAt: prev?.updatedAt || '',
      }));
    }
  }, [chatMembers]);

  // 1. socket 만들어서 설정
  // 2. 서버에서 듣고 있는 joinRoom으로 보낸다
  // 3. 서버에서 .join으로 채팅방 id를 설정 (socket에 채팅방 특정)
  // 4. 프론트에서 input을 send로 보냄
  // 5. send에서 듣고 있던 서버에서 메세지 저장하고 .to(chatRoomId) 으로 특정한 채팅방으로 메세지를 보냄
  // 6. 프론트에서 receive를 듣고 있다가 메세지에 추가
  useEffect(() => {
    const token = getCookie('access_token');

    if (chatRoom && chatRoom.id && token) {
      const socketConnection = io(`${SOCKET_URL}`, { auth: { token } });

      // 백엔드 웹소켓이랑 연결 후, 방 id 전송
      socketConnection.on('connect', () => {
        if (chatRoom.id) {
          socketConnection.emit('joinRoom', chatRoom.id.toString());
        }
      });

      socketConnection.on('error', (error) => {
        console.error('Socket error:', error);
      });

      // 소켓 연결 상태를 업데이트
      setSocket(socketConnection);

      return () => {
        socketConnection.disconnect();
      };
    }
  }, [chatRoom]);

  return (
    <ChatContext.Provider value={{ ...value, socket, setSocket, chatRoom, setChatRoom }}>
      {children}
    </ChatContext.Provider>
  );
}
