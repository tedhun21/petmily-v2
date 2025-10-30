import styled from 'styled-components';

import { ChatMember } from 'types/chat.type';
import MessageItem from './MessageItem';
import { isMessageUnread } from 'utils/misc';
import { useChat } from '../contexts/ChatProvider';
import { useMemo } from 'react';

export default function MessageList() {
  const {
    chatRoomValues: { meMember, otherMembers },
    messageValues: { messages, newMessages },
  } = useChat();

  const allMessages = useMemo(() => [...newMessages, ...messages], [newMessages, messages]);

  return (
    <List>
      {allMessages.map((message, index) => {
        const isMyMessage = message.sender?.id === meMember?.user.id;
        const previousMessage = index < allMessages.length - 1 ? allMessages[index + 1] : undefined;
        const nextMessage = index > 0 ? allMessages[index - 1] : undefined;

        const unreadCount = otherMembers
          ? otherMembers.filter((member: ChatMember) => isMessageUnread(message, member?.lastReadMessage)).length
          : 0;

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
  padding: 0 16px;
  gap: 8px;
`;
