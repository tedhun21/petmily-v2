import styled from 'styled-components';
import { ModalLayOut } from '../SearchBox';
import { Column } from 'commonStyle';
import { timeOptions } from 'utils/date';
import { useFormContext } from 'react-hook-form';
import dayjs from 'dayjs';

export default function CheckInOutModal({ isSelected, setIsSelected }: any) {
  const { setValue, watch } = useFormContext();

  const checkIn = watch('checkIn');
  const checkOut = watch('checkOut');

  console.log(isSelected);

  const handleCapsuleClick = (e: React.MouseEvent, time: string) => {
    e.stopPropagation();
    if (isSelected === 'checkIn') {
      if (dayjs(time, 'HH:mm').isAfter(dayjs(checkOut, 'HH:mm'))) {
        setValue('checkIn', time);
        setValue('checkOut', null);
      }

      setValue('checkIn', time);
      setIsSelected('checkOut');
    } else if (isSelected === 'checkOut') {
      if (dayjs(time, 'HH:mm').isBefore(dayjs(checkIn, 'HH:mm'))) {
        setValue('checkIn', time);
        setValue('checkOut', null);
      } else {
        setValue('checkOut', time);
      }

      if (!checkIn) {
        setIsSelected('checkIn');
      }
    }
  };

  const isTimeBetween = (time: string) => {
    if (!checkIn || !checkOut) return false;
    const checkInTimeDayjs = dayjs(checkIn, 'HH:mm');
    const checkOutTimeDayjs = dayjs(checkOut, 'HH:mm');
    const timeDayjs = dayjs(time, 'HH:mm');

    return timeDayjs.isBetween(checkInTimeDayjs, checkOutTimeDayjs, 'minute', '[]');
  };

  return (
    <ModalLayOut>
      <Content>
        <TimeContainer>
          <span>{isSelected === 'chekcIn' ? '체크인' : '체크아웃'} 시간 선택</span>
          <List>
            {timeOptions().map((time: string) => {
              const inTime = checkIn === time;
              const outTime = checkOut === time;
              const isBetween = isTimeBetween(time);

              return (
                <CapsuleWrapper key={time} $isBetween={isBetween} $isCheckIn={inTime} $isCheckOut={outTime}>
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
`;

const CapsuleWrapper = styled.div<{ $isBetween: boolean; $isCheckIn: boolean; $isCheckOut: boolean }>`
  border-radius: ${({ $isCheckIn, $isCheckOut }) =>
    $isCheckIn ? '20px 0 0 20px' : $isCheckOut ? '0 20px 20px 0' : null};
  background-color: ${({ $isBetween, theme }) => ($isBetween ? theme.background.box.default.hover : null)};
`;

const TimeCapsule = styled.li<{ $isSelected: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border-radius: 20px;
  padding: 12px 16px;
  border: 1px solid transparent;
  font-weight: ${({ theme }) => theme.fontWeight.light};

  color: ${({ $isSelected, theme }) => $isSelected && theme.text.opposite};

  background-color: ${({ theme, $isSelected }) => $isSelected && theme.background.box.default.opposite};

  &:hover {
    border: 1px solid ${({ theme }) => theme.line.box.highlight};
  }
`;
