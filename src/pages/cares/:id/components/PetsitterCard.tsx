import styled from '@emotion/styled';

import { PiStarFill } from 'react-icons/pi';
import { MdOutlineRateReview } from 'react-icons/md';

import { ImageCentered, RoundedImageWrapper } from '@/styles/commonStyle';
import { timeRange, weekdays } from '@/utils/date';
import { Petsitter } from '@/types/user.type';

import { Text } from '@components/styled/Text';
import Flex from '@components/styled/Flex';
import Box from '@components/styled/Box';
import Link from '@components/styled/Link';

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
    <section>
      <Box p="xl" br="lg" shadow="dp03">
        <Flex direction="column" alignItems="center" gap="sm">
          <PetsitterImage>
            <ImageCentered
              src={petsitter?.photo ? `${petsitter?.photo}` : '/imgs/DefaultUserProfile.jpg'}
              alt="petsitter_photo"
            />
          </PetsitterImage>
          <Text size="lg" weight="semibold">
            {petsitter?.nickname} 님
          </Text>
          <Flex gap="xs">
            <Link to={`/chats/temp?${params.toString()}`} type="text" size="sm">
              채팅 하기
            </Link>
            <Link to={`/users/${petsitter?.nickname}`} type="text" size="sm">
              프로필 보기
            </Link>
          </Flex>
        </Flex>
        <Flex direction="column">
          <Flex>
            <Flex alignItems="center" gap="xs">
              <PiStarFill size="28px" color="#279EFF" />
              <Text size="lg">{petsitter?.star}</Text>
            </Flex>
            <Flex alignItems="center" gap="xs">
              <MdOutlineRateReview size="28px">review</MdOutlineRateReview>
              <Text size="lg">{petsitter?.reviewCount}</Text>
            </Flex>
          </Flex>

          <Flex alignItems="center" gap="sm">
            {petsitter?.possibleDays?.map((day: string, index: number) => {
              const matchedDay = weekdays.find((weekday) => weekday.value === day);
              return (
                <Box as="li" key={index} px="sm" py="xs" bg="background.box.accent.primary" br="lg">
                  <Text size="sm" color="white">
                    {matchedDay?.label}
                  </Text>
                </Box>
              );
            })}
          </Flex>

          <div>
            <span>{timeRange(petsitter?.possibleStartTime ?? null, petsitter?.possibleEndTime ?? null)}</span>
          </div>
        </Flex>
      </Box>
    </section>
  );
}

const PetsitterImage = styled(RoundedImageWrapper)`
  width: 100px;
  height: 100px;
  border: 2px solid ${({ theme }) => theme.colors.line.box.highlight};
`;
