import { useRef } from 'react';
import styled from 'styled-components';
import { FaChevronDown } from 'react-icons/fa6';

import { Button, CenterContainer, ImageCentered, RoundedImageWrapper, Texts14h21 } from 'styles/commonStyle';

import MessageList from './MessageList';
import Loading from '@components/Loading';
import { useChat } from '../contexts/ChatProvider';
import { useChatUIEffects } from '../hooks/useChatUIEffects';

export default function ChatContainer() {
  const {
    chatRoomValues: { meMember },
    messageValues: { messages, isLoading, isValidating, isEnd, setSize, newMessages },
  } = useChat();
  const chatRef = useRef<HTMLDivElement>(null);

  const { downButtonState, scrollToBottom } = useChatUIEffects({
    scrollRef: chatRef,
    chatRoomOptions: {
      meMember,
    },
    messageOptions: {
      messages,
      isLoading,
      isValidating,
      isEnd,
      setSize,
      newMessages,
    },
  });

  return (
    <Container ref={chatRef}>
      {isLoading && messages.length === 0 ? (
        <CenterContainer>
          <Loading />
        </CenterContainer>
      ) : !isLoading && messages.length > 0 ? (
        <>
          <MessageList />
          <Sticky>
            {downButtonState.state === 'default' && (
              <AbsoluteBottomCenter>
                <DownButton type="button" onClick={() => scrollToBottom({ behavior: 'smooth' })}>
                  <FaChevronDown size="16px" />
                </DownButton>
              </AbsoluteBottomCenter>
            )}
            {downButtonState.state === 'newMessage' && (
              <AbsolutBottom>
                <BottomWrapper>
                  <NewMessageButton type="button" onClick={() => scrollToBottom({ behavior: 'smooth' })}>
                    <NewMessageUser>
                      <NewMessageUserPhoto>
                        <ImageCentered
                          src={downButtonState.lastestNewMessages?.sender?.photo || '/imgs/DefaultUserProfile.jpg'}
                        />
                      </NewMessageUserPhoto>
                      <span>{downButtonState.lastestNewMessages?.sender.nickname}</span>
                      <NewMessage>{downButtonState.lastestNewMessages?.content}</NewMessage>
                    </NewMessageUser>
                    <div style={{ padding: '8px' }}>
                      <FaChevronDown size="16px" />
                    </div>
                  </NewMessageButton>
                </BottomWrapper>
              </AbsolutBottom>
            )}
          </Sticky>
        </>
      ) : null}
    </Container>
  );
}

const Container = styled.div`
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
