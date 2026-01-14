import { useCallback, useContext, useEffect } from 'react';

import type { ChatMember, ChatRoom, Message, PendingMessage } from '@/types/chat.type';

import { AuthContext } from '@/components/contexts/AuthContext';
import { SocketContext } from '@/components/contexts/SocketContext';

interface IProps {
  chatRoom: ChatRoom | null;
  meMember: ChatMember | null;
  otherMembers: ChatMember[];
  addPendingMessage: (tempMessage: PendingMessage) => void;
  updatePendingMessageStatus: (tempId: string, status: 'error') => void;
  addIncomingMessage: (newMessage: Message) => void;
  replaceMessage: (tempId: string, newMessage: Message) => void;
  updateMemberRead: (payload: {
    lastReadMessage: { id: number; chatRoom: { id: number }; createdAt: string };
    readBy: number;
  }) => void;
}

export type UseSocketReturn = {
  sendMessage: (message: string, retryTempId?: string) => void;
  markMessageAsRead: (messageId: number, messageCreatedAt: string) => void;
};

// 1. 메시지 송신
// 2. 읽음 처리 서버 송신
export default function useChatSocket({
  chatRoom,
  meMember,
  otherMembers,
  addPendingMessage,
  updatePendingMessageStatus,
  addIncomingMessage,
  replaceMessage,
  updateMemberRead,
}: IProps) {
  const { socketRef } = useContext(SocketContext);

  const { refreshToken } = useContext(AuthContext);

  // 새 메시지 송신
  const sendMessage = useCallback(
    (message: string, retryTempId?: string) => {
      const socket = socketRef.current;
      if (!socket || !chatRoom || !meMember) return;

      const tempId = retryTempId || crypto.randomUUID();
      const isRetry = !!retryTempId;

      if (!isRetry) {
        const tempMessage: PendingMessage = {
          id: tempId,
          tempId,
          content: message,
          status: 'pending',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          sender: meMember.user,
        };
        addPendingMessage(tempMessage);
      }

      const payload = {
        chatRoomId: chatRoom.id,
        tempId,
        opponentIds: otherMembers.map((other) => other.id),
        content: message,
      };

      socket.emit('chat:message:new', payload, async (ack: any) => {
        if (ack.success) {
          replaceMessage(tempId, ack.data);
        } else {
          if (ack.error?.code === 'TOKEN_EXPIRED') {
            try {
              await refreshToken();
              sendMessage(message, tempId);
            } catch (e) {
              updatePendingMessageStatus(tempId, 'error');
            }
          } else {
            updatePendingMessageStatus(tempId, 'error');
          }
        }
      });
    },
    [
      socketRef,
      chatRoom,
      meMember,
      otherMembers,
      addPendingMessage,
      replaceMessage,
      updatePendingMessageStatus,
      refreshToken,
    ],
  );

  // 읽음 처리 송신
  const markMessageAsRead = useCallback(
    (messageId: number, messageCreatedAt: string) => {
      const socket = socketRef.current;
      if (!socket || !chatRoom?.id || !messageId) return;
      socket.emit('chat:read:mark', {
        chatRoomId: chatRoom.id,
        lastReadMessageId: messageId,
        lastReadMessageCreatedAt: messageCreatedAt,
      });
    },
    [socketRef.current, chatRoom],
  );

  // 채팅방 조인
  useEffect(() => {
    const socket = socketRef.current;

    if (!socket || !chatRoom) return;
    socket.emit('chat:room:join', { chatRoomId: chatRoom.id });
  }, [socketRef.current, chatRoom]);

  // 새 메시지 수신
  useEffect(() => {
    const socket = socketRef.current;

    if (!socket || !meMember) return;

    const handleNewMessage = (payload: { newMessage: Message }) => {
      const { newMessage } = payload;
      if (newMessage.sender.id !== meMember.user.id) {
        addIncomingMessage(newMessage);
      }
    };

    socket.on('chat:room:message:new', handleNewMessage);

    return () => {
      socket.off('chat:room:message:new', handleNewMessage);
    };
  }, [socketRef.current, addIncomingMessage, meMember]);

  // 읽음 처리 수신
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    socket.on('chat:room:read:update', (payload) => {
      updateMemberRead(payload);
    });
  }, [socketRef.current]);

  return { sendMessage, markMessageAsRead };
}
