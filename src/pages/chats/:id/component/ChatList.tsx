import { ChatRoomContext } from './ChatRoomProvider';
import { useContext, useEffect, useMemo, useRef } from 'react';
import styled from 'styled-components';
import { Message } from 'types/chat.type';
import ChatMessage from './ChatMessage';
import { MessageContext } from './MessageProvider';
import { SocketContext } from '@components/SocketProvider';
import useDebounce from 'hooks/useDebounce';

export default function ChatList() {
  const { socket } = useContext(SocketContext);
  const { chatRoom } = useContext(ChatRoomContext);
  const { messages, markAsRead } = useContext(MessageContext);

  // state로 하면 재랜더링이 계속 일어나서 재랜더링을 유발 안하는 ref 사용
  const lastMessageId = useRef<number | null>(null);
  // 2초 후 lastMessageId
  const debouncedMessageId = useDebounce(lastMessageId.current, 2000);

  const reversedMessages = useMemo(() => {
    return [...messages].reverse();
  }, [messages]);

  // 메세지 id 제일 큰거 설정
  useEffect(() => {
    if (messages.length > 0 && chatRoom?.chatMembers.me) {
      const lastestMessageId = messages[0].id;
      if (lastMessageId.current === null || lastestMessageId > lastMessageId.current) {
        lastMessageId.current = lastestMessageId;

        // 읽음 처리 즉시 반영
        markAsRead(lastMessageId.current, chatRoom.chatMembers.me.id);
      }
    }
  }, [messages]);

  // 몇 초뒤에 읽음 처리 보내기
  useEffect(() => {
    if (socket && chatRoom?.id && debouncedMessageId) {
      const handleRead = () => {
        socket.emit('readMessage', {
          chatRoomId: chatRoom.id,
          messageId: debouncedMessageId,
        });
      };

      handleRead();

      return () => {
        handleRead();
      };
    }
  }, [debouncedMessageId]);

  return (
    <List>
      {reversedMessages.map((message: Message, index: number) => {
        const isMyMessage = message.sender?.id === chatRoom?.chatMembers.me?.id;
        const previousMessage = index > 0 ? reversedMessages[index - 1] : undefined;
        const nextMessage = index < reversedMessages.length - 1 ? reversedMessages[index + 1] : undefined;

        return (
          <ChatMessage
            key={message.id}
            index={index}
            message={message}
            isMyMessage={isMyMessage}
            previousMessage={previousMessage}
            nextMessage={nextMessage}
            membersCount={chatRoom?.chatMembers?.membersCount ?? 0}
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
