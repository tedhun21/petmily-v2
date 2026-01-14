import { useForm } from 'react-hook-form';
import { IoMdArrowRoundUp } from 'react-icons/io';
import Box from '@/components/styled/Box';
import Flex from '@/components/styled/Flex';
import { IconButton } from '@/components/styled/IconButtonAndLink';
import styled from '@emotion/styled';
import { useRef, useEffect, useCallback } from 'react';
import { colors } from '@/styles/colors';
import { useChat } from '../contexts/ChatProvider';

export default function MessageInput() {
  const { register, setValue, handleSubmit, watch } = useForm<{ message: string }>();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);
  const { sendMessage } = useChat();

  const { ref: rhfRef, ...rest } = register('message');

  const message = watch('message');

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (formRef.current && e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      formRef.current.requestSubmit();
    }
  }, []);

  const onSubmit = (data: { message: string }) => {
    const trimmed = data.message.trim();
    if (trimmed.length === 0) return;
    setValue('message', '');

    sendMessage(trimmed);
  };

  // 높이를 조절하는 로직
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // 높이를 초기화
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // scrollHeight를 바탕으로 높이 재설정
    }
  }, [message]);

  return (
    <footer>
      <form ref={formRef} onSubmit={handleSubmit(onSubmit)}>
        <Box p="md" bgColor="background.box.default.primary">
          <Flex alignItems="flex-end" gap="sm">
            <TextArea
              rows={1}
              placeholder="메시지 보내기"
              {...rest}
              ref={(e) => {
                rhfRef(e);
                textareaRef.current = e;
              }}
              onKeyDown={handleKeyDown}
            />

            <IconButton type="submit" variant="fill" size="sm" bgColor={colors.blue400} shape="circle">
              <IoMdArrowRoundUp size="24px" color="white" />
            </IconButton>
          </Flex>
        </Box>
      </form>
    </footer>
  );
}

const TextArea = styled.textarea`
  width: 100%;
  resize: none;
  color: inherit;
  outline: none;
  background-color: ${({ theme }) => theme.colors.background.layer0};
  border: 2px solid ${({ theme }) => theme.colors.line.input.primary};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: ${({ theme }) => `${theme.space.sm} ${theme.space.lg}`};
  ${({ theme }) => theme.typeScale.lg};

  /* 높이 조절을 위한 필수 스타일 */
  box-sizing: border-box;
  overflow-y: hidden;

  &::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none; /* Firefox */
`;
