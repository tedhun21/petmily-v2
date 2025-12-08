import { useParams, useSearchParams } from 'react-router-dom';

import ChatSection from './component/ChatSection';
import ChatProvider from './contexts/ChatProvider';

export default function ChatPage() {
  const { id: chatRoomId } = useParams();
  const [searchParams] = useSearchParams();

  const opponentIds = searchParams.getAll('opponentIds');

  const isTemp = chatRoomId === 'temp' ? null : chatRoomId;

  return (
    <ChatProvider value={{ chatRoomId: isTemp, opponentIds }}>
      <ChatSection />
    </ChatProvider>
  );
}
