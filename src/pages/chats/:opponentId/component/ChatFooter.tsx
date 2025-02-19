import { useContext } from 'react';

import useSWRMutation from 'swr/mutation';

import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';

import { IoMdArrowRoundUp } from 'react-icons/io';

import { posterWithCookie } from 'api';
import { ChatContext } from './ChatProvider';
import { BlueButton, Input } from 'styles/commonStyle';

const API_URL = process.env.REACT_APP_API_URL;

export default function ChatFooter() {
  const { socket, chatRoom, setChatRoom, opponentId } = useContext(ChatContext);

  const { register, handleSubmit, setValue } = useForm();

  // 채팅방 만들기
  const { trigger } = useSWRMutation(`${API_URL}/chats`, posterWithCookie);

  const onSubmit = async (data: any) => {
    const { message } = data;
    if (!socket || !message.trim()) return;

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
  return (
    <footer>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Div>
          <ChatInput type="text" placeholder="메세지 보내기" {...register('message')} />
          <ChatSubmitButton type="submit">
            <IoMdArrowRoundUp size="32px" color="white" />
          </ChatSubmitButton>
        </Div>
      </form>
    </footer>
  );
}

const Div = styled.div`
  display: flex;
  padding: 8px;
  gap: 8px;
`;

const ChatInput = styled(Input)`
  flex: auto;
  border-radius: 24px;
  padding: 8px 12px;
  ${({ theme }) => theme.fontSize.s18h27};
`;

const ChatSubmitButton = styled(BlueButton)`
  border-radius: ${({ theme }) => theme.radius.circle};
  padding: 6px;
`;
