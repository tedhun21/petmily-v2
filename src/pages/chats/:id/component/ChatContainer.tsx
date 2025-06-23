import { useContext, useEffect, useRef, useState } from 'react';

import styled from 'styled-components';
import { useInView } from 'framer-motion';
import { FaChevronDown } from 'react-icons/fa6';

import { Button, ImageCentered, RoundedImageWrapper, Texts14h21 } from 'styles/commonStyle';
import { ChatRoomContext } from './ChatRoomProvider';
import MessageList from './MessageList';
import { MessageContext } from './MessageProvider';

export default function ChatContainer() {
  const { chatRoom } = useContext(ChatRoomContext);
  const { fetchedMessages, newMessages, setSize, isLoading } = useContext(MessageContext);

  const chatRef = useRef<HTMLDivElement>(null);

  const [isTopInView, setIsTopInView] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const isBottomInView = useInView(bottomRef, { root: chatRef });

  const prevScrollHeightRef = useRef(0);

  const [isFirstRender, setIsFirstRender] = useState(true);
  const [showDownButton, setShowDownButton] = useState<boolean>(false);
  const [showNewestMessage, setShowNewestMessage] = useState<boolean>(false);

  const others = chatRoom?.chatMembers?.others;
  const newestMessage = newMessages[0];

  const otherNewMessageUser =
    newestMessage && others?.find((other) => other.user.id === newestMessage.sender?.id)?.user;

  const showDefaultDownButton = !newestMessage && showDownButton;
  // 바텀 새 매시지 팝업 (새로운 메시지 온 상태 && 스크롤 상태 && 바텀이 안 보이는 상태 && 내 매시지가 아님 )
  const showNewMessageDownButton = newestMessage && showNewestMessage && !isBottomInView;

  const scrollToBottom = () => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (chatRef.current) {
      prevScrollHeightRef.current = chatRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    const chatEl = chatRef.current;
    if (!chatEl) return;

    // 새 메시지가 추가된 후 scrollHeight 변화량 계산
    const diff = chatEl.scrollHeight - prevScrollHeightRef.current;

    // 만약 스크롤이 거의 최상단(예: 30% 영역 안)이라면 기존 위치 유지 (즉, 스크롤 위치 보정)
    if (diff > 0 && chatEl.scrollTop <= chatEl.clientHeight * 0.3) {
      chatEl.scrollTop += diff;
    }

    // 변경 후 현재 scrollHeight 저장
    prevScrollHeightRef.current = chatEl.scrollHeight;
  }, [fetchedMessages]);

  // 처음 들어오면 채팅창 제일 밑
  useEffect(() => {
    if (bottomRef.current && fetchedMessages.length > 0 && !isLoading && isFirstRender) {
      bottomRef.current?.scrollIntoView();
      setIsFirstRender(false);
    }
  }, [fetchedMessages, isLoading]);

  // 새 메세지가 왔을 때, 바닥 포커스
  // 바닥에 포커스 되어있을 때, 새 매세지가 올때
  // 바닥에 포커스 안 되어있을 때, 내가 작성하면 바닥에 포커스
  useEffect(() => {
    if (newestMessage) {
      if (isBottomInView || !otherNewMessageUser) {
        scrollToBottom();
        setShowNewestMessage(false); // 내 메시지거나 바닥이면 새 메시지 안 보여줌
      } else {
        setShowNewestMessage(true); // 내가 보낸 게 아니고 바닥이 아닐 때만 표시
      }
    }
  }, [newestMessage]);

  useEffect(() => {
    if (isTopInView) {
      setSize((prev) => prev + 1);
    }
  }, [isTopInView]);

  useEffect(() => {
    if (isBottomInView) {
      setShowNewestMessage(false); // 바닥에 있으면 새 메시지 UI 숨김
    }
  }, [isBottomInView]);

  // Down 버튼 로직이 생기는 로직
  useEffect(() => {
    const handleScroll = () => {
      const chatElement = chatRef.current;

      if (!chatRef.current) return;
      if (chatElement) {
        const scrollTop = chatElement.scrollTop; // 현재 스크롤 위치
        const scrollHeight = chatElement.scrollHeight; // listRef의 높이
        const clientHeight = chatElement.clientHeight; // 뷰포트 높이 (가시 영역의 높이)

        // 스크롤 위치를 퍼센트로 계산
        const scrollPercentage = (scrollTop / (scrollHeight - clientHeight)) * 100;

        // 소수점 오차니 렌더링 차이 때문에 === 100이 잘 안나올 수 있다
        const isAtBottom = scrollTop + clientHeight >= scrollHeight - 5;

        if (isAtBottom) {
          // 이미 false라면 setState하지 않음
          setShowDownButton(false);
        } else if (scrollPercentage < 80) {
          // 스크롤 80%미만 이면 표시
          setShowDownButton(true);
        } else {
          setShowDownButton(false);
        }
      }
    };
    const chatElement = chatRef.current;
    chatElement?.addEventListener('scroll', handleScroll);
    return () => {
      chatElement?.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // 500px 이내에 있으면 최상단에 있다고 판단
  useEffect(() => {
    const chatEl = chatRef.current;
    if (!chatEl) return;

    const threshold = 500; // 500px 이내일 대 최상단에 있다고 판단

    const onScroll = () => {
      setIsTopInView(chatEl.scrollTop <= threshold);
    };

    chatEl.addEventListener('scroll', onScroll);

    // 처음엔 상태 세팅 안 함

    return () => {
      chatEl.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <Div ref={chatRef}>
      {/* {isEnd === false && !isLoading && <TopSentinel ref={topRef} />} */}
      <MessageList />

      <BottomSentinel ref={bottomRef} />
      <Sticky>
        {showDefaultDownButton && (
          <AbsoluteBottomCenter>
            <DownButton type="button" onClick={scrollToBottom}>
              <FaChevronDown size="16px" />
            </DownButton>
          </AbsoluteBottomCenter>
        )}
        {showNewMessageDownButton && (
          <AbsolutBottom>
            <BottomWrapper>
              <NewMessageButton type="button" onClick={scrollToBottom}>
                <NewMessageUser>
                  <NewMessageUserPhoto>
                    <ImageCentered
                      src={otherNewMessageUser?.photo ? otherNewMessageUser.photo : '/imgs/DefaultUserProfile.jpg'}
                    />
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
  flex: 1 1 auto;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

const Sticky = styled.div`
  position: sticky;
  bottom: 0;
  right: 0;
`;

const BottomSentinel = styled.div`
  height: 1px;
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
