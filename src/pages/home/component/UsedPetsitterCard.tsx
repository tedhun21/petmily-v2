import styled from 'styled-components';
import { PiStarFill } from 'react-icons/pi';

import { formatKrDays, timeRange } from 'utils/date';
import { Column, ImageCentered, RoundedImageWrapper, Row, Texts12h18, Texts18h27 } from 'styles/commonStyle';

export default function UsedPetsitterCard({ petsitter }: any) {
  const { nickname, star, photo, possibleDays, possibleStartTime, possibleEndTime } = petsitter;

  const possibleTimeRange = timeRange(possibleStartTime, possibleEndTime);

  return (
    <OftenPetsitterbox>
      <ImageNameContainer>
        <ImageWrapper>
          <ImageCentered src={photo ? `${photo?.url}` : '/imgs/DefaultUserProfile.jpg'} alt="petsitterPhoto" />
        </ImageWrapper>
      </ImageNameContainer>
      <InfoContainer>
        <UpperContainer>
          <Texts18h27>{nickname}</Texts18h27>
          <StarWrapper>
            <PiStarFill size="20px" color="#279EFF" />
            <span>{star}</span>
          </StarWrapper>
        </UpperContainer>
        <LowerContainer>
          <PossibleWrapper>
            <Texts12h18>가능 요일</Texts12h18>
            <div>
              {possibleDays?.map((day: string, index: number) => (
                <Texts12h18 key={index}>{formatKrDays(day)}</Texts12h18>
              ))}
            </div>
          </PossibleWrapper>
          <PossibleWrapper>
            <Texts12h18>가능 시간</Texts12h18>
            <Texts12h18>{possibleTimeRange}</Texts12h18>
          </PossibleWrapper>
        </LowerContainer>
      </InfoContainer>
    </OftenPetsitterbox>
  );
}

const OftenPetsitterbox = styled(Row)`
  align-items: center;
  width: 100%;
  padding: 12px;
  border-radius: 16px;
  background-color: ${({ theme }) => theme.background.box.default.primary};
  gap: 8px;
`;

const InfoContainer = styled(Column)`
  display: flex;
  justify-content: space-between;
  flex: auto;
  gap: 8px;
`;

const UpperContainer = styled(Row)`
  justify-content: space-between;
`;

const StarWrapper = styled(Row)`
  align-items: center;
`;

const ImageNameContainer = styled(Row)`
  gap: 4px;
`;
const ImageWrapper = styled(RoundedImageWrapper)`
  width: 60px;
  height: 60px;
  border: 2px solid ${({ theme }) => theme.line.box.highlight};
`;

const LowerContainer = styled.div`
  gap: 4px;
`;

const PossibleWrapper = styled(Row)`
  justify-content: space-between;
`;
