import { ImageCentered, RoundedImageWrapper, Row, Texts18h28 } from 'styles/commonStyle';
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
  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.spacing.xl};
  box-shadow: ${({ theme }) => theme.shadow.dp03};
`;

const ImageName = styled(Row)`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ClientImage = styled(RoundedImageWrapper)`
  width: 80px;
  height: 80px;
  border: 2px solid ${({ theme }) => theme.colors.line.box.highlight};
`;

const ClientName = styled(Texts18h28)`
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
`;

const StyledLink = styled(Link)`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.background.box.blue.primary};
  border-radius: ${({ theme }) => theme.radius.base};
  color: ${({ theme }) => theme.colors.text.white};

  &:hover {
    background-color: ${({ theme }) => theme.colors.background.box.blue.hover};
  }

  &:active {
    background-color: ${({ theme }) => theme.colors.background.box.blue.active};
    box-shadow: ${({ theme }) => theme.shadow.inset};
  }

  > span {
    color: inherit;
  }
`;
