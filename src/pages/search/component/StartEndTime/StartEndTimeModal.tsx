import styled from 'styled-components';
import { ModalLayOut } from '../SearchBox';
import { Column } from 'styles/commonStyle';
import { timeOptions } from 'utils/date';
import { useFormContext } from 'react-hook-form';
import dayjs from 'dayjs';

export default function StartEndTimeModal({ isSelected, setIsSelected }: any) {
  const { setValue, watch } = useFormContext();

  const startTime = watch('startTime');
  const endTime = watch('endTime');

  // 시간을 선택했을 때
  const handleCapsuleClick = (e: React.MouseEvent, time: string) => {
    e.stopPropagation();

    const selectedTime = dayjs(time, 'HH:mm');

    if (isSelected === 'startTime') {
      // endTime이 먼저 있고, 선택한 시간이 endTime보다 더 이후일때
      // endTime은 null로 설정
      if (selectedTime.isAfter(dayjs(endTime, 'HH:mm'))) {
        setValue('startTime', time);
        setValue('endTime', null);
      } else if (selectedTime.isSame(dayjs(startTime, 'HH:mm'))) {
        setValue('startTime', null);
      } else {
        setValue('startTime', time);
      }

      setIsSelected('endTime');
    } else if (isSelected === 'endTime') {
      // startTime이 먼저 있고,
      // 선택한 endTime이 startTime보다 더 이전일때
      if (selectedTime.isBefore(dayjs(startTime, 'HH:mm'))) {
        setValue('startTime', time);
        setValue('endTime', null);
      } else if (selectedTime.isSame(dayjs(endTime, 'HH:mm'))) {
        setValue('endTime', null);
      } else if (selectedTime.isSame(dayjs(startTime, 'HH:mm'))) {
        return;
      } else {
        setValue('endTime', time);
      }

      if (!startTime) {
        setIsSelected('startTime');
      }
    }
  };

  const isTimeBetween = (time: string) => {
    if (!startTime || !endTime) return false;
    const startTimeTimeDayjs = dayjs(startTime, 'HH:mm');
    const endTimeTimeDayjs = dayjs(endTime, 'HH:mm');
    const timeDayjs = dayjs(time, 'HH:mm');

    return timeDayjs.isBetween(startTimeTimeDayjs, endTimeTimeDayjs, 'minute', '[]');
  };

  return (
    <ModalLayOut>
      <Content>
        <TimeContainer>
          <span>{isSelected === 'chekcIn' ? '체크인' : '체크아웃'} 시간 선택</span>
          <List>
            {timeOptions().map((time: string) => {
              const inTime = startTime === time;
              const outTime = endTime === time;
              const isBetween = isTimeBetween(time);

              return (
                <CapsuleWrapper key={time} $isBetween={isBetween} $isStartTime={inTime} $isEndTime={outTime}>
                  <TimeCapsule onClick={(e) => handleCapsuleClick(e, time)} $isSelected={inTime || outTime}>
                    {time}
                  </TimeCapsule>
                </CapsuleWrapper>
              );
            })}
          </List>
        </TimeContainer>
      </Content>
    </ModalLayOut>
  );
}

const Content = styled.div``;

const TimeContainer = styled(Column)`
  gap: 16px;
`;

const List = styled.ul`
  display: flex;
  flex-wrap: wrap;
  row-gap: 1px;
  justify-content: center;
`;

const CapsuleWrapper = styled.div<{ $isBetween: boolean; $isStartTime: boolean; $isEndTime: boolean }>`
  border-radius: ${({ $isStartTime, $isEndTime }) =>
    $isStartTime ? '20px 0 0 20px' : $isEndTime ? '0 20px 20px 0' : null};
  background-color: ${({ $isBetween, theme }) => ($isBetween ? theme.background.box.default.hover : null)};
`;

const TimeCapsule = styled.li<{ $isSelected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 16px;
  border: 1px solid transparent;
  border-radius: 20px;
  color: ${({ $isSelected, theme }) => $isSelected && theme.text.opposite};
  font-weight: ${({ theme }) => theme.fontWeight.light};
  background-color: ${({ theme, $isSelected }) => $isSelected && theme.background.box.default.opposite};
  cursor: pointer;

  &:hover {
    border: 1px solid ${({ theme }) => theme.line.box.highlight};
  }
`;
