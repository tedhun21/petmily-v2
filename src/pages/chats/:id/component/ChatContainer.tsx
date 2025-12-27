import { useRef } from 'react';
import styled from '@emotion/styled';
import { FaChevronDown } from 'react-icons/fa6';

import { ImageCentered, RoundedImageWrapper } from '@/styles/commonStyle';

import MessageList from './MessageList';
import Spinner from '@/components/Spinner';
import { useChat } from '../contexts/ChatProvider';
import { useChatUIEffects } from '../hooks/useChatUIEffects';
import Button from '@/components/styled/Button';
import Text from '@/components/styled/Text';
import Box from '@/components/styled/Box';
import Flex from '@/components/styled/Flex';
import { IconButton } from '@/components/styled/IconButtonAndLink';

export default function ChatContainer() {
  const {
    chatRoomValues: { meMember },
    messageValues: { messages, isLoading, isValidating, isEnd, setSize, newMessages },
  } = useChat();
  const chatRef = useRef<HTMLDivElement | null>(null);

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
    <div ref={chatRef}>
      {isLoading && messages.length === 0 ? (
        <Flex justifyContent="center" alignItems="center">
          <Spinner />
        </Flex>
      ) : !isLoading && messages.length > 0 ? (
        <>
          <MessageList />
          <Sticky>
            <AbsoluteBottom>
              {downButtonState.state === 'default' && (
                <Box pb="sm">
                  <Flex justifyContent="center" alignItems="center">
                    <IconButton onClick={() => scrollToBottom({ behavior: 'smooth' })} variant="clear">
                      <FaChevronDown size="20px" />
                    </IconButton>
                  </Flex>
                </Box>
              )}
              {downButtonState.state === 'newMessage' && (
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
              )}
            </AbsoluteBottom>
          </Sticky>
        </>
      ) : null}
    </div>
  );
}

const Sticky = styled.div`
  position: sticky;
  bottom: 0;
`;

const AbsoluteBottom = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
`;

// TODO
const NewMessageUser = styled.div`
  display: flex;
  flex: auto;
  align-items: center;

  gap: ${({ theme }) => theme.space.xs};
`;

const NewMessageUserPhoto = styled(RoundedImageWrapper)`
  width: 32px;
  height: 32px;
`;
