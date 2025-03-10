import { createContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { Message } from 'types/message.type';
import { getCookie } from 'utils/cookie';

const SOCKET_URL = process.env.REACT_APP_WEBSOCKET_URL;

interface ContextProps {
  socket: Socket | null;
  setSocket: React.Dispatch<React.SetStateAction<Socket | null>>;
  newMessages: Message[];
  setNewMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

export const MessageContext = createContext<ContextProps>({
  socket: null,
  setSocket: () => null,
  newMessages: [],
  setNewMessages: () => null,
});

export default function MessageProvider({ children }: any) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [newMessages, setNewMessages] = useState<Message[]>([]);

  useEffect(() => {
    const token = getCookie('access_token');

    if (token) {
      const socketConnection = io(`${SOCKET_URL}`, { auth: { token } });

      socketConnection.on('connect', () => {
        socketConnection.emit('joinUser');

        socketConnection.on('directMessage', (newMessage) => {
          setNewMessages((prev) => [...prev, newMessage]);
        });
      });

      socketConnection.on('error', (error) => {
        console.error('Socket error:', error);
      });

      setSocket(socketConnection);

      return () => {
        socketConnection.disconnect();
      };
    }
  }, []);

  return (
    <MessageContext.Provider value={{ socket, setSocket, newMessages, setNewMessages }}>
      {children}
    </MessageContext.Provider>
  );
}
