import { ImageCentered, RoundedImageWrapper, Texts12h18, Texts16h24 } from 'commonStyle';
import styled, { css } from 'styled-components';
import { Message } from 'types/chat.type';
import { formatToLocaleAMPM } from 'utils/date';

export default function MessageList({
  allMessages,
  pagination,
  opponentId,
}: {
  allMessages: Message[];
  pagination: { total: number; totalPages: number };
  opponentId: string | undefined;
}) {
  return (
    <List>
      {allMessages
        .map((message: Message, index: number) => {
          const isMyMessage = message.sender.id !== Number(opponentId);
          // Get the createdAt of the previous message for comparison
          const previousMessage = allMessages[index - 1];
          const showTime =
            !previousMessage ||
            new Date(message.createdAt).getMinutes() !== new Date(previousMessage.createdAt).getMinutes() ||
            new Date(message.createdAt).getHours() !== new Date(previousMessage.createdAt).getHours();

          return (
            <Item key={message.id} isMyMessage={isMyMessage}>
              {!isMyMessage && (
                <SenderPhoto>
                  <ImageCentered
                    src={message?.sender?.photo ? message?.sender.photo : '/imgs/DefaultUserProfile.jpg'}
                  />
                </SenderPhoto>
              )}
              <MessageContent isMyMessage={isMyMessage}>
                <Content isMyMessage={isMyMessage}>{message.content}</Content>
                <SendTime>{formatToLocaleAMPM(message.createdAt)}</SendTime>
              </MessageContent>
            </Item>
          );
        })
        .reverse()}
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
  align-items: center;
  gap: 8px;
  ${(props) =>
    props.isMyMessage
      ? css`
          flex-direction: row-reverse; /* 본인의 메시지 사진을 오른쪽으로 이동 */
          align-self: flex-end;
        `
      : css`
          flex-direction: row; /* 상대방의 메시지 사진을 왼쪽에 위치 */
          align-self: flex-start;
        `}
`;
const SenderPhoto = styled(RoundedImageWrapper)`
  width: 48px;
  height: 48px;
`;

const MessageContent = styled.div<{ isMyMessage: boolean }>`
  display: flex;
  flex-direction: ${(props) => (props.isMyMessage ? 'row-reverse' : 'row')};
  align-items: flex-end;
  gap: 8px;
`;

const Content = styled(Texts16h24)<{ isMyMessage: boolean }>`
  padding: 8px;
  color: white;
  background-color: ${(props) => (props.isMyMessage ? props.theme.colors.mainBlue : props.theme.colors.darkBlue)};
  border-radius: 8px;
  max-width: 70%;
`;

const SendTime = styled(Texts12h18)``;
