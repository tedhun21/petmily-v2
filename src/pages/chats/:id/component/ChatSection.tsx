import { useContext } from 'react';
import styled from 'styled-components';

import { useForm } from 'react-hook-form';
import useSWRMutation from 'swr/mutation';

import { IoMdArrowRoundUp } from 'react-icons/io';

import { BlueButton, Input } from 'styles/commonStyle';
import { posterWithCookie } from 'api';
import { ChatRoomContext } from './ChatRoomProvider';
import ChatContainer from './ChatContainer';
import { SocketContext } from '@components/SocketProvider';
import { useNavigate } from 'react-router-dom';
import { API_URL } from 'config';

interface MessageFormValues {
  message: string;
}

export default function ChatSection() {
  const navigate = useNavigate();
  const { socket } = useContext(SocketContext);
  const { opponentIds, chatRoom, setChatRoom } = useContext(ChatRoomContext);

  const { register, setValue, handleSubmit } = useForm<MessageFormValues>();

  // 채팅방 만들기
  const { trigger } = useSWRMutation(opponentIds ? `${API_URL}/chats` : null, posterWithCookie);

  // 채팅방이 없을 때는 메세지를 입력하면 채팅방 만들기
  const onSubmit = async (data: MessageFormValues) => {
    const { message } = data;

    if (!socket || message.length === 0) return;

    // 채팅방에서 첫 메세지 (챗룸이 없는 상태)
    if (!chatRoom?.id && opponentIds.length > 0) {
      const newChatRoom = await trigger({ formData: { opponentIds } });
      if (newChatRoom) {
        socket.emit('chat:room:join', newChatRoom.id.toString());
        socket.emit('chat:message:new', { chatRoomId: newChatRoom.id, message, opponentIds });

        setChatRoom(newChatRoom);

        navigate(`/chats/${newChatRoom.id}`, { replace: true });
      }
    } else if (chatRoom?.id && chatRoom.chatMembers?.others?.length > 0) {
      // 이미 chatRoom 있을 때
      const otherIds = chatRoom.chatMembers?.others?.map((other) => other.user.id);
      if (otherIds && otherIds.length > 0) {
        socket.emit('chat:message:new', { chatRoomId: chatRoom.id, message, opponentIds: otherIds });
      }
    }
    setValue('message', '');
  };

  return (
    <Section>
      <ChatContainer />
      <Footer>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Wrapper>
            <ChatInput type="text" placeholder="메시지 보내기" {...register('message')} />
            <ChatSubmitButton type="submit">
              <IoMdArrowRoundUp size="28px" color="white" />
            </ChatSubmitButton>
          </Wrapper>
        </form>
      </Footer>
    </Section>
  );
}

const Section = styled.section`
  display: flex;
  flex-direction: column;
  overflow: hidden;

  > footer {
    flex: 0 0 auto;
  }
`;

const Footer = styled.footer`
  flex: 0 0 auto;
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 12px;
  gap: 8px;
`;

const ChatInput = styled(Input)`
  flex: auto;
  border-radius: ${({ theme }) => theme.radius.large};
  padding: 8px 12px;
  ${({ theme }) => theme.fontSize.s18h27};
`;

const ChatSubmitButton = styled(BlueButton)`
  border-radius: ${({ theme }) => theme.radius.circle};
  padding: 6px;
`;
