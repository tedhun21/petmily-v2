import { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { fetcher } from 'api';
import { useAuthSWR } from 'hooks/authSWR';
import { makeOpponentQuery } from 'utils/misc';
import { ChatMember, ChatRoom } from 'types/chat.type';
import { removeMessagesByChatRoom } from 'store/newMessageSlice';
import { User } from 'types/user.type';

interface UseChatRoomOptions {
  opponentIds?: string[] | null;
  chatRoomId?: string | null;
  me: User;
}

export type UseChatRoomReturn = {
  chatRoom: ChatRoom | null;
  setChatRoom: React.Dispatch<React.SetStateAction<ChatRoom | null>>;
  meMember: ChatMember | undefined;
  otherMembers: ChatMember[] | undefined;
};

// 채팅방 가져오기
export default function useChatRoom({ opponentIds, chatRoomId, me }: UseChatRoomOptions): UseChatRoomReturn {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [chatRoom, setChatRoom] = useState<ChatRoom | null>(null);

  const meMember: ChatMember | undefined = chatRoom?.chatMembers.meMember ?? undefined;
  const otherMembers: ChatMember[] | undefined = chatRoom?.chatMembers.otherMembers ?? undefined;

  // 채팅방 데이터 페칭
  // 기존 채팅방 ID로 조회
  const { data: byId } = useAuthSWR(chatRoomId ? `/chats/${chatRoomId}` : null, fetcher);

  // opponentIds 기반으로 조회 (chatRoomId 없을 경우)
  const { data: byUsers } = useAuthSWR(
    !chatRoomId && (opponentIds?.length ?? 0) > 0 ? `/chats/by-users?${makeOpponentQuery(opponentIds ?? [])}` : null,
    fetcher,
  );

  // 채팅방 데이터 세팅 (기존 방 or opponent 기반 조회 결과)
  useEffect(() => {
    // 1 . chatRoomId로 채팅방을 찾은 경우
    if (byId) {
      setChatRoom(byId);
      return;
    }

    // 2. opponentIds로 채팅방을 찾은 경우
    if (byUsers) {
      navigate(`/chats/${byUsers.id}`, { replace: true });

      setChatRoom(byUsers);
    }

    if (me && !chatRoomId && opponentIds && opponentIds.length > 0) {
      const tempChatRoom: ChatRoom = {
        id: -1,
        lastMessage: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        chatMembers: {
          meMember: {
            id: -1,
            unreadCount: 0,
            lastReadMessage: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            user: {
              id: me.id,
              role: me.role,
              nickname: me.nickname,
              photo: me.photo,
            },
          },
          otherMembers: [],
        },
      };

      setChatRoom(tempChatRoom);
    }
  }, [byId, byUsers]);

  // 컴포넌트 언마운트 또는 채팅방 변경 시 새 메시지 초기화
  // 채팅방을 나가거나 다른 채팅방으로 이동할 때, 이전 채팅방의 새 메시지를 Redux store에서 정리
  useEffect(() => {
    return () => {
      if (chatRoom?.id) {
        dispatch(removeMessagesByChatRoom(chatRoom.id));
      }
    };
  }, [chatRoom?.id]);

  return { chatRoom, setChatRoom, meMember, otherMembers };
}
