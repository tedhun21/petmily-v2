import styled from 'styled-components';

import { PiStarFill } from 'react-icons/pi';

import { Column, ImageCentered, RoundedImageWrapper, Row } from 'commonStyle';
import { PetInfoCapsule, PetInfoContainer } from '@pages/care/Reservation';
import { timeRange } from 'utils/date';

const BUCKET_URL = process.env.REACT_APP_BUCKET_URL;

export default function PetsitterCard({ petsitter }: any) {
  const parsedPossibleDay = petsitter?.possibleDay && JSON.parse(petsitter?.possibleDay);
  return (
    <Card>
      <ImageName>
        <PetsitterImage>
          <ImageCentered
            src={petsitter?.photo ? `${BUCKET_URL}${petsitter?.photo?.url}` : '/imgs/DefaultUserProfile.jpg'}
            alt="petsitter_photo"
          />
        </PetsitterImage>
        <PetsitterName>{petsitter?.nickname}</PetsitterName>
      </ImageName>
      <PetsitterInfo>
        <div>
          <PiStarFill size="28px" color="#279EFF" />
          <span>{petsitter?.star}</span>
        </div>
        <div>
          <PetInfoContainer>
            {parsedPossibleDay?.map((day: string, index: number) => <PetInfoCapsule key={index}>{day}</PetInfoCapsule>)}
          </PetInfoContainer>
        </div>

        <div>
          <span>{timeRange(petsitter?.possibleStartTime, petsitter?.possibleEndTime)}</span>
        </div>
      </PetsitterInfo>
    </Card>
  );
}

const Card = styled.section`
  display: flex;
  border-radius: 20px;
  padding: 20px;
  box-shadow: ${(props) => props.theme.shadow.dp03};

  > div {
    flex: 1;
  }
`;

const ImageName = styled(Column)`
  align-items: center;
  gap: 8px;
`;

const PetsitterImage = styled(RoundedImageWrapper)`
  width: 100px;
  height: 100px;
  border: 2px solid ${(props) => props.theme.colors.mainBlue};
`;

const PetsitterInfo = styled(Column)`
  flex: auto;
  > div {
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
  }
`;

const PetsitterName = styled.span`
  font-weight: ${(props) => props.theme.fontWeights.bold};
  ${(props) => props.theme.fontSize.s18h27};
`;
