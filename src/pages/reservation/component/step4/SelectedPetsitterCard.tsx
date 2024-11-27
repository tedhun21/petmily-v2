import { Column, ImageCentered, RoundedImageWrapper, Row, Texts14h21, Texts18h27, Texts20h30 } from 'commonStyle';
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
            src={petsitter?.photo ? `${petsitter?.photo}` : '/imgs/DefaultUserProfile.jpg'}
            alt="petsitter_photo"
          />
        </PetsitterImg>
      </CardTitleContainer>

      <CardBodyContainer>
        <Row>
          <div>
            <PiStarFill size="28px" color="#279EFF" />
            <Count>{petsitter?.average_rating}</Count>
          </div>
          <div>
            <MdOutlineRateReview size="28px" />
            <Count>{petsitter?.reviewCount}</Count>
          </div>
        </Row>
        <PossibleContainer style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <PossibleWrapper>
            <span>가능 장소</span>
            <CapsuleWrapper>
              {petsitter?.possibleLocations?.map((location: any) => <Capsule key={location}>{location}</Capsule>)}
            </CapsuleWrapper>
          </PossibleWrapper>
          <PossibleWrapper>
            <span>가능 요일</span>
            <CapsuleWrapper>
              {petsitter?.possibleDays?.map((day: any) => <Capsule key={day}>{formatKrDays(day)}</Capsule>)}
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

  box-shadow: ${({ theme }) => theme.shadow.dp01};
`;

const CardTitleContainer = styled.div`
  display: flex;
  position: relative;
  padding: 12px 36px;
  background-color: ${({ theme }) => theme.background.highlight};
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

const PetsitterName = styled(Texts18h27)`
  font-weight: ${({ theme }) => theme.fontWeight.bold};
`;

const Petsitter = styled(Texts14h21)`
  font-weight: ${({ theme }) => theme.fontWeight.light};
`;

const CardBodyContainer = styled(Column)`
  padding: 24px;
  background-color: ${({ theme }) => theme.background.box.default.primary};
`;

const Count = styled(Texts20h30)`
  font-weight: ${({ theme }) => theme.fontWeight.extrabold};
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

const Capsule = styled(Texts14h21)`
  color: white;
  padding: 4px 8px;
  border-radius: 16px;
  background-color: ${({ theme }) => theme.backgorund.highlight};
`;
