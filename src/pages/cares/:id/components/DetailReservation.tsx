import { Link } from 'react-router-dom';

import styled from 'styled-components';
import { HiOutlineLocationMarker } from 'react-icons/hi';
import { FaChevronRight } from 'react-icons/fa6';

import { dateAgo, dayFormat, timeRange } from 'utils/date';
import { Reservation } from 'types/reservation.type';
import { Column, Row } from 'styles/commonStyle';
import { Text } from 'styles/common/Text';

interface DetailReservationProps {
  reservation: Reservation;
}

export default function DetailReservation({ reservation }: DetailReservationProps) {
  return (
    <Section as="section">
      <Wrapper>
        <Text $size="lg" $weight="semibold">
          예약 날짜
        </Text>
        <div>
          <span>{reservation?.date}</span>
          <span>({dayFormat(reservation?.date)})</span>
        </div>
      </Wrapper>
      <Wrapper>
        <Text $size="lg" $weight="semibold">
          예약 시간
        </Text>
        <span>{timeRange(reservation?.startTime, reservation?.endTime)}</span>
      </Wrapper>
      <Wrapper>
        <Text $size="lg" $weight="semibold">
          예약 장소
        </Text>
        <LocationLink to={`/cares/${reservation?.id}/maps?address=${reservation?.address}`}>
          <CustomLocationMarker />
          <span>{reservation?.address}</span>
          <CustomChevronRight />
        </LocationLink>
      </Wrapper>
      <RequestContaier>
        <Text $size="lg" $weight="semibold">
          요청 사항
        </Text>
        <RequestParagraph>{reservation?.body}</RequestParagraph>
      </RequestContaier>

      <Text $size="sm">{dateAgo(reservation?.createdAt)}</Text>
    </Section>
  );
}

const Section = styled(Column)`
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadow.dp03};
`;

const Wrapper = styled(Row)`
  justify-content: space-between;
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

const RequestContaier = styled(Column)`
  gap: 8px;
`;

const RequestParagraph = styled.p`
  ${({ theme }) => theme.typeScale.sm};
  padding-left: ${({ theme }) => theme.spacing.sm};
`;
