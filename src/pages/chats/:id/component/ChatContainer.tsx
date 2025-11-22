import { useRef } from 'react';
import styled from '@emotion/styled';
import { FaChevronDown } from 'react-icons/fa6';

import { ImageCentered, RoundedImageWrapper } from '@/styles/commonStyle';

import MessageList from './MessageList';
import Loading from '@components/Loading';
import { useChat } from '../contexts/ChatProvider';
import { useChatUIEffects } from '../hooks/useChatUIEffects';
import { Button } from '@/components/styled/Button';
import { Text } from '@components/styled/Text';
import Box from '@components/styled/Box';
import Flex from '@components/styled/Flex';

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
        <Flex justifyContent="center" alignItems="center">
          <Loading />
        </Flex>
      ) : !isLoading && messages.length > 0 ? (
        <>
          <MessageList />
          <Sticky>
            {downButtonState.state === 'default' && (
              <AbsoluteBottomCenter>
                <Button
                  type="button"
                  onClick={() => scrollToBottom({ behavior: 'smooth' })}
                  variant="icon"
                  borderRadius="circle"
                >
                  <FaChevronDown size="16px" />
                </Button>
              </AbsoluteBottomCenter>
            )}
            {downButtonState.state === 'newMessage' && (
              <AbsolutBottom>
                <Box p="md">
                  <Flex>
                    <Button
                      type="button"
                      onClick={() => scrollToBottom({ behavior: 'smooth' })}
                      variant="secondary"
                      size="md"
                      borderRadius="lg"
                      fullWidth
                      style={{ opacity: 0.9 }}
                    >
                      <NewMessageUser>
                        <NewMessageUserPhoto>
                          <ImageCentered
                            src={downButtonState.lastestNewMessages?.sender?.photo || '/imgs/DefaultUserProfile.jpg'}
                          />
                        </NewMessageUserPhoto>
                        <span>{downButtonState.lastestNewMessages?.sender.nickname}</span>
                        <Text size="sm" weight="semibold" style={{ textAlign: 'start' }}>
                          {downButtonState.lastestNewMessages?.content}
                        </Text>
                      </NewMessageUser>

                      <FaChevronDown size="16px" />
                    </Button>
                  </Flex>
                </Box>
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

// TODO
const NewMessageUser = styled.div`
  display: flex;
  flex: auto;
  align-items: center;

  gap: ${({ theme }) => theme.spacing.xs};
`;

const NewMessageUserPhoto = styled(RoundedImageWrapper)`
  width: 32px;
  height: 32px;
`;
