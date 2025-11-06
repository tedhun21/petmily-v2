import styled from 'styled-components';
import { Text } from 'styles/common/Text';
import { Column, Row } from 'styles/commonStyle';
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
    <Item as="li" key={notification.id} onClick={handleClick} $isRead={isRead}>
      <TopDiv>
        <DayDiv>
          <Text
            $size="sm"
            $weight="semibold"
          >{`${dateFormat(notification.createdAt).year}.${dateFormat(notification.createdAt).month}.${dateFormat(notification.createdAt).day}`}</Text>
          <Text $size="xs">{dateAgo(notification.createdAt)}</Text>
        </DayDiv>
        {!isRead && <IsUnread />}
      </TopDiv>
      {/* <Text $size="sm">{notification.message}</Text> */}
    </Item>
  );
}

const Item = styled(Column)<{ $isRead: boolean }>`
  padding: ${({ theme }) => theme.spacing.xs};
  cursor: ${({ $isRead }) => ($isRead ? 'default' : 'pointer')};
`;

const TopDiv = styled(Row)`
  justify-content: space-between;
  align-items: center;
`;

const DayDiv = styled(Row)`
  gap: ${({ theme }) => theme.spacing.xs};
  align-items: flex-end;
`;

const IsUnread = styled.div`
  padding: ${({ theme }) => theme.spacing.xs};
  background-color: ${({ theme }) => theme.colors.background.error};
  border-radius: ${({ theme }) => theme.radius.circle};
`;
