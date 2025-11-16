import styled from 'styled-components';
import { Button } from '@components/buttons/Button';
import { flex, Flex } from '@components/Flex';
import { Text } from '@components/Text';
import { Notification } from 'types/notification.type';
import { dateAgo, dateFormat } from 'utils/date';
import Box from '@components/Box';

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
    <Button key={notification.id} onClick={handleClick}>
      <Flex direction="column">
        <TopDiv $isRead={isRead}>
          <Flex alignItems="flex-end" gap="xs">
            <Text
              size="sm"
              weight="semibold"
            >{`${dateFormat(notification.createdAt).year}.${dateFormat(notification.createdAt).month}.${dateFormat(notification.createdAt).day}`}</Text>
            <Text size="xs">{dateAgo(notification.createdAt)}</Text>
          </Flex>
          {!isRead && <IsUnread />}
        </TopDiv>
      </Flex>
      {/* <Text size="sm">{notification.message}</Text> */}
    </Button>
  );
}

const TopDiv = styled(Box).attrs(() => ({
  p: 'xs',
}))<{ $isRead: boolean }>`
  cursor: ${({ $isRead }) => ($isRead ? 'default' : 'pointer')};
  ${flex({
    justifyContent: 'space-between',
    alignItems: 'center',
  })}
`;

const IsUnread = styled.div`
  padding: ${({ theme }) => theme.spacing.xs};
  background-color: ${({ theme }) => theme.colors.background.error};
  border-radius: ${({ theme }) => theme.radius.circle};
`;
