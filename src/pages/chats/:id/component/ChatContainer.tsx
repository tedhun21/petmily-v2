import { useRef } from 'react';
import styled from '@emotion/styled';
import { FaChevronDown } from 'react-icons/fa6';

import { ImageCentered, RoundedImageWrapper } from '@/styles/commonStyle';

import MessageList from './MessageList';

import { useChatUIEffects } from '../hooks/useChatUIEffects';
import Button from '@/components/styled/Button';
import Text from '@/components/styled/Text';
import Box from '@/components/styled/Box';
import Flex from '@/components/styled/Flex';
import { IconButton } from '@/components/styled/IconButtonAndLink';
import { useChat } from '../contexts/ChatProvider';

export default function ChatContainer() {
  const { meMember, serverMessages, setSize, isValidating, hasNextPage } = useChat();

  const chatRef = useRef<HTMLUListElement | null>(null);

  const { downButtonState, scrollToBottom } = useChatUIEffects({
    scrollRef: chatRef,
    chatRoomOptions: { meMember },
    messageOptions: { serverMessages, setSize, isValidating, hasNextPage },
  });

  return (
    <div css={{ position: 'relative' }}>
      <MessageList ref={chatRef} />

      <div css={{ position: 'sticky', bottom: 0 }}>
        <div css={{ position: 'absolute', bottom: 0, width: '100%' }}>
          {downButtonState.state === 'default' && (
            <Box pb="sm">
              <Flex justifyContent="center" alignItems="center">
                <IconButton onClick={() => scrollToBottom({ behavior: 'smooth' })} variant="fill">
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
        </div>
      </div>
    </div>
  );
}

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
