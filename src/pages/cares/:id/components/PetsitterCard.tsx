import styled from 'styled-components';

import { PiStarFill } from 'react-icons/pi';
import { MdOutlineRateReview } from 'react-icons/md';

import { Column, ImageCentered, RoundedImageWrapper, Row } from 'styles/commonStyle';
import { PetInfoCapsule, PetInfoContainer } from '@pages/cares/:id/page';
import { timeRange, weekdays } from 'utils/date';
import { Petsitter } from 'types/user.type';
import { Button } from 'styles/common/Button';
import { Link } from 'react-router-dom';
import { Text } from 'styles/common/Text';

interface PetsitterCardProps {
  petsitter: Petsitter;
}

export default function PetsitterCard({ petsitter }: PetsitterCardProps) {
  const opponentIds = [petsitter?.id];
  const params = new URLSearchParams();
  if (petsitter?.id !== undefined) {
    opponentIds.forEach((id) => params.append('opponentIds', id.toString()));
  }

  return (
    <Card as="section">
      <ImageName>
        <PetsitterImage>
          <ImageCentered
            src={petsitter?.photo ? `${petsitter?.photo}` : '/imgs/DefaultUserProfile.jpg'}
            alt="petsitter_photo"
          />
        </PetsitterImage>
        <Text $size="lg" $weight="semibold">
          {petsitter?.nickname} 님
        </Text>
        <LinkWrapper>
          <Button as={Link} to={`/chats/temp?${params.toString()}`} $size="sm" $borderRadius="sm">
            채팅 하기
          </Button>
          <Button as={Link} to={`/users/${petsitter?.nickname}`} $size="sm" $borderRadius="sm">
            프로필 보기
          </Button>
        </LinkWrapper>
      </ImageName>
      <PetsitterInfo>
        <StarReviewWrapper>
          <IconAndSpan>
            <PiStarFill size="28px" color="#279EFF" />
            <Text $size="lg">{petsitter?.star}</Text>
          </IconAndSpan>
          <IconAndSpan>
            <MdOutlineRateReview size="28px">review</MdOutlineRateReview>
            <Text $size="lg">{petsitter?.reviewCount}</Text>
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

const Card = styled(Row)`
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

const LinkWrapper = styled(Row)`
  gap: ${({ theme }) => theme.spacing.xs};
`;

const StarReviewWrapper = styled(Row)`
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const IconAndSpan = styled(Row)`
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;
