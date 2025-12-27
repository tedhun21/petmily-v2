import styled from '@emotion/styled';
import { type FormValues, ModalLayOut } from '../SearchBox';
import { timeOptions } from '@/utils/date';
import { useFormContext } from 'react-hook-form';
import dayjs from 'dayjs';
import type { RootState } from '@/store';
import { useDispatch, useSelector } from 'react-redux';
import { ModalType, openModal } from '@/store/modalSlice';
import Flex from '@/components/styled/Flex';

interface IProps {
  handleSetValue: (field: keyof FormValues, value: any) => void;
}

export default function StartEndTimeModal({ handleSetValue }: IProps) {
  const dispatch = useDispatch();
  const { currentModal } = useSelector((state: RootState) => state.modal);
  const { setValue, watch } = useFormContext();

  const startTime = watch('startTime');
  const endTime = watch('endTime');

  // 시간을 선택했을 때
  const handleCapsuleClick = (e: React.MouseEvent, time: string) => {
    e.stopPropagation();

    const selectedTime = dayjs(time, 'HH:mm');

    if (!startTime && !endTime) {
      setValue('startTime', time);
    } else if (startTime && !endTime) {
      if (selectedTime.isBefore(dayjs(startTime, 'HH:mm')) || selectedTime.isSame(dayjs(startTime, 'HH:mm'))) {
        setValue('startTime', time);
        return;
      }
      setValue('endTime', time);
    } else {
      setValue('startTime', time);
      setValue('endTime', null);
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
      <Flex direction="column" gap="lg">
        <span>{'체크인 & 체크아웃'} 시간 선택</span>
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
      </Flex>
    </ModalLayOut>
  );
}

const List = styled.ul`
  display: flex;
  flex-wrap: wrap;
  row-gap: 1px;
  justify-content: center;
`;

const CapsuleWrapper = styled.div<{
  $isBetween: boolean;
  $isStartTime: boolean;
  $isEndTime: boolean;
}>`
  background-color: ${({ $isBetween, theme }) => ($isBetween ? theme.colors.background.box.default.hover : null)};
  border-radius: ${({ $isStartTime, $isEndTime }) =>
    $isStartTime ? '20px 0 0 20px' : $isEndTime ? '0 20px 20px 0' : null};
`;

// TODO
const TimeCapsule = styled.li<{ $isSelected: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px ${({ theme }) => theme.space.lg};
  background-color: ${({ theme, $isSelected }) => $isSelected && theme.colors.background.box.accent.primary};
  border: 1px solid transparent;
  border-radius: ${({ theme }) => theme.space.xl};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  cursor: pointer;

  &:hover {
    border: 1px solid ${({ theme }) => theme.colors.line.box.hover};
  }
`;
