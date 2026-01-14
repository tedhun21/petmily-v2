import { createContext, useContext } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

import useChatRoom, { type UseChatRoomReturn } from '../hooks/useChatRoom';
import useChatSocket, { type UseSocketReturn } from '../hooks/useChatSocket';
import useMessages, { type UseMessagesReturn } from '../hooks/useMessages';
import { type UseChatReadStatus, useChatReadStatus } from '../hooks/useChatReadStatus';

type ChatContextReturn = UseChatRoomReturn & UseMessagesReturn & UseSocketReturn & UseChatReadStatus;

export const ChatContext = createContext<ChatContextReturn | null>(null);

export default function ChatProvider({ children }: { children: React.ReactNode }) {
  const { id } = useParams();
  const [searchParams] = useSearchParams();

  const opponentIds = searchParams.getAll('opponentIds');
  const chatRoomId = id === 'temp' ? null : id;

  const chatRoomValues = useChatRoom({
    chatRoomId,
    opponentIds: opponentIds.length > 0 ? opponentIds : null,
  });

  const messageValues = useMessages({ chatRoom: chatRoomValues.chatRoom });

  const socketValues = useChatSocket({
    chatRoom: chatRoomValues.chatRoom,
    meMember: chatRoomValues.meMember,
    otherMembers: chatRoomValues.otherMembers,
    addPendingMessage: messageValues.addPendingMessage,
    updatePendingMessageStatus: messageValues.updatePendingMessageStatus,
    replaceMessage: messageValues.replaceMessage,
    addIncomingMessage: messageValues.addIncomingMessage,
    updateMemberRead: chatRoomValues.updateMemberRead,
  });

  const readStatusValues = useChatReadStatus({ markMessageAsRead: socketValues.markMessageAsRead });

  const value = {
    ...chatRoomValues,
    ...messageValues,
    ...socketValues,
    ...readStatusValues,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export const useChat = () => {
  const context = useContext(ChatContext);

  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }

  return context;
};
