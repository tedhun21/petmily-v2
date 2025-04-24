import { createContext, useEffect, useState } from 'react';
import { ChatRoom } from 'types/message.type';
import { fetcherWithCookie, updaterWithCookie } from 'api';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { removeMessages } from 'store/messageSlice';

const API_URL = process.env.REACT_APP_API_URL;

interface ContextProps {
  chatRoom: ChatRoom | null;
  setChatRoom: React.Dispatch<React.SetStateAction<ChatRoom | null>>;
  [key: string]: any;
}

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
  const [chatRoom, setChatRoom] = useState<ChatRoom | null>(null);

  const { opponentIds, chatRoomId } = value;

  // chatRoomId로만 먼저 시도
  const { data: byId } = useSWR(chatRoomId ? `${API_URL}/chats/${chatRoomId}` : null, fetcherWithCookie);

  // chatRoomId가 없고 opponentIds가 있을때
  const { data: byUsers } = useSWR(
    !chatRoomId && opponentIds.length > 0 ? `${API_URL}/chats/by-users?opponentIds=${opponentIds}` : null,
    fetcherWithCookie,
  );

  // unreadCount reset
  const { trigger } = useSWRMutation(`${API_URL}/chats/unread-counts?action=reset`, updaterWithCookie);

  // 1.챗룸 업데이트
  // 2. unreadCount 초기화 (서버 업데이트 + redux 업데이트)
  useEffect(() => {
    if (byId) {
      setChatRoom(byId);
      trigger({ formData: { chatRoomId: byId.id } });
      dispatch(removeMessages({ chatRoomId: byId.id }));
    } else if (byUsers) {
      // 유저 아이디로 들어왔을 때
      setChatRoom(byUsers);
      trigger({ formData: { chatRoomId: byUsers.id } });
      dispatch(removeMessages({ chatRoomId: byUsers.id }));
      navigate(`/chats/${byUsers.id}`, { replace: true });
    }
  }, [byId, byUsers]);

  return <ChatRoomContext.Provider value={{ ...value, chatRoom, setChatRoom }}>{children}</ChatRoomContext.Provider>;
}
