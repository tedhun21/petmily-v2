import dayjs from 'dayjs';
import { useFormContext, useWatch } from 'react-hook-form';
import useSWR from 'swr';

import styled from '@emotion/styled';

import { Divider } from '@/styles/commonStyle';
import { isTimeBetween, timeOptions } from '@/utils/date';
import { fetcher } from '@/api';
import type { Petsitter } from '@/types/user.type';
import type { Reservation } from '@/types/reservation.type';
import Flex from '@/components/styled/Flex';
import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeModal, ModalType, openModal } from '@/store/slices/modalSlice';
import { css } from '@emotion/react';

import type { RootState } from '@/store';
import Text from '@/components/styled/Text';
import Box from '@/components/styled/Box';
import { createPortal } from 'react-dom';
import Modal from '@/components/Modal';

interface IProps {
  petsitter?: Petsitter;
}

export default function SelectTimes({ petsitter }: IProps) {
  const dispatch = useDispatch();
  const timeRef = useRef(null);
  const { register, setValue, getValues, control } = useFormContext();

  const { currentModal } = useSelector((state: RootState) => state.modal);
  const [isSelected, setIsSelected] = useState<'startTime' | 'endTime' | null>(null);

  const possibleStartTimeDayjs = petsitter?.possibleStartTime ? dayjs(petsitter.possibleStartTime, 'HH:mm:ss') : null;
  const possibleEndTimeDayjs = petsitter?.possibleEndTime ? dayjs(petsitter.possibleEndTime, 'HH:mm:ss') : null;

  const date = useWatch({ control, name: 'date', defaultValue: null });
  const startTime = useWatch({ control, name: 'startTime', defaultValue: '' });
  const endTime = useWatch({ control, name: 'endTime', defaultValue: '' });

  // 펫시터의 해당 날짜 예약된 시간 불러오기
  const { data } = useSWR(
    date && petsitter ? `/reservations/petsitter/${petsitter.id}?date=${dayjs(date).format('YYYY-MM-DD')}` : null,
    fetcher,
  );

  const handleBookTimeModalOpen = () => {
    dispatch(openModal(ModalType.BOOK_TIME));
  };

  const handleBookTimeModalClose = () => {
    dispatch(closeModal());
  };

  const handleTimeClick = (time: string) => {
    const startTime = getValues('startTime');
    const endTime = getValues('endTime');

    if (!startTime) {
      // 1. 시작 시간이 없는 경우: 시작 시간으로 설정
      setValue('startTime', time);
    } else if (!endTime) {
      // 2. 시작 시간만 있는 경우
      if (time === startTime) {
        // 같은 시간을 클릭하면 선택 취소
        setValue('startTime', '');
      } else if (dayjs(time, 'HH:mm').isBefore(dayjs(startTime, 'HH:mm'))) {
        // 시작 시간보다 이전 시간을 클릭하면, 새로운 시작 시간으로 설정
        setValue('startTime', time);
      } else {
        // 시작 시간 이후의 시간을 클릭하면, 종료 시간으로 설정
        setValue('endTime', time);
      }
    } else {
      // 3. 시작 시간과 종료 시간이 모두 있는 경우
      if (time === startTime) {
        // 시작 시간을 다시 클릭하면, 전체 선택 취소
        setValue('startTime', '');
        setValue('endTime', '');
      } else if (time === endTime) {
        // 종료 시간을 다시 클릭하면, 종료 시간만 선택 취소
        setValue('endTime', '');
      } else {
        // 새로운 시간을 클릭하면, 새로운 시작 시간으로 설정
        setValue('startTime', time);
        setValue('endTime', '');
      }
    }
  };
  const isTimeDisabled = (time: string): boolean => {
    const timeDayjs = dayjs(time, 'HH:mm');
    // 1. 펫시터의 활동 가능 시간 확인
    if (possibleStartTimeDayjs && possibleEndTimeDayjs) {
      if (timeDayjs.isBefore(possibleStartTimeDayjs) || timeDayjs.isAfter(possibleEndTimeDayjs)) {
        return true;
      }
    }
    return false;
  };

  const handleFocus = (time: 'startTime' | 'endTime' | null) => {
    setIsSelected(time);
  };

  return (
    <div ref={timeRef} css={{ position: 'relative' }}>
      <button type="button" onClick={() => handleBookTimeModalOpen()}>
        <Box
          br="lg"
          css={(theme) => css`
            outline: ${currentModal === ModalType.BOOK_TIME
              ? `2px solid ${theme.colors.line.input.focus}`
              : `1px solid ${theme.colors.line.input.primary}`};
          `}
        >
          <Flex>
            <Box p="md">
              <Flex direction="column" gap="md" alignItems="flex-start">
                <Text>시작 시간</Text>
                <input {...register('startTime')} placeholder="시간 추가" autoComplete="off" />
              </Flex>
            </Box>
            <Box
              p="md"
              css={(theme) => css`
                border-left: 1px solid ${theme.colors.line.input.primary};
              `}
            >
              <Flex direction="column" gap="md" alignItems="flex-start">
                <Text>종료 시간</Text>
                <input {...register('endTime')} placeholder="시간 추가" autoComplete="off" />
              </Flex>
            </Box>
          </Flex>
        </Box>
      </button>

      {/* <Modal open={currentModal === ModalType.BOOK_TIME} close={handleBookTimeModalClose}>
        <div>hi</div>
        <div>hi</div>
        <div>hi</div>
        <div>hi</div>
        <div>hi</div>
        <div>hi</div>
        <div>hi</div>
        <div>hi</div>
        <div>hi</div>
      </Modal> */}

      {/* {timeRef.current &&
        createPortal(
          <div css={{ position: 'absolute', top: 0, left: 0 }}>
            <button type="button" onClick={() => handleBookTimeModalOpen()}>
              <Box
                br="lg"
                css={(theme) => css`
                  outline: ${currentModal === ModalType.BOOK_TIME
                    ? `2px solid ${theme.colors.line.input.focus}`
                    : `1px solid ${theme.colors.line.input.primary}`};
                `}
              >
                <Flex>
                  <Box p="md">
                    <Flex direction="column" gap="md" alignItems="flex-start">
                      <Text>시작 시간</Text>
                      <input {...register('startTime')} placeholder="시간 추가" autoComplete="off" />
                    </Flex>
                  </Box>
                  <Box
                    p="md"
                    css={(theme) => css`
                      border-left: 1px solid ${theme.colors.line.input.primary};
                    `}
                  >
                    <Flex direction="column" gap="md" alignItems="flex-start">
                      <Text>종료 시간</Text>
                      <input {...register('endTime')} placeholder="시간 추가" autoComplete="off" />
                    </Flex>
                  </Box>
                </Flex>
              </Box>
            </button>
          </div>,
          timeRef.current,
        )} */}

      {/* <PortalModal
        open={currentModal === ModalType.BOOK_TIME}
        onClose={handleBookTimeModalClose}
        targetElement={timeRef.current}
      >
        <div style={{}}>
          <button type="button" onClick={() => handleBookTimeModalOpen()}>
            <Box
              br="md"
              css={(theme) => css`
                outline: ${currentModal === ModalType.BOOK_TIME
                  ? `2px solid ${theme.colors.line.input.focus}`
                  : `1px solid ${theme.colors.line.input.primary}`};
              `}
            >
              <Flex>
                <Box p="md">
                  <Flex direction="column" gap="md" alignItems="flex-start">
                    <Text>시작 시간</Text>
                    <input {...register('startTime')} placeholder="시간 추가" />
                  </Flex>
                </Box>
                <Box
                  p="md"
                  css={(theme) => css`
                    border-left: 1px solid ${theme.colors.line.input.primary};
                  `}
                >
                  <Flex direction="column" gap="md" alignItems="flex-start">
                    <Text>종료 시간</Text>
                    <input {...register('endTime')} placeholder="시간 추가" />
                  </Flex>
                </Box>
              </Flex>
            </Box>
          </button>
          <ButtonContainer>
            {timeOptions().map((time: string) => {
              const isSelected = startTime === time || endTime === time;
              const disabled = isTimeDisabled(time);
              const isBetween = isTimeBetween(time, startTime, endTime, 'minute', '()');
              return (
                <ButtonWrapper key={time} disabled={disabled}>
                  <TimeButton
                    disabled={disabled}
                    $isBetween={isBetween}
                    $isSelected={isSelected}
                    onClick={() => handleTimeClick(time)}
                  >
                    <TimeText disabled={disabled} $isBetween={isBetween} $isSelected={isSelected}>
                      {time}
                    </TimeText>
                  </TimeButton>
                </ButtonWrapper>
              );
            })}
          </ButtonContainer>
        </div>
      </PortalModal> */}
    </div>
  );
}

const ButtonContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-gap: ${({ theme }) => theme.space.sm};
`;

const ButtonWrapper = styled.div<{ disabled: boolean }>`
  position: relative;
  display: flex;
  border: 1px solid transparent;
  border-radius: ${({ theme }) => theme.radius.sm};

  &:hover {
    border: 1px solid ${({ theme, disabled }) => (disabled ? 'none' : theme.colors.line.box.active)};
  }

  &:hover div {
    opacity: 1; /* On hover, set opacity of Hover element to 1 */
  }
`;

const TimeButton = styled.button<{
  disabled: boolean;
  $isSelected: boolean;
  $isBetween: boolean;
}>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: ${({ theme }) => theme.space.xl};
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

const TimeText = styled.span<{
  disabled: boolean;
  $isBetween: boolean;
  $isSelected: boolean;
}>`
  color: ${({ disabled, $isSelected, $isBetween, theme }) =>
    $isSelected || $isBetween
      ? theme.colors.text.white
      : disabled
        ? theme.colors.text.disabled
        : theme.colors.text.primary};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  text-decoration: ${({ disabled }) => (disabled ? 'line-through' : 'none')};
`;
