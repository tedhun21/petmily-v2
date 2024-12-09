import styled from 'styled-components';

import { MdOutlineRateReview } from 'react-icons/md';
import { PiStarFill } from 'react-icons/pi';

import { formatKrDays } from 'utils/date';
import { Column, DefaultDivider, ImageCentered, RoundedImageWrapper, Row, Texts14h21, Texts18h27 } from 'commonStyle';

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
        <StarReview>
          <Wrapper>
            <PiStarFill size="28px" color="#279EFF" />
            <Count>{petsitter?.star}</Count>
          </Wrapper>
          <Wrapper>
            <MdOutlineRateReview size="28px" />
            <Count>{petsitter?.reviewCount}</Count>
          </Wrapper>
        </StarReview>
        <PossibleContainer>
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

        <DefaultDivider />

        <div>{petsitter?.body}</div>
      </CardBodyContainer>
    </PetsitterSection>
  );
}

const PetsitterSection = styled.section`
  overflow: hidden;
  position: relative;
  border-radius: 12px;
  box-shadow: ${({ theme }) => theme.shadow.dp01};
`;

const CardTitleContainer = styled.div`
  display: flex;
  position: relative;
  padding: 12px 36px;
  color: ${({ theme }) => theme.text.white};
  background-color: ${({ theme }) => theme.background.highlight};
`;

const NameWrapper = styled(Row)`
  gap: 8px;
  align-items: flex-end;
`;

const PetsitterImg = styled(RoundedImageWrapper)`
  position: absolute;
  top: 24px;
  right: 24px;
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
  gap: 8px;
  background-color: ${({ theme }) => theme.background.box.default.primary};
`;

const StarReview = styled(Row)`
  align-items: center;
  gap: 16px;
`;

const Wrapper = styled(Row)`
  align-items: center;
  gap: 8px;
`;

const Count = styled(Texts18h27)`
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
  padding: 4px 8px;
  border-radius: 12px;
  color: ${({ theme }) => theme.text.white};
  background-color: ${({ theme }) => theme.background.highlight};
`;
