import styled from 'styled-components';
import ChatRoomItem from './ChatRoomItem';
import Loading from '@components/Loading';
import { useInView } from 'framer-motion';
import { useContext, useEffect, useRef } from 'react';
import { CenterContainer } from 'styles/commonStyle';
import { ChatRoomsContext } from './ChatRoomsProvider';

export default function ChatRoomList() {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref);
  const { chatRooms, setSize, isLoading, isEnd } = useContext(ChatRoomsContext);

  useEffect(() => {
    if (isInView && !isLoading) {
      setSize((prev) => prev + 1);
    }
  }, [isInView, isLoading, setSize]);

  if (isLoading && chatRooms.length === 0) {
    return (
      <CenterContainer>
        <Loading color="279EFF" />
      </CenterContainer>
    );
  }

  if (!isLoading && chatRooms.length === 0) {
    return (
      <CenterContainer>
        <span>채팅방이 없습니다.</span>
      </CenterContainer>
    );
  }

  return (
    <Main>
      <ul>
        {chatRooms.map((chatRoom) => (
          <ChatRoomItem key={chatRoom.id} chatRoom={chatRoom} />
        ))}
      </ul>
      {!isEnd && (
        <CenterContainer ref={ref}>
          <Loading color="#279EFF" />
        </CenterContainer>
      )}
    </Main>
  );
}

const Main = styled.main`
  height: 100%;
`;
