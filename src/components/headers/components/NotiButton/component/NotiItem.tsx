import styled from 'styled-components';
import { Row, Texts12h18, Texts14h21 } from 'styles/commonStyle';
import { dateAgo, dateFormat } from 'utils/date';

export default function NotiItem({ notification, onReadClick }: any) {
  const isRead = notification.readStatus[0].isRead;

  const handleClick = () => {
    if (!isRead) {
      onReadClick(notification.id);
    }
  };

  return (
    <Item key={notification.id} onClick={handleClick} $isRead={isRead}>
      <TopDiv>
        <DayDiv>
          <Day>{`${dateFormat(notification.createdAt).year}.${dateFormat(notification.createdAt).month}.${dateFormat(notification.createdAt).day}`}</Day>
          <Ago>{dateAgo(notification.createdAt)}</Ago>
        </DayDiv>
        {!isRead && <IsUnread />}
      </TopDiv>
      <Message>{notification.message}</Message>
    </Item>
  );
}

const Item = styled.li<{ $isRead: boolean }>`
  display: flex;
  flex-direction: column;
  padding: 4px;
  cursor: ${({ $isRead }) => ($isRead ? 'default' : 'pointer')};
`;

const TopDiv = styled(Row)`
  justify-content: space-between;
  align-items: center;
`;

const DayDiv = styled(Row)`
  gap: 4px;
  align-items: flex-end;
`;

const IsUnread = styled.div`
  padding: 4px;
  background-color: ${({ theme }) => theme.background.red};
  border-radius: ${({ theme }) => theme.radius.circle};
`;

const Day = styled(Texts14h21)`
  font-weight: ${({ theme }) => theme.fontWeight.bold};
`;

const Ago = styled(Texts12h18)``;

const Message = styled(Texts14h21)`
  width: 100%;
  white-space: nowrap;
`;
