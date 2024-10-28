import { Link } from 'react-router-dom';

export default function ClientCard({ client }: any) {
  return (
    <div>
      <span>{client?.nickname}</span>
      <Link to={`/chats/${client?.id}`}>채팅 하기</Link>
    </div>
  );
}
