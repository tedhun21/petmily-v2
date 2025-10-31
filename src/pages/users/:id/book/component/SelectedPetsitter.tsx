import styled from 'styled-components';

import { MdOutlineRateReview } from 'react-icons/md';
import { PiStarFill } from 'react-icons/pi';

import { weekdays } from 'utils/date';
import { Column, Divider, ImageCentered, RoundedImageWrapper, Row, Texts14h20, Texts18h28 } from 'styles/commonStyle';
import { Petsitter } from 'types/user.type';
import { DayOfWeekType } from 'types/common.type';

interface SelectedPetsitterProps {
  petsitter: Petsitter;
}

export default function SelectedPetsitter({ petsitter }: SelectedPetsitterProps) {
  return (
    <PetsitterSection>
      <CardTitleContainer>
        <NameWrapper>
          <PetsitterName>{petsitter?.nickname}</PetsitterName>
          <PetsitterTitle>펫시터</PetsitterTitle>
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
              {petsitter?.possibleLocations?.map((location: string) => (
                <Capsule key={location}>{location}</Capsule>
              ))}
            </CapsuleWrapper>
          </PossibleWrapper>
          <PossibleWrapper>
            <span>가능 요일</span>
            <CapsuleWrapper>
              {petsitter?.possibleDays?.map((day: DayOfWeekType) => {
                const matchedDay = weekdays.find((weekday) => weekday.value === day);
                return <Capsule key={day}>{matchedDay?.label}</Capsule>;
              })}
            </CapsuleWrapper>
          </PossibleWrapper>
        </PossibleContainer>

        <Divider />

        <div>{petsitter?.body}</div>
      </CardBodyContainer>
    </PetsitterSection>
  );
}

const PetsitterSection = styled.section`
  position: relative;
  flex-shrink: 0;
  overflow: hidden;
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadow.dp01};
`;

const CardTitleContainer = styled(Row)`
  position: relative;
  padding: 12px 36px;
  background-color: ${({ theme }) => theme.colors.background.highlight};
  color: ${({ theme }) => theme.colors.text.white};
`;

const NameWrapper = styled(Row)`
  gap: ${({ theme }) => theme.spacing.sm};
  align-items: flex-end;
`;

const PetsitterImg = styled(RoundedImageWrapper)`
  position: absolute;
  top: ${({ theme }) => theme.spacing._2xl};
  right: ${({ theme }) => theme.spacing._2xl};
  width: 64px;
  height: 64px;
`;

const PetsitterName = styled(Texts18h28)`
  font-weight: ${({ theme }) => theme.fontWeight.bold};
`;

const PetsitterTitle = styled(Texts14h20)`
  font-weight: ${({ theme }) => theme.fontWeight.light};
`;

const CardBodyContainer = styled(Column)`
  padding: ${({ theme }) => theme.spacing._2xl};
  gap: ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.background.box.default.primary};
`;

const StarReview = styled(Row)`
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const Wrapper = styled(Row)`
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Count = styled(Texts18h28)`
  font-weight: ${({ theme }) => theme.fontWeight.bold};
`;

const PossibleContainer = styled(Column)`
  gap: ${({ theme }) => theme.spacing.sm};
`;

const PossibleWrapper = styled(Row)`
  gap: ${({ theme }) => theme.spacing.sm};
`;

const CapsuleWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const Capsule = styled(Texts14h20)`
  padding: 4px ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.background.highlight};
  border-radius: ${({ theme }) => theme.radius.sm};
  color: ${({ theme }) => theme.colors.text.white};
`;
