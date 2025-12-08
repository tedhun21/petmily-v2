import { useContext, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { io, Socket } from 'socket.io-client';

import { addNewNotification } from '@/store/notificationSlice';
import { addNewMessage } from '@/store/newMessageSlice';

import type { RootState } from '@/store';
import { SOCKET_URL } from '@/config';
import { AuthContext } from './AuthContext';
import { SocketContext } from './SocketContext';

export default function SocketProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const socketRef = useRef<Socket | null>(null);
  const { accessToken } = useSelector((state: RootState) => state.auth);
  const { refreshToken } = useContext(AuthContext);

  useEffect(() => {
    // accessToken 없으면 기존 소켓 종료
    if (!accessToken) {
      socketRef.current?.disconnect();
      socketRef.current = null;
      return;
    }

    // 기존 소켓 제거
    socketRef.current?.disconnect();

    const newSocket = io(SOCKET_URL, {
      auth: { access_token: accessToken },
      reconnection: true,
      autoConnect: false,
    });

    socketRef.current = newSocket;

    // 이벤트 등록
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

    newSocket.on('auth:expired', async () => {
      console.log('⚠️ Token expired, refreshing...');
      newSocket.disconnect();
      const newToken = await refreshToken();
      newSocket.auth = { access_token: newToken };
      newSocket.connect();
    });

    newSocket.connect();

    // cleanup: 기존 소켓 정리
    return () => {
      newSocket.off();
      newSocket.disconnect();
    };
  }, [accessToken, dispatch, refreshToken]);

  return <SocketContext.Provider value={{ socketRef }}>{children}</SocketContext.Provider>;
}
