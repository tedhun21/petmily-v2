import { useSelector } from 'react-redux';

import type { RootState } from '@/store';
import { selectNewMessagesByChatRoom } from '@/store/newMessageSlice';

import styled from '@emotion/styled';
import Flex from '@/components/styled/Flex';
import Text from '@/components/styled/Text';
import { ImageCentered, RoundedImageWrapper } from '@/styles/commonStyle';
import type { ChatMember, ChatRoom } from '@/types/chat.type';
import { updatedAtAgo } from '@/utils/date';

import Box from '@/components/styled/Box';
import { Link } from 'react-router-dom';

interface ChatRoomItemProps {
  chatRoom: ChatRoom;
}

export default function ChatRoomItem({ chatRoom }: ChatRoomItemProps) {
  const newMessages = useSelector((state: RootState) => selectNewMessagesByChatRoom(state, chatRoom.id));

  const others = chatRoom.chatMembers.otherMembers;

  // 최신 메시지 추출
  const newestMessage = newMessages[0];

  // 최신 메세지 내용 (새로운 메세지가 없으면 기존 lastMessage 사용)
  const lastMessage = newestMessage || chatRoom.lastMessage;

  // 읽지 않은 메세지 개수 (원래 unreadCount 값 + 새로 들어온 메세지 개수)
  const unreadCount = (chatRoom.chatMembers.meMember?.unreadCount || 0) + newMessages?.length;

  return (
    <Link to={`/chats/${chatRoom.id}`}>
      <Box p="xl" br="md">
        <Flex justifyContent="space-between">
          <Flex alignItems="center" gap="xl">
            <Photo>
              {others?.map((other: ChatMember) => (
                <MemberPhoto key={other.id}>
                  <ImageCentered src={`${other.user?.photo ?? '/imgs/DefaultUserProfile.jpg'}`} />
                </MemberPhoto>
              ))}
            </Photo>
            <Flex direction="column" gap="sm">
              <div>
                {others?.map((other: ChatMember) => (
                  <span key={other.id}>{other.user?.nickname ?? '알 수 없음'}</span>
                ))}
              </div>
              <Text size="xs">{lastMessage?.content}</Text>
            </Flex>
          </Flex>
          <Flex direction="column" justifyContent="space-between" alignItems="center" gap="sm">
            <Text size="xs">{updatedAtAgo(lastMessage?.createdAt)}</Text>
            {unreadCount > 0 && (
              <NewMessage>
                <Text size="xs">{unreadCount}</Text>
              </NewMessage>
            )}
          </Flex>
        </Flex>
      </Box>
    </Link>
  );
}

const Photo = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  width: 60px;
  height: 60px;
`;

const MemberPhoto = styled(RoundedImageWrapper)``;

const NewMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: ${({ theme }) => theme.space.xl};
  height: ${({ theme }) => theme.space.xl};
  padding: ${({ theme }) => theme.space.xs};
  background-color: ${({ theme }) => theme.colors.background.error};
  border-radius: ${({ theme }) => theme.radius.md};
`;
