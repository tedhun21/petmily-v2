import { createContext, useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { io, Socket } from 'socket.io-client';

import { addNewNotification } from 'store/notificationSlice';
import { addNewMessage } from 'store/newMessageSlice';

import { RootState } from 'store';
import { SOCKET_URL } from 'config';
import { AuthContext } from './AuthProvider';

interface SocketProviderProps {
  children: React.ReactNode;
}

interface SocketContextProps {
  socket: Socket | null;
  setSocket: React.Dispatch<React.SetStateAction<Socket | null>>;
}

export const SocketContext = createContext<SocketContextProps>({
  socket: null,
  setSocket: () => null,
});

export default function SocketProvider({ children }: SocketProviderProps) {
  const dispatch = useDispatch();
  const [socket, setSocket] = useState<Socket | null>(null);
  const { accessToken } = useSelector((state: RootState) => state.auth);
  const { refreshToken } = useContext(AuthContext);

  // 새 토큰 받아서 소켓연결

  useEffect(() => {
    if (!accessToken) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    // 기존 소켓이 있으면 제거
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }

    const newSocket = io(SOCKET_URL, {
      auth: { access_token: accessToken },
      reconnection: true,
      autoConnect: false, // 토큰 준비 후 연결
    });

    // 이벤트 등록
    const registerEvents = () => {
      newSocket.on('connect', () => {
        console.log('✅ Socket connected');
        newSocket.emit('chat:user:join');
        newSocket.emit('noti:user:join');
      });

      newSocket.on('disconnect', (reason) => {
        console.log('❌ Socket disconnected:', reason);
      });

      newSocket.on('connect_error', (error) => {
        console.error('🔥 Socket connection error:', error);
      });

      newSocket.on('chat:user:message:new', (newMessage) => {
        dispatch(addNewMessage(newMessage));
      });

      newSocket.on('noti:user:newNoti', (newNotification) => {
        dispatch(addNewNotification(newNotification));
      });

      // 토큰 만료 처리
      newSocket.on('auth:expired', async () => {
        console.log('⚠️ Token expired, refreshing...');
        newSocket.disconnect();
        const newToken = await refreshToken(); // 새 토큰 발급
        newSocket.auth = { access_token: newToken };
        newSocket.connect();
      });
    };

    registerEvents();
    newSocket.connect();
    setSocket(newSocket);

    return () => {
      newSocket.off();
      newSocket.disconnect();
    };
  }, [accessToken]);

  return <SocketContext.Provider value={{ socket, setSocket }}>{children}</SocketContext.Provider>;
}
