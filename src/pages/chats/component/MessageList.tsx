import { useEffect, useRef } from 'react';
import styled, { css } from 'styled-components';
import { motion } from 'framer-motion';
import { ImageCentered, RoundedImageWrapper, Texts12h18, Texts14h21, Texts16h24 } from 'styles/commonStyle';
import { Message } from 'types/chat.type';
import { formatToLocaleAMPM } from 'utils/date';
import { shouldShowDateDivider, shouldShowSenderPhoto, shouldShowTime } from 'utils/date';
import dayjs from 'dayjs';

export default function MessageList({
  allMessages,
  pagination,
  opponentId,
}: {
  allMessages?: Message[];
  pagination: { total: number; totalPages: number };
  opponentId: string | undefined;
}) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [allMessages]);

  return (
    <List>
      {allMessages &&
        Array.isArray(allMessages) &&
        allMessages.length > 0 &&
        allMessages.map((message: Message, index: number) => {
          const isMyMessage = message.sender.id !== Number(opponentId);

          // 이전 메시지와 다음 메시지를 찾는다.
          const previousMessage = index > 0 ? allMessages[index - 1] : undefined;
          const nextMessage = index < allMessages.length - 1 ? allMessages[index + 1] : undefined;

          const showSenderPhoto = shouldShowSenderPhoto(message, previousMessage);
          const showTime = shouldShowTime(message, previousMessage, nextMessage);
          const showDateDivider = shouldShowDateDivider(message, previousMessage);

          return (
            <div key={message.id}>
              {showDateDivider && (
                <DateDivider>
                  <Date>{dayjs(message.createdAt).format('MMMM D[일], YYYY')}</Date>
                </DateDivider>
              )}
              <Item isMyMessage={isMyMessage}>
                {!isMyMessage && showSenderPhoto ? (
                  <SenderPhoto>
                    <ImageCentered
                      src={message?.sender?.photo ? message.sender.photo : '/imgs/DefaultUserProfile.jpg'}
                    />
                  </SenderPhoto>
                ) : !isMyMessage ? (
                  <EmptySpace />
                ) : null}
                <MessageContent isMyMessage={isMyMessage}>
                  <Content isMyMessage={isMyMessage}>{message.content}</Content>
                  {showTime && <SendTime>{formatToLocaleAMPM(message.createdAt)}</SendTime>}
                </MessageContent>
              </Item>
            </div>
          );
        })}
      <motion.div ref={bottomRef} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} />
    </List>
  );
}

const List = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  overflow-y: auto;
  padding: 20px;
`;

const Item = styled.li<{ isMyMessage: boolean }>`
  display: flex;
  width: 100%;
  align-items: center;
  gap: 8px;
  ${({ isMyMessage }) =>
    isMyMessage
      ? css`
          flex-direction: row-reverse; /* 본인의 메시지 사진을 오른쪽으로 이동 */
          align-self: flex-end;
        `
      : css`
          flex-direction: row; /* 상대방의 메시지 사진을 왼쪽에 위치 */
          align-self: flex-start;
        `}
`;

const DateDivider = styled.div`
  display: flex;
  justify-content: center;
  padding: 8px;
`;

const Date = styled(Texts14h21)`
  border-radius: 12px;
  padding: 8px;
  background-color: ${({ theme }) => theme.background.box.default.active};
  ${({ theme }) => theme.fontSize.s14h21};
`;

const SenderPhoto = styled(RoundedImageWrapper)`
  width: 40px;
  height: 40px;
`;

const EmptySpace = styled.div`
  width: 40px; /* SenderPhoto와 동일한 크기로 설정 */
  height: 40px; /* SenderPhoto와 동일한 크기로 설정 */
`;

const MessageContent = styled.div<{ isMyMessage: boolean }>`
  display: flex;
  flex: 1;
  flex-direction: ${({ isMyMessage }) => (isMyMessage ? 'row-reverse' : 'row')};
  align-items: flex-end;
  gap: 8px;
`;

const Content = styled(Texts16h24)<{ isMyMessage: boolean }>`
  padding: 8px;
  color: white;
  background-color: ${({ theme, isMyMessage }) =>
    isMyMessage ? theme.background.box.blue.primary : theme.background.box.blue.hover};
  border-radius: 8px;
  max-width: 70%; // 최대 너비를 설정하여 상대방 영역 침범 방지
  word-wrap: break-word; // 긴 단어가 있을 경우 줄 바꿈 처리
`;

const SendTime = styled(Texts12h18)``;
