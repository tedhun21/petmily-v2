import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import styled from 'styled-components';
import { FaArrowLeft } from 'react-icons/fa6';
import { FiMenu } from 'react-icons/fi';

import { ChatRoomContext } from './ChatRoomProvider';
import { Texts20h30 } from 'styles/commonStyle';

export default function ChatHeader() {
  const navigate = useNavigate();
  const { chatRoom } = useContext(ChatRoomContext);

  const others = chatRoom?.chatMembers.others;

  return (
    <Header>
      <StyledBackButton onClick={() => navigate(-1)}>
        <FaArrowLeft color="#279EFF" size="24px" />
      </StyledBackButton>
      <Texts20h30>{others?.map((other: any) => other?.nickname)?.join(', ')}</Texts20h30>
      <button>
        <FiMenu size="24px" color="#279EFF" />
      </button>
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
