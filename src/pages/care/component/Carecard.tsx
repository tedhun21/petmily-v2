import styled from 'styled-components';
import { Link } from 'react-router-dom';

import { Column, ImageCentered, RoundedImageWrapper, Row, Texts12h18, Texts14h21, Texts16h24 } from 'commonStyle';

import { formatProgress } from 'utils/misc';
import { dayFormat, timeRange } from 'utils/date';

const BUCKET_URL = process.env.REACT_APP_BUCKET_URL;

export default function CareCard({ reservation }: any) {
  const { id, date, startTime, endTime, pets, petsitter, progress } = reservation;

  return (
    <CardLink to={`/reservations/${id}`}>
      <FirstContainer>
        <PetsitterContainer>
          <PetsitterImage>
            <ImageCentered
              src={petsitter.photo ? `${BUCKET_URL}${petsitter.photo.url}` : '/imgs/DefaultUserProfile.png'}
            />
          </PetsitterImage>
          <PetsitterName>
            <Texts16h24>{petsitter.nickname}</Texts16h24>
            <Texts14h21>펫시터님</Texts14h21>
          </PetsitterName>
        </PetsitterContainer>
        <PropgressSpan>{formatProgress(progress)}</PropgressSpan>
      </FirstContainer>
      <ReservationContainer>
        <Wrapper>
          <Texts14h21>일시:</Texts14h21>
          <Texts12h18>
            {date} ({dayFormat(date)})
          </Texts12h18>
        </Wrapper>
        <Wrapper>
          <Texts14h21>시간:</Texts14h21>
          <Texts12h18>{timeRange(startTime, endTime)}</Texts12h18>
        </Wrapper>
        <Wrapper>
          <Texts14h21>맡기실 펫:</Texts14h21>
          <PetWrapper>
            {pets.map((pet: any) => (
              <Texts12h18 key={pet.id}>{pet.name}</Texts12h18>
            ))}
          </PetWrapper>
        </Wrapper>
      </ReservationContainer>
    </CardLink>
  );
}

const CardLink = styled(Link)`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 20px;
  box-shadow: ${(props) => props.theme.shadow.dp01};
  border-radius: 16px;
  color: black;

  &:visited {
    text-decoration: none;
    color: inherit;
  }

  &:hover {
    box-shadow: ${(props) => props.theme.shadow.dp03};
  }
`;

const FirstContainer = styled(Row)`
  justify-content: space-between;
`;

const PetsitterContainer = styled(Row)`
  gap: 4px;
`;

const PetsitterName = styled(Row)`
  gap: 4px;
`;

const PetsitterImage = styled(RoundedImageWrapper)`
  width: 60px;
  height: 60px;
  border: 2px solid ${(props) => props.theme.colors.mainBlue};
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
    font-weight: ${(props) => props.theme.fontWeights.bold};
    ${({ theme }) => theme.fontSize.s12h18};
  }
`;

const PropgressSpan = styled.span`
  color: ${(props) => props.theme.colors.mainBlue};
  font-weight: ${(props) => props.theme.fontWeights.extrabold};
  ${(props) => props.theme.fontSize.s18h27}
`;

const ActiveLink = styled(Link)`
  color: white;
  cursor: pointer;
  ${({ theme }) => theme.fontSize.s14h21}
  background-color: ${({ theme }) => theme.colors.mainBlue};
  border-radius: 4px;
  padding: 4px 8px;

  &:hover {
    background-color: ${({ theme }) => theme.colors.subBlue};
  }

  &:active {
    background-color: ${({ theme }) => theme.colors.darkBlue};
    box-shadow: ${({ theme }) => theme.shadow.inset};
  }
`;