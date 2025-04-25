import { Controller, useFormContext } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styled from 'styled-components';
import { ko } from 'date-fns/locale';

import { ModalLayOut } from '../SearchBox';
import dayjs from 'dayjs';

export default function DateModal({ handleSetValue }: any) {
  const { watch, control } = useFormContext();
  const selectedDate = watch('date');

  return (
    <ModalLayOut>
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
                field.onChange(date ? dayjs(date).format('MM-DD') : null);
                handleSetValue('date', dayjs(date).format('MM-DD'));
              }}
              minDate={new Date()}
              maxDate={new Date(new Date().setMonth(new Date().getMonth() + 2))}
              inline
            />
          )}
        />
      </DatepickerWrapper>
    </ModalLayOut>
  );
}

const DatepickerWrapper = styled.div`
  width: 100%;
  height: 400px;

  .react-datepicker {
    width: 100%;
    height: 100%;
    background-color: transparent; // 변경된 부분
    color: inherit;
    border: none;

    .react-datepicker__month-container {
      width: 100%;
      height: 100%;

      .react-datepicker__header {
        height: 15%;
        background-color: transparent; // 변경된 부분
        border: none;

        .react-datepicker__current-month {
          color: inherit;
          ${({ theme }) => theme.fontSize.s16h24};
        }

        .react-datepicker__day-names {
          display: flex;
          justify-content: center;

          > div {
            width: 46px;
            color: inherit;
          }
        }
      }

      .react-datepicker__month {
        height: 85%;

        display: flex;
        flex-direction: column;
        justify-content: space-around;

        .react-datepicker__week {
          display: flex;
          justify-content: center;

          > div {
            color: inherit;
          }

          .react-datepicker__day--selected,
          .react-datepicker__day--in-range {
            //선택된 날짜
            background-color: ${({ theme }) => theme.background.highlight} !important;
            color: ${({ theme }) => theme.text.white};
            border-radius: 50%;
          }

          .react-datepicker__day--today {
            // 오늘 날짜
            background-color: transparent;
          }

          .react-datepicker__day--disabled {
            // 비활성화된 날짜
            color: ${({ theme }) => theme.text.inactive};
            cursor: default;
            text-decoration: line-through;
          }

          .react-datepicker__day {
            display: flex;
            justify-content: center;
            align-items: center;

            width: 46px;
            height: 46px;
            font-weight: ${({ theme }) => theme.fontWeight.normal};
            ${({ theme }) => theme.fontSize.s14h21};

            &:not(.react-datepicker__day--selected):not([aria-disabled='true']):hover {
              border-radius: 50%;
              border: 1px solid ${({ theme }) => theme.line.box.primary};
              background-color: transparent; // 변경된 부분
            }
          }
        }
      }
    }
  }
`;
