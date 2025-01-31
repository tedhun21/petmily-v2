import styled from 'styled-components';

import {
  Column,
  DefaultLink,
  ImageCentered,
  RoundedImageWrapper,
  Row,
  Texts12h18,
  Texts14h21,
  Texts16h24,
  Texts18h27,
} from 'styles/commonStyle';
import { formatStatus } from 'utils/misc';
import { dayFormat, timeRange } from 'utils/date';

export default function CareCard({ reservation }: any) {
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
            <Texts14h21>펫시터님</Texts14h21>
          </PetsitterName>
        </PetsitterContainer>
        <PropgressSpan>{formatStatus(reservation?.status)}</PropgressSpan>
      </FirstContainer>

      <ReservationContainer>
        <Wrapper>
          <Texts14h21>일시:</Texts14h21>
          <Texts12h18>
            {reservation?.date} ({dayFormat(reservation?.date)})
          </Texts12h18>
        </Wrapper>
        <Wrapper>
          <Texts14h21>시간:</Texts14h21>
          <Texts12h18>{timeRange(reservation?.startTime, reservation?.endTime)}</Texts12h18>
        </Wrapper>
        <Wrapper>
          <Texts14h21>맡기실 펫:</Texts14h21>
          <PetWrapper>
            {reservation?.pets.map((pet: any) => <Texts12h18 key={pet.id}>{pet.name}</Texts12h18>)}
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

  border-radius: ${({ theme }) => theme.radius.large};

  &:hover {
    box-shadow: ${({ theme }) => theme.shadow.dp02};
  }
`;

const FirstContainer = styled(Row)`
  width: 100%;
  justify-content: space-between;
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
  border: 2px solid ${({ theme }) => theme.line.box.highlight};
`;

const ReservationContainer = styled(Column)`
  // gap: 4px;
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
    ${({ theme }) => theme.fontSize.s12h18};
  }
`;

const PropgressSpan = styled(Texts18h27)`
  color: ${({ theme }) => theme.text.highlight};
  font-weight: ${({ theme }) => theme.fontWeight.extrabold};
`;
