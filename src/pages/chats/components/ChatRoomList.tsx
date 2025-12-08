import { useEffect, useRef } from 'react';

import { useInView } from 'framer-motion';

import useChatRooms from '@/pages/chats/hooks/useChatRooms';
import ChatRoomItem from './ChatRoomItem';
import Loading from '@/components/Loading';
import Flex from '@/components/styled/Flex';

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
      <Flex justifyContent="center" alignItems="center">
        <Loading color="279EFF" />
      </Flex>
    );
  }

  if (!isLoading && chatRooms.length === 0) {
    return (
      <Flex justifyContent="center" alignItems="center">
        <span>채팅방이 없습니다.</span>
      </Flex>
    );
  }

  return (
    <>
      <ul>
        {chatRooms.map((chatRoom) => (
          <ChatRoomItem key={chatRoom.id} chatRoom={chatRoom} />
        ))}
      </ul>
      {!isEnd && (
        <div ref={ref}>
          <Flex justifyContent="center" alignItems="center">
            <Loading color="#279EFF" />
          </Flex>
        </div>
      )}
    </>
  );
}
