import { useEffect, useRef, useCallback, useMemo } from 'react';
import { useInView } from 'react-intersection-observer';
import styled from '@emotion/styled';
import { FaChevronDown } from 'react-icons/fa6';
import dayjs from 'dayjs';

import type { ChatMember, Message, PendingMessage } from '@/types/chat.type';
import MessageLine from './MessageLine';
import Box from '@/components/styled/Box';
import Flex from '@/components/styled/Flex';
import { IconButton } from '@/components/styled/IconButtonAndLink';
import Button from '@/components/styled/Button';
import { ImageCentered } from '@/styles/commonStyle';
import Text from '@/components/styled/Text';
import { useChatMessagesContext, useChatRoomContext } from '../context/ChatProvider';

/**
 * 메시지가 기준(마지막 읽은 메시지)보다 최신인지 확인
 */
const checkIsUnread = (
  message: { createdAt: string } | null | undefined,
  lastRead?: { createdAt: string } | null | undefined,
) => {
  if (!message) return false;
  if (!lastRead || !lastRead.createdAt) return true;
  return dayjs(message.createdAt).isAfter(dayjs(lastRead.createdAt));
};

export default function MessageList() {
  const listRef = useRef<HTMLUListElement>(null);
  const { ref: topRef, inView: isTopInView } = useInView({ rootMargin: '100px 0px 0px 0px' });
  const { ref: bottomRef, inView: isBottomInView } = useInView({ threshold: 1 });
  const { ref: nearBottomRef, inView: isNearBottomInView } = useInView({
    rootMargin: '100px 0px 0px 0px',
    initialInView: true,
  });

  const setBottomRefs = useCallback(
    (node: HTMLDivElement) => {
      bottomRef(node);
      nearBottomRef(node);
    },
    [bottomRef, nearBottomRef],
  );

  const { meMember, otherMembers } = useChatRoomContext();
  const { messages, isValidating, setSize, isCurrentBatchLoaded, hasNextPage } = useChatMessagesContext();

  // 가장 최신 메시지 정보
  const lastMessage: PendingMessage | Message | undefined = messages[0];
  const myId = meMember?.user.id;
  const lastReadTime = meMember?.lastReadMessage?.createdAt;

  const isLatestMine = useMemo(() => lastMessage?.sender.id === myId, [lastMessage, myId]);
  const isLatestUnread = useMemo(() => {
    if (!lastMessage || !lastReadTime) return true;
    return dayjs(lastMessage.createdAt).isAfter(dayjs(lastReadTime));
  }, [lastMessage, lastReadTime]);

  // 기본 => bottom에서 벗어나면 노출
  // 새 메시지 => bottom에서 벗어나고, 마지막 메시지가 내가 보낸게 아니고, 마지막 메시지가 내가 읽은 메시지보다 최신일 때 노출
  const downButtonState = useMemo(() => {
    // 메시지 데이터가 로드되지 않았을 때는 버튼을 절대 보여주지 않음
    if (isNearBottomInView || !lastMessage) return 'none';
    if (!isLatestMine && isLatestUnread) return 'newMessage';
    return 'default';
  }, [isNearBottomInView, lastMessage, isLatestMine, isLatestUnread]);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'auto', mode: 'reverse' | 'normal' = 'normal') => {
    if (listRef.current) {
      listRef.current.scrollTo({
        top: mode === 'reverse' ? 0 : listRef.current.scrollHeight,
        behavior,
      });
    }
  }, []);

  // 새 메시지가 왔을 때 스크롤 로직
  useEffect(() => {
    if (!lastMessage) return;

    if (isBottomInView || (isLatestMine && isLatestUnread)) {
      scrollToBottom('auto', 'reverse');
    }
  }, [lastMessage, isLatestMine, isLatestUnread, isBottomInView, scrollToBottom]);

  // 상단 무한 스크롤 로직
  useEffect(() => {
    if (isTopInView && !isValidating && hasNextPage && isCurrentBatchLoaded) {
      setSize((prev) => prev + 1);
    }
  }, [isTopInView, isValidating, hasNextPage, isCurrentBatchLoaded, setSize]);

  return (
    <Container>
      <List ref={listRef}>
        {/* 하단 감시자 */}
        <div ref={setBottomRefs} />

        {messages.map((message, index) => {
          const isMine = message.sender.id === meMember?.user.id;
          const isPending = 'status' in message;
          const previousMessage = index < messages.length - 1 ? messages[index + 1] : undefined;
          const nextMessage = index > 0 ? messages[index - 1] : undefined;

          const unreadCount =
            !isPending && otherMembers
              ? otherMembers.filter((member: ChatMember) => checkIsUnread(message, member?.lastReadMessage)).length
              : 0;

          return (
            <MessageLine
              key={isPending ? (message as PendingMessage).tempId : (message as Message).id}
              message={message}
              isMine={isMine}
              isPending={isPending}
              previousMessage={previousMessage}
              nextMessage={nextMessage}
              unreadCount={unreadCount}
            />
          );
        })}

        {/* 상단 감시자 */}
        {!isValidating && hasNextPage && <div ref={topRef} />}
      </List>

      <StickyBottom>
        <Absolute>
          {/* 새 메시지 알림 버튼 */}
          {downButtonState === 'default' && (
            <Box pb="sm">
              <Flex justifyContent="center" alignItems="center">
                <IconButton onClick={() => scrollToBottom('smooth', 'reverse')} variant="fill">
                  <FaChevronDown size="20px" />
                </IconButton>
              </Flex>
            </Box>
          )}

          {downButtonState === 'newMessage' && (
            <Box p="sm">
              <Button
                type="button"
                onClick={() => scrollToBottom('smooth', 'reverse')}
                variant="secondary"
                size="sm"
                borderRadius="lg"
                fullWidth
              >
                <Box w="100%" p="xs">
                  <Flex justifyContent="space-between" alignItems="center">
                    <Flex alignItems="center" gap="xs">
                      <div css={{ position: 'relative', width: '32px', height: '32px' }}>
                        <ImageCentered src={lastMessage?.sender?.photo || '/imgs/DefaultUserProfile.jpg'} />
                      </div>
                      <span>{lastMessage?.sender.nickname}</span>
                      <Text size="sm" weight="semibold" style={{ textAlign: 'start' }}>
                        {lastMessage?.content}
                      </Text>
                    </Flex>

                    <FaChevronDown size="16px" />
                  </Flex>
                </Box>
              </Button>
            </Box>
          )}
        </Absolute>
      </StickyBottom>
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  flex: 1;
  overflow: hidden;
  height: 100%;
`;

// column-reverse, 스크롤 설정을 같이해야 스크롤이 밑에서 시작
const List = styled.ul`
  display: flex;
  flex-direction: column-reverse;
  overflow-y: auto;
  height: 100%;
  padding: 8px 16px;
  gap: ${({ theme }) => theme.space.sm};
`;

const StickyBottom = styled.div`
  position: sticky;
  bottom: 0;
`;

const Absolute = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
`;
