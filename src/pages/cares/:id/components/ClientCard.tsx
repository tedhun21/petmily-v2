import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { User } from 'types/user.type';
import { Text } from 'styles/common/Text';
import { Button } from 'styles/common/Button';
import { ImageCentered, RoundedImageWrapper, Row } from 'styles/commonStyle';

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
        <Text $size="lg" $weight="semibold">
          {client?.nickname} 님
        </Text>
      </ImageName>

      <Button as={Link} to={`/chats/temp?${params.toString()}`} $variant="primary">
        채팅 하기
      </Button>
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
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ClientImage = styled(RoundedImageWrapper)`
  width: 80px;
  height: 80px;
  border: 2px solid ${({ theme }) => theme.colors.line.box.highlight};
`;
