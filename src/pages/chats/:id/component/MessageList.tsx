import { ChatRoomContext } from './ChatRoomProvider';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { Message } from 'types/chat.type';
import MessageItem from './MessageItem';
import { MessageContext } from './MessageProvider';
import { SocketContext } from '@components/SocketProvider';
import dayjs from 'dayjs';
import useDebounce from 'hooks/useDebounce';

export default function MessageList() {
  const { socket } = useContext(SocketContext);
  const { chatRoom } = useContext(ChatRoomContext);
  const { messages } = useContext(MessageContext);

  const [lastSeenMessage, setLastSeenMessage] = useState<Message | null>(null);

  const debouncedReadMessage = useDebounce(lastSeenMessage, 2000); // 2초 디바운스

  const reversedMessages = useMemo(() => {
    return [...messages].reverse();
  }, [messages]);

  const membersCount = (chatRoom?.chatMembers.others?.length ?? 0) + 1;

  const handleVisible = useCallback(
    (message: Message) => {
      if (!lastSeenMessage || dayjs(message.createdAt).isAfter(dayjs(lastSeenMessage.createdAt))) {
        setLastSeenMessage(message);
      }
    },
    [lastSeenMessage],
  );

  // 서버 메시지 데이터 읽음처리
  useEffect(() => {
    if (socket && chatRoom?.id && debouncedReadMessage) {
      socket.emit('chat:read:mark', {
        chatRoomId: chatRoom.id,
        lastSeenMessage: { ...debouncedReadMessage, chatRoom: { id: chatRoom.id } },
      });
    }
  }, [debouncedReadMessage]);

  return (
    <List>
      {reversedMessages.map((message: Message, index: number) => {
        const isMyMessage = message.sender?.id === chatRoom?.chatMembers.me?.user.id;
        const previousMessage = index > 0 ? reversedMessages[index - 1] : undefined;
        const nextMessage = index < reversedMessages.length - 1 ? reversedMessages[index + 1] : undefined;

        return (
          <MessageItem
            key={message.id}
            message={message}
            isMyMessage={isMyMessage}
            previousMessage={previousMessage}
            nextMessage={nextMessage}
            membersCount={membersCount ?? 0}
            onVisible={handleVisible}
          />
        );
      })}
    </List>
  );
}

const List = styled.ul`
  display: flex;
  flex-direction: column;
  padding: 0px 16px;
  gap: 8px;
`;
