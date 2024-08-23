import { parsePossibleDay, timeRange } from 'utils/date';
import { Column, Row, Texts12h18, Texts18h27 } from '../../commonStyle';
import styled from 'styled-components';

const BUCKET_URL = process.env.REACT_APP_BUCKET_URL;
export default function OftenPetsitterCard({ petsitter }: any) {
  const possibleDay = parsePossibleDay(petsitter.possibleDay);
  const possibleTimeRange = timeRange(petsitter.possibleStartTime, petsitter.possibleEndTime);

  return (
    <OftenPetsitterbox>
      <ImageNameContainer>
        <ImageWrapper>
          {petsitter.photo ? (
            <Image src={`${BUCKET_URL}${petsitter.photo?.url}`} alt="petsitterPhoto" />
          ) : (
            <div>hi</div>
          )}
        </ImageWrapper>
      </ImageNameContainer>
      <InfoContainer>
        <UpperContainer>
          <Texts18h27>{petsitter.nickname}</Texts18h27>
          <Row>
            <span>star</span>
            <span>{petsitter.star}</span>
          </Row>
        </UpperContainer>
        <LowerContainer>
          <PossibleWrapper>
            <Texts12h18>가능 요일</Texts12h18>
            <Texts12h18>{possibleDay}</Texts12h18>
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
  flex-grow: 1;
  padding: 12px 16px;
  gap: 12px;
  border-radius: 8px;
  box-shadow: ${(props) => props.theme.shadow.dp01};
`;

const InfoContainer = styled(Column)`
  flex: auto;
  display: flex;
  justify-content: space-between;
`;

const UpperContainer = styled(Row)`
  justify-content: space-between;
`;

const ImageNameContainer = styled(Row)`
  gap: 4px;
`;
const ImageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 60px;
  height: 60px;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 100%;
`;

const LowerContainer = styled.div``;

const PossibleWrapper = styled(Row)`
  justify-content: space-between;
`;
