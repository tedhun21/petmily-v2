import { Column, ImageCentered, RoundedImageWrapper, Row } from 'commonStyle';
import { MdOutlineRateReview } from 'react-icons/md';
import { PiStarFill } from 'react-icons/pi';
import styled from 'styled-components';
import { formatKrDays } from 'utils/date';

export default function SelectedPetsitter({ petsitter }: any) {
  return (
    <PetsitterSection>
      <CardTitleContainer>
        <NameWrapper>
          <PetsitterName>{petsitter?.nickname}</PetsitterName>
          <Petsitter>펫시터</Petsitter>
        </NameWrapper>
        <PetsitterImg>
          <ImageCentered
            src={petsitter.photo ? `${petsitter?.photo}` : '/imgs/DefaultUserProfile.jpg'}
            alt="petsitter_photo"
          />
        </PetsitterImg>
      </CardTitleContainer>

      <CardBodyContainer>
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
              {petsitter?.possibleLocations.map((location: any) => <Capsule key={location}>{location}</Capsule>)}
            </CapsuleWrapper>
          </PossibleWrapper>
          <PossibleWrapper>
            <span>가능 요일</span>
            <CapsuleWrapper>
              {petsitter?.possibleDays.map((day: any) => <Capsule key={day}>{formatKrDays(day)}</Capsule>)}
            </CapsuleWrapper>
          </PossibleWrapper>
        </PossibleContainer>
      </CardBodyContainer>
    </PetsitterSection>
  );
}

const PetsitterSection = styled.section`
  position: relative;
  border-radius: 12px;
  overflow: hidden;

  box-shadow: ${(props) => props.theme.shadow.dp01};
`;

const CardTitleContainer = styled.div`
  display: flex;
  position: relative;
  padding: 12px 36px;
  background-color: ${(props) => props.theme.colors.mainBlue};
`;

const NameWrapper = styled(Row)`
  gap: 8px;
  align-items: center;
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

const CardBodyContainer = styled(Column)`
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
  color: white;
  padding: 4px 8px;
  border-radius: 16px;
  background-color: ${(props) => props.theme.colors.mainBlue};
  // font-weight: ${(props) => props.theme.fontWeights.normal};
  ${(props) => props.theme.fontSize.s14h21};
`;
