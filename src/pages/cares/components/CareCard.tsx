import { Link } from 'react-router-dom';
import styled from '@emotion/styled';

import { ImageCentered, RoundedImageWrapper } from '@/styles/commonStyle';
import { formatStatus } from '@/utils/misc';
import { dayFormat, timeRange } from '@/utils/date';
import type { Reservation } from '@/types/reservation.type';
import type { Pet } from '@/types/pet.type';
import { Text } from '@/components/styled/Text';
import Flex from '@/components/styled/Flex';
import Box from '@/components/styled/Box';

interface CareCardProps {
  reservation: Reservation;
}

export default function CareCard({ reservation }: CareCardProps) {
  return (
    <Link to={`/cares/${reservation?.id}`}>
      <Box p="xl" br="lg" shadow="dp01">
        <Flex direction="column" gap="sm">
          <Flex justifyContent="space-between">
            <Flex alignItems="center" gap="sm">
              <PetsitterImage>
                <ImageCentered
                  src={
                    reservation?.petsitter?.photo ? `${reservation?.petsitter.photo}` : '/imgs/DefaultUserProfile.jpg'
                  }
                />
              </PetsitterImage>
              <Flex alignItems="flex-end" gap="xs">
                <Text size="base">{reservation?.petsitter?.nickname}</Text>
                <Text size="sm">펫시터님</Text>
              </Flex>
            </Flex>
            <Text size="lg" weight="semibold" color="highlight">
              {formatStatus(reservation?.status)}
            </Text>
          </Flex>

          <Flex direction="column">
            <Flex alignItems="center" gap="xs">
              <Text size="sm">일시:</Text>
              <Text size="xs">
                {reservation?.date} ({dayFormat(reservation?.date)})
              </Text>
            </Flex>
            <Flex alignItems="center" gap="xs">
              <Text size="sm">시간:</Text>
              <Text size="xs">{timeRange(reservation?.startTime, reservation?.endTime)}</Text>
            </Flex>
            <Flex alignItems="center" gap="xs">
              <Text size="sm">맡기실 펫:</Text>
              <Flex gap="xs">
                {reservation?.pets.map((pet: Pet) => (
                  <Text key={pet.id} size="xs" weight="bold">
                    {pet.name}
                  </Text>
                ))}
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Box>
    </Link>
  );
}

const PetsitterImage = styled(RoundedImageWrapper)`
  width: 60px;
  height: 60px;
  border: 2px solid ${({ theme }) => theme.colors.line.box.highlight};
`;
