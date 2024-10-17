import { Column, ImageCentered, RoundedImageWrapper, Row } from 'commonStyle';

import styled from 'styled-components';

import { IoMdTime } from 'react-icons/io';
import { PiStarFill } from 'react-icons/pi';
import { MdOutlineRateReview } from 'react-icons/md';

import { timeRange } from 'utils/date';
import { Modal } from '@mui/material';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';

const BUCKET_URL = process.env.REACT_APP_BUCKET_URL;

export default function PetsitterCard({ petsitter, onNext }: any) {
  const { id, nickname, photo, possibleStartTime, possibleEndTime } = petsitter;
  const { setValue } = useFormContext();

  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleNextStep = () => {
    setValue('petsitter', petsitter);
    handleClose();
    onNext();
  };

  return (
    <>
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
      {/* <Modal open={open} onClose={handleClose}>
        <ModalContainer>
          <ImageContainer>
            <ModalPetsitterImageWrapper>
              {photo ? (
                <ImageCentered src={`${BUCKET_URL}${photo.url}`} alt="petsitterPhoto" />
              ) : (
                <img src="/imgs/DefaultUserProfile.jpg" alt="defaultPetsitter" width="100%" height="100%" />
              )}
            </ModalPetsitterImageWrapper>
          </ImageContainer>
          <div>
            <ModalPetsitterName>{nickname}</ModalPetsitterName>
            <div>
              <PiStarFill size="20px" color="#279EFF" />
              <span>4.1</span>
            </div>
          </div>
          <ActiveContainer>
            <Column>
              <span>활동 요일</span>
              <span>화 수 목 금</span>
            </Column>
            <Column>
              <span>활동 시간</span>
              <span>10:00 ~ 18:00</span>
            </Column>
          </ActiveContainer>
          <div>
            <span>소개</span>
            <p>안녕하세요 펫시터 3년차 펫시터1입니다.</p>
          </div>
          <NextStepButton onClick={handleNextStep}>예약하러가기</NextStepButton>
        </ModalContainer>
      </Modal> */}
    </>
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

const ContainerArrow = styled.img`
  position: absolute;
  top: 43%;
  right: 10%;
  width: 6px;
  height: 12px;
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

const ReviewImg = styled.img`
  width: 16px;
`;

const ModalContainer = styled(Column)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 360px;
  background-color: white;
  border-radius: 16px;
  padding: 16px;
  gap: 20px;
`;

const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px;
`;

const ModalPetsitterImageWrapper = styled(RoundedImageWrapper)`
  width: 80px;
  height: 80px;
`;

const ModalPetsitterName = styled.span`
  ${(props) => props.theme.fontSize.s18h27}
  font-weight:${(props) => props.theme.fontWeights.bold}
`;

const NextStepButton = styled.button`
  background-color: ${(props) => props.theme.colors.mainBlue};
  border-radius: 8px;
  padding: 8px;
  color: white;
  cursor: pointer;

  &:hover {
    background-color: ${(props) => props.theme.colors.subBlue};
  }

  &:active {
    background-color: ${({ theme }) => theme.colors.darkBlue};
    box-shadow: ${({ theme }) => theme.shadow.inset};
  }
`;

const ActiveContainer = styled(Row)`
  > div {
    flex: 1;
    gap: 4px;
  }
`;
