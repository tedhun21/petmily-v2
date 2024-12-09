import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { io } from 'socket.io-client';

import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite';
import useSWRMutation from 'swr/mutation';

import styled from 'styled-components';
import { toast } from 'react-toastify';

import { ChatRoom } from 'types/chat.type';
import { fetcherWithCookie, infiniteFetcherWithCookie, posterWithCookie } from 'api';

import { getCookie } from 'utils/cookie';
import { Texts20h30 } from 'commonStyle';
import MessageList from './component/MessageList';

import { FaArrowLeft } from 'react-icons/fa6';
import { FiMenu } from 'react-icons/fi';
import { useForm } from 'react-hook-form';

const API_URL = process.env.REACT_APP_API_URL;
const SOCKET_URL = process.env.REACT_APP_WEBSOCKET_URL;

export default function Chat() {
  // Ensure opponentId is a string and handle undefined case
  const { opponentId } = useParams<{ opponentId: string | undefined }>();
  const navigate = useNavigate();
  const [socket, setSocket] = useState<any>(null);

  const { register, handleSubmit, setValue } = useForm();

  const [chatRoom, setChatRoom] = useState<ChatRoom | null>(null);
  const [allMessages, setAllMessages] = useState<any[]>([]);

  const [pagination, setPagination] = useState({ total: 0, totalPages: 0 });

  // 기존의 채팅방 정보 가져오기
  const { data: fetchedChatRoom } = useSWR<ChatRoom>(`${API_URL}/chats?opponentId=${opponentId}`, fetcherWithCookie);

  // 채팅방 만들기
  const { trigger } = useSWRMutation(`${API_URL}/chats`, posterWithCookie);

  const pageSize = 50;

  const getKey = (pageIndex: number, previousPageData: any) => {
    if (previousPageData && !previousPageData.length) return null;
    return chatRoom
      ? `${API_URL}/chats/${chatRoom.id}/messages?opponentId=${opponentId}&page=${pageIndex + 1}&pageSize=${pageSize}`
      : null;
  };

  // 채팅방의 메세지 가져오기
  const { data: messagesData } = useSWRInfinite(getKey, infiniteFetcherWithCookie);

  const onSubmit = async (data: any) => {
    const { message } = data;
    if (!message.trim()) return;

    try {
      if (!chatRoom) {
        // Create a new chat room if it doesn't exist
        const newChatRoom = await trigger({ formData: { opponentId } });
        setChatRoom(newChatRoom);
        socket.emit('send', { chatRoomId: newChatRoom.id, opponentId, message });
      } else {
        // Send message to existing chat room
        socket.emit('send', { chatRoomId: chatRoom.id, opponentId, message });
      }
      setValue('message', '');
    } catch (error) {
      toast.error('Failed to send message or create chat room');
    }
  };

  useEffect(() => {
    if (fetchedChatRoom) {
      setChatRoom(fetchedChatRoom);
    }
  }, [fetchedChatRoom]);

  useEffect(() => {
    if (messagesData) {
      const flattenedMessages = messagesData.flatMap((page) => page.results);
      setAllMessages((prevMessages: any) => [...flattenedMessages, ...prevMessages]);
      setPagination({ total: messagesData[0].pagination.total, totalPages: messagesData[0].pagination.totalPages });
    }
  }, [messagesData]);

  // 1. socket 만들어서 설정
  // 2. 서버에서 듣고 있는 joinRoom으로 보낸다
  // 3. 서버에서 .join으로 채팅방 id를 설정 (socket에 채팅방 특정)
  // 4. 프론트에서 input을 send로 보냄
  // 5. send에서 듣고 있던 서버에서 메세지 저장하고 .to(chatRoomId) 으로 특정한 채팅방으로 메세지를 보냄
  // 6. 프론트에서 receive를 듣고 있다가 메세지에 추가
  useEffect(() => {
    const token = getCookie('access_token');
    if (chatRoom && token) {
      const socketConnection = io(`${SOCKET_URL}`, {
        auth: { token },
      });

      socketConnection.on('connect', () => {
        socketConnection.emit('joinRoom', chatRoom.id.toString());
      });

      socketConnection.on('error', (error) => {
        console.error('Socket error:', error);
      });

      socketConnection.on('receive', (newMessage) => {
        setAllMessages((prevMessages: any) => [...prevMessages, newMessage]);
      });

      // 소켓 연결 상태를 업데이트
      setSocket(socketConnection);

      return () => {
        socketConnection.off('receive');
        socketConnection.disconnect();
      };
    }
  }, [chatRoom]);

  return (
    <MainContainer>
      <ChatHeader>
        <StyledBackButton onClick={() => navigate(-1)}>
          <FaArrowLeft color="#279EFF" size="24px" />
        </StyledBackButton>
        <Texts20h30>
          {chatRoom?.client.id === Number(opponentId) ? chatRoom?.petsitter?.nickname : chatRoom?.client?.nickname} 님
        </Texts20h30>
        <button>
          <FiMenu size="24px" color="#279EFF" />
        </button>
      </ChatHeader>

      <MessageList allMessages={allMessages} pagination={pagination} opponentId={opponentId} />

      <ChatFooterForm onSubmit={handleSubmit(onSubmit)}>
        <ChatInput type="text" placeholder="Send a message" {...register('message')} />
        <ChatSubmitButton type="submit">Send</ChatSubmitButton>
      </ChatFooterForm>
    </MainContainer>
  );
}

const MainContainer = styled.main`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const ChatHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 20px;
`;

const StyledBackButton = styled.button`
  z-index: 2;
  border: none;
  background-color: transparent;
  cursor: pointer;
`;

const ChatFooterForm = styled.form`
  display: flex;
  padding: 16px;
  gap: 16px;
`;

const ChatInput = styled.input`
  flex: auto;
  border-radius: 24px;
  padding: 8px 12px;
  border: 2px solid ${({ theme }) => theme.line.input.blue};
  ${({ theme }) => theme.fontSize.s18h27};
`;

const ChatSubmitButton = styled.button``;
