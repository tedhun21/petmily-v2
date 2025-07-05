import { ChatRoomContext } from './ChatRoomProvider';
import { useContext } from 'react';
import styled from 'styled-components';
import { Message } from 'types/chat.type';
import MessageItem from './MessageItem';
import { MessageContext } from './MessageProvider';
import { isAfterMessage } from 'utils/misc';

export default function MessageList() {
  const { chatRoom } = useContext(ChatRoomContext);
  const { allMessages } = useContext(MessageContext);

  const others = chatRoom?.chatMembers.others || [];

  return (
    <List>
      {allMessages.map((message: Message, index: number) => {
        const isMyMessage = message.sender?.id === chatRoom?.chatMembers.me?.user.id;
        const previousMessage = index < allMessages.length - 1 ? allMessages[index + 1] : undefined;
        const nextMessage = index > 0 ? allMessages[index - 1] : undefined;

        const unreadCount = others.filter((member) => isAfterMessage(message, member?.lastReadMessage)).length;

        return (
          <MessageItem
            key={message.id}
            message={message}
            isMyMessage={isMyMessage}
            previousMessage={previousMessage}
            nextMessage={nextMessage}
            unreadCount={unreadCount}
          />
        );
      })}
    </List>
  );
}

const List = styled.ul`
  display: flex;
  flex-direction: column-reverse;
  padding: 0px 16px;
  gap: 8px;
`;
