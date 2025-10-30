import React, { useEffect, useRef } from 'react';

import dayjs from 'dayjs';
import { useInView } from 'framer-motion';
import styled, { css } from 'styled-components';
import { FaXmark } from 'react-icons/fa6';

import { ImageCentered, RoundedImageWrapper, Texts12h18, Texts14h21, Texts16h24 } from 'styles/commonStyle';
import {
  formatToLocaleAMPM,
  shouldShowDateDivider,
  shouldShowNickname,
  shouldShowSenderPhoto,
  shouldShowTime,
} from 'utils/date';
import { ChatMessage, Message, PendingMessage } from 'types/chat.type';
import { IoMdRefresh } from 'react-icons/io';
import { useChat } from '../contexts/ChatProvider';

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
  const showNickname = shouldShowNickname(message, previousMessage, nextMessage);

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
        <DateDivider>
          <Date>{dayjs(message.createdAt).format('MMMM D[일], YYYY')}</Date>
        </DateDivider>
      )}
      <Item $isMyMessage={isMyMessage}>
        {!isMyMessage && showSenderPhoto ? (
          <SenderPhoto>
            <ImageCentered src={message.sender?.photo ? message.sender.photo : '/imgs/DefaultUserProfile.jpg'} />
          </SenderPhoto>
        ) : !isMyMessage ? (
          <EmptySpace />
        ) : null}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%' }}>
          {showNickname && !isMyMessage && <Texts14h21>{message.sender?.nickname}</Texts14h21>}
          <MessageContent $isMyMessage={isMyMessage}>
            <Content $isMyMessage={isMyMessage}>{message.content}</Content>
            {showTime && <Texts12h18>{formatToLocaleAMPM(message.createdAt)}</Texts12h18>}
            {isPendingMessage(message)
              ? message.status === 'error' && (
                  <ErrorStatus>
                    <Button onClick={() => sendMessage(message.content, message?.tempId)}>
                      <ReSendMark />
                    </Button>
                    <Button onClick={deleteNewMessage}>
                      <XMark />
                    </Button>
                  </ErrorStatus>
                )
              : unreadCount > 0 && <ReadCount>{unreadCount}</ReadCount>}
          </MessageContent>
        </div>
      </Item>
    </li>
  );
});

const DateDivider = styled.div`
  display: flex;
  justify-content: center;
  padding: 24px;
`;

const Date = styled(Texts14h21)`
  border-radius: ${({ theme }) => theme.radius.normal};
  padding: 8px;
  background-color: ${({ theme }) => theme.background.box.default.active};
`;

const Item = styled.div<{ $isMyMessage: boolean }>`
  display: flex;
  gap: 8px;
  width: 100%;
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
  flex: 0 0 auto;
  width: 40px;
  height: 40px;
`;

const EmptySpace = styled.div`
  flex: 0 0 auto;
  width: 40px;
  height: 40px;
`;

const MessageContent = styled.div<{ $isMyMessage: boolean }>`
  flex: auto;
  display: flex;
  flex-direction: ${({ $isMyMessage }) => ($isMyMessage ? 'row-reverse' : 'row')};
  align-items: flex-end;
  gap: 8px;
`;

const Content = styled(Texts16h24)<{ $isMyMessage: boolean }>`
  display: inline-block;
  color: white;
  padding: 8px;
  border-radius: ${({ theme }) => theme.radius.normal};
  background-color: ${({ theme, $isMyMessage }) =>
    $isMyMessage ? theme.background.box.blue.primary : theme.background.box.blue.hover};
  max-width: 70%; // 최대 너비를 설정하여 상대방 영역 침범 방지
  word-wrap: break-word; // 긴 단어가 있을 경우 줄 바꿈 처리
`;

const ErrorStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  border-radius: ${({ theme }) => theme.radius.normal};
  padding: 4px;
  background-color: ${({ theme }) => theme.background.box.default.primary};
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ReSendMark = styled(IoMdRefresh)`
  color: ${({ theme }) => theme.text.highlight};
  ${({ theme }) => theme.fontSize.s18h27};
`;

const XMark = styled(FaXmark)`
  color: ${({ theme }) => theme.text.error};
  ${({ theme }) => theme.fontSize.s18h27};
`;

const ReadCount = styled(Texts12h18)`
  color: ${({ theme }) => theme.text.highlight};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
`;
