import styled from 'styled-components';

import ChatRoomProvider from './component/ChatRoomProvider';
import ChatSection from './component/ChatSection';
import { useParams, useSearchParams } from 'react-router-dom';
import MessageProvider from './component/MessageProvider';

export default function ChatPage() {
  const { id: chatRoomId } = useParams();
  const [searchParams] = useSearchParams();

  const opponentIds = searchParams.getAll('opponentIds');

  const isTemp = chatRoomId === 'temp' ? null : chatRoomId;

  return (
    <ChatRoomProvider value={{ chatRoomId: isTemp, opponentIds }}>
      <MessageProvider>
        <MainContainer>
          <ChatSection />
        </MainContainer>
      </MessageProvider>
    </ChatRoomProvider>
  );
}

const MainContainer = styled.main`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
`;
