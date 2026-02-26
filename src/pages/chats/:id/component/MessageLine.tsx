import dayjs from 'dayjs';
import { useInView } from 'react-intersection-observer';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { FaXmark } from 'react-icons/fa6';
import { IoMdRefresh } from 'react-icons/io';

import { ImageCentered, RoundedImageWrapper } from '@/styles/commonStyle';
import {
  formatToLocaleAMPM,
  shouldShowDateDivider,
  shouldShowNickname,
  shouldShowSenderPhoto,
  shouldShowTime,
} from '@/utils/date';

import Text from '@/components/styled/Text';
import Flex from '@/components/styled/Flex';
import { Label } from '@/components/styled/Label';
import Box from '@/components/styled/Box';
import { IconButton } from '@/components/styled/IconButtonAndLink';
import type { Message, PendingMessage } from '@/types/chat.type';
import { useChatActionsContext } from '../context/ChatProvider';

interface IProps {
  message: Message | PendingMessage;
  isMine: boolean;
  isPending: boolean;
  previousMessage?: Message | PendingMessage;
  nextMessage?: Message | PendingMessage;
  unreadCount: number;
}

export default function MessageLine({ message, isMine, isPending, previousMessage, nextMessage, unreadCount }: IProps) {
  const { sendMessage, removePendingMessage, onMessageVisible } = useChatActionsContext();

  const { ref } = useInView({
    triggerOnce: true,
    onChange: (inView) => {
      if (inView && !isPending) {
        const sent = message as Message;
        onMessageVisible(sent.id, sent.createdAt);
      }
    },
  });

  const showSenderPhoto = shouldShowSenderPhoto(message, previousMessage);
  const showTime = shouldShowTime(message, previousMessage, nextMessage);
  const showDateDivider = shouldShowDateDivider(message, previousMessage);
  const showNickname = shouldShowNickname(message, previousMessage);

  // status가 'error'인 경우 재전송
  const handleMessageSend = () => {
    if (isPending) {
      const pending = message as PendingMessage;
      sendMessage(pending.content, pending.tempId);
    }
  };

  // status가 'error'인 임시 메시지 삭제
  const handlePendingMessageRemove = () => {
    if (isPending) {
      const pending = message as PendingMessage;
      removePendingMessage(pending.tempId);
    }
  };

  return (
    <li ref={ref}>
      {/* 날짜 구분선 */}
      {showDateDivider && (
        <Box p="lg">
          <Flex justifyContent="center" alignItems="center">
            <Label size="sm" color="grey">
              {dayjs(message.createdAt).format('MMMM D[일], YYYY')}
            </Label>
          </Flex>
        </Box>
      )}

      <Item $isMine={isMine}>
        {!isMine && showSenderPhoto ? (
          <SenderPhoto>
            <ImageCentered src={message.sender?.photo ? message.sender.photo : '/imgs/DefaultUserProfile.jpg'} />
          </SenderPhoto>
        ) : !isMine ? (
          <EmptySpace />
        ) : null}
        <Box w="50%">
          <Flex direction="column" gap="xs">
            {showNickname && !isMine && <Text size="sm">{message.sender?.nickname}</Text>}
            <MessageWrapper $isMine={isMine}>
              <Bubble $isMine={isMine}>
                <span>{message.content}</span>
              </Bubble>

              {showTime && <Text size="xs">{formatToLocaleAMPM(message.createdAt)}</Text>}

              {/* 에러 상태인 경우 재전송/삭제 UI 표시 */}
              {isPending && (message as PendingMessage).status === 'error' && (
                <Box p="xs" bgColor="background.box.default.primary" br="md">
                  <Flex>
                    <IconButton onClick={handleMessageSend} size="xs">
                      <ReSendMark size="16px" />
                    </IconButton>
                    <IconButton onClick={handlePendingMessageRemove} size="xs">
                      <XMark size="16px" />
                    </IconButton>
                  </Flex>
                </Box>
              )}

              {/* 내 메시지이고 읽지 않은 사람이 있을 때 (sent 상태에서만 표시) */}
              {!isPending && isMine && unreadCount > 0 && (
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

const Item = styled.div<{ $isMine: boolean }>`
  display: flex;
  gap: ${({ theme }) => theme.space.sm};
  ${({ $isMine }) =>
    $isMine
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
`;

const MessageWrapper = styled.div<{ $isMine: boolean }>`
  display: flex;
  flex-grow: 1;
  flex-direction: ${({ $isMine }) => ($isMine ? 'row-reverse' : 'row')};
  align-items: flex-end;
  gap: ${({ theme }) => theme.space.sm};
`;

const Bubble = styled.div<{ $isMine: boolean }>`
  padding: ${({ theme }) => theme.space.md};
  background-color: ${({ theme, $isMine }) =>
    $isMine ? theme.colors.background.box.accent.primary : theme.colors.background.box.accent.hover};
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
