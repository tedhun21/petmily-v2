import styled from 'styled-components';
import { dateAgo, dayFormat, timeRange } from 'utils/date';

export default function DetailReservation({ reservation }: any) {
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
      <div>
        <Label>요청 사항</Label>
        <p>{reservation?.body}</p>
      </div>
      <span>{dateAgo(reservation?.createdAt)}</span>
    </DetailRservation>
  );
}

const DetailRservation = styled.section`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 20px;
  border-radius: 20px;
  box-shadow: ${(props) => props.theme.shadow.dp03};
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Label = styled.span`
  font-weight: ${(props) => props.theme.fontWeights.bold};
  ${(props) => props.theme.fontSize.s18h27};
`;
