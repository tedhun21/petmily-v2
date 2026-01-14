import styled from '@emotion/styled';
import { forwardRef, useMemo } from 'react';

import type { ChatMember, Message, PendingMessage } from '@/types/chat.type';
import MessageItem from './MessageItem';
import { isMessageUnread } from '@/utils/misc';
import { useChat } from '../contexts/ChatProvider';

const MessageList = forwardRef<HTMLUListElement>((_, ref) => {
  const { meMember, otherMembers, serverMessages, pendingMessages } = useChat();

  const messages = useMemo(() => [...pendingMessages, ...serverMessages], [pendingMessages, serverMessages]);

  const isPendingMessage = (msg: Message | PendingMessage): msg is PendingMessage => {
    return 'status' in msg;
  };

  return (
    <List ref={ref}>
      {messages.map((message: Message | PendingMessage, index) => {
        const isMyMessage = message.sender?.id === meMember?.user.id;
        const previousMessage = index < messages.length - 1 ? messages[index + 1] : undefined;
        const nextMessage = index > 0 ? messages[index - 1] : undefined;

        const unreadCount =
          !isPendingMessage(message) && otherMembers
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
});

export default MessageList;

// column-reverse, 스크롤 설정을 같이해야 스크롤이 밑에서 시작
const List = styled.ul`
  display: flex;
  flex-direction: column-reverse;
  overflow-y: auto;
  height: 100%;
  padding: 8px 16px;
  gap: ${({ theme }) => theme.space.sm};
`;
