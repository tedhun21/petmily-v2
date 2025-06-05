import { createContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { io, Socket } from 'socket.io-client';
import { addNewMessage } from 'store/messageSlice';
import { addNewNotification } from 'store/notificationSlice';
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

  useEffect(() => {
    const token = getCookie('access_token');

    if (!token) return;
    const socket = io(`${SOCKET_URL}`, {
      auth: { token },
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10, // 10번까지만 시도
      reconnectionDelay: 2000, // 2초 간격
    });

    // message
    socket.on('connect', () => {
      socket.emit('joinChatUser');
      socket.emit('joinNotiUser');
    });

    socket.on('notification', (newNotification) => {
      dispatch(addNewNotification(newNotification));
    });
    socket.on('directMessage', (newMessage) => {
      dispatch(addNewMessage(newMessage));
    });

    setSocket(socket);

    return () => {
      socket.off('notification');
      socket.off('directMessage');
      socket.disconnect();
    };
  }, []);
  return <SocketContext.Provider value={{ socket, setSocket }}>{children}</SocketContext.Provider>;
}
