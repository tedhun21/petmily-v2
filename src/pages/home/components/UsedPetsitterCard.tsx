import styled from 'styled-components';
import { PiStarFill } from 'react-icons/pi';

import { timeRange, weekdays } from 'utils/date';
import { Column, ImageCentered, RoundedImageWrapper, Row } from 'styles/commonStyle';
import { Petsitter } from 'types/user.type';
import { Link } from 'react-router-dom';
import { Text } from 'styles/common/Text';

interface IProps {
  petsitter: Petsitter;
}

export default function UsedPetsitterCard({ petsitter }: IProps) {
  const possibleTimeRange = timeRange(petsitter?.possibleStartTime ?? null, petsitter?.possibleEndTime ?? null);

  return (
    <Card to={`/users/${petsitter.nickname}`}>
      <ImageWrapper>
        <ImageCentered
          src={petsitter?.photo ? `${petsitter.photo}` : '/imgs/DefaultUserProfile.jpg'}
          alt="petsitter_photo"
        />
      </ImageWrapper>

      <InfoContainer>
        <Row>
          <span>{petsitter?.nickname}</span>
          <span>·</span>
          {petsitter.star && (
            <StarWrapper>
              <PiStarFill size="16px" color="#279EFF" />
              <span>{petsitter?.star}</span>
            </StarWrapper>
          )}
        </Row>
        <PossibleWrapper>
          {petsitter?.possibleDays?.map((day: string, index: number) => {
            const matchedDay = weekdays.find((weekday) => weekday.value === day);
            return (
              <Text $size="xs" $color="secondary" key={index}>
                {matchedDay?.label}
              </Text>
            );
          })}
        </PossibleWrapper>
        <PossibleWrapper>
          <Text $size="xs" $color="secondary">
            {possibleTimeRange}
          </Text>
        </PossibleWrapper>
      </InfoContainer>
    </Card>
  );
}

const Card = styled(Link)`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md};
`;

const ImageWrapper = styled(RoundedImageWrapper)`
  flex-shrink: 0;
  width: 60px;
  height: 60px;
  border: 2px solid ${({ theme }) => theme.colors.line.box.highlight};
`;

const InfoContainer = styled(Column)`
  flex: 1;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const StarWrapper = styled(Row)`
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const PossibleWrapper = styled(Row)`
  gap: ${({ theme }) => theme.spacing.xs};
`;
