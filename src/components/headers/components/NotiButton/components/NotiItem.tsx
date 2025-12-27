import styled from '@emotion/styled';
import Flex from '@/components/styled/Flex';
import Text from '@/components/styled/Text';
import type { Notification } from '@/types/notification.type';
import { dateAgo, dateFormat } from '@/utils/date';
import Box from '@/components/styled/Box';
import Button from '@/components/styled/Button';

interface IProps {
  notification: Notification;
  onReadClick: (id: number) => void;
}

export default function NotiItem({ notification, onReadClick }: IProps) {
  const isRead = notification.readStatus[0].isRead;

  const handleClick = () => {
    if (!isRead) {
      onReadClick(notification.id);
    }
  };

  return (
    <Button key={notification.id} onClick={handleClick}>
      <Flex direction="column">
        <TopDiv $isRead={isRead} p="xs">
          <Flex justifyContent="space-between" alignItems="center">
            <Flex alignItems="flex-end" gap="xs">
              <Text size="sm" weight="semibold">{`${
                dateFormat(notification.createdAt).year
              }.${dateFormat(notification.createdAt).month}.${dateFormat(notification.createdAt).day}`}</Text>
              <Text size="xs">{dateAgo(notification.createdAt)}</Text>
            </Flex>
            {!isRead && <IsUnread />}
          </Flex>
        </TopDiv>
      </Flex>
      {/* <Text size="sm">{notification.message}</Text> */}
    </Button>
  );
}

const TopDiv = styled(Box)<{ $isRead: boolean }>`
  cursor: ${({ $isRead }) => ($isRead ? 'default' : 'pointer')};
`;

const IsUnread = styled.div`
  padding: ${({ theme }) => theme.space.xs};
  background-color: ${({ theme }) => theme.colors.background.error};
  border-radius: ${({ theme }) => theme.radius.circle};
`;
