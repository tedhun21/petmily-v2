import { useForm } from 'react-hook-form';
import styled from '@emotion/styled';
import { IoMdArrowRoundUp } from 'react-icons/io';

import ChatHeader from './ChatHeader';
import ChatContainer from './ChatContainer';
import { useChat } from '../contexts/ChatProvider';
import Button from '@/components/styled/Button';
import { Input } from '@/components/styled/Input';
import Box from '@/components/styled/Box';
import Flex from '@/components/styled/Flex';

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
          <Box p="md">
            <Flex alignItems="center" gap="sm">
              {/* TODO */}
              <Input
                as="input"
                type="text"
                placeholder="메시지 보내기"
                autoComplete="off"
                {...register('message')}
                inputSize="lg"
                variant="default"
                borderRadius="lg"
                fullWidth
              />

              <ChatSubmitButton type="submit" variant="icon" borderRadius="circle">
                <IoMdArrowRoundUp size="32px" color="white" />
              </ChatSubmitButton>
            </Flex>
          </Box>
        </form>
      </footer>
    </Section>
  );
}

const Section = styled.section`
  display: flex;
  flex-direction: column;
  height: 100vh;

  > header {
    flex-shrink: 0; /* 높이가 줄어들지 않도록 고정 */
  }

  > div {
    flex-grow: 1; /* 남은 공간을 모두 차지 */
    overflow-y: auto; /* 내용이 넘칠 경우 스크롤 생성 */
  }

  > footer {
    flex-shrink: 0;
  }
`;

// TODO
const ChatSubmitButton = styled(Button)`
  background-color: ${({ theme }) => theme.colors.background.box.accent.primary};

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.background.box.accent.hover};
  }

  &:active:not(:disalbed) {
    background-color: ${({ theme }) => theme.colors.background.box.accent.active};
  }
`;
