import styled from 'styled-components';

import { Column, DefaultLink, ImageCentered, RoundedImageWrapper, Row } from 'styles/commonStyle';
import { formatStatus } from 'utils/misc';
import { dayFormat, timeRange } from 'utils/date';
import { Reservation } from 'types/reservation.type';
import { Pet } from 'types/pet.type';
import { Text } from 'styles/common/Text';

interface CareCardProps {
  reservation: Reservation;
}

export default function CareCard({ reservation }: CareCardProps) {
  return (
    <Card to={`/cares/${reservation?.id}`}>
      <FirstContainer>
        <PetsitterContainer>
          <PetsitterImage>
            <ImageCentered
              src={reservation?.petsitter?.photo ? `${reservation?.petsitter.photo}` : '/imgs/DefaultUserProfile.jpg'}
            />
          </PetsitterImage>
          <PetsitterName>
            <Text $size="base">{reservation?.petsitter?.nickname}</Text>
            <Text $size="sm">펫시터님</Text>
          </PetsitterName>
        </PetsitterContainer>
        <Text $size="lg" $weight="semibold" $color="highlight">
          {formatStatus(reservation?.status)}
        </Text>
      </FirstContainer>

      <ReservationContainer>
        <Wrapper>
          <Text $size="sm">일시:</Text>
          <Text $size="xs">
            {reservation?.date} ({dayFormat(reservation?.date)})
          </Text>
        </Wrapper>
        <Wrapper>
          <Text $size="sm">시간:</Text>
          <Text $size="xs">{timeRange(reservation?.startTime, reservation?.endTime)}</Text>
        </Wrapper>
        <Wrapper>
          <Text $size="sm">맡기실 펫:</Text>
          <PetWrapper>
            {reservation?.pets.map((pet: Pet) => (
              <Text $size="xs" key={pet.id}>
                {pet.name}
              </Text>
            ))}
          </PetWrapper>
        </Wrapper>
      </ReservationContainer>
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

const FirstContainer = styled(Row)`
  justify-content: space-between;
  width: 100%;
`;

const PetsitterContainer = styled(Row)`
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const PetsitterName = styled(Row)`
  gap: ${({ theme }) => theme.spacing.xs};
  align-items: flex-end;
`;

const PetsitterImage = styled(RoundedImageWrapper)`
  width: 60px;
  height: 60px;
  border: 2px solid ${({ theme }) => theme.colors.line.box.highlight};
`;

const ReservationContainer = styled(Column)`
  /* gap: ${({ theme }) => theme.spacing.xs}; */
`;

const Wrapper = styled(Row)`
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const PetWrapper = styled(Row)`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};

  > span {
    font-weight: ${({ theme }) => theme.fontWeight.bold};
    ${({ theme }) => theme.typeScale.xs};
  }
`;
