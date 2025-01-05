import styled from 'styled-components';

import { PiStarFill } from 'react-icons/pi';

import { Column, ImageCentered, RoundedImageWrapper, Row, Texts18h27 } from 'styles/commonStyle';
import { PetInfoCapsule, PetInfoContainer } from '@pages/cares/:id/CareDetail';
import { formatKrDays, timeRange } from 'utils/date';
import { Link } from 'react-router-dom';
import { MdOutlineRateReview } from 'react-icons/md';

export default function PetsitterCard({ petsitter }: any) {
  return (
    <Card>
      <ImageName>
        <PetsitterImage>
          <ImageCentered
            src={petsitter?.photo ? `${petsitter?.photo}` : '/imgs/DefaultUserProfile.jpg'}
            alt="petsitter_photo"
          />
        </PetsitterImage>
        <PetsitterName>{petsitter?.nickname} 님</PetsitterName>
        <StyledLink to={`/chats/${petsitter?.id}`}>채팅 하기</StyledLink>
      </ImageName>
      <PetsitterInfo>
        <StarReviewWrapper>
          <IconAndSpan>
            <PiStarFill size="28px" color="#279EFF" />
            <Texts18h27>{petsitter?.star}</Texts18h27>
          </IconAndSpan>
          <IconAndSpan>
            <MdOutlineRateReview size="28px">review</MdOutlineRateReview>
            <Texts18h27>{petsitter?.reviewCount}</Texts18h27>
          </IconAndSpan>
        </StarReviewWrapper>

        <PetInfoContainer>
          {petsitter?.possibleDays?.map((day: string, index: number) => (
            <PetInfoCapsule key={index}>{formatKrDays(day)}</PetInfoCapsule>
          ))}
        </PetInfoContainer>

        <div>
          <span>{timeRange(petsitter?.possibleStartTime, petsitter?.possibleEndTime)}</span>
        </div>
      </PetsitterInfo>
    </Card>
  );
}

const Card = styled.section`
  display: flex;
  padding: 20px;
  border-radius: 20px;
  box-shadow: ${({ theme }) => theme.shadow.dp03};

  > div {
    flex: 1;
  }
`;

const ImageName = styled(Column)`
  align-items: center;
  gap: 8px;
`;

const PetsitterImage = styled(RoundedImageWrapper)`
  width: 100px;
  height: 100px;
  border: 2px solid ${({ theme }) => theme.line.box.highlight};
`;

const PetsitterInfo = styled(Column)`
  flex: auto;

  > div {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
  }
`;

const PetsitterName = styled(Texts18h27)`
  font-weight: ${({ theme }) => theme.fontWeight.bold};
`;

const StyledLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: ${({ theme }) => theme.radius};
  color: white;
  background-color: ${({ theme }) => theme.background.box.blue.primary};

  &:hover {
    background-color: ${({ theme }) => theme.background.box.blue.hover};
  }

  &:active {
    background-color: ${({ theme }) => theme.background.box.blue.active};
    box-shadow: ${({ theme }) => theme.shadow.inset};
  }

  > span {
    color: inherit;
  }
`;

const StarReviewWrapper = styled(Row)`
  align-items: center;
  gap: 8px;
`;

const IconAndSpan = styled(Row)`
  align-items: center;
  gap: 4px;
`;
