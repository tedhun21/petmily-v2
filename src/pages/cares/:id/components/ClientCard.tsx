import styled from 'styled-components';

import { User } from 'types/user.type';
import { Text } from '@components/Text';
import { ImageCentered, RoundedImageWrapper } from 'styles/commonStyle';
import { flex, Flex } from '@components/Flex';
import Box from '@components/Box';
import Link from '@components/Link';

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
    <Container>
      <Flex gap="sm">
        <ClientImage>
          <ImageCentered src={client?.photo ? `${client?.photo}` : '/imgs/DefaultUserProfile.jpg'} alt="client_photo" />
        </ClientImage>
        <Text size="lg" weight="semibold">
          {client?.nickname} 님
        </Text>
      </Flex>

      <Link to={`/chats/temp?${params.toString()}`} type="text">
        채팅 하기
      </Link>
    </Container>
  );
}

const Container = styled(Box).attrs(() => ({
  p: 'xl',
  br: 'lg',
  shaodw: 'dp03',
}))`
  ${flex({
    justifyContent: 'space-between',
  })}
`;

const ClientImage = styled(RoundedImageWrapper)`
  width: 80px;
  height: 80px;
  border: 2px solid ${({ theme }) => theme.colors.line.box.highlight};
`;
