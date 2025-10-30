import { ImageCentered, RoundedImageWrapper, Row, Texts18h27 } from 'styles/commonStyle';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { User } from 'types/user.type';

interface ClientCardProps {
  client: User;
}

export default function ClientCard({ client }: ClientCardProps) {
  const opponentIds = [client?.id];
  const params = new URLSearchParams();
  if (client?.id !== undefined) {
    opponentIds.forEach((id) => params.append('opponentIds', id.toString())); // opponentIds=1&opponentIds=2
  }

  return (
    <Card>
      <ImageName>
        <ClientImage>
          <ImageCentered src={client?.photo ? `${client?.photo}` : '/imgs/DefaultUserProfile.jpg'} alt="client_photo" />
        </ClientImage>
        <ClientName>{client?.nickname} 님</ClientName>
      </ImageName>

      <StyledLink to={`/chats/temp?${params.toString()}`}>채팅 하기</StyledLink>
    </Card>
  );
}

const Card = styled.section`
  display: flex;
  justify-content: space-between;
  padding: 20px;
  border-radius: 20px;
  box-shadow: ${({ theme }) => theme.shadow.dp03};
`;

const ImageName = styled(Row)`
  display: flex;
  gap: 8px;
`;

const ClientImage = styled(RoundedImageWrapper)`
  width: 80px;
  height: 80px;
  border: 2px solid ${({ theme }) => theme.line.box.highlight};
`;

const ClientName = styled(Texts18h27)`
  font-weight: ${({ theme }) => theme.fontWeight.bold};
`;

const StyledLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: ${({ theme }) => theme.radius.normal};
  color: white;
  background-color: ${({ theme }) => theme.background.box.blue.primary};

  &:hover {
    background-color: ${({ theme }) => theme.background.box.blue.hover};
  }

  &:active {
    background-color: ${({ theme }) => theme.background.box.blue.active};
    box-shadow: ${({ theme }) => theme.shadow.inset};
  }

  > span {
    color: inherit;
  }
`;
