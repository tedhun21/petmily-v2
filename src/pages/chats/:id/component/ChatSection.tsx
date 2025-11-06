import styled from 'styled-components';

import { useForm } from 'react-hook-form';

import { IoMdArrowRoundUp } from 'react-icons/io';

import ChatHeader from './ChatHeader';
import ChatContainer from './ChatContainer';
import { useChat } from '../contexts/ChatProvider';
import { Button } from 'styles/common/Button';
import { Input } from 'styles/common/Input';
import { Row } from 'styles/commonStyle';

interface MessageFormValues {
  message: string;
}

export default function ChatSection() {
  const {
    socketValues: { sendMessage },
  } = useChat();

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
            <Input
              type="text"
              placeholder="메시지 보내기"
              autoComplete="off"
              {...register('message')}
              $variant="default"
              $size="lg"
              $borderRadius="lg"
              $fullWidth
            />

            <ChatSubmitButton type="submit">
              <IoMdArrowRoundUp size="32px" color="white" />
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

const Wrapper = styled(Row)`
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md};
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ChatSubmitButton = styled(Button).attrs(() => ({
  $variant: 'icon',
  $borderRadius: 'circle',
}))`
  background-color: ${({ theme }) => theme.colors.background.box.accent.primary};

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.background.box.accent.hover};
  }

  &:active:not(:disalbed) {
    background-color: ${({ theme }) => theme.colors.background.box.accent.active};
  }
`;
