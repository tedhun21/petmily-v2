import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState } from 'store';
import { selectNewMessagesByChatRoom } from 'store/newMessageSlice';

import styled from 'styled-components';
import { Column, ImageCentered, RoundedImageWrapper, Row, Texts12h16 } from 'styles/commonStyle';
import { ChatMember, ChatRoom } from 'types/chat.type';
import { updatedAtAgo } from 'utils/date';

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
    <ChatRoomLink to={`/chats/${chatRoom.id}`}>
      <PhotoName>
        <Photo>
          {others?.map((other: ChatMember) => (
            <MemberPhoto key={other.id}>
              <ImageCentered src={`${other.user?.photo ?? '/imgs/DefaultUserProfile.jpg'}`} />
            </MemberPhoto>
          ))}
        </Photo>
        <NameMessageWrapper>
          <div>
            {others?.map((other: ChatMember) => (
              <span key={other.id}>{other.user?.nickname ?? 'unknown'}</span>
            ))}
          </div>
          <Texts12h16>{lastMessage?.content}</Texts12h16>
        </NameMessageWrapper>
      </PhotoName>
      <TimeUnreadCount>
        <Texts12h16>{updatedAtAgo(lastMessage?.createdAt)}</Texts12h16>
        {unreadCount > 0 && (
          <NewMessage>
            <Texts12h16>{unreadCount}</Texts12h16>
          </NewMessage>
        )}
      </TimeUnreadCount>
    </ChatRoomLink>
  );
}

const ChatRoomLink = styled(Link)`
  display: flex;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.xl};
`;

const PhotoName = styled(Row)`
  gap: ${({ theme }) => theme.spacing.xl};
  align-items: center;
`;

const Photo = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  width: 60px;
  height: 60px;
`;

const MemberPhoto = styled(RoundedImageWrapper)``;

const NameMessageWrapper = styled(Column)`
  gap: ${({ theme }) => theme.spacing.sm};
`;

const TimeUnreadCount = styled(Column)`
  justify-content: space-between;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const NewMessage = styled(Row)`
  justify-content: center;
  align-items: center;
  min-width: ${({ theme }) => theme.spacing.xl};
  height: ${({ theme }) => theme.spacing.xl};
  padding: ${({ theme }) => theme.spacing.xs};
  background-color: ${({ theme }) => theme.colors.background.error};
  border-radius: ${({ theme }) => theme.radius.md};
  color: ${({ theme }) => theme.colors.text.white};
`;
