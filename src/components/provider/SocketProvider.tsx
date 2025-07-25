import { createContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { io, Socket } from 'socket.io-client';

import { fetcher } from 'api';
import { addNewNotification } from 'store/notificationSlice';
import { addNewMessage, markAsRead } from 'store/newMessageSlice';

import { useAuthSWR } from 'hooks/authSWR';
import { RootState } from 'store';

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
  const { accessToken } = useSelector((state: RootState) => state.auth);

  const { data: me } = useAuthSWR('/users/me', fetcher);

  useEffect(() => {
    if (!me || !accessToken) return;
    const socket = io(`${SOCKET_URL}`, {
      auth: { access_token: accessToken },
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10, // 10번까지만 시도
      reconnectionDelay: 2000, // 2초 간격
    });

    socket.on('connect', () => {
      // join
      socket.emit('chat:user:join');
      socket.emit('noti:user:join');
    });

    socket.on('chat:user:message:new', (newMessage) => {
      dispatch(addNewMessage(newMessage));
    });

    socket.on('chat:user:newMessage:clear', (data) => {
      dispatch(markAsRead(data));
    });

    socket.on('noti:user:newNoti', (newNotification) => {
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
