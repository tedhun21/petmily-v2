import styled from 'styled-components';

import { PiStarFill } from 'react-icons/pi';
import { MdOutlineRateReview } from 'react-icons/md';

import { BlueLink, Column, ImageCentered, RoundedImageWrapper, Row, Texts18h28 } from 'styles/commonStyle';
import { PetInfoCapsule, PetInfoContainer } from '@pages/cares/:id/page';
import { timeRange, weekdays } from 'utils/date';
import { Petsitter } from 'types/user.type';

interface PetsitterCardProps {
  petsitter: Petsitter;
}

export default function PetsitterCard({ petsitter }: PetsitterCardProps) {
  const opponentIds = [petsitter?.id];
  const params = new URLSearchParams();
  if (petsitter?.id !== undefined) {
    opponentIds.forEach((id) => params.append('opponentIds', id.toString())); // opponentIds=1&opponentIds=2
  }

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
        <LinkWrapper>
          <StyledLink to={`/chats/temp?${params.toString()}`}>채팅 하기</StyledLink>
          <StyledLink to={`/users/${petsitter?.nickname}`}>프로필 보기</StyledLink>
        </LinkWrapper>
      </ImageName>
      <PetsitterInfo>
        <StarReviewWrapper>
          <IconAndSpan>
            <PiStarFill size="28px" color="#279EFF" />
            <Texts18h28>{petsitter?.star}</Texts18h28>
          </IconAndSpan>
          <IconAndSpan>
            <MdOutlineRateReview size="28px">review</MdOutlineRateReview>
            <Texts18h28>{petsitter?.reviewCount}</Texts18h28>
          </IconAndSpan>
        </StarReviewWrapper>

        <PetInfoContainer>
          {petsitter?.possibleDays?.map((day: string, index: number) => {
            const matchedDay = weekdays.find((weekday) => weekday.value === day);
            return <PetInfoCapsule key={index}>{matchedDay?.label}</PetInfoCapsule>;
          })}
        </PetInfoContainer>

        <div>
          <span>{timeRange(petsitter?.possibleStartTime ?? null, petsitter?.possibleEndTime ?? null)}</span>
        </div>
      </PetsitterInfo>
    </Card>
  );
}

const Card = styled.section`
  display: flex;
  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadow.dp03};

  > div {
    flex: 1;
  }
`;

const ImageName = styled(Column)`
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const PetsitterImage = styled(RoundedImageWrapper)`
  width: 100px;
  height: 100px;
  border: 2px solid ${({ theme }) => theme.colors.line.box.highlight};
`;

const PetsitterInfo = styled(Column)`
  flex: auto;

  > div {
    display: flex;
    flex: 1;
    justify-content: center;
    align-items: center;
  }
`;

const PetsitterName = styled(Texts18h28)`
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
`;

const LinkWrapper = styled(Row)`
  gap: ${({ theme }) => theme.spacing.sm};
`;

const StyledLink = styled(BlueLink)`
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radius.md};
`;

const StarReviewWrapper = styled(Row)`
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const IconAndSpan = styled(Row)`
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;
