import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { fetcher } from '@/api';
import { useAuthSWR } from '@/hooks/authSWR';
import { makeOpponentQuery } from '@/utils/misc';
import type { ChatMember, ChatRoom } from '@/types/chat.type';

interface IProps {
  chatRoomId?: string | null;
  opponentIds?: string[] | null;
}

export interface UseChatRoomReturn {
  chatRoom: ChatRoom;
  meMember: ChatMember;
  otherMembers: ChatMember[];
  updateMemberRead: (payload: {
    lastReadMessage: { id: number; chatRoom: { id: number }; createdAt: string };
    readBy: number;
  }) => void;
}

export default function useChatRoom({ chatRoomId, opponentIds }: IProps): UseChatRoomReturn {
  const navigate = useNavigate();

  const { data: chatRoom, mutate } = useAuthSWR(
    chatRoomId
      ? `/chats/${chatRoomId}`
      : opponentIds?.length
        ? `/chats/by-users?${makeOpponentQuery(opponentIds)}`
        : null,
    fetcher,
  );

  const meMember: ChatMember = chatRoom?.chatMembers.meMember;
  const otherMembers: ChatMember[] = chatRoom?.chatMembers.otherMembers;

  const updateMemberRead = useCallback(
    ({
      lastReadMessage,
      readBy,
    }: {
      lastReadMessage: { id: number; chatRoom: { id: number }; createdAt: string };
      readBy: number;
    }) => {
      mutate(
        (prevChatRoom: ChatRoom | undefined) => {
          if (!prevChatRoom) return prevChatRoom;

          // Check if the update is for the current user (me)
          if (prevChatRoom.chatMembers.meMember.user.id === readBy) {
            const updatedMe = {
              ...prevChatRoom.chatMembers.meMember,
              lastReadMessage,
            };
            return {
              ...prevChatRoom,
              chatMembers: {
                ...prevChatRoom.chatMembers,
                meMember: updatedMe,
              },
            };
          }

          // If not for me, check other members
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
              otherMembers: updatedOthers,
            },
          };
        },
        { revalidate: false },
      );
    },
    [mutate],
  );

  useEffect(() => {
    if (chatRoom?.id && chatRoomId !== chatRoom.id) {
      navigate(`/chats/${chatRoom.id}`, { replace: true });
    }
  }, [chatRoom?.id, navigate]);

  return { chatRoom, meMember, otherMembers, updateMemberRead };
}
