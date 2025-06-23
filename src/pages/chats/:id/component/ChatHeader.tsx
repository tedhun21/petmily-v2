import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import styled from 'styled-components';
import { FaArrowLeft } from 'react-icons/fa6';
import { FiMenu } from 'react-icons/fi';

import { ChatRoomContext } from './ChatRoomProvider';
import { Texts20h30 } from 'styles/commonStyle';
import { ChatMember } from 'types/chat.type';
import ChatRoomDrawer from './ChatRoomDrawer';

export default function ChatHeader() {
  const navigate = useNavigate();
  const { chatRoom } = useContext(ChatRoomContext);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const others = chatRoom?.chatMembers.others;

  const handleDrawerToggle = () => {
    setIsDrawerOpen((prev) => !prev);
  };

  return (
    <Header>
      <StyledBackButton onClick={() => navigate(-1)}>
        <FaArrowLeft color="#279EFF" size="24px" />
      </StyledBackButton>
      <Texts20h30>{others?.map((other: ChatMember) => other?.user?.nickname)?.join(', ')}</Texts20h30>
      <button onClick={handleDrawerToggle}>
        <FiMenu size="24px" color="#279EFF" />
      </button>
      <ChatRoomDrawer isDrawerOpen={isDrawerOpen} setIsDrawerOpen={setIsDrawerOpen} />
    </Header>
  );
}

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 20px;
  box-shadow: ${({ theme }) => theme.shadow.dp01};
`;

const StyledBackButton = styled.button`
  z-index: 2;
  border: none;
  background-color: transparent;
  cursor: pointer;
`;
