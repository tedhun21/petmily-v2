import { useFormContext } from 'react-hook-form';
import styled from 'styled-components';
import { PiStarFill } from 'react-icons/pi';

import MyPetsitterSettings from '@pages/me/components/MyPetistterSetting';
import {
  BlueButton,
  BottomFixed,
  CenterContainer,
  Column,
  Float,
  ImageCentered,
  RoundedImageWrapper,
  Row,
  Texts18h27,
} from 'commonStyle';

export default function Step3({ onNext }: any) {
  const { getValues } = useFormContext();
  const { petsitter } = getValues();

  return (
    <MainContainer>
      <PaddingContainer>
        <PetsitterInfo>
          <ImageName>
            <ImageWrapper>
              <ImageCentered src={petsitter?.photo ? `${petsitter.photo}` : '/imgs/DefaultUserProfile.jpg'} />
            </ImageWrapper>
            <Texts18h27>{petsitter?.nickname}</Texts18h27>
          </ImageName>
          <InfoContainer>
            <InfoWrapper>
              <PiStarFill color="#279EFF" size="32px" />
              <Texts18h27>{petsitter?.star}</Texts18h27>
            </InfoWrapper>
            <InfoWrapper>
              <span>{petsitter?.reviewCount}</span>
              <span>리뷰가 달린 케어</span>
            </InfoWrapper>
          </InfoContainer>
        </PetsitterInfo>

        <span>리뷰 보기</span>

        <MyPetsitterSettings petsitter={petsitter} />
      </PaddingContainer>

      <BottomFixed>
        <FloatButtonContainer>
          <StyledButton type="button" onClick={onNext}>
            예약하러가기
          </StyledButton>
        </FloatButtonContainer>
      </BottomFixed>
    </MainContainer>
  );
}

const MainContainer = styled.main`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const PaddingContainer = styled.div`
  padding: 12px;
`;

const PetsitterInfo = styled(CenterContainer)`
  gap: 20px;
`;

const ImageWrapper = styled(RoundedImageWrapper)`
  width: 80px;
  height: 80px;
`;

const ImageName = styled(Column)`
  align-items: center;
`;

const InfoContainer = styled(Column)`
  align-items: center;
  gap: 8px;
`;
const InfoWrapper = styled(Row)`
  align-items: center;
  gap: 4px;
`;

const FloatButtonContainer = styled(Float)`
  left: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 20px;
`;

const StyledButton = styled(BlueButton)`
  border-radius: 8px;
  width: 100%;
  padding: 12px;

  ${({ theme }) => theme.fontSize.s16h24};
`;
