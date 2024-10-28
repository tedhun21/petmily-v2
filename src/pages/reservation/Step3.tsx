import { useFormContext } from 'react-hook-form';
import styled from 'styled-components';
import { PiStarFill } from 'react-icons/pi';

import MyPetsitterSettings from '@pages/me/components/MyPetistterSetting';
import { Column, ImageCentered, RoundedImageWrapper, Row, Texts18h27 } from 'commonStyle';

export default function Step3({ onNext, onPrevious }: any) {
  const { getValues, watch } = useFormContext();
  const { petsitter } = getValues();

  console.log(petsitter);
  // console.log(watch());
  return (
    <MainContainer>
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
          <div></div>
        </InfoContainer>
      </PetsitterInfo>

      <span>리뷰 보기</span>

      <MyPetsitterSettings petsitter={petsitter} />

      <ButtonContainer>
        <StyledButton type="button" onClick={onNext}>
          예약하러가기
        </StyledButton>
      </ButtonContainer>
    </MainContainer>
  );
}

const MainContainer = styled.main`
  display: flex;
  flex-direction: column;
  padding: 20px;
  gap: 8px;
`;

const PetsitterInfo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
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

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledButton = styled.button`
  border-radius: 8px;
  width: 100%;
  padding: 12px;
  border: none;
  background-color: ${({ theme }) => theme.colors.mainBlue};
  color: white;
  cursor: pointer;
  ${({ theme }) => theme.fontSize.s16h24};

  &:hover {
    background-color: ${({ theme }) => theme.colors.subBlue};
  }
  &:active {
    background-color: ${({ theme }) => theme.colors.darkBlue};
    box-shadow: ${({ theme }) => theme.shadow.inset};
  }
`;
