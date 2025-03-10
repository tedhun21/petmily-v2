import styled from 'styled-components';
import ChatRoomList from './component/ChatRoomList';
import TopHeader from '@components/headers/TopHeader';

export default function Chats() {
  return (
    <>
      <Shadow>
        <TopHeader />
      </Shadow>
      <ChatRoomList />
    </>
  );
}

const Shadow = styled.div`
  box-shadow: ${({ theme }) => theme.shadow.onlyBottom};
`;
