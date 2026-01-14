import ChatProvider from './contexts/ChatProvider';
import ChatHeader from './component/ChatHeader';
import ChatContainer from './component/ChatContainer';
import MessageInput from './component/MessageInput';
import styled from '@emotion/styled';

export default function ChatPage() {
  return (
    <ChatProvider>
      <Wrapper css={{ position: 'relative' }}>
        <ChatHeader />
        <ChatContainer />
        <MessageInput />
      </Wrapper>
    </ChatProvider>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;

  > header {
    flex-shrink: 0; /* 높이가 줄어들지 않도록 고정 */
  }

  > div {
    flex-grow: 1; /* 남은 공간을 모두 차지 */
    overflow: hidden;
  }

  > footer {
    flex-shrink: 0;
  }
`;
