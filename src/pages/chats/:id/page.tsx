import styled from 'styled-components';

import ChatRoomProvider from './component/ChatRoomProvider';
import ChatHeader from './component/ChatHeader';
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
          <ChatHeader />

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

  // 보통 크기를 고정하거나 콘텍츠에 딱 맞추기
  > header {
    flex: 0 0 auto;
  }

  // 남은 공간을 다 차지
  > section {
    flex: 1 1 auto;
  }
`;
