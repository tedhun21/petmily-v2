import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Column, ImageCentered, RoundedImageWrapper, Row, Texts12h18 } from 'styles/commonStyle';
import { updatedAtAgo } from 'utils/date';

export default function ChatRoom({ chatRoom }: any) {
  console.log('chatRoom:', chatRoom);

  return (
    <ChatRoomLink to={`/chats/${chatRoom.id}`}>
      <PhotoName>
        <OpponentPhoto>
          <ImageCentered
            src={`${chatRoom.opponent.photo ? chatRoom.opponent.photo : '/imgs/DefaultUserProfile.jpg'}`}
            alt="opponent_photo"
          />
        </OpponentPhoto>

        <NameMessageWrapper>
          <span>{chatRoom.opponent?.nickname}</span>
          <Texts12h18>{chatRoom.lastMessage?.content}</Texts12h18>
        </NameMessageWrapper>
      </PhotoName>
      <TimeUnreadCount>
        <Texts12h18>{updatedAtAgo(chatRoom.updatedAt)}</Texts12h18>
        <span>{chatRoom.unreadCount !== 0 && chatRoom.unredCount}</span>
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

const OpponentPhoto = styled(RoundedImageWrapper)`
  width: 60px;
  height: 60px;
`;

const NameMessageWrapper = styled(Column)`
  gap: 8px;
`;

const TimeUnreadCount = styled(Column)`
  gap: 8px;
`;
