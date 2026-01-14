import dayjs from 'dayjs';
import { useInView } from 'react-intersection-observer';
import { FaXmark } from 'react-icons/fa6';

import { ImageCentered, RoundedImageWrapper } from '@/styles/commonStyle';
import {
  formatToLocaleAMPM,
  shouldShowDateDivider,
  shouldShowNickname,
  shouldShowSenderPhoto,
  shouldShowTime,
} from '@/utils/date';
import type { Message, PendingMessage } from '@/types/chat.type';
import { IoMdRefresh } from 'react-icons/io';

import Text from '@/components/styled/Text';
import Flex from '@/components/styled/Flex';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { Label } from '@/components/styled/Label';
import Box from '@/components/styled/Box';
import { IconButton } from '@/components/styled/IconButtonAndLink';
import { useChat } from '../contexts/ChatProvider';

interface IProps {
  message: Message | PendingMessage;
  isMyMessage: boolean;
  previousMessage?: Message | PendingMessage;
  nextMessage?: Message | PendingMessage;
  unreadCount: number;
}

export default function MessageItem({ message, isMyMessage, previousMessage, nextMessage, unreadCount }: IProps) {
  const { sendMessage, removePendingMessage, onMessageVisible } = useChat();

  // type narrowing (리턴값이 true일 때 msg는 PendingMessage 타입
  const isPendingMessage = (msg: Message | PendingMessage): msg is PendingMessage => {
    return 'status' in msg;
  };

  const { ref } = useInView({
    triggerOnce: true,
    onChange: (inView) => {
      if (inView && !isPendingMessage(message)) {
        onMessageVisible(message);
      }
    },
  });

  const showSenderPhoto = shouldShowSenderPhoto(message, previousMessage);
  const showTime = shouldShowTime(message, previousMessage, nextMessage);
  const showDateDivider = shouldShowDateDivider(message, previousMessage);
  const showNickname = shouldShowNickname(message, previousMessage);

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
                    <Box p="xs" bgColor="background.box.default.primary" br="md">
                      <Flex>
                        <IconButton onClick={() => sendMessage(message.content, message?.tempId)} size="xs">
                          <ReSendMark />
                        </IconButton>
                        <IconButton onClick={() => removePendingMessage(message.id)} size="xs">
                          <XMark />
                        </IconButton>
                      </Flex>
                    </Box>
                  )
                : isMyMessage &&
                  unreadCount > 0 && (
                    <Text size="xs" color="text.accent.default" weight="semibold">
                      {unreadCount}
                    </Text>
                  )}
            </MessageWrapper>
          </Flex>
        </Box>
      </Item>
    </li>
  );
}

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

const ReSendMark = styled(IoMdRefresh)`
  color: ${({ theme }) => theme.colors.text.accent};
`;

const XMark = styled(FaXmark)`
  color: ${({ theme }) => theme.colors.text.error};
`;
