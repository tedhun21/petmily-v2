import { Column, ImageCentered, RoundedImageWrapper, Row } from 'commonStyle';
import { MdOutlineRateReview } from 'react-icons/md';
import { PiStarFill } from 'react-icons/pi';
import styled from 'styled-components';

const BUCKET_URL = process.env.REACT_APP_BUCKET_URL;

export default function SelectedPetsitter({ petsitter }: any) {
  const possibleLocation = petsitter.possibleLocation.slice(1, -1).split(',');
  const possibleDay = petsitter.possibleDay.slice(1, -1).split(',');

  return (
    <PetsitterSection>
      <CardWrap>
        <PetsitterName>{petsitter?.nickname}</PetsitterName>
        <Petsitter>펫시터</Petsitter>
        <PetsitterImg>
          <ImageCentered
            src={petsitter.photo ? `${BUCKET_URL}${petsitter?.photo.url}` : '/imgs/DefaultUserProfile.png'}
            alt="petsitter_photo"
          />
        </PetsitterImg>
      </CardWrap>

      <PetsitterCardBody>
        <Row>
          <div>
            <PiStarFill size="28px" color="#279EFF" />
            <RatingCount>{petsitter?.average_rating}</RatingCount>
          </div>
          <div>
            <MdOutlineRateReview size="28px" />
            <ReviewCount>{petsitter?.reviewCount}</ReviewCount>
          </div>
        </Row>
        <PossibleContainer style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <PossibleWrapper>
            <span>가능 장소</span>
            <CapsuleWrapper>
              {possibleLocation.map((location: any) => (
                <Capsule key={location}>{location}</Capsule>
              ))}
            </CapsuleWrapper>
          </PossibleWrapper>
          <PossibleWrapper>
            <span>가능 요일</span>
            <CapsuleWrapper>
              {possibleDay.map((day: any) => (
                <Capsule key={day}>{day}</Capsule>
              ))}
            </CapsuleWrapper>
          </PossibleWrapper>
        </PossibleContainer>
      </PetsitterCardBody>
    </PetsitterSection>
  );
}

const PetsitterSection = styled.section`
  position: relative;
  border-radius: 12px;
  overflow: hidden;

  box-shadow: ${(props) => props.theme.shadow.dp01};
`;

const CardWrap = styled.div`
  display: flex;
  position: relative;
  padding: 12px 36px;
  background-color: ${(props) => props.theme.colors.mainBlue};
`;

const PetsitterImg = styled(RoundedImageWrapper)`
  position: absolute;
  right: 24px;
  top: 24px;
  width: 64px;
  height: 64px;
`;

const PetsitterName = styled.h2`
  ${(props) => props.theme.fontSize.s18h27};
  font-weight: ${(props) => props.theme.fontWeights.bold};
  color: ${(props) => props.theme.colors.white};
`;

const Petsitter = styled.h3`
  ${(props) => props.theme.fontSize.s14h21};
  font-weight: ${(props) => props.theme.fontWeights.light};
  color: ${(props) => props.theme.textColors.primary};
`;

const PetsitterCardBody = styled(Column)`
  padding: 24px;
  background-color: ${(props) => props.theme.colors.white};
`;

const RatingCount = styled.h4`
  ${(props) => props.theme.fontSize.s20h30};
  font-weight: ${(props) => props.theme.fontWeights.extrabold};
  color: #595959;
  margin-right: 30px;
  margin-top: -5px;
`;

const ReviewCount = styled.h4`
  ${(props) => props.theme.fontSize.s20h30};
  font-weight: ${(props) => props.theme.fontWeights.extrabold};
  color: #595959;
`;

const PossibleContainer = styled(Column)`
  gap: 8px;
`;

const PossibleWrapper = styled(Row)`
  gap: 8px;
`;

const CapsuleWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
`;

const Capsule = styled.span`
  ${(props) => props.theme.fontSize.s14h21};
  padding: 0px 8px;
  border: 1px solid #279eff;
  border-radius: 20px;
  // font-weight: ${(props) => props.theme.fontWeights.normal};
`;
