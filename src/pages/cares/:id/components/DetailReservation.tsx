import { Link } from 'react-router-dom';

import styled from '@emotion/styled';
import { HiOutlineLocationMarker } from 'react-icons/hi';
import { FaChevronRight } from 'react-icons/fa6';

import { dateAgo, dayFormat, timeRange } from '@/utils/date';
import type { Reservation } from '@/types/reservation.type';
import Text from '@/components/styled/Text';
import Flex from '@/components/styled/Flex';
import Box from '@/components/styled/Box';

interface DetailReservationProps {
  reservation: Reservation;
}

export default function DetailReservation({ reservation }: DetailReservationProps) {
  return (
    <Box p="xl" br="lg" shadow="dp03">
      <Flex direction="column" gap="sm">
        <Flex justifyContent="space-between">
          <Text size="lg" weight="semibold">
            예약 날짜
          </Text>
          <div>
            <span>{reservation?.date}</span>
            <span>({dayFormat(reservation?.date)})</span>
          </div>
        </Flex>
        <Flex justifyContent="space-between">
          <Text size="lg" weight="semibold">
            예약 시간
          </Text>
          <span>{timeRange(reservation?.startTime, reservation?.endTime)}</span>
        </Flex>
        <Flex justifyContent="space-between">
          <Text size="lg" weight="semibold">
            예약 장소
          </Text>
          <Link to={`/cares/${reservation?.id}/maps?address=${reservation?.address}`}>
            <Flex alignItems="center" gap="xs">
              <CustomLocationMarker />
              <span>{reservation?.address}</span>
              <CustomChevronRight />
            </Flex>
          </Link>
        </Flex>
        <Flex direction="column" gap="sm">
          <Text size="lg" weight="semibold">
            요청 사항
          </Text>
          <RequestParagraph>{reservation?.body}</RequestParagraph>
        </Flex>

        <Text size="sm">{dateAgo(reservation?.createdAt)}</Text>
      </Flex>
    </Box>
  );
}

const CustomLocationMarker = styled(HiOutlineLocationMarker)`
  color: ${({ theme }) => theme.colors.text.accent};
`;

const CustomChevronRight = styled(FaChevronRight)`
  color: ${({ theme }) => theme.colors.text.accent};
`;

const RequestParagraph = styled.p`
  padding-left: ${({ theme }) => theme.space.sm};
  ${({ theme }) => theme.typeScale.sm};
`;
