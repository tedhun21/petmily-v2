import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import styled from '@emotion/styled';
import { FiMenu } from 'react-icons/fi';
import { FaArrowLeft } from 'react-icons/fa6';

import type { ChatMember } from '@/types/chat.type';
import ChatRoomDrawer from './ChatRoomDrawer';
import { useChat } from '../contexts/ChatProvider';
import Text from '@/components/styled/Text';
import { IconButton } from '@/components/styled/IconButtonAndLink';

export default function ChatHeader() {
  const navigate = useNavigate();
  const {
    chatRoomValues: { otherMembers },
  } = useChat();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleDrawerToggle = () => {
    setIsDrawerOpen((prev) => !prev);
  };

  return (
    <Header>
      <IconButton type="button" onClick={() => navigate(-1)}>
        <FaArrowLeft />
      </IconButton>
      <Text size="xl">{otherMembers?.map((other: ChatMember) => other?.user?.nickname)?.join(', ')}</Text>
      <IconButton type="button" onClick={handleDrawerToggle}>
        <FiMenu size="28px" color="#279EFF" />
      </IconButton>
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
