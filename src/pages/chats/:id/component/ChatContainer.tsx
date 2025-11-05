import { useRef } from 'react';
import styled from 'styled-components';
import { FaChevronDown } from 'react-icons/fa6';

import { Center, ImageCentered, RoundedImageWrapper, Row, Texts14h20 } from 'styles/commonStyle';

import MessageList from './MessageList';
import Loading from '@components/Loading';
import { useChat } from '../contexts/ChatProvider';
import { useChatUIEffects } from '../hooks/useChatUIEffects';
import { Button } from '@components/buttons/Button';

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
        <Center>
          <Loading />
        </Center>
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

                    <FaChevronDown size="16px" />
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
  flex: 1;
  overflow-y: auto;
`;

const Sticky = styled.div`
  position: sticky;
  right: 0;
  bottom: 0;
`;

const AbsoluteBottomCenter = styled.div`
  position: absolute;
  bottom: ${({ theme }) => theme.spacing.sm};
  left: 50%;
  transform: translateX(-50%);
`;

const AbsolutBottom = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
`;

const BottomWrapper = styled(Row)`
  padding: ${({ theme }) => theme.spacing.md};
`;

const NewMessageButton = styled(Button).attrs(() => ({ $variant: 'secondary', $size: 'md', $borderRadius: 'lg' }))`
  width: 100%;

  opacity: 0.9;
`;

const NewMessageUser = styled(Row)`
  flex: auto;
  align-items: center;

  gap: ${({ theme }) => theme.spacing.xs};
`;

const NewMessageUserPhoto = styled(RoundedImageWrapper)`
  width: 32px;
  height: 32px;
`;

const NewMessage = styled(Texts14h20)`
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  text-align: start;
`;

const DownButton = styled(Button).attrs(() => ({
  $variant: 'secondary',
  $borderRadius: 'circle',
}))`
  padding: ${({ theme }) => theme.spacing.sm};
`;
