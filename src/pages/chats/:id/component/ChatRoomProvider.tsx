import { createContext, useContext, useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { useAuthSWR, useAuthSWRMutation } from 'hooks/authSWR';

import { ChatMember, ChatRoom } from 'types/chat.type';
import { removeMessages } from 'store/newMessageSlice';
import { SocketContext } from '@components/provider/SocketProvider';
import { fetcher, poster } from 'api';

interface ContextProps {
  chatRoom: ChatRoom | null;
  setChatRoom: React.Dispatch<React.SetStateAction<ChatRoom | null>>;
  [key: string]: any;
}

// 현재 채팅방 정보 및 채팅방 관련 상태 관리
export const ChatRoomContext = createContext<ContextProps>({
  chatRoom: null,
  setChatRoom: () => null,
});

// 1. 기존 채팅방 있음 (chatRoomId로 접근)
// 1. 기존 채팅방 없음 (opponentIds로 접근)
// 1. 기존 채팅방 있음 (opponentIds로 접근) => 기존 chatRoomId 찾아서 사용
// 1. 첫 메세지 보냄 => 새로운 chatRoomId 생성하고 업데이트
export default function ChatRoomProvider({ children, value }: any) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { socket } = useContext(SocketContext);
  const [chatRoom, setChatRoom] = useState<ChatRoom | null>(null);

  const { opponentIds, chatRoomId } = value;

  // chatRoomId로만 먼저 시도
  const { data: byId } = useAuthSWR(chatRoomId ? `/chats/${chatRoomId}` : null, fetcher);

  // chatRoomId가 없고 opponentIds가 있을때
  const { data: byUsers } = useAuthSWR(
    !chatRoomId && opponentIds.length > 0 ? `/chats/by-users?opponentIds=${opponentIds}` : null,
    fetcher,
  );

  // 채팅방 만들기
  const { trigger } = useAuthSWRMutation(opponentIds ? '/chats' : null, poster);

  const sendMessage = async (message: string) => {
    if (!socket || message.length === 0) return;

    // 채팅방이 없으면 만들어서 연결 후 보내기
    if (!chatRoom?.id && opponentIds.length > 0) {
      const newChatRoom = await trigger({ formData: { opponentIds } });

      socket.emit('chat:room:join', newChatRoom.id);
      socket.emit('chat:message:new', { chatRoomId: newChatRoom.id, opponentIds, message });

      navigate(`/chats/${newChatRoom.id}`);
    } else if (chatRoom?.id) {
      // 채팅방이 있으면 바로 보내기

      const otherIds = byId.chatMembers.others.map((member: ChatMember) => member.user.id);

      socket.emit('chat:message:new', { chatRoomId: chatRoom.id, opponentIds: otherIds, message });
    }
  };

  // 챗룸이 있으면 소켓 연결
  useEffect(() => {
    if (chatRoom?.id && socket) {
      socket.emit('chat:room:join', chatRoom.id.toString());
    }
  }, [chatRoom, socket]);

  // 챗룸 업데이트
  useEffect(() => {
    if (byId) {
      setChatRoom(byId);
      dispatch(removeMessages({ chatRoomId: byId.id }));
    } else if (byUsers) {
      // 유저 아이디로 들어왔을 때
      setChatRoom(byUsers);
      dispatch(removeMessages({ chatRoomId: byUsers.id, action: 'reset' }));
      navigate(`/chats/${byUsers.id}`, { replace: true });
    }
  }, [byId, byUsers]);

  return (
    <ChatRoomContext.Provider value={{ ...value, chatRoom, setChatRoom, sendMessage }}>
      {children}
    </ChatRoomContext.Provider>
  );
}
