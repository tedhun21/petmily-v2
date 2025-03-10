import styled from 'styled-components';

import ChatRoomProvider from './component/ChatRoomProvider';
import ChatHeader from './component/ChatHeader';
import ChatSection from './component/ChatSection';
import { useParams, useSearchParams } from 'react-router-dom';

export default function Chat() {
  const { chatRoomId } = useParams();
  const [searchParams] = useSearchParams();

  const opponentIds = searchParams.getAll('opponentIds');

  return (
    <ChatRoomProvider value={{ chatRoomId, opponentIds }}>
      <MainContainer>
        <ChatHeader />

        <ChatSection />
      </MainContainer>
    </ChatRoomProvider>
  );
}

const MainContainer = styled.main`
  display: flex;
  flex-direction: column;
  height: 100vh;

  > header {
    flex: 1;
  }

  > section {
    flex: auto;
    height: 100%;
  }
`;
