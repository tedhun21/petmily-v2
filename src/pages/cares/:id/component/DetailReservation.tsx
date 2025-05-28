import { Link } from 'react-router-dom';

import styled from 'styled-components';
import { HiOutlineLocationMarker } from 'react-icons/hi';
import { FaChevronRight } from 'react-icons/fa6';

import { dateAgo, dayFormat, timeRange } from 'utils/date';
import { Texts12h18, Texts18h27 } from 'styles/commonStyle';
import { Reservation } from 'types/reservation.type';

interface DetailReservationProps {
  reservation: Reservation;
}

export default function DetailReservation({ reservation }: DetailReservationProps) {
  return (
    <DetailRservation>
      <Wrapper>
        <Label>예약 날짜</Label>
        <div>
          <span>{reservation?.date}</span>
          <span>({dayFormat(reservation?.date)})</span>
        </div>
      </Wrapper>
      <Wrapper>
        <Label>예약 시간</Label>
        <span>{timeRange(reservation?.startTime, reservation?.endTime)}</span>
      </Wrapper>
      <Wrapper>
        <Label>예약 장소</Label>
        <LocationLink to={`/cares/${reservation?.id}/maps?address=${reservation?.address}`}>
          <CustomLocationMarker />
          <span>{reservation?.address}</span>
          <CustomChevronRight />
        </LocationLink>
      </Wrapper>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Label>요청 사항</Label>
        <RequestParagraph>{reservation?.body}</RequestParagraph>
      </div>

      <Texts12h18>{dateAgo(reservation?.createdAt)}</Texts12h18>
    </DetailRservation>
  );
}

const DetailRservation = styled.section`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 20px;
  border-radius: 20px;
  box-shadow: ${({ theme }) => theme.shadow.dp03};
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Label = styled(Texts18h27)`
  font-weight: ${({ theme }) => theme.fontWeight.bold};
`;

const LocationLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const CustomLocationMarker = styled(HiOutlineLocationMarker)`
  color: ${({ theme }) => theme.text.highlight};
`;

const CustomChevronRight = styled(FaChevronRight)`
  color: ${({ theme }) => theme.text.highlight};
`;

const RequestParagraph = styled.p`
  ${({ theme }) => theme.fontSize.s14h21};
  padding-left: 8px;
`;
