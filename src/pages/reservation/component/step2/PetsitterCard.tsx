import { ImageCentered, RoundedImageWrapper, Row } from 'commonStyle';

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
            <IoMdTime size="16px" color="gray" />
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
  justify-contnet: space-between;
  box-shadow: ${(props) => props.theme.shadow.dp02};
  border-radius: 12px;
  padding: 12px;
  cursor: pointer;
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

const NameText = styled.span`
  font-weight: ${(props) => props.theme.fontWeights.extrabold};
  font-size: ${(props) => props.theme.fontSize.s16h24};
`;

const Possiblebox = styled.div`
  margin: 6px 0;
  padding: 2px 8px;
  border-radius: 8px;
  color: ${(props) => props.theme.colors.white};
  font-weight: ${(props) => props.theme.fontWeights.light};
  font-size: 12px;
  line-height: 16px;
  background-color: ${(props) => props.theme.colors.mainBlue};
`;

const TimeWrap = styled(Row)`
  gap: 4px;
  align-items: center;
`;

const TimeText = styled.div`
  color: ${(props) => props.theme.textColors.gray50};
  font-weight: ${(props) => props.theme.fontWeights.light};
  font-size: ${(props) => props.theme.fontSize.s14h21};
`;

const RatingReviewContainer = styled(Row)`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const StarContainer = styled(Row)`
  gap: 4px;
`;

const ReviewContainer = styled.div`
  display: flex;
  gap: 4px;
`;
