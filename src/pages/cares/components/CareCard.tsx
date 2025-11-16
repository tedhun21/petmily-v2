import styled from 'styled-components';

import { DefaultLink, ImageCentered, RoundedImageWrapper } from 'styles/commonStyle';
import { formatStatus } from 'utils/misc';
import { dayFormat, timeRange } from 'utils/date';
import { Reservation } from 'types/reservation.type';
import { Pet } from 'types/pet.type';
import { Text } from '@components/Text';
import { Flex } from '@components/Flex';

interface CareCardProps {
  reservation: Reservation;
}

export default function CareCard({ reservation }: CareCardProps) {
  return (
    <Card to={`/cares/${reservation?.id}`}>
      <Flex justifyContent="space-between">
        <Flex alignItems="center" gap="sm">
          <PetsitterImage>
            <ImageCentered
              src={reservation?.petsitter?.photo ? `${reservation?.petsitter.photo}` : '/imgs/DefaultUserProfile.jpg'}
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

      <Flex>
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
    </Card>
  );
}

const Card = styled(DefaultLink)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.radius.lg};

  &:hover {
    box-shadow: ${({ theme }) => theme.shadow.dp02};
  }
`;

const PetsitterImage = styled(RoundedImageWrapper)`
  width: 60px;
  height: 60px;
  border: 2px solid ${({ theme }) => theme.colors.line.box.highlight};
`;
