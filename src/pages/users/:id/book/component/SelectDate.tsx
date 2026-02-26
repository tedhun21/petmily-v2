import { useRef } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import styled from '@emotion/styled';
import { css } from '@emotion/react';
import DatePicker from 'react-datepicker';
import { ko } from 'date-fns/locale';
import dayjs from 'dayjs';

import { PiCalendarDots } from 'react-icons/pi';

import type { RootState } from '@/store';
import { closeModal, ModalType, openModal } from '@/store/slices/modalSlice';
import { DayOfWeek, type DayOfWeekType } from '@/types/common.type';
import Flex from '@/components/styled/Flex';
import Button from '@/components/styled/Button';
import Text from '@/components/styled/Text';

interface IProps {
  possibleDays?: DayOfWeekType[];
}

const getDayMap: DayOfWeekType[] = [
  DayOfWeek.SUN,
  DayOfWeek.MON,
  DayOfWeek.TUE,
  DayOfWeek.WED,
  DayOfWeek.THU,
  DayOfWeek.FRI,
  DayOfWeek.SAT,
];

export default function SelectDate({ possibleDays }: IProps) {
  const { control, watch } = useFormContext();

  const dateRef = useRef(null);
  const selectedDate = watch('date');

  const isDateDisabled = (date: Date): boolean => {
    if (!possibleDays || possibleDays.length === 0) {
      return false;
    }
    const dayOfWeek = getDayMap[date.getDay()];
    return !possibleDays.includes(dayOfWeek);
  };

  return (
    <div
      ref={dateRef}
      css={(theme) => css`
        position: relative;
        display: inline-block;
        border-radius: ${theme.space.lg};
        border: 1px solid ${theme.colors.line.input.primary};
      `}
    >
      <button
        type="button"
        // onClick={handleDateModalOpen}
        css={{ backgroundColor: 'transparent', padding: '8px', display: 'inline-block' }}
      >
        <Flex justifyContent="space-between" alignItems="center" gap="lg">
          <Text>{selectedDate ? dayjs(selectedDate).format('YYYY년 MM월 DD일') : '방문 날짜 선택'}</Text>
          <PiCalendarDots size="24px" />
        </Flex>
      </button>

      {/* <PortalModal
        open={currentModal === ModalType.BOOK_DATE}
        onClose={handleDateModalClose}
        targetElement={dateRef.current}
      >
        <StyledModal>
          <DatepickerWrapper onClick={(e) => e.stopPropagation()}>
            <Controller
              control={control}
              name="date"
              render={({ field }) => (
                <DatePicker
                  locale={ko}
                  dateFormatCalendar="yyyy년 MM월"
                  selected={selectedDate ? new Date(selectedDate) : null}
                  onChange={(date: Date | null) => {
                    field.onChange(date ? dayjs(date).format('YYYY-MM-DD') : null);
                  }}
                  minDate={new Date()}
                  maxDate={new Date(new Date().setMonth(new Date().getMonth() + 2))}
                  filterDate={(date) => !isDateDisabled(date)}
                  inline
                />
              )}
            />
          </DatepickerWrapper>
          <Flex justifyContent="flex-end">
            <Button type="button" onClick={handleDateModalClose}>
              다음
            </Button>
          </Flex>
        </StyledModal>
      </PortalModal> */}
    </div>
  );
}

const DatepickerWrapper = styled.div`
  width: 100%;

  & .react-datepicker {
    width: 100%;
    height: 100%;
    background-color: transparent;
    border: none;
    color: inherit;

    & .react-datepicker__month-container {
      width: 100%;
      height: 100%;

      & .react-datepicker__header {
        height: 15%;
        background-color: transparent;
        border: none;

        & .react-datepicker__current-month {
          color: inherit;
          ${({ theme }) => theme.typeScale.base};
        }
      }

      & .react-datepicker__day-names {
        display: flex;
        justify-content: space-around;
        margin: 0.4rem;

        & > div {
          color: inherit;
        }
      }

      & .react-datepicker__month {
        display: flex;
        flex-direction: column;
        justify-content: space-around;

        & .react-datepicker__week {
          display: flex;
          justify-content: space-around;

          > div {
            color: inherit;
          }

          & .react-datepicker__day--selected,
          & .react-datepicker__day--in-range {
            /* 선택된 날짜 */
            background-color: ${({ theme }) => theme.colors.background.accent} !important;
            border-radius: 50%;
            color: ${({ theme }) => theme.colors.text.white};
          }

          & .react-datepicker__day--keyboard-selected {
            /* 키보드로 선택된 날짜 */
            color: inherit;
            background-color: ${({ theme }) => theme.colors.background.box.default.primary};
            border: 1px solid ${({ theme }) => theme.colors.line.box.primary};
            border-radius: 50%;
          }

          & .react-datepicker__day--today {
            /* 오늘 날짜 */
            background-color: transparent;
            border: 1px solid ${({ theme }) => theme.colors.line.box.active};
            border-radius: 50%;
          }

          & .react-datepicker__day--disabled {
            /* 비활성화된 날짜 */
            color: ${({ theme }) => theme.colors.text.secondary};
            text-decoration: line-through;
            cursor: default;
          }

          & .react-datepicker__day {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 46px;
            height: 46px;
            font-weight: ${({ theme }) => theme.fontWeight.normal};
            ${({ theme }) => theme.typeScale.sm};

            &:not(.react-datepicker__day--selected, [aria-disabled='true']):hover {
              background-color: transparent;
              border: 1px solid ${({ theme }) => theme.colors.line.box.primary};
              border-radius: 50%;
            }
          }
        }
      }
    }
  }
`;
