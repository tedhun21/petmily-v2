import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import useChatRooms from '@/pages/chats/hooks/useChatRooms';
import ChatRoomItem from './ChatRoomItem';
import Spinner from '@/components/Spinner';
import Flex from '@/components/styled/Flex';

const PAGE_SIZE = 20;

export default function ChatRoomList() {
  const { ref, inView } = useInView();
  const { chatRooms, setSize, isValidating, isEnd } = useChatRooms({ pageSize: PAGE_SIZE });

  useEffect(() => {
    if (inView && !isEnd && !isValidating) {
      setSize((prev) => prev + 1);
    }
  }, [inView, isEnd, isValidating, setSize]);

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
            <Spinner color="#279EFF" />
          </Flex>
        </div>
      )}
    </>
  );
}
