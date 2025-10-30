import { useCallback, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { SocketContext } from '@components/contexts/SocketProvider';
import { ChatMember, ChatMessage, ChatRoom, Message, PendingMessage } from 'types/chat.type';
import { AuthContext } from '@components/contexts/AuthProvider';
import { MessagePayload } from './useMessages';

export type UseSocketReturn = {
  sendMessage: (message: string, retryTempId?: string) => void;
  markMessageAsRead: (messageId: number, messageCreatedAt: string) => void;
};

// 메시지 송신
// 읽음 처리 서버 송신

export default function useChatSocket({ opponentIds, chatRoomValues, setNewMessages, me }: any) {
  const { socket } = useContext(SocketContext);
  const navigate = useNavigate();

  const { chatRoom, setChatRoom } = chatRoomValues;

  const { refreshToken } = useContext(AuthContext);

  // 새 메시지 송신
  const sendMessage = useCallback(
    async (message: string, retryTempId?: string) => {
      if (!socket || !chatRoom || !me) return;

      // 1. 재전송 여부와 임시 ID를 설정
      const tempMessageId = retryTempId || `temp-${Date.now()}`;
      const isRetry = !!retryTempId;

      // 1. Optimistic update
      if (!isRetry) {
        const tempMessage: PendingMessage = {
          id: tempMessageId,
          content: message,
          status: 'pending',
          chatRoom,
          sender: {
            id: me.id,
            role: me.role,
            nickname: me.nickname ?? '',
            photo: me.photo ?? '',
          },
          tempId: tempMessageId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        setNewMessages((prev: ChatMessage[]) => [tempMessage, ...prev]);
      } else {
        // 재시도면 상태만 pending으로 변경
        setNewMessages((prev: ChatMessage[]) =>
          prev.map((msg) => (msg.id === tempMessageId ? { ...msg, status: 'pending' } : msg)),
        );
      }

      const payload: MessagePayload =
        chatRoom.id !== -1
          ? { content: message, chatRoomId: chatRoom.id, tempMessageId }
          : { content: message, opponentIds: opponentIds ?? null, tempMessageId };

      socket.emit('chat:message:new', payload, async (ack: any) => {
        const handleSuccess = (ackData: any) => {
          const { newMessage } = ackData;
          setNewMessages((prev: ChatMessage[]) =>
            prev.map((msg: ChatMessage) => {
              if (msg.id === tempMessageId) {
                return newMessage;
              }
              return msg;
            }),
          );

          if (chatRoom.id === -1) {
            navigate(`/chats/${ackData.newChatRoomId}`, { replace: true });
          }
        };

        const handleError = () => {
          setNewMessages((prev: ChatMessage[]) =>
            prev.map((msg) => (msg.id === tempMessageId ? { ...msg, status: 'error' } : msg)),
          );
        };

        if (ack.success) {
          handleSuccess(ack);
        } else if (!ack.success) {
          if (ack.error === 'TokenExpired') {
            const newToken = await refreshToken();
            socket.auth = { access_token: newToken };
            socket.disconnect();
            socket.connect();

            socket.once('connect', () => {
              socket.emit('chat:message:new', payload, (retryAck: any) => {
                if (retryAck.success) {
                  handleSuccess(retryAck);
                } else {
                  handleError();
                }
              });
            });
          } else {
            handleError();
          }
        }
      });
    },
    [socket, chatRoom, me],
  );

  // 읽음 처리 송신
  const markMessageAsRead = useCallback(
    (messageId: number, messageCreatedAt: string) => {
      if (!socket || !chatRoom?.id || !messageId) return;

      socket.emit('chat:read:mark', {
        chatRoomId: chatRoom.id,
        lastReadMessageId: messageId,
        lastReadMessageCreatedAt: messageCreatedAt,
      });
    },
    [socket, chatRoom],
  );

  // 채팅방 조인
  useEffect(() => {
    if (!socket || !chatRoom) return;
    socket.emit('chat:room:join', { chatRoomId: chatRoom.id });
  }, [socket, chatRoom]);

  // 새 메시지 수신
  useEffect(() => {
    if (!socket || !me) return;

    const handleNewMessage = (payload: { newMessage: Message; tempMessageId?: string }) => {
      const { newMessage } = payload;

      if (newMessage.sender.id !== me.id) {
        setNewMessages((prev: ChatMessage[]) => [newMessage, ...prev]);
      }
    };

    socket.on('chat:room:message:new', handleNewMessage);

    return () => {
      socket.off('chat:room:message:new', handleNewMessage);
    };
  }, []);

  // 읽음 처리 수신
  useEffect(() => {
    if (!socket || !chatRoom) return;

    const handleReadUpdate = (receivedData: { lastReadMessage: Message; readBy: number }) => {
      const { lastReadMessage, readBy } = receivedData;

      setChatRoom((prevChatRoom: ChatRoom | null) => {
        if (!prevChatRoom) return prevChatRoom;

        const isMe = prevChatRoom.chatMembers.meMember?.user.id === readBy;

        const updatedMeMember = isMe
          ? { ...prevChatRoom.chatMembers.meMember, lastReadMessage }
          : prevChatRoom.chatMembers.meMember;

        const updatedOthers = prevChatRoom.chatMembers.otherMembers.map((member: ChatMember) => {
          if (member.user.id === readBy) {
            return {
              ...member,
              lastReadMessage,
            };
          }
          return member;
        });

        return {
          ...prevChatRoom,
          chatMembers: {
            ...prevChatRoom.chatMembers,
            meMember: updatedMeMember,
            otherMembers: updatedOthers,
          },
        };
      });
    };

    socket.on('chat:room:read:update', handleReadUpdate);

    return () => {
      socket.off('chat:room:read:update', handleReadUpdate);
    };
  }, [socket, chatRoom]);

  // 읽음 처리 송신

  return { sendMessage, markMessageAsRead };
}
