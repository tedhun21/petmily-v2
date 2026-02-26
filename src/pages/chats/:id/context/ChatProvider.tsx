import React, { createContext, useContext, useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useChatSocket } from '../hooks/useChatSocket';
import type { ChatRoom, ChatMember, Message, PendingMessage, ChatMessage } from '@/types/chat.type';
import useChatRoom from '../hooks/useChatRoom';
import { useChatReadStatus } from '../hooks/useChatReadStatus';
import useMessages from '../hooks/useMessages';
import type { CursorResponse } from '@/types/common.type';

// --- Contexts and Types ---

export interface ChatRoomContextProps {
  chatRoom: ChatRoom | undefined;
  meMember: ChatMember | undefined;
  otherMembers: ChatMember[] | undefined;
}
export const ChatRoomContext = createContext<ChatRoomContextProps | null>(null);

export interface ChatMessagesContextProps {
  messages: (Message | PendingMessage)[];
  isValidating: boolean;
  hasNextPage: boolean;
  setSize: (size: number | ((size: number) => number)) => Promise<CursorResponse<ChatMessage>[] | undefined>;
  isCurrentBatchLoaded: boolean;
}
export const ChatMessagesContext = createContext<ChatMessagesContextProps | null>(null);

export interface ChatActionsContextProps {
  sendMessage: (messageContent: string, retryTempId?: string) => void;
  onMessageVisible: (messageId: number, messageCreatedAt: string) => void;
  removePendingMessage: (tempId: string) => void;
}
export const ChatActionsContext = createContext<ChatActionsContextProps | null>(null);

// --- Provider Component ---

export default function ChatProvider({ children }: { children: React.ReactNode }) {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const opponentIds = useMemo(() => searchParams.getAll('opponentIds'), [searchParams]);

  const chatRoomId = id === 'temp' ? undefined : Number(id);

  const { chatRoom, meMember, otherMembers, updateMemberRead } = useChatRoom({ opponentIds, chatRoomId });

  const {
    messages,
    hasNextPage,
    isValidating,
    isCurrentBatchLoaded,
    setSize,
    addPendingMessage,
    removePendingMessage,
    commitMessage,
    updatePendingMessageStatus,
    addIncomingMessage,
  } = useMessages({
    chatRoomId: chatRoom?.id,
  });

  const { sendMessage, updateReadStatus } = useChatSocket({
    chatRoomId: chatRoom?.id,
    meMember,
    otherMembers,
    updateMemberRead,
    addPendingMessage,
    commitMessage,
    updatePendingMessageStatus,
    addIncomingMessage,
  });

  const { onMessageVisible } = useChatReadStatus({ updateReadStatus });

  // --- Memoized Context Values ---
  const roomValue = useMemo(
    () => ({
      chatRoom,
      meMember,
      otherMembers,
    }),
    [chatRoom, meMember, otherMembers],
  );

  const messagesValue = useMemo(
    () => ({
      messages,
      setSize,
      isValidating,
      hasNextPage,
      isCurrentBatchLoaded,
    }),
    [messages, setSize, isValidating, hasNextPage, isCurrentBatchLoaded],
  );

  const actionsValue = useMemo(
    () => ({ sendMessage, onMessageVisible, removePendingMessage }),
    [sendMessage, onMessageVisible, removePendingMessage],
  );

  return (
    <ChatRoomContext.Provider value={roomValue}>
      <ChatMessagesContext.Provider value={messagesValue}>
        <ChatActionsContext.Provider value={actionsValue}>{children}</ChatActionsContext.Provider>
      </ChatMessagesContext.Provider>
    </ChatRoomContext.Provider>
  );
}

// --- Helper Hooks ---
export const useChatRoomContext = () => {
  const context = useContext(ChatRoomContext);
  if (!context) throw new Error('useChatRoomContext must be used within a ChatProvider');
  return context;
};

export const useChatMessagesContext = () => {
  const context = useContext(ChatMessagesContext);
  if (!context) throw new Error('useChatMessagesContext must be used within a ChatProvider');
  return context;
};

export const useChatActionsContext = () => {
  const context = useContext(ChatActionsContext);
  if (!context) throw new Error('useChatActionsContext must be used within a ChatProvider');
  return context;
};
