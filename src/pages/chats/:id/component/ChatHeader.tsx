import { useState } from 'react';

import styled from 'styled-components';

import { FiMenu } from 'react-icons/fi';

import { Texts20h28 } from 'styles/commonStyle';
import { ChatMember } from 'types/chat.type';
import ChatRoomDrawer from './ChatRoomDrawer';
import { useChat } from '../contexts/ChatProvider';
import BackButton from '@components/buttons/BackButton';
import { Button } from '@components/buttons/Button';

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
      <Texts20h28>{otherMembers?.map((other: ChatMember) => other?.user?.nickname)?.join(', ')}</Texts20h28>
      <Button type="button" onClick={handleDrawerToggle} $variant="icon" $borderRadius="circle">
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
  padding: ${({ theme }) => theme.spacing.xl};
  box-shadow: ${({ theme }) => theme.shadow.dp01};
`;
