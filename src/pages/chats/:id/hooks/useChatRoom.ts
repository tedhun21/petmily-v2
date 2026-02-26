import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { fetcher } from '@/api';
import { useAuthSWR } from '@/hooks/authSWR';
import type { ChatMember, ChatRoom, Message } from '@/types/chat.type';

interface IProps {
  chatRoomId: number | undefined;
  opponentIds: string[];
}

export interface UseChatRoomReturn {
  chatRoom?: ChatRoom;
  meMember?: ChatMember;
  otherMembers?: ChatMember[];
  updateMemberRead: (lastReadMessage: Message, readBy: number) => void;
}

export default function useChatRoom({ chatRoomId, opponentIds }: IProps) {
  const navigate = useNavigate();

  const getKey = chatRoomId
    ? `/chats/${chatRoomId}`
    : opponentIds.length > 0
      ? `/chats/by-users?${opponentIds.map((id) => `opponentIds=${id}`).join('&')}`
      : null;

  const { data: chatRoom, mutate } = useAuthSWR<ChatRoom>(getKey, fetcher);

  const meMember = chatRoom?.chatMembers.meMember;
  const otherMembers = chatRoom?.chatMembers.otherMembers;

  const updateMemberRead = useCallback(
    (lastReadMessage: Message, readBy: number) => {
      mutate(
        (prev) => {
          if (!prev) return prev;

          const { meMember, otherMembers } = prev.chatMembers;

          const isMe = meMember.user.id === readBy;

          return {
            ...prev,
            chatMembers: {
              ...prev.chatMembers,
              meMember: isMe ? { ...meMember, lastReadMessage } : meMember,
              otherMembers: isMe
                ? otherMembers
                : otherMembers.map((m) => (m.user.id === readBy ? { ...m, lastReadMessage } : m)),
            },
          };
        },
        { revalidate: false },
      );
    },
    [mutate],
  );

  useEffect(() => {
    if (!chatRoom) return;

    if (chatRoom.id !== Number(chatRoomId)) {
      navigate(`/chats/${chatRoom.id}`, { replace: true });
    }
  }, [chatRoom, chatRoomId, navigate]);

  return { chatRoom, meMember, otherMembers, updateMemberRead };
}
