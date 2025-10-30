import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import styled from 'styled-components';
import { FaArrowLeft } from 'react-icons/fa6';
import { FiMenu } from 'react-icons/fi';

import { Texts20h28 } from 'styles/commonStyle';
import { ChatMember } from 'types/chat.type';
import ChatRoomDrawer from './ChatRoomDrawer';
import { useChat } from '../contexts/ChatProvider';

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
      <StyledBackButton onClick={() => navigate(-1)}>
        <FaArrowLeft color="#279EFF" size="24px" />
      </StyledBackButton>
      <Texts20h28>{otherMembers?.map((other: ChatMember) => other?.user?.nickname)?.join(', ')}</Texts20h28>
      <button onClick={handleDrawerToggle}>
        <FiMenu size="24px" color="#279EFF" />
      </button>
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
  padding: 20px;
  box-shadow: ${({ theme }) => theme.shadow.dp01};
`;

const StyledBackButton = styled.button`
  z-index: 2;
  background-color: transparent;
  border: none;
  cursor: pointer;
`;
