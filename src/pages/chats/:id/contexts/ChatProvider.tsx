import { createContext, useContext } from 'react';

import { fetcher } from '@/api';
import { useAuthSWR } from '@/hooks/authSWR';
import useChatRoom, { UseChatRoomReturn } from '../hooks/useChatRoom';
import useChatSocket, { UseSocketReturn } from '../hooks/useChatSocket';
import useMessages, { UseMessagesReturn } from '../hooks/useMessages';
import { UseChatReadStatus, useChatReadStatus } from '../hooks/useChatReadStatus';

interface ChatProviderOptions {
  children: React.ReactNode;
  value: {
    opponentIds?: string[] | null;
    chatRoomId?: string | null;
  };
}

type ChatContextReturn = {
  chatRoomValues: UseChatRoomReturn;
  messageValues: UseMessagesReturn;
  socketValues: UseSocketReturn;
  readStatus: UseChatReadStatus;
};

const ChatContext = createContext<ChatContextReturn | null>(null);

export default function ChatProvider({ children, value }: ChatProviderOptions) {
  const { opponentIds, chatRoomId } = value;

  const { data: me } = useAuthSWR('/users/me', fetcher);

  const chatRoomValues = useChatRoom({ opponentIds, chatRoomId, me });

  const messageValues = useMessages({
    chatRoom: chatRoomValues.chatRoom,
  });

  const socketValues = useChatSocket({ chatRoomValues, setNewMessages: messageValues.setNewMessages, me });
  const readStatus = useChatReadStatus({ markMessageAsRead: socketValues.markMessageAsRead });

  return (
    <ChatContext.Provider
      value={{
        chatRoomValues,
        messageValues,
        socketValues,
        readStatus,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => {
  const context = useContext(ChatContext);

  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }

  return context;
};
