import styled from 'styled-components';
import ChatRoomList from './component/ChatRoomList';
import TopHeader from '@components/headers/TopHeader';
import ChatRoomsProvider from './component/ChatRoomsProvider';

export default function ChatsPage() {
  return (
    <>
      <Shadow>
        <TopHeader />
      </Shadow>
      <ChatRoomsProvider>
        <ChatRoomList />
      </ChatRoomsProvider>
    </>
  );
}

const Shadow = styled.div`
  box-shadow: ${({ theme }) => theme.shadow.onlyBottom};
`;
