import styled from '@emotion/styled';
import ChatRoomList from './components/ChatRoomList';
import TopHeader from '@components/headers/TopHeader';

export default function ChatsPage() {
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
