import { useContext, useEffect, useRef, useState } from 'react';

import styled from 'styled-components';
import { useInView } from 'framer-motion';
import { FaChevronDown } from 'react-icons/fa6';

import { ChatUser, Message } from 'types/message.type';
import { Button, ImageCentered, RoundedImageWrapper, Texts14h21 } from 'styles/commonStyle';
import { ChatContext } from './ChatRoomProvider';
import ChatMessage from './ChatMessage';

export default function ChatContainer({ messages, newMessage, setNewMessage, isLoading, setSize }: any) {
  const { chatRoom } = useContext(ChatContext);
  const chatRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const isBottomInView = useInView(bottomRef);

  const [isFirstRender, setIsFirstRender] = useState(true);

  const [showDownButton, setShowDownButton] = useState<boolean>(false);
  const [showNewMessage, setShowNewMessage] = useState<boolean>(false);

  const newMessageSender = newMessage
    ? chatRoom?.chatMembers.others?.find((other: ChatUser) => other.id === newMessage?.sender.id)
    : null;

  const scrollToBottom = () => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // 처음 들어오면 채팅창 제일 밑
  useEffect(() => {
    if (bottomRef.current && messages.length > 0 && !isLoading && isFirstRender) {
      bottomRef.current?.scrollIntoView();

      setIsFirstRender(false);
    }
  }, [messages, isLoading]);

  // 새 메세지가 왔을 때, 바닥 포커스
  // 바닥에 포커스 되어있을 때, 새 매세지가 올때
  // 바닥에 포커스 안 되어있을 때, 내가 작성하면 바닥에 포커스
  useEffect(() => {
    if (newMessage) {
      const myMessage = newMessage.sender.id === chatRoom?.chatMembers.me?.user.id;

      if (isBottomInView || myMessage) {
        scrollToBottom();
        setShowNewMessage(false); // 내 메시지거나 바닥이면 새 메시지 안 보여줌
      } else {
        setShowNewMessage(true); // 내가 보낸 게 아니고 바닥이 아닐 때만 표시
      }
    }
  }, [newMessage]);

  useEffect(() => {
    if (isBottomInView) {
      setNewMessage(false);
      setShowNewMessage(false); // 바닥에 있으면 새 메시지 UI 숨김
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

        // 스크롤이 80% 이상이면 버튼 숨기기, 아니면 표시
        if (scrollPercentage < 80) {
          setShowDownButton(true);
        }

        // 스크롤이 끝에 도달했을 때 초기화
        if (scrollPercentage >= 100) {
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

  return (
    <Div ref={chatRef}>
      <div style={{ height: '100%' }}>
        <List>
          {messages.map((message: Message, index: number) => {
            const isMyMessage = message.sender.id === chatRoom?.chatMembers.me?.user.id;
            const previousMessage = index > 0 ? messages[index - 1] : undefined;
            const nextMessage = index < messages.length - 1 ? messages[index + 1] : undefined;

            return (
              <ChatMessage
                key={message.id}
                index={index}
                message={message}
                isMyMessage={isMyMessage}
                previousMessage={previousMessage}
                nextMessage={nextMessage}
                setSize={setSize}
              />
            );
          })}
        </List>
        <Bottom ref={bottomRef} />
      </div>

      {!newMessage && showDownButton && (
        <Fixed>
          <AbsoluteBottomRight>
            <DownButton type="button" onClick={scrollToBottom}>
              <FaChevronDown size="20px" />
            </DownButton>
          </AbsoluteBottomRight>
        </Fixed>
      )}

      {showNewMessage && !isBottomInView && (
        <Fixed>
          <AbsoluteFixedBottom>
            <BottomWrapper>
              <NewMessageButton type="button" onClick={scrollToBottom}>
                <NewMessageUser>
                  <NewMessageUserPhoto>
                    <ImageCentered
                      src={newMessage.sender.photo ? newMessage.sender.photo : '/imgs/DefaultUserProfile.jpg'}
                    />
                  </NewMessageUserPhoto>
                  <span>{newMessageSender?.nickname}</span>
                  <NewMessage>{newMessage.content}</NewMessage>
                </NewMessageUser>

                <div style={{ padding: '8px' }}>
                  <FaChevronDown size="16px" />
                </div>
              </NewMessageButton>
            </BottomWrapper>
          </AbsoluteFixedBottom>
        </Fixed>
      )}
    </Div>
  );
}

const Div = styled.div`
  height: 100%;
  overflow-y: auto;
`;

const List = styled.ul`
  display: flex;
  flex-direction: column;
  padding: 12px;
  gap: 8px;
`;

const Bottom = styled.div``;

// 이해 안 가는 부분:
// fixed가 뷰포트 기준이라는데
// 스크롤이되는 부모 엘리먼트 안에 있으면
// 그 부모 엘리먼트를 기준으로 따라간다
// 부모의 크기가 정확히 정해져서 그 부모의 하단이 뷰포트의 하단과 일치하는 경우,
// fixed 요소가 뷰포트를 기준으로 배치되더라도 부모의 경계와 동일하게 보이게 된다.
// 즉, 부모의 크기가 마치 뷰포트처럼 계산되면 fixed 요소가 그 부모 내부에 고정되어 있는 것처럼 보이게 된다.
// 하지만 실제로 fixed는 항상 뷰포트를 기준으로 하므로, 부모의 크기가 다르면 그 모습도 달라질 수 있다.
const Fixed = styled.div`
  position: fixed;
  width: 100%;
  max-width: 600px;
`;

const AbsoluteBottomRight = styled.div`
  position: absolute;
  right: 8px;
  bottom: 8px;
`;

const AbsoluteFixedBottom = styled.div`
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
  padding: 12px;
  border-radius: ${({ theme }) => theme.radius.circle};
  opacity: 0.9;
`;
