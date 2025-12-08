import { useState } from 'react';

import styled from '@emotion/styled';
import { FiMenu } from 'react-icons/fi';

import type { ChatMember } from '@/types/chat.type';
import ChatRoomDrawer from './ChatRoomDrawer';
import { useChat } from '../contexts/ChatProvider';
import BackButton from '@/components/buttons/BackButton';
import { Button } from '@/components/styled/Button';
import { Text } from '@/components/styled/Text';

export default function ChatHeader() {
  const {
    chatRoomValues: { otherMembers },
  } = useChat();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleDrawerToggle = () => {
    setIsDrawerOpen((prev) => !prev);
  };

  return (
    <Header>
      <BackButton />
      <Text size="xl">{otherMembers?.map((other: ChatMember) => other?.user?.nickname)?.join(', ')}</Text>
      <Button type="button" onClick={handleDrawerToggle} variant="icon" borderRadius="circle">
        <FiMenu size="28px" color="#279EFF" />
      </Button>
      <ChatRoomDrawer isDrawerOpen={isDrawerOpen} setIsDrawerOpen={setIsDrawerOpen} />
    </Header>
  );
}

const Header = styled.header`
  display: flex;
  flex: 0 0 auto;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: ${({ theme }) => theme.space.xl};
  box-shadow: ${({ theme }) => theme.shadow.dp01};
`;
