import styled from 'styled-components';
import { Row, Texts12h16, Texts14h20 } from 'styles/commonStyle';
import { Notification } from 'types/notification.type';
import { dateAgo, dateFormat } from 'utils/date';

interface NotiItemProps {
  notification: Notification;
  onReadClick: (id: number) => void;
}

export default function NotiItem({ notification, onReadClick }: NotiItemProps) {
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
      {/* <Message>{notification.message}</Message> */}
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
  background-color: ${({ theme }) => theme.colors.background.error};
  border-radius: ${({ theme }) => theme.radius.circle};
`;

const Day = styled(Texts14h20)`
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
`;

const Ago = styled(Texts12h16)``;

const Message = styled(Texts14h20)`
  width: 100%;
  white-space: nowrap;
`;
