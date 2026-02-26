import { useContext, useEffect, useCallback } from 'react';
import { SocketContext } from '@/components/contexts/SocketProvider';
import { AuthContext } from '@/components/contexts/AuthProvider';
import type { AckPayload, Message, ChatMember, PendingMessage } from '@/types/chat.type';

interface IProps {
  chatRoomId: number | undefined;
  meMember: ChatMember | undefined;
  otherMembers: ChatMember[] | undefined;
  updateMemberRead: (lastReadMessage: Message, readBy: number) => void;
  addPendingMessage: (pendingMessage: PendingMessage) => void;
  commitMessage: (tempId: string, serverMessage: Message) => void;
  updatePendingMessageStatus: (tempId: string, status: 'pending' | 'error') => void;
  addIncomingMessage: (newMessage: Message) => void;
}

export function useChatSocket({
  chatRoomId,
  meMember,
  otherMembers,
  updateMemberRead,
  addPendingMessage,
  commitMessage,
  updatePendingMessageStatus,
  addIncomingMessage,
}: IProps) {
  const { socket } = useContext(SocketContext);
  const { refreshToken } = useContext(AuthContext);

  // 새 메시지 송신
  const sendMessage = useCallback(
    (messageContent: string, retryTempId?: string) => {
      if (!socket || !chatRoomId || !meMember || !otherMembers) return;

      const tempId = retryTempId || crypto.randomUUID();
      if (!retryTempId) {
        const optimisticMessage: PendingMessage = {
          tempId,
          content: messageContent,
          createdAt: new Date().toISOString(),
          sender: meMember.user,
          status: 'pending',
        };
        addPendingMessage(optimisticMessage);
      }

      const payload = {
        chatRoomId,
        tempId,
        content: messageContent,
        opponentIds: otherMembers.map((m) => m.user.id),
      };

      socket.emit('chat:message:new', payload, async (ack: AckPayload) => {
        if (ack.success && ack.data) {
          commitMessage(tempId, ack.data);
        } else {
          updatePendingMessageStatus(tempId, 'error');
          if (ack.error?.code === 'TOKEN_EXPIRED') {
            await refreshToken();
            sendMessage(messageContent, tempId);
          }
        }
      });
    },
    [
      socket,
      chatRoomId,
      meMember,
      otherMembers,
      addPendingMessage,
      commitMessage,
      updatePendingMessageStatus,
      refreshToken,
    ],
  );

  // 읽음 상태 송신
  const updateReadStatus = useCallback(
    (messageId: number, messageCreatedAt: string) => {
      if (!socket) return;

      const payload = {
        chatRoomId,
        lastReadMessageId: messageId,
        lastReadMessageCreatedAt: messageCreatedAt,
      };

      // 송신
      socket.emit('chat:read:mark', payload);
    },
    [socket, chatRoomId],
  );

  // 방의 생명주기
  useEffect(() => {
    if (!socket || !chatRoomId) return;

    const joinRoom = () => {
      socket.emit('chat:room:join', { chatRoomId });
    };

    joinRoom();
    socket.on('connect', joinRoom);

    return () => {
      socket.off('connect', joinRoom);
      socket.emit('chat:room:leave', { chatRoomId });
    };
  }, [socket, chatRoomId]);

  // 새 메시지 수신
  useEffect(() => {
    if (!socket || !chatRoomId) return;

    const handleNewMessage = (newMessage: Message) => {
      if (newMessage?.sender?.id === meMember?.user?.id) return;
      addIncomingMessage(newMessage);
    };

    socket.on('chat:room:message:new', handleNewMessage);

    return () => {
      socket.off('chat:room:message:new', handleNewMessage);
    };
  }, [socket, chatRoomId, meMember?.user.id, addIncomingMessage]);

  // 읽음 상태 수신
  useEffect(() => {
    if (!socket || !chatRoomId) return;

    const handleReadUpdate = ({ lastReadMessage, readBy }: { lastReadMessage: Message; readBy: number }) => {
      updateMemberRead(lastReadMessage, readBy);
    };

    socket.on('chat:room:read:update', handleReadUpdate);

    return () => {
      socket.off('chat:room:read:update', handleReadUpdate);
    };
  }, [socket, chatRoomId, updateMemberRead]);

  return { sendMessage, updateReadStatus };
}
