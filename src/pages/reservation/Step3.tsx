import { ImageCentered, RoundedImageWrapper, Texts18h27 } from 'commonStyle';
import { useFormContext } from 'react-hook-form';
import { PiCatBold, PiDogBold, PiStarFill } from 'react-icons/pi';
import styled from 'styled-components';
import { timeRange } from 'utils/date';

export default function Step3({ onNext, onPrevious }: any) {
  const { getValues, watch } = useFormContext();
  const { petsitter } = getValues();

  console.log(petsitter);
  // console.log(watch());
  return (
    <MainContainer>
      <ImageNickname>
        <ImageWrapper>
          <ImageCentered src={petsitter?.photo ? `${petsitter.photo}` : '/imgs/DefaultUserProfile.jpg'} />
        </ImageWrapper>
        <Texts18h27>{petsitter?.nickname}</Texts18h27>
      </ImageNickname>

      <div>
        <div>
          <PiStarFill color="#279EFF" size="20px" />
          <span>{petsitter?.star}</span>
        </div>
        <div>
          <span>10,400</span>
          <span>케어 횟수</span>
        </div>
        <div></div>
      </div>

      <span>리뷰 보기</span>

      <InfoContainer>
        <InfoWrapper>
          <span>가능한 펫 종류</span>
          {Array.isArray(petsitter?.possiblePetSpecies) &&
            petsitter?.possiblePetSpecies.length > 0 &&
            petsitter?.possiblePetSpecies?.map((species: string, index: number) =>
              species === 'Dog' ? (
                <PiDogBold key={index} size="20px" color="#237EFF" />
              ) : species === 'Cat' ? (
                <PiCatBold key={index} size="20px" color="#237EFF" />
              ) : null,
            )}
        </InfoWrapper>
        <InfoWrapper>
          <span>가능한 요일</span>
          {petsitter?.possibleDays.map((day: string) => <span key={day}>{day}</span>)}
        </InfoWrapper>
        <InfoWrapper>
          <span>가능한 시간</span>
          <span>{timeRange(petsitter?.possibleStartTime, petsitter?.possibleEndTime)}</span>
        </InfoWrapper>
      </InfoContainer>
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
`;

const ImageNickname = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ImageWrapper = styled(RoundedImageWrapper)`
  width: 80px;
  height: 80px;
`;

const InfoContainer = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const InfoWrapper = styled.li`
  display: flex;
  flex-direction: column;
  border: 2px solid ${(props) => props.theme.colors.mainBlue};
  padding: 8px;
  border-radius: 20px;
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
