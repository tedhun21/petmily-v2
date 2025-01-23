import dayjs from 'dayjs';
import styled, { css } from 'styled-components';

import { Message } from 'types/message.type';
import { ImageCentered, RoundedImageWrapper, Texts12h18, Texts14h21, Texts16h24 } from 'styles/commonStyle';
import { formatToLocaleAMPM, shouldShowDateDivider, shouldShowSenderPhoto, shouldShowTime } from 'utils/date';
import { useEffect, useRef, SetStateAction } from 'react';
import { useInView } from 'framer-motion';

interface IProps {
  index: number;
  message: Message;

  isMyMessage: boolean;
  previousMessage?: Message;
  nextMessage?: Message;
  setSize: React.Dispatch<SetStateAction<number>>;
}

export default function ChatMessage({ index, message, isMyMessage, previousMessage, nextMessage, setSize }: IProps) {
  const viewRefIndex = 2;
  const ref = useRef<HTMLLIElement>(null);
  const isInView = useInView(ref, { once: true });

  const showSenderPhoto = shouldShowSenderPhoto(message, previousMessage);
  const showTime = shouldShowTime(message, previousMessage, nextMessage);
  const showDateDivider = shouldShowDateDivider(message, previousMessage);

  const focusRef = index === viewRefIndex ? ref : null;

  useEffect(() => {
    if (isInView) {
      setSize((prev: number) => prev + 1);
    }
  }, [isInView]);

  return (
    <li ref={focusRef}>
      {showDateDivider && (
        <DateDivider>
          <Date>{dayjs(message.createdAt).format('MMMM D[일], YYYY')}</Date>
        </DateDivider>
      )}
      <MessageItem $isMyMessage={isMyMessage}>
        {!isMyMessage && showSenderPhoto ? (
          <SenderPhoto>
            <ImageCentered src={message.sender?.photo ? message.sender.photo : '/imgs/DefaultUserProfile.jpg'} />
          </SenderPhoto>
        ) : !isMyMessage ? (
          <EmptySpace />
        ) : null}
        <MessageContent $isMyMessage={isMyMessage}>
          <Content $isMyMessage={isMyMessage}>{message.content}</Content>
          {showTime && <SendTime>{formatToLocaleAMPM(message.createdAt)}</SendTime>}
        </MessageContent>
      </MessageItem>
    </li>
  );
}

const DateDivider = styled.div`
  display: flex;
  justify-content: center;
  padding: 8px;
`;

const Date = styled(Texts14h21)`
  border-radius: ${({ theme }) => theme.radius.normal};
  padding: 8px;
  background-color: ${({ theme }) => theme.background.box.default.active};
`;

const MessageItem = styled.div<{ $isMyMessage: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
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
  width: 40px;
  height: 40px;
`;

const EmptySpace = styled.div`
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
  color: white;
  padding: 8px;
  border-radius: ${({ theme }) => theme.radius.normal};
  background-color: ${({ theme, $isMyMessage }) =>
    $isMyMessage ? theme.background.box.blue.primary : theme.background.box.blue.hover};
  max-width: 70%; // 최대 너비를 설정하여 상대방 영역 침범 방지
  word-wrap: break-word; // 긴 단어가 있을 경우 줄 바꿈 처리
`;

const SendTime = styled(Texts12h18)``;
