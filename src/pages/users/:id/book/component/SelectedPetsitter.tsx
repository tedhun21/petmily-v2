import styled from '@emotion/styled';

import { MdOutlineRateReview } from 'react-icons/md';
import { PiStarFill } from 'react-icons/pi';

import { weekdays } from '@/utils/date';
import { Divider, ImageCentered, RoundedImageWrapper } from '@/styles/commonStyle';
import { Petsitter } from '@/types/user.type';
import { DayOfWeekType } from '@/types/common.type';
import { Text } from '@components/styled/Text';
import Box from '@components/styled/Box';
import Flex from '@components/styled/Flex';

interface SelectedPetsitterProps {
  petsitter: Petsitter;
}

export default function SelectedPetsitter({ petsitter }: SelectedPetsitterProps) {
  return (
    <PetsitterSection>
      <CardTitleContainer>
        <Flex alignItems="flex-end" gap="sm">
          <Text size="lg" weight="bold">
            {petsitter?.nickname}
          </Text>
          <Text size="sm" weight="light">
            펫시터
          </Text>
        </Flex>
        <PetsitterImg>
          <ImageCentered
            src={petsitter?.photo ? `${petsitter?.photo}` : '/imgs/DefaultUserProfile.jpg'}
            alt="petsitter_photo"
          />
        </PetsitterImg>
      </CardTitleContainer>

      <Box p="2xl" bg="background.box.default.primary">
        <Flex direction="column" gap="sm">
          <Flex alignItems="center" gap="lg">
            <Flex alignItems="center" gap="sm">
              <PiStarFill size="28px" color="#279EFF" />
              <Text size="lg" weight="bold">
                {petsitter?.star}
              </Text>
            </Flex>
            <Flex alignItems="center" gap="sm">
              <MdOutlineRateReview size="28px" />
              <Text size="lg" weight="bold">
                {petsitter?.reviewCount}
              </Text>
            </Flex>
          </Flex>
        </Flex>
        <Flex direction="column" gap="sm">
          <Flex gap="sm">
            <span>가능 장소</span>
            <CapsuleWrapper>
              {petsitter?.possibleLocations?.map((location: string) => (
                <Capsule key={location}>{location}</Capsule>
              ))}
            </CapsuleWrapper>
          </Flex>
          <Flex gap="sm">
            <span>가능 요일</span>
            <CapsuleWrapper>
              {petsitter?.possibleDays?.map((day: DayOfWeekType) => {
                const matchedDay = weekdays.find((weekday) => weekday.value === day);
                return <Capsule key={day}>{matchedDay?.label}</Capsule>;
              })}
            </CapsuleWrapper>
          </Flex>
        </Flex>

        <Divider />

        <div>{petsitter?.body}</div>
      </Box>
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

// TODO
const CardTitleContainer = styled.div`
  position: relative;
  display: flex;
  padding: 12px 36px;
  background-color: ${({ theme }) => theme.colors.background.highlight};
  color: ${({ theme }) => theme.colors.text.white};
`;

const PetsitterImg = styled(RoundedImageWrapper)`
  position: absolute;
  top: ${({ theme }) => theme.spacing['2xl']};
  right: ${({ theme }) => theme.spacing['2xl']};
  width: 64px;
  height: 64px;
`;

const CapsuleWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
`;

// TODO
const Capsule = styled.span`
  padding: 4px ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.background.highlight};
  border-radius: ${({ theme }) => theme.radius.sm};
  color: ${({ theme }) => theme.colors.text.white};
  ${({ theme }) => theme.typeScale.sm};
`;
