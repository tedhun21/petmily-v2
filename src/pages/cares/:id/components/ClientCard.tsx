import styled from '@emotion/styled';

import type { User } from '@/types/user.type';
import Text from '@/components/styled/Text';
import { ImageCentered, RoundedImageWrapper } from '@/styles/commonStyle';
import Flex from '@/components/styled/Flex';
import Box from '@/components/styled/Box';
import Link from '@/components/styled/Link';

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
    <Box p="xl" br="lg" shadow="dp03">
      <Flex justifyContent="space-between">
        <Flex gap="sm">
          <ClientImage>
            <ImageCentered
              src={client?.photo ? `${client?.photo}` : '/imgs/DefaultUserProfile.jpg'}
              alt="client_photo"
            />
          </ClientImage>
          <Text size="lg" weight="semibold">
            {client?.nickname} 님
          </Text>
        </Flex>

        <Link to={`/chats/temp?${params.toString()}`} type="text">
          채팅 하기
        </Link>
      </Flex>
    </Box>
  );
}

const ClientImage = styled(RoundedImageWrapper)`
  width: 80px;
  height: 80px;
  border: 2px solid ${({ theme }) => theme.colors.line.box.highlight};
`;
