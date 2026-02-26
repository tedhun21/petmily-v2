import { Link } from 'react-router-dom';
import styled from '@emotion/styled';
import { PiStarFill } from 'react-icons/pi';

import { timeRange, weekdays } from '@/utils/date';
import { ImageCentered, RoundedImageWrapper } from '@/styles/commonStyle';
import type { Petsitter } from '@/types/user.type';
import Text from '@/components/styled/Text';
import Flex from '@/components/styled/Flex';

interface IProps {
  petsitter: Petsitter;
}

export default function UsedPetsitterCard({ petsitter }: IProps) {
  const possibleTimeRange = timeRange(petsitter?.possibleStartTime ?? null, petsitter?.possibleEndTime ?? null);

  return (
    <Link to={`/users/${petsitter.id}`}>
      <ImageWrapper>
        <ImageCentered
          src={petsitter?.photo ? `${petsitter.photo}` : '/imgs/DefaultUserProfile.jpg'}
          alt="petsitter_photo"
        />
      </ImageWrapper>

      <Flex direction="column" justifyContent="space-between" gap="sm">
        <Flex>
          <span>{petsitter?.nickname}</span>
          <span>·</span>
          {petsitter.star && (
            <Flex alignItems="center" gap="xs">
              <PiStarFill size="16px" color="#279EFF" />
              <span>{petsitter?.star}</span>
            </Flex>
          )}
        </Flex>
        <Flex gap="xs">
          {petsitter?.possibleDays?.map((day: string, index: number) => {
            const matchedDay = weekdays.find((weekday) => weekday.value === day);
            return (
              <Text size="xs" color="secondary" key={index}>
                {matchedDay?.label}
              </Text>
            );
          })}
        </Flex>
        <Flex gap="xs">
          <Text size="xs" color="secondary">
            {possibleTimeRange}
          </Text>
        </Flex>
      </Flex>
    </Link>
  );
}

const ImageWrapper = styled(RoundedImageWrapper)`
  flex-shrink: 0;
  width: 60px;
  height: 60px;
  border: 2px solid ${({ theme }) => theme.colors.line.box.active};
`;
