import dayjs, { Dayjs } from 'dayjs';
import { Controller, useForm } from 'react-hook-form';
import useSWR from 'swr';

import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';

import { Title } from '@/styles/commonStyle';
import { reservationDisableDate, timeOptions } from '@/utils/date';
import { fetcher } from '@/api';
import { Petsitter } from '@/types/user.type';
import { DayOfWeekType } from '@/types/common.type';
import { Reservation } from '@/types/reservation.type';
import Box from '@components/styled/Box';
import Flex from '@components/styled/Flex';

interface PossibleDateProps {
  petsitter?: Petsitter;
}

interface IDateForm {
  date: string | null;
  startTime: string | null;
  endTime: string | null;
}

export default function PossibleDate({ petsitter }: PossibleDateProps) {
  const { watch, setValue, control } = useForm<IDateForm>({
    defaultValues: {
      date: null,
      startTime: null,
      endTime: null,
    },
  });

  const possibleStartTimeDayjs = petsitter?.possibleStartTime ? dayjs(petsitter.possibleStartTime, 'HH:mm:ss') : null;
  const possibleEndTimeDayjs = petsitter?.possibleEndTime ? dayjs(petsitter.possibleEndTime, 'HH:mm:ss') : null;

  const date = watch('date');
  const startTime = watch('startTime');
  const endTime = watch('endTime');

  const { data } = useSWR(
    date ? `/reservations/petsitter/${petsitter?.id}?date=${dayjs(date).format('YYYY-MM-DD')}` : null,
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
    const isReserved = data?.some((reservation: Reservation) => {
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
    const dayIndexToEnum: DayOfWeekType[] = [
      DayOfWeekType.SUN,
      DayOfWeekType.MON,
      DayOfWeekType.TUE,
      DayOfWeekType.WED,
      DayOfWeekType.THU,
      DayOfWeekType.FRI,
      DayOfWeekType.SAT,
    ];
    const dayOfWeek = dayIndexToEnum[day.day()]; // 날짜의 요일 ("Mon")
    const isNotAvailableDay = !(petsitter?.possibleDays?.includes(dayOfWeek) || false);

    return isOutOfRange || isNotAvailableDay;
  };

  return (
    <Section>
      <Flex justifyContent="space-between" alignItems="center">
        <Title>예약 가능 날짜</Title>
        {date && <button onClick={deleteDate}>날짜 지우기</button>}
      </Flex>

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
            <Flex justifyContent="space-between" alignItems="center">
              <Title>예약 가능 시간</Title>
              {(startTime || endTime) && <button onClick={deleteTime}>시간 지우기</button>}
            </Flex>
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

      {/* <ButtonContainer>
        <StyledLink
          to={`book?date=${dayjs(date).format('YYYY-MM-DD')}&checkIn=${startTime}&checkOut=${endTime}`}
          disabled={!date || !startTime || !endTime}
        >
          <span>예약하기</span>
        </StyledLink>
      </ButtonContainer> */}
    </Section>
  );
}

// TODO
const Section = styled.section`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const StyledDatePicker = styled(DatePicker)`
  font-family: inherit;

  .MuiInputBase-root {
    border-radius: ${({ theme }) => theme.spacing.md};
  }
`;

const DropdownMenu = styled(motion.div)`
  overflow: hidden;
  width: 100%;
  border-radius: 5px;
`;

const ButtonContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-gap: ${({ theme }) => theme.spacing.sm};
`;

const ButtonWrapper = styled.div<{ disabled: boolean }>`
  position: relative;
  display: flex;
  border: 1px solid transparent;
  border-radius: ${({ theme }) => theme.radius.sm};

  &:hover {
    border: 1px solid ${({ theme, disabled }) => (disabled ? 'none' : theme.colors.line.box.highlight)};
  }

  &:hover div {
    opacity: 1; /* On hover, set opacity of Hover element to 1 */
  }
`;

const TimeButton = styled.button<{ disabled: boolean; $isSelected: boolean; $isBetween: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: ${({ theme }) => theme.spacing.xl};
  background-color: ${({ $isSelected, $isBetween, theme }) =>
    $isSelected
      ? theme.colors.background.box.accent.active
      : $isBetween
        ? theme.colors.background.box.accent.primary
        : 'transparent'};
  border-radius: ${({ theme }) => theme.radius.sm};

  /* hover와 active 스타일을 disabled일 때 비활성화 */
  pointer-events: ${({ disabled }) => (disabled ? 'none' : 'auto')};
`;

const TimeText = styled.span<{ disabled: boolean; $isBetween: boolean; $isSelected: boolean }>`
  color: ${({ disabled, $isSelected, $isBetween, theme }) =>
    $isSelected || $isBetween
      ? theme.colors.text.white
      : disabled
        ? theme.colors.text.inactive
        : theme.colors.text.active};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  text-decoration: ${({ disabled }) => (disabled ? 'line-through' : 'none')};
`;

// TODO
// const ButtonContainer = styled.div`
//   flex: 1;
//   display: flex;
//   justify-content: center;
//   padding: ${({ theme }) => theme.spacing.xl};
//   background-color: ${({ theme }) => theme.colors.background.primary};
// `;
