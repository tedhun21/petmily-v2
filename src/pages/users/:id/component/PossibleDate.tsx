import dayjs, { Dayjs } from 'dayjs';
import { Controller, useFormContext } from 'react-hook-form';

import styled from 'styled-components';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';

import { Row, Title } from 'styles/commonStyle';
import { reservationDisableDate, timeOptions } from 'utils/date';
import { motion, AnimatePresence } from 'framer-motion';
import { fetcher } from 'api';
import useSWR from 'swr';

const API_URL = process.env.REACT_APP_API_URL;

export default function PossibleDate({ petsitter }: any) {
  const { setValue, control, watch } = useFormContext();

  const possibleStartTimeDayjs = petsitter?.possibleStartTime ? dayjs(petsitter.possibleStartTime, 'HH:mm:ss') : null;
  const possibleEndTimeDayjs = petsitter?.possibleEndTime ? dayjs(petsitter.possibleEndTime, 'HH:mm:ss') : null;

  const date = watch('date');
  const startTime = watch('startTime');
  const endTime = watch('endTime');

  const { data } = useSWR(
    date ? `${API_URL}/reservations/petsitter/${petsitter?.id}?date=${dayjs(date).format('YYYY-MM-DD')}` : null,
    fetcher,
  );

  const deleteDate = () => {
    setValue('date', null);
    setValue('startTime', null);
    setValue('endTime', null);
  };

  const deleteTime = () => {
    setValue('startTime', null);
    setValue('endTime', null);
  };

  const handleButtonClick = (time: string) => {
    if (!startTime) {
      // 시작 시간이 없을 경우 클릭한 시간을 시작 시간으로 설정
      setValue('startTime', time);
    } else if (startTime === time) {
      // 시작 시간을 다시 클릭하면 초기화
      setValue('startTime', null);
      setValue('endTime', null);
    } else if (!endTime) {
      // 종료 시간이 없으면 클릭한 시간을 종료 시간으로 설정
      setValue('endTime', time);
    } else if (endTime === time) {
      // 종료 시간을 다시 클릭하면 초기화
      setValue('endTime', null);
    }
  };

  const isTimeDisabled = (time: string): boolean => {
    if (!possibleStartTimeDayjs || !possibleEndTimeDayjs) {
      // 가능 시간이 설정되어 있지 않으면 모두 활성화
      return false;
    }

    const timeDayjs = dayjs(time, 'HH:mm');

    // 시간 범위 외인지 확인
    const isBeforePossibleStart = timeDayjs.isBefore(possibleStartTimeDayjs);
    const isAfterPossibleEnd = timeDayjs.isAfter(possibleEndTimeDayjs);

    if (isBeforePossibleStart || isAfterPossibleEnd) {
      return true;
    }

    // 시작 시간만 선택된 경우, 선택된 시간 이전 시간은 비활성화 && 최소 시간
    if (startTime && !endTime) {
      const startTimeDayjs = dayjs(startTime, 'HH:mm');

      if (timeDayjs.isBefore(startTimeDayjs)) {
        return true;
      }

      // 최소 시간 처리: 시작 시간인 경우는 예외
      const minDuration = 1; // 최소 1시간
      const isWithinMinDuration = timeDayjs.diff(startTimeDayjs, 'hour') < minDuration;
      if (isWithinMinDuration && time !== startTime) {
        return true;
      }
    }

    // 예약된 시간 확인
    const isReserved = data?.some((reservation: any) => {
      const reservationStart = dayjs(reservation.startTime, 'HH:mm');
      const reservationEnd = dayjs(reservation.endTime, 'HH:mm');

      // "[]" 이면 포함(이상, 이하), "()" 이면 포함x (초과, 미만)
      return timeDayjs.isBetween(reservationStart, reservationEnd, 'minute', '[]');
    });

    if (isReserved) {
      return true;
    }

    // 시작 시간과 종료 시간이 선택된 경우, 시간 범위를 제외한 나머지 비활성화
    if (startTime && endTime) {
      const startTimeDayjs = dayjs(startTime, 'HH:mm:ss');
      const endTimeDayjs = dayjs(endTime, 'HH:mm:ss');

      if (timeDayjs.isBefore(startTimeDayjs) || timeDayjs.isAfter(endTimeDayjs)) {
        return true;
      }
    }

    return false; // 위 조건에 해당하지 않으면 활성화
  };

  const isTimeBetween = (time: string) => {
    if (!startTime || !endTime) return false;

    const startTimeDayjs = dayjs(startTime, 'HH:mm');
    const endTimeDayjs = dayjs(endTime, 'HH:mm');
    const timeDayjs = dayjs(time, 'HH:mm');

    // 선택된 시간 범위 내에 포함되는지 확인
    return timeDayjs.isBetween(startTimeDayjs, endTimeDayjs, 'minute', '[]');
  };

  const isDateDisabled = (day: Dayjs | null): boolean => {
    if (!day) return false;

    // 첫번째 조건: 2개월 이후까지만
    const isOutOfRange = reservationDisableDate(day);

    // 두번째 조건: 요일 조건 확인
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayOfWeek = weekDays[day.day()]; // 날짜의 요일 ("Mon")
    const isNotAvailableDay = !(petsitter?.possibleDays?.includes(dayOfWeek) || false);

    return isOutOfRange || isNotAvailableDay;
  };

  return (
    <Section>
      <TitleContainer>
        <Title>예약 가능 날짜</Title>
        <button onClick={deleteDate}>날짜 지우기</button>
      </TitleContainer>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Controller
          name="date"
          control={control}
          render={({ field }) => (
            <StyledDatePicker {...field} shouldDisableDate={(value) => isDateDisabled(value as Dayjs)} />
          )}
        />
      </LocalizationProvider>

      <AnimatePresence>
        {date && (
          <div>
            <TitleContainer>
              <Title>예약 가능 시간</Title>
              <button onClick={deleteTime}>시간 지우기</button>
            </TitleContainer>
            <DropdownMenu
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            >
              <ButtonContainer>
                {timeOptions().map((time: string) => {
                  const isSelected = startTime === time || endTime === time;
                  const disabled = isTimeDisabled(time);
                  const isBetween = isTimeBetween(time);

                  return (
                    <ButtonWrapper key={time} disabled={disabled}>
                      {/* {isSelected && <Hover isSelected={isSelected}>체크인 시간</Hover>} */}
                      <TimeButton
                        disabled={disabled}
                        $isBetween={isBetween}
                        $isSelected={isSelected}
                        onClick={() => handleButtonClick(time)}
                      >
                        <TimeText disabled={disabled} $isBetween={isBetween} $isSelected={isSelected}>
                          {time}
                        </TimeText>
                      </TimeButton>
                    </ButtonWrapper>
                  );
                })}
              </ButtonContainer>
            </DropdownMenu>
          </div>
        )}
      </AnimatePresence>
    </Section>
  );
}

const Section = styled.section`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  gap: 16px;
`;

const TitleContainer = styled(Row)`
  justify-content: space-between;
  align-items: center;
`;

const StyledDatePicker = styled(DatePicker)`
  font-family: inherit;

  .MuiInputBase-root {
    border-radius: 12px;
  }
`;

const DropdownMenu = styled(motion.div)`
  width: 100%;
  border-radius: 5px;
  overflow: hidden;
`;

const ButtonContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-gap: 8px;
`;

const ButtonWrapper = styled.div<{ disabled: boolean }>`
  position: relative;
  display: flex;
  border-radius: 12px;
  border: 1px solid transparent;

  &:hover {
    border: 1px solid ${({ theme, disabled }) => (disabled ? 'none' : theme.line.box.highlight)};
  }

  &:hover div {
    opacity: 1; /* On hover, set opacity of Hover element to 1 */
  }
`;

const Hover = styled.div<{ isSelected: boolean }>`
  position: absolute;
  top: -20px;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.background.box.default.active};
  opacity: ${({ isSelected }) => (isSelected ? 1 : 0)};
  transition: opacity 0.3s ease;
`;

const TimeButton = styled.button<{ disabled: boolean; $isSelected: boolean; $isBetween: boolean }>`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  border-radius: 12px;

  // hover와 active 스타일을 disabled일 때 비활성화
  pointer-events: ${({ disabled }) => (disabled ? 'none' : 'auto')};

  background-color: ${({ $isSelected, $isBetween, theme }) =>
    $isSelected ? theme.background.box.blue.active : $isBetween ? theme.background.box.blue.primary : 'transparent'};
`;

const TimeText = styled.span<{ disabled: boolean; $isBetween: boolean; $isSelected: boolean }>`
  color: ${({ disabled, $isSelected, $isBetween, theme }) =>
    $isSelected || $isBetween ? theme.text.white : disabled ? theme.text.inactive : theme.text.active};
  text-decoration: ${({ disabled }) => (disabled ? 'line-through' : 'none')};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
`;
