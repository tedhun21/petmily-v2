import { useParams } from 'react-router-dom';

import styled from 'styled-components';

import ChatProvider from './component/ChatProvider';
import ChatHeader from './component/ChatHeader';
import ChatFooter from './component/ChatFooter';
import ChatList from './component/ChatList';

export default function Chat() {
  const { opponentId } = useParams<{ opponentId: string }>();

  return (
    <ChatProvider value={{ opponentId }}>
      <MainContainer>
        <ChatHeader />

        <ChatList />

        <ChatFooter />
      </MainContainer>
    </ChatProvider>
  );
}

const MainContainer = styled.main`
  display: flex;
  flex-direction: column;
  height: 100vh;

  header {
    flex: 1;
  }

  > div {
    flex: auto;
  }

  footer {
    flex: 1;
  }
`;
