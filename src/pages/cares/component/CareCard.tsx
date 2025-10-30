import styled from 'styled-components';

import {
  Column,
  DefaultLink,
  ImageCentered,
  RoundedImageWrapper,
  Row,
  Texts12h16,
  Texts14h20,
  Texts16h24,
  Texts18h28,
} from 'styles/commonStyle';
import { formatStatus } from 'utils/misc';
import { dayFormat, timeRange } from 'utils/date';
import { Reservation } from 'types/reservation.type';
import { Pet } from 'types/pet.type';

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
            <Texts16h24>{reservation?.petsitter?.nickname}</Texts16h24>
            <Texts14h20>펫시터님</Texts14h20>
          </PetsitterName>
        </PetsitterContainer>
        <PropgressSpan>{formatStatus(reservation?.status)}</PropgressSpan>
      </FirstContainer>

      <ReservationContainer>
        <Wrapper>
          <Texts14h20>일시:</Texts14h20>
          <Texts12h16>
            {reservation?.date} ({dayFormat(reservation?.date)})
          </Texts12h16>
        </Wrapper>
        <Wrapper>
          <Texts14h20>시간:</Texts14h20>
          <Texts12h16>{timeRange(reservation?.startTime, reservation?.endTime)}</Texts12h16>
        </Wrapper>
        <Wrapper>
          <Texts14h20>맡기실 펫:</Texts14h20>
          <PetWrapper>
            {reservation?.pets.map((pet: Pet) => (
              <Texts12h16 key={pet.id}>{pet.name}</Texts12h16>
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
  gap: 8px;
  padding: 20px;
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
  gap: 8px;
`;

const PetsitterName = styled(Row)`
  gap: 4px;
  align-items: flex-end;
`;

const PetsitterImage = styled(RoundedImageWrapper)`
  width: 60px;
  height: 60px;
  border: 2px solid ${({ theme }) => theme.colors.line.box.highlight};
`;

const ReservationContainer = styled(Column)`
  /* gap: 4px; */
`;

const Wrapper = styled(Row)`
  align-items: center;
  gap: 4px;
`;

const PetWrapper = styled(Row)`
  display: flex;
  gap: 4px;

  > span {
    font-weight: ${({ theme }) => theme.fontWeight.bold};
    ${({ theme }) => theme.typeScale.xs};
  }
`;

const PropgressSpan = styled(Texts18h28)`
  color: ${({ theme }) => theme.colors.text.highlight};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
`;
