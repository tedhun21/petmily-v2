import { Link } from 'react-router-dom';

import styled from 'styled-components';
import { HiOutlineLocationMarker } from 'react-icons/hi';
import { FaChevronRight } from 'react-icons/fa6';

import { dateAgo, dayFormat, timeRange } from 'utils/date';
import { Reservation } from 'types/reservation.type';
import { Text } from '@components/Text';
import { flex, Flex } from '@components/Flex';
import Box from '@components/Box';

interface DetailReservationProps {
  reservation: Reservation;
}

export default function DetailReservation({ reservation }: DetailReservationProps) {
  return (
    <Container>
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
        <LocationLink to={`/cares/${reservation?.id}/maps?address=${reservation?.address}`}>
          <CustomLocationMarker />
          <span>{reservation?.address}</span>
          <CustomChevronRight />
        </LocationLink>
      </Flex>
      <Flex direction="column" gap="sm">
        <Text size="lg" weight="semibold">
          요청 사항
        </Text>
        <RequestParagraph>{reservation?.body}</RequestParagraph>
      </Flex>

      <Text size="sm">{dateAgo(reservation?.createdAt)}</Text>
    </Container>
  );
}

const Container = styled(Box).attrs(() => ({
  p: 'xl',
  br: 'lg',
  shadow: 'dp03',
}))`
  ${flex({
    gap: 'sm',
  })}
`;

const LocationLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const CustomLocationMarker = styled(HiOutlineLocationMarker)`
  color: ${({ theme }) => theme.colors.text.highlight};
`;

const CustomChevronRight = styled(FaChevronRight)`
  color: ${({ theme }) => theme.colors.text.highlight};
`;

const RequestParagraph = styled.p`
  ${({ theme }) => theme.typeScale.sm};
  padding-left: ${({ theme }) => theme.spacing.sm};
`;
