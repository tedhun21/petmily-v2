import { fetcherWithCookie } from 'api';
import { API_URL } from 'config';
import { createContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { io, Socket } from 'socket.io-client';
import { addNewMessage, markAsRead } from 'store/newMessageSlice';
import { addNewNotification } from 'store/notificationSlice';
import useSWR from 'swr';
import { getCookie } from 'utils/cookie';

const SOCKET_URL = process.env.REACT_APP_WEBSOCKET_URL;

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

  const { data: me } = useSWR(`${API_URL}/users/me`, fetcherWithCookie);

  useEffect(() => {
    const token = getCookie('access_token');

    if (!me || !token) return;
    const socket = io(`${SOCKET_URL}`, {
      auth: { token },
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10, // 10번까지만 시도
      reconnectionDelay: 2000, // 2초 간격
    });

    socket.on('connect', () => {
      // join
      socket.emit('chat:user:join');
      socket.emit('joinNotiUser');
    });

    socket.on('chat:user:message:new', (newMessage) => {
      dispatch(addNewMessage(newMessage));
    });

    socket.on('chat:user:newMessage:clear', (data) => {
      dispatch(markAsRead(data));
    });

    socket.on('notification', (newNotification) => {
      dispatch(addNewNotification(newNotification));
    });

    setSocket(socket);

    return () => {
      socket.off('notification');
      socket.off('chat:user:message:new');
      socket.disconnect();
    };
  }, [me]);
  return <SocketContext.Provider value={{ socket, setSocket }}>{children}</SocketContext.Provider>;
}
