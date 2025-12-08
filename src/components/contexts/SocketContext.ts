import { createContext } from 'react';
import { Socket } from 'socket.io-client';

interface SocketContextProps {
  socketRef: React.RefObject<Socket | null>;
}

export const SocketContext = createContext<SocketContextProps>({
  socketRef: { current: null },
});
