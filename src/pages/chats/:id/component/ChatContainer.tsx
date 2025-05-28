import { useContext, useEffect, useRef, useState } from 'react';

import styled from 'styled-components';
import { useInView } from 'framer-motion';
import { FaChevronDown } from 'react-icons/fa6';

import { Button, ImageCentered, RoundedImageWrapper, Texts14h21 } from 'styles/commonStyle';
import { ChatRoomContext } from './ChatRoomProvider';

import ChatList from './ChatList';
import { MessageContext } from './MessageProvider';
import { Message } from 'types/chat.type';

export default function ChatContainer() {
  const { chatRoom } = useContext(ChatRoomContext);
  const { messages, newMessages, isLoading } = useContext(MessageContext);

  const chatRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const isBottomInView = useInView(bottomRef);
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [showDownButton, setShowDownButton] = useState<boolean>(false);
  const [showNewestMessage, setShowNewestMessage] = useState<boolean>(false);
  const [newestMessage, setNewestMessage] = useState<Message | null>(null);

  const me = chatRoom?.chatMembers?.me;
  const others = chatRoom?.chatMembers?.others;
  const senderId = newestMessage?.sender?.id;
  const myMessage = senderId === me?.id;
  const newMessagesMaster = myMessage ? me : others?.find((user) => user.id === senderId);

  const showDefaultDownButton = !newestMessage && showDownButton;
  const showNewMessageDownButton = newestMessage && showNewestMessage && !isBottomInView;

  const scrollToBottom = () => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (newMessages?.length > 0) {
      setNewestMessage(newMessages[0]);
    }
  }, [newMessages]);

  // 처음 들어오면 채팅창 제일 밑
  useEffect(() => {
    if (bottomRef.current && messages.length > 0 && !isLoading && isFirstRender) {
      bottomRef.current?.scrollIntoView({});
      setIsFirstRender(false);
    }
  }, [messages, isLoading]);

  // 새 메세지가 왔을 때, 바닥 포커스
  // 바닥에 포커스 되어있을 때, 새 매세지가 올때
  // 바닥에 포커스 안 되어있을 때, 내가 작성하면 바닥에 포커스
  useEffect(() => {
    if (newestMessage) {
      if (isBottomInView || myMessage) {
        scrollToBottom();
        setShowNewestMessage(false); // 내 메시지거나 바닥이면 새 메시지 안 보여줌
      } else {
        setShowNewestMessage(true); // 내가 보낸 게 아니고 바닥이 아닐 때만 표시
      }
    }
  }, [newestMessage]);

  useEffect(() => {
    if (isBottomInView) {
      setShowNewestMessage(false); // 바닥에 있으면 새 메시지 UI 숨김
      setNewestMessage(null); // 바닥에 있으면 새 메시지 초기화
    }
  }, [isBottomInView]);

  // down 버튼 로직이 생기는 로직
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

        // 소수점 오차니 렌더링 차이 때문에 ===100이 잘 안나올 수 있다
        const isAtBottom = scrollTop + clientHeight >= scrollHeight - 5;

        if (isAtBottom) {
          setShowDownButton(false);
        } else if (scrollPercentage < 80) {
          // 스크롤이 80% 이상이면 버튼 숨기기, 아니면 표시
          setShowDownButton(true);
        }
      }
    };
    const chatElement = chatRef.current;
    chatElement?.addEventListener('scroll', handleScroll);
    return () => {
      chatElement?.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <Div ref={chatRef}>
      <ChatList />

      <Bottom ref={bottomRef} />
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
                      src={newMessagesMaster?.photo ? newMessagesMaster.photo : '/imgs/DefaultUserProfile.jpg'}
                    />
                  </NewMessageUserPhoto>
                  <span>{newMessagesMaster?.nickname}</span>
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

const Sticky = styled.div`
  position: sticky;
  bottom: 0;
  right: 0;
`;

const Div = styled.div`
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

const Bottom = styled.div``;

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
