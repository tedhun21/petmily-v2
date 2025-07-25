import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState } from 'store';

import styled from 'styled-components';
import { Column, ImageCentered, RoundedImageWrapper, Row, Texts12h18 } from 'styles/commonStyle';
import { ChatMember, ChatRoom, Message } from 'types/chat.type';
import { updatedAtAgo } from 'utils/date';

interface ChatRoomItemProps {
  chatRoom: ChatRoom;
}

export default function ChatRoomItem({ chatRoom }: ChatRoomItemProps) {
  const { newMessages } = useSelector((state: RootState) => state.newMessage);

  const others = chatRoom.chatMembers.others;

  // 현재 채팅방의 새로운 메세지만 필터링
  const newChatRoomMessages = newMessages?.filter((msg: Message) => msg.chatRoom.id === chatRoom.id);

  // 최신 메시지 추출
  const newestMessage = newChatRoomMessages[0];

  // 최신 메세지 내용 (새로운 메세지가 없으면 기존 lastMessage 사용)
  const lastMessage = newestMessage || chatRoom.lastMessage;

  // 읽지 않은 메세지 개수 (원래 unreadCount 값 + 새로 들어온 메세지 개수)
  const unreadCount = (chatRoom.chatMembers.me?.unreadCount || 0) + newChatRoomMessages?.length;

  return (
    <ChatRoomLink to={`/chats/${chatRoom.id}`}>
      <PhotoName>
        <Photo>
          {others?.map((other: ChatMember) => (
            <MemberPhoto key={other.id}>
              <ImageCentered src={`${other.user.photo ?? '/imgs/DefaultUserProfile.jpg'}`} />
            </MemberPhoto>
          ))}
        </Photo>
        <NameMessageWrapper>
          <div>
            {others?.map((other: ChatMember) => (
              <span key={other.id}>{other.user.nickname}</span>
            ))}
          </div>
          <Texts12h18>{lastMessage.content}</Texts12h18>
        </NameMessageWrapper>
      </PhotoName>
      <TimeUnreadCount>
        <Texts12h18>{updatedAtAgo(lastMessage?.createdAt)}</Texts12h18>
        {unreadCount > 0 && (
          <NewMessage>
            <Texts12h18>{unreadCount}</Texts12h18>
          </NewMessage>
        )}
      </TimeUnreadCount>
    </ChatRoomLink>
  );
}

const ChatRoomLink = styled(Link)`
  display: flex;
  justify-content: space-between;
  padding: 20px;
`;

const PhotoName = styled(Row)`
  gap: 20px;
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
  gap: 8px;
`;

const TimeUnreadCount = styled(Column)`
  justify-content: space-between;
  align-items: center;
  gap: 8px;
`;

const NewMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  height: 20px;
  padding: 4px;
  color: ${({ theme }) => theme.text.white};
  border-radius: ${({ theme }) => theme.radius.normal};
  background-color: ${({ theme }) => theme.background.red};
`;
