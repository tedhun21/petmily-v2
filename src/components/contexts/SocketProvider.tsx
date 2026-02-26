import { useContext, createContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { io, Socket } from 'socket.io-client';

import type { RootState } from '@/store';
import { SOCKET_URL } from '@/config';
import { AuthContext } from './AuthProvider';
import { addNewMessage } from '@/store/slices/newMessageSlice';
import { addNewNotification } from '@/store/slices/notificationSlice';

interface SocketContextProps {
  socket: Socket | null;
}

export const SocketContext = createContext<SocketContextProps>({
  socket: null,
});

export default function SocketProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const [socket, setSocket] = useState<Socket | null>(null);
  const { accessToken } = useSelector((state: RootState) => state.auth);
  const { refreshToken } = useContext(AuthContext);

  useEffect(() => {
    // 1. accessToken이 없으면 상태만 null로 비웁니다.
    if (!accessToken) {
      setSocket(null);
      return;
    }

    // 2. 'socket' 상태를 읽지 않고 'newSocket' 지역 변수를 생성
    const newSocket = io(SOCKET_URL, {
      auth: { access_token: accessToken },
      reconnection: true,
      autoConnect: false,
    });

    // 3. 모든 리스너를 'newSocket'에 직접 붙입니다.
    newSocket.on('connect', () => {
      console.log('✅ Socket connected');
      newSocket.emit('chat:user:join');
      newSocket.emit('noti:user:join');
    });

    newSocket.on('chat:user:message:new', (newMessage) => {
      dispatch(addNewMessage(newMessage));
    });

    newSocket.on('noti:user:newNoti', (newNotification) => {
      dispatch(addNewNotification(newNotification));
    });

    newSocket.on('auth:expired', async () => {
      console.log('⚠️ Token expired, refreshing...');
      const newToken = await refreshToken();
      if (newToken) {
        newSocket.auth = { access_token: newToken };
        newSocket.connect();
      }
    });

    newSocket.connect();
    setSocket(newSocket);

    // 4. Cleanup
    return () => {
      console.log('🧹 Cleaning up old socket...');
      newSocket.off();
      newSocket.disconnect();
    };
  }, [accessToken, dispatch, refreshToken]);

  return <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>;
}
