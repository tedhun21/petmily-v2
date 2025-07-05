import { useContext } from 'react';
import styled from 'styled-components';

import { useForm } from 'react-hook-form';

import { IoMdArrowRoundUp } from 'react-icons/io';

import { BlueButton, Input } from 'styles/commonStyle';
import { ChatRoomContext } from './ChatRoomProvider';
import ChatContainer from './ChatContainer';
import ChatHeader from './ChatHeader';

interface MessageFormValues {
  message: string;
}

export default function ChatSection() {
  const { sendMessage } = useContext(ChatRoomContext);

  const { register, setValue, handleSubmit } = useForm<MessageFormValues>();

  // 채팅방이 없을 때는 메세지를 입력하면 채팅방 만들기
  const onSubmit = async (data: MessageFormValues) => {
    const { message } = data;

    sendMessage(message);

    setValue('message', '');
  };

  return (
    <Section>
      <ChatHeader />

      <ChatContainer />

      <footer>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Wrapper>
            <ChatInput type="text" placeholder="메시지 보내기" autoComplete="off" {...register('message')} />
            <ChatSubmitButton type="submit">
              <IoMdArrowRoundUp size="28px" color="white" />
            </ChatSubmitButton>
          </Wrapper>
        </form>
      </footer>
    </Section>
  );
}

const Section = styled.section`
  display: flex;
  flex-direction: column;
  height: 100%;

  > header {
    flex: 0 0 auto;
  }

  > div {
    flex: 1 1 auto;
  }

  > footer {
    flex: 0 0 auto;
  }
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
