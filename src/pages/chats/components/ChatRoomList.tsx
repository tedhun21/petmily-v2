import { useEffect, useRef } from 'react';

import styled from 'styled-components';
import { useInView } from 'framer-motion';

import useChatRooms from '@pages/chats/hooks/useChatRooms';
import ChatRoomItem from './ChatRoomItem';
import Loading from '@components/Loading';
import { Center } from 'styles/commonStyle';

export default function ChatRoomList() {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref);
  const { chatRooms, setSize, isLoading, isEnd } = useChatRooms();

  useEffect(() => {
    if (isInView && !isLoading) {
      setSize((prev) => prev + 1);
    }
  }, [isInView, isLoading, setSize]);

  if (isLoading && chatRooms.length === 0) {
    return (
      <Center>
        <Loading color="279EFF" />
      </Center>
    );
  }

  if (!isLoading && chatRooms.length === 0) {
    return (
      <Center>
        <span>채팅방이 없습니다.</span>
      </Center>
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
        <Center ref={ref}>
          <Loading color="#279EFF" />
        </Center>
      )}
    </Main>
  );
}

const Main = styled.main`
  height: 100%;
`;
