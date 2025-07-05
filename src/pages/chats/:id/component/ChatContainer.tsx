import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { FaChevronDown } from 'react-icons/fa6';

import { Button, CenterContainer, ImageCentered, RoundedImageWrapper, Texts14h21 } from 'styles/commonStyle';
import { ChatRoomContext } from './ChatRoomProvider';
import { MessageContext } from './MessageProvider';
import { useChatScroll } from 'hooks/useChatScroll';
import MessageList from './MessageList';
import Loading from '@components/Loading';

export default function ChatContainer() {
  // 1. Hooks & Contexts
  const { chatRoom } = useContext(ChatRoomContext);
  const { messages, newMessages, allMessages, setSize, isLoading, isValidating, isEnd } = useContext(MessageContext);
  const chatRef = useRef<HTMLDivElement>(null);
  const { isTopInView, isBottomInView, showDownButton, scrollToBottom } = useChatScroll({ targetSection: chatRef });

  // 2. Refs & State
  const prevScrollHeightRef = useRef<number>(0);
  const isInitialLoad = useRef(true);
  const [showNewestMessage, setShowNewestMessage] = useState<boolean>(false);

  // 3. Memoized Values
  const newestMessage = useMemo(() => newMessages[0], [newMessages]);
  const otherNewMessageUser = useMemo(
    () =>
      newestMessage && chatRoom?.chatMembers?.others?.find((other) => other.user.id === newestMessage.sender?.id)?.user,
    [newestMessage, chatRoom?.chatMembers?.others],
  );

  // 4. Effects
  // 스크롤 위치 관리 (초기 로딩 및 이전 메시지 로드 시)
  useEffect(() => {
    const chatEl = chatRef.current;
    if (!chatEl) return;

    if (isInitialLoad.current && !isLoading && messages.length > 0) {
      scrollToBottom();
      isInitialLoad.current = false;
    }

    const scrollHeightDiff = chatEl.scrollHeight - prevScrollHeightRef.current;
    if (scrollHeightDiff > 0 && chatEl.scrollTop <= chatEl.clientHeight * 0.3) {
      chatEl.scrollTop += scrollHeightDiff;
    }

    prevScrollHeightRef.current = chatEl.scrollHeight;
  }, [messages, isLoading, scrollToBottom]);

  // UI 상태 관리 (새 메시지 도착, 무한 스크롤 트리거 등)
  useEffect(() => {
    if (newestMessage) {
      if (isBottomInView || !otherNewMessageUser) {
        scrollToBottom({ behavior: 'smooth' });
        setShowNewestMessage(false);
      } else {
        setShowNewestMessage(true);
      }
    }

    if (isTopInView && !isValidating && !isEnd) {
      setSize((prev) => prev + 1);
    }

    if (isBottomInView) {
      setShowNewestMessage(false);
    }
  }, [newestMessage, isBottomInView, isTopInView, isValidating, isEnd, otherNewMessageUser, scrollToBottom, setSize]);

  // 5. Render Logic
  const showDefaultDownButton = !newestMessage && showDownButton;
  const showNewMessageDownButton = newestMessage && showNewestMessage && !isBottomInView;

  return (
    <Div ref={chatRef}>
      {isLoading || !chatRoom ? (
        <CenterContainer>
          <Loading />
        </CenterContainer>
      ) : allMessages.length === 0 && !isValidating ? (
        <CenterContainer>
          <Empty>
            <span>아직 메시지가 없습니다.</span>
            <span>메시지로 인사를 건네보세요.</span>
          </Empty>
        </CenterContainer>
      ) : (
        <MessageList />
      )}

      <Sticky>
        {showDefaultDownButton && (
          <AbsoluteBottomCenter>
            <DownButton type="button" onClick={() => scrollToBottom({ behavior: 'smooth' })}>
              <FaChevronDown size="16px" />
            </DownButton>
          </AbsoluteBottomCenter>
        )}
        {showNewMessageDownButton && (
          <AbsolutBottom>
            <BottomWrapper>
              <NewMessageButton type="button" onClick={() => scrollToBottom({ behavior: 'smooth' })}>
                <NewMessageUser>
                  <NewMessageUserPhoto>
                    <ImageCentered src={otherNewMessageUser?.photo || '/imgs/DefaultUserProfile.jpg'} />
                  </NewMessageUserPhoto>
                  <span>{otherNewMessageUser?.nickname}</span>
                  <NewMessage>{newestMessage.content}</NewMessage>
                </NewMessageUser>
                <div style={{ padding: '8px' }}>
                  <FaChevronDown size="16px" />
                </div>
              </NewMessageButton>
            </BottomWrapper>
          </AbsolutBottom>
        )}
      </Sticky>
    </Div>
  );
}

const Div = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  flex: 1;
`;

const Sticky = styled.div`
  position: sticky;
  bottom: 0;
  right: 0;
`;

const AbsoluteBottomCenter = styled.div`
  position: absolute;
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%);
`;

const AbsolutBottom = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
`;

const BottomWrapper = styled.div`
  display: flex;
  padding: 12px;
`;

const NewMessageButton = styled.button`
  display: flex;
  align-items: center;
  padding: 4px;
  width: 100%;
  border-radius: ${({ theme }) => theme.radius.large};
  background-color: ${({ theme }) => theme.background.box.default.primary};
  opacity: 0.9;
`;

const NewMessageUser = styled.div`
  flex: auto;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px;
`;

const NewMessageUserPhoto = styled(RoundedImageWrapper)`
  width: 32px;
  height: 32px;
`;

const NewMessage = styled(Texts14h21)`
  text-align: start;
  font-weight: ${({ theme }) => theme.fontWeight.extrabold};
`;

const DownButton = styled(Button)`
  padding: 8px;
  border-radius: ${({ theme }) => theme.radius.circle};
  opacity: 0.9;
`;

const Empty = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;
