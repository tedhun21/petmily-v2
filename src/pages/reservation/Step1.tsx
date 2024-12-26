import { useState } from 'react';

import styled from 'styled-components';
import { Controller, useFormContext, useWatch } from 'react-hook-form';

import { TextField } from '@mui/material';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers';
import { Modal, Sheet } from '@mui/joy';
import DaumPostcode from 'react-daum-postcode';

import dayjs, { Dayjs } from 'dayjs';

import { checkInDisableTime, checkOutDisableTime, reservationDisableDate } from 'utils/date';

import { BlueButton, BottomFixed, Column, Float, Row } from 'styles/commonStyle';
import PetContainer from './component/step1/PetContainer';

export default function Step1({ onNext }: any) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    setValue,
    setError,
    clearErrors,
    control,
    watch,
    formState: { errors },
  } = useFormContext();

  const { date, startTime, endTime, address, detailAddress, checkedPets } = useWatch({ control });

  // Address handler
  const handleComplete = (data: any) => {
    // 우편번호 data.zonecode
    // 시.도 data.sido
    // 구.군 data.sigungu
    // 상세주소 앞 2단어 제외하고 저장 ('서울 강남구' 제외하고 저장)

    const { address, zonecode } = data;
    if (data) {
      clearErrors('address');
    }

    setValue('address', `${zonecode} ${address}`);
    setIsModalOpen(false);
  };

  // Address Modal
  const onToggleModal = () => {
    setIsModalOpen(true);
  };

  const onSubmit = () => {
    let hasError = false;

    if (!date) {
      setError('date', { type: 'manual', message: '날짜를 선택해주세요.' });
      hasError = true;
    } else {
      clearErrors('date');
    }

    if (!startTime) {
      setError('startTime', { type: 'manual', message: '시작 시간을 선택해주세요.' });
      hasError = true;
    } else {
      clearErrors('startTime');
    }

    if (!endTime) {
      setError('endTime', { type: 'manual', message: '종료 시간을 선택해주세요.' });
      hasError = true;
    } else {
      clearErrors('endTime');
    }

    if (!address) {
      setError('address', { type: 'manual', message: '주소를 입력해주세요.' });
      hasError = true;
    } else {
      clearErrors('address');
    }

    if (!detailAddress) {
      setError('detailAddress', { type: 'manual', message: '상세주소를 입력해주세요.' });
      hasError = true;
    } else {
      clearErrors('detailAddress');
    }

    if (!checkedPets || checkedPets.length === 0 || checkedPets.length > 3) {
      setError('checkedPets', { type: 'manual', message: '펫을 최소 1마리, 최대 3마리까지 선택해주세요.' });
      hasError = true;
    } else {
      clearErrors('checkedPets');
    }

    if (hasError) {
      return; // 에러가 있으면 진행하지 않음
    }

    onNext(); // 에러가 없으면 다음 단계로 진행
  };

  return (
    <MainContainer>
      <form>
        <FieldContainer>
          {/* 방문 날짜 */}
          <Container>
            <ScheduleText>언제 펫시터가 필요하신가요?</ScheduleText>
            <LocalizationProvider dateAdapter={AdapterDayjs} dateFormats={{ monthShort: `M` }}>
              <DemoContainer components={['DatePicker']}>
                <Controller
                  name="date"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <StyledDatePicker
                      label="날짜를 입력해주세요"
                      format="YYYY-MM-DD"
                      value={value}
                      onChange={onChange}
                      shouldDisableDate={(value) => reservationDisableDate(value as Dayjs)}
                      sx={{ width: '100%' }}
                    />
                  )}
                />
              </DemoContainer>
            </LocalizationProvider>
          </Container>

          {/* 방문시간 */}
          <Container>
            <ScheduleText>방문시간</ScheduleText>
            <BasicTimePickerContainer>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['TimePicker']} sx={{ flex: 1 }}>
                  <Controller
                    name="startTime"
                    control={control}
                    rules={{ required: '예약 시간을 확인해주세요' }}
                    render={({ field: { value, onChange } }) => (
                      <StyledTimePicker
                        label="Check In"
                        minutesStep={30}
                        skipDisabled={true}
                        minTime={dayjs(new Date(0, 0, 0, 8))}
                        maxTime={dayjs(new Date(0, 0, 0, 21))}
                        ampm={false}
                        value={value}
                        onChange={onChange}
                        shouldDisableTime={(value, view) => checkInDisableTime(value as Dayjs, view, watch('date'))}
                      />
                    )}
                  />
                </DemoContainer>
              </LocalizationProvider>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['TimePicker']} sx={{ flex: 1 }}>
                  <Controller
                    name="endTime"
                    control={control}
                    rules={{ required: '예약 시간을 확인해주세요' }}
                    render={({ field: { value, onChange } }) => (
                      <StyledTimePicker
                        label="Check Out"
                        minutesStep={30}
                        skipDisabled={true}
                        minTime={dayjs(new Date(0, 0, 0, 9))}
                        maxTime={dayjs(new Date(0, 0, 0, 22))}
                        ampm={false}
                        value={value}
                        onChange={onChange}
                        shouldDisableTime={(value, view) =>
                          checkOutDisableTime(value as Dayjs, view, watch('startTime'))
                        }
                      />
                    )}
                  />
                </DemoContainer>
              </LocalizationProvider>
            </BasicTimePickerContainer>
          </Container>

          {/* 방문 주소 */}
          <Container>
            <ScheduleText>어디로 방문할까요?</ScheduleText>
            <Controller
              name="address"
              control={control}
              rules={{ required: '주소를 입력해주세요' }}
              render={({ field: { value, onChange } }) => (
                <StyledTextField
                  label="주소를 입력해주세요"
                  fullWidth
                  value={value}
                  onChange={onChange}
                  error={errors.address?.type === 'required'}
                  onClick={onToggleModal}
                  onKeyDown={onToggleModal}
                />
              )}
            />

            <Controller
              name="detailAddress"
              control={control}
              rules={{ required: '상세주소를 확인해주세요' }}
              render={({ field: { value, onChange } }) => (
                <StyledTextField label="상세주소를 입력해주세요" fullWidth value={value} onChange={onChange} />
              )}
            />

            {/* 다음 주소 모달 */}
            <Modal
              open={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <Sheet sx={{ width: '360px;' }}>
                <DaumPostcode onComplete={handleComplete} />
              </Sheet>
            </Modal>
          </Container>

          {/* 맡기실 펫 */}
          <SelectPetContainer>
            <ScheduleText>맡기시는 반려동물</ScheduleText>
            <PetContainer />
          </SelectPetContainer>
        </FieldContainer>

        <BottomFixed>
          <FloatButtonContainer>
            <StyledButton type="button" onClick={onSubmit}>
              다음단계
            </StyledButton>
          </FloatButtonContainer>
        </BottomFixed>
      </form>
    </MainContainer>
  );
}

const MainContainer = styled.main`
  margin-bottom: 80px;
`;

const FieldContainer = styled(Column)`
  gap: 52px;
  padding: 12px;
`;

const Container = styled(Column)`
  gap: 8px;
`;

const ScheduleText = styled.h2`
  color: ${({ theme }) => theme.text.active};
  font-weight: ${({ theme }) => theme.fontWeight.extrabold};
  ${({ theme }) => theme.fontSize.s16h24};
`;

const BasicTimePickerContainer = styled(Row)`
  gap: 8px;
`;

const StyledDatePicker = styled(DatePicker)`
  // 기본 배경 & 텍스트
  .MuiInputBase-root {
    color: ${({ theme }) => theme.text.active};
    background-color: ${({ theme }) => theme.background.input.primary};

    &:hover {
      background-color: ${({ theme }) => theme.background.input.hover};
    }
  }

  // 버튼
  .MuiButtonBase-root {
    color: ${({ theme }) => theme.text.active};
  }

  // 라벨
  .MuiInputLabel-root {
    color: ${({ theme }) => theme.text.active};
    ${({ theme }) => theme.fontSize.s14h21};
  }

  .MuiOutlinedInput-notchedOutline {
    border-color: ${({ theme }) => theme.line.input.default};
  }
`;

const StyledTimePicker = styled(TimePicker)`
  width: 100%;

  // 기본 배경 & 텍스트
  .MuiInputBase-root {
    color: ${({ theme }) => theme.text.active};
    background-color: ${({ theme }) => theme.background.input.primary};

    &:hover {
      background-color: ${({ theme }) => theme.background.input.hover};
    }
  }

  // 버튼
  .MuiButtonBase-root {
    color: ${({ theme }) => theme.text.active};
  }

  // 라벨
  .MuiInputLabel-root {
    color: ${({ theme }) => theme.text.active};
    ${({ theme }) => theme.fontSize.s14h21};
  }

  .MuiOutlinedInput-notchedOutline {
    border-color: ${({ theme }) => theme.line.input.default};
  }
`;

const StyledTextField = styled(TextField)`
  // 라벨
  .MuiInputLabel-root {
    color: ${({ theme }) => theme.text.active};
    ${({ theme }) => theme.fontSize.s14h21};
  }

  // input 배경
  .MuiOutlinedInput-root {
    background-color: ${({ theme }) => theme.background.input.primary};

    &:hover {
      background-color: ${({ theme }) => theme.background.input.hover};
    }
  }

  // value
  .MuiOutlinedInput-input {
    color: ${({ theme }) => theme.text.active};
    ${({ theme }) => theme.fontSize.s14h21};
  }

  // 포커스 상태 스타일
  .Mui-focused .MuiOutlinedInput-input {
    color: ${({ theme }) => theme.text.active} !important;
  }
`;

const SelectPetContainer = styled(Column)`
  gap: 8px;
`;

const FloatButtonContainer = styled(Float)`
  display: flex;
  align-items: center;
  justify-content: center;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 20px;
  background-color: ${({ theme }) => theme.background.primary};
`;

const StyledButton = styled(BlueButton)`
  border-radius: 8px;
  width: 100%;
  padding: 12px;

  ${({ theme }) => theme.fontSize.s16h24};
`;
