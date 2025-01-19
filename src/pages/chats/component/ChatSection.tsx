import ChatList from './ChatList';
import styled from 'styled-components';
import ChatFooter from './ChatFooter';

export default function ChatSection() {
  return (
    <Section>
      <ChatList />
      <ChatFooter />
    </Section>
  );
}

const Section = styled.section`
  display: flex;
  flex-direction: column;
  height: 100%;

  list {
    flex: auto;
  }

  footer {
    flex: 1;
  }
`;
