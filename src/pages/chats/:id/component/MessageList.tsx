import { ChatRoomContext } from './ChatRoomProvider';
import { useContext } from 'react';
import styled from 'styled-components';
import { Message } from 'types/chat.type';
import MessageItem from './MessageItem';
import { MessageContext } from './MessageProvider';

export default function MessageList() {
  const { chatRoom } = useContext(ChatRoomContext);
  const { fetchedMessages, newMessages } = useContext(MessageContext);

  const allMessages = [...newMessages, ...fetchedMessages];

  const membersCount = (chatRoom?.chatMembers.others?.length ?? 0) + 1;

  return (
    <List>
      {allMessages.map((message: Message, index: number) => {
        const isMyMessage = message.sender?.id === chatRoom?.chatMembers.me?.user.id;
        const previousMessage = index < allMessages.length - 1 ? allMessages[index + 1] : undefined;
        const nextMessage = index > 0 ? allMessages[index - 1] : undefined;

        return (
          <MessageItem
            key={message.id}
            message={message}
            isMyMessage={isMyMessage}
            previousMessage={previousMessage}
            nextMessage={nextMessage}
            membersCount={membersCount ?? 0}
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
