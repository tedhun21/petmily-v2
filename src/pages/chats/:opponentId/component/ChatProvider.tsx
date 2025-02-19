import { fetcherWithCookie } from 'api';
import { createContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import useSWR from 'swr';
import { ChatRoom } from 'types/message.type';
import { getCookie } from 'utils/cookie';

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

export default function ChatProvider({ children, value }: any) {
  const { opponentId } = value;

  const [socket, setSocket] = useState<Socket | null>(null);
  const [chatRoom, setChatRoom] = useState<ChatRoom | null>(null);

  // 기존의 채팅방 정보 가져오기
  const { data: fetchedChatRoom } = useSWR(opponentId ? `${API_URL}/chats/${opponentId}` : null, fetcherWithCookie);

  useEffect(() => {
    if (fetchedChatRoom) {
      setChatRoom(fetchedChatRoom);
    }
  }, [fetchedChatRoom]);

  // 1. socket 만들어서 설정
  // 2. 서버에서 듣고 있는 joinRoom으로 보낸다
  // 3. 서버에서 .join으로 채팅방 id를 설정 (socket에 채팅방 특정)
  // 4. 프론트에서 input을 send로 보냄
  // 5. send에서 듣고 있던 서버에서 메세지 저장하고 .to(chatRoomId) 으로 특정한 채팅방으로 메세지를 보냄
  // 6. 프론트에서 receive를 듣고 있다가 메세지에 추가
  useEffect(() => {
    const token = getCookie('access_token');

    if (chatRoom && token) {
      const socketConnection = io(`${SOCKET_URL}`, { auth: { token } });

      // 백엔드 웹소켓이랑 연결 후, 방 id 전송
      socketConnection.on('connect', () => {
        socketConnection.emit('joinRoom', chatRoom.id.toString());
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
      {chatRoom && socket ? children : null}
    </ChatContext.Provider>
  );
}
