import { useParams, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';

import ChatSection from './component/ChatSection';
import ChatProvider from './contexts/ChatProvider';

export default function ChatPage() {
  const { id: chatRoomId } = useParams();
  const [searchParams] = useSearchParams();

  const opponentIds = searchParams.getAll('opponentIds');

  const isTemp = chatRoomId === 'temp' ? null : chatRoomId;

  return (
    <ChatProvider value={{ chatRoomId: isTemp, opponentIds }}>
      <MainContainer>
        <ChatSection />
      </MainContainer>
    </ChatProvider>
  );
}

const MainContainer = styled.main`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
`;
