import { ImageCentered, RoundedImageWrapper, Row, Texts12h18, Texts14h21, Texts16h24 } from 'styles/commonStyle';

import styled from 'styled-components';

import { IoMdTime } from 'react-icons/io';
import { PiStarFill } from 'react-icons/pi';
import { MdOutlineRateReview } from 'react-icons/md';

import { timeRange } from 'utils/date';
import { useFormContext } from 'react-hook-form';

export default function PetsitterCard({ petsitter, onNext }: any) {
  const { id, nickname, photo, possibleStartTime, possibleEndTime } = petsitter;
  const { setValue } = useFormContext();

  const handleNextStep = () => {
    setValue('petsitter', petsitter);
    onNext();
  };

  return (
    <Card onClick={handleNextStep}>
      <InfoWrapper>
        <PetssiterImageWrapper>
          <ImageCentered src={photo ? `${photo}` : '/imgs/DefaultUserProfile.jpg'} alt="petsitter_photo" />
        </PetssiterImageWrapper>
        <PetsitterBody>
          <PetsitterWrap>
            <NameText>{nickname}</NameText>
            <Possiblebox>예약가능</Possiblebox>
          </PetsitterWrap>
          <TimeWrap>
            <TimeText>{timeRange(possibleStartTime, possibleEndTime)}</TimeText>
          </TimeWrap>
          <RatingReviewContainer>
            <StarContainer>
              <PiStarFill size="20px" color="#279EFF" />
              <div>{petsitter.star}</div>
            </StarContainer>
            <ReviewContainer>
              <MdOutlineRateReview size="16px" />
              <div>{petsitter.reviewCount}</div>
            </ReviewContainer>
          </RatingReviewContainer>
        </PetsitterBody>
      </InfoWrapper>
    </Card>
  );
}

const Card = styled.button`
  display: flex;
  justify-content: space-between;
  padding: 12px;
  border-radius: 12px;
  color: inherit;
  box-shadow: ${({ theme }) => theme.shadow.dp02};
`;

const InfoWrapper = styled(Row)`
  gap: 16px;
`;

const PetssiterImageWrapper = styled(RoundedImageWrapper)`
  width: 80px;
  height: 80px;
`;

const PetsitterBody = styled.div``;

const PetsitterWrap = styled(Row)`
  gap: 4px;
  align-items: center;
`;

const NameText = styled(Texts16h24)`
  font-weight: ${({ theme }) => theme.fontWeight.extrabold};
`;

const Possiblebox = styled(Texts12h18)`
  margin: 6px 0;
  padding: 2px 8px;
  border-radius: ${({ theme }) => theme.radius};
  color: white;
  font-weight: ${({ theme }) => theme.fontWeight.light};
  background-color: ${({ theme }) => theme.background.highlight};
`;

const TimeWrap = styled(Row)`
  gap: 4px;
  align-items: center;
`;

const TimeText = styled(Texts14h21)`
  font-weight: ${({ theme }) => theme.fontWeight.light};
`;

const RatingReviewContainer = styled(Row)`
  align-items: center;
  gap: 16px;
`;

const StarContainer = styled(Row)`
  align-items: center;
  gap: 4px;
`;

const ReviewContainer = styled(Row)`
  align-items: center;
  gap: 4px;
`;
