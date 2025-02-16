import styled from 'styled-components';
import { ModalLayOut } from '../../../../components/headers/SearchBox';
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

    if (isSelected === 'startTime') {
      if (dayjs(time, 'HH:mm').isAfter(dayjs(endTime, 'HH:mm'))) {
        setValue('startTime', time);
        setValue('endTime', null);
      }

      setIsSelected('endTime');
    } else if (isSelected === 'endTime') {
      if (dayjs(time, 'HH:mm').isBefore(dayjs(startTime, 'HH:mm'))) {
        setValue('startTime', time);
        setValue('endTime', null);
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
                <CapsuleWrapper key={time} $isBetween={isBetween} $isstartTime={inTime} $isendTime={outTime}>
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

const CapsuleWrapper = styled.div<{ $isBetween: boolean; $isstartTime: boolean; $isendTime: boolean }>`
  border-radius: ${({ $isstartTime, $isendTime }) =>
    $isstartTime ? '20px 0 0 20px' : $isendTime ? '0 20px 20px 0' : null};
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
