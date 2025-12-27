import React, { useEffect, useRef } from 'react';

import dayjs from 'dayjs';
import { useInView } from 'framer-motion';
import { FaXmark } from 'react-icons/fa6';

import { ImageCentered, RoundedImageWrapper } from '@/styles/commonStyle';
import {
  formatToLocaleAMPM,
  shouldShowDateDivider,
  shouldShowNickname,
  shouldShowSenderPhoto,
  shouldShowTime,
} from '@/utils/date';
import type { ChatMessage, Message, PendingMessage } from '@/types/chat.type';
import { IoMdRefresh } from 'react-icons/io';
import { useChat } from '../contexts/ChatProvider';
import Button from '@/components/styled/Button';
import Text from '@/components/styled/Text';
import Flex from '@/components/styled/Flex';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { Label } from '@/components/styled/Label';
import Box from '@/components/styled/Box';

interface IProps {
  message: ChatMessage;
  isMyMessage: boolean;
  previousMessage?: ChatMessage;
  nextMessage?: ChatMessage;
  unreadCount: number;
}

export default React.memo(function MessageItem({
  message,
  isMyMessage,
  previousMessage,
  nextMessage,
  unreadCount,
}: IProps) {
  const {
    messageValues: { setNewMessages },
    socketValues: { sendMessage },
    readStatus: { onMessageVisible },
  } = useChat();
  const ref = useRef<HTMLLIElement>(null);
  const isInView = useInView(ref, { once: true });

  const showSenderPhoto = shouldShowSenderPhoto(message, previousMessage);
  const showTime = shouldShowTime(message, previousMessage, nextMessage);
  const showDateDivider = shouldShowDateDivider(message, previousMessage);
  const showNickname = shouldShowNickname(message, previousMessage);

  // type narrowing (리턴값이 true일 때 msg는 PendingMessage 타입
  const isPendingMessage = (msg: ChatMessage): msg is PendingMessage => {
    return 'status' in msg;
  };

  const deleteNewMessage = () => {
    setNewMessages((prev) => prev.filter((msg) => msg.id !== message.id));
  };

  useEffect(() => {
    if (isInView && !('status' in message)) {
      onMessageVisible(message as Message);
    }
  }, [isInView]);

  return (
    <li ref={ref}>
      {showDateDivider && (
        <Flex justifyContent="center" alignItems="center">
          <Label size="sm" color="grey">
            {dayjs(message.createdAt).format('MMMM D[일], YYYY')}
          </Label>
        </Flex>
      )}
      <Item $isMyMessage={isMyMessage}>
        {!isMyMessage && showSenderPhoto ? (
          <SenderPhoto>
            <ImageCentered src={message.sender?.photo ? message.sender.photo : '/imgs/DefaultUserProfile.jpg'} />
          </SenderPhoto>
        ) : !isMyMessage ? (
          <EmptySpace />
        ) : null}
        <Box w="50%">
          <Flex direction="column" gap="xs">
            {showNickname && !isMyMessage && <Text size="sm">{message.sender?.nickname}</Text>}
            <MessageWrapper $isMyMessage={isMyMessage}>
              <Bubble $isMyMessage={isMyMessage}>
                <span>{message.content}</span>
              </Bubble>
              {showTime && <Text size="xs">{formatToLocaleAMPM(message.createdAt)}</Text>}
              {isPendingMessage(message)
                ? message.status === 'error' && (
                    <ErrorStatus>
                      <Button
                        onClick={() => sendMessage(message.content, message?.tempId)}
                        variant="icon"
                        size="sm"
                        borderRadius="circle"
                      >
                        <ReSendMark />
                      </Button>
                      <Button onClick={deleteNewMessage} variant="icon" size="sm" borderRadius="circle">
                        <XMark />
                      </Button>
                    </ErrorStatus>
                  )
                : unreadCount > 0 && (
                    <Text size="xs" color="highlight" weight="semibold">
                      {unreadCount}
                    </Text>
                  )}
            </MessageWrapper>
          </Flex>
        </Box>
      </Item>
    </li>
  );
});

const Item = styled.div<{ $isMyMessage: boolean }>`
  display: flex;
  gap: ${({ theme }) => theme.space.sm};
  ${({ $isMyMessage }) =>
    $isMyMessage
      ? css`
          flex-direction: row-reverse;
          align-self: flex-end;
        `
      : css`
          flex-direction: row;
          align-self: flex-start;
        `}
`;

const SenderPhoto = styled(RoundedImageWrapper)`
  flex-shrink: 0;
  width: 52px;
  height: 52px;
`;

const EmptySpace = styled.div`
  flex-shrink: 0;
  width: 52px;
  height: 52px;
`;

const MessageWrapper = styled.div<{ $isMyMessage: boolean }>`
  display: flex;
  flex-grow: 1;
  flex-direction: ${({ $isMyMessage }) => ($isMyMessage ? 'row-reverse' : 'row')};
  align-items: flex-end;
  gap: ${({ theme }) => theme.space.sm};
`;

const Bubble = styled.div<{ $isMyMessage: boolean }>`
  padding: ${({ theme }) => theme.space.md};
  background-color: ${({ theme, $isMyMessage }) =>
    $isMyMessage ? theme.colors.background.box.accent.primary : theme.colors.background.box.accent.hover};
  border-radius: ${({ theme }) => theme.radius.md}; /* 기존 라운드 값 유지 */
  position: relative;
  max-width: 100%;

  > span {
    color: white;
    word-wrap: break-word;
  }
`;

// TODO
const ErrorStatus = styled.div`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => theme.space.xs};
  background-color: ${({ theme }) => theme.colors.background.box.default.primary};
  border-radius: ${({ theme }) => theme.radius.md};
`;

const ReSendMark = styled(IoMdRefresh)`
  color: ${({ theme }) => theme.colors.text.accent};
`;

const XMark = styled(FaXmark)`
  color: ${({ theme }) => theme.colors.text.error};
`;
