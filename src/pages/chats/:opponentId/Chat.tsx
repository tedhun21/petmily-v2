import { useParams } from 'react-router-dom';

import styled from 'styled-components';

import ChatProvider from './component/ChatProvider';
import ChatHeader from './component/ChatHeader';
import ChatSection from './component/ChatSection';

export default function Chat() {
  const { opponentId } = useParams<{ opponentId: string }>();

  return (
    <ChatProvider value={{ opponentId }}>
      <MainContainer>
        <ChatHeader />

        <ChatSection />
      </MainContainer>
    </ChatProvider>
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
  }
`;
