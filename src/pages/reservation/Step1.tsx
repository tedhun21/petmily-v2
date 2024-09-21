import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import styled from 'styled-components';
import { Controller, useFormContext, useWatch } from 'react-hook-form';

import {
  ButtonGroup,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  Button,
  Dialog,
  Box,
} from '@mui/material';
import { styled as styledMui } from '@mui/material/styles';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers';
import { Modal, Sheet } from '@mui/joy';
import DaumPostcode from 'react-daum-postcode';

import dayjs from 'dayjs';

import { checkInDisableTime, checkOutDisableTime, reservationDisableDate } from 'utils/date';

import { Row } from 'commonStyle';

import PetContainer from './component/step1/PetContainer';

const API_URL = process.env.REACT_APP_API_URL;

export default function Step1({ onNext }: any) {
  const navigate = useNavigate();

  // modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    setValue,
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
    setValue('address', `${zonecode} ${address}`);

    if (data) {
      clearErrors('address');
    }

    setIsModalOpen(false);
  };

  // Address Modal
  const onToggleModal = () => {
    setIsModalOpen(true);
  };

  const onSubmit = (data: any) => {
    if (checkedPets.length === 0 || checkedPets.length > 3) {
      window.alert('펫은 최소 1마리 최대 3마리까지 가능합니다.');
      return;
    }

    if (date && startTime && endTime && address !== '' && detailAddress !== '') {
      onNext();
    }
  };

  return (
    <MainContainer>
      <FormContainer>
        {/* 방문 날짜 */}
        <Container>
          <ScheduleText>언제 펫시터가 필요하신가요?</ScheduleText>
          <LocalizationProvider dateAdapter={AdapterDayjs} dateFormats={{ monthShort: `M` }}>
            <DemoContainer components={['DatePicker']}>
              <Controller
                name="date"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <DatePicker
                    label="날짜를 입력해주세요"
                    format="YYYY-MM-DD"
                    value={value}
                    onChange={onChange}
                    shouldDisableDate={reservationDisableDate}
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
                <StyledTimePicker>
                  <Controller
                    name="startTime"
                    control={control}
                    rules={{ required: '예약 시간을 확인해주세요' }}
                    render={({ field: { value, onChange } }) => (
                      <TimePicker
                        label="Check In"
                        minutesStep={30}
                        skipDisabled={true}
                        minTime={dayjs(new Date(0, 0, 0, 8))}
                        maxTime={dayjs(new Date(0, 0, 0, 21))}
                        ampm={false}
                        value={value}
                        onChange={onChange}
                        shouldDisableTime={(value, view) => checkInDisableTime(value, view, watch('date'))}
                        sx={{ width: '100%' }}
                      />
                    )}
                  />
                </StyledTimePicker>
              </DemoContainer>
            </LocalizationProvider>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={['TimePicker']} sx={{ flex: 1 }}>
                <StyledTimePicker>
                  <Controller
                    name="endTime"
                    control={control}
                    rules={{ required: '예약 시간을 확인해주세요' }}
                    render={({ field: { value, onChange } }) => (
                      <TimePicker
                        label="Check Out"
                        minutesStep={30}
                        skipDisabled={true}
                        minTime={dayjs(new Date(0, 0, 0, 9))}
                        maxTime={dayjs(new Date(0, 0, 0, 22))}
                        ampm={false}
                        value={value}
                        onChange={onChange}
                        shouldDisableTime={(value, view) => checkOutDisableTime(value, view, watch('startTime'))}
                        sx={{ width: '100%' }}
                      />
                    )}
                  />
                </StyledTimePicker>
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
              <TextField
                id="outlined-basic"
                placeholder="주소를 입력해주세요"
                fullWidth
                // {...register('address', { required: true })}
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
              <TextField label="상세주소를 입력해주세요" fullWidth value={value} onChange={onChange} />
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
          <SelectTitle>맡기시는 반려동물</SelectTitle>
          <PetContainer />
        </SelectPetContainer>

        <ButtonContainer>
          <StyledButton type="button" onClick={onSubmit}>
            다음단계
          </StyledButton>
        </ButtonContainer>
      </FormContainer>
    </MainContainer>
  );
}

const MainContainer = styled.main`
  display: flex;
  flex-direction: column;
  padding: 12px;
`;

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ScheduleText = styled.h2`
  ${(props) => props.theme.fontSize.s16h24};
  font-weight: ${(props) => props.theme.fontWeights.extrabold};
  white-space: pre-line;
`;

const BasicTimePickerContainer = styled(Row)`
  gap: 8px;
`;

const StyledTimePicker = styled.div`
  // TimePicker 컴포넌트의 스타일을 수정하기 위한
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SelectPetContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SelectTitle = styled.h1`
  font-weight: ${({ theme }) => theme.fontWeights.extrabold};
  ${({ theme }) => theme.fontSize.s16h24};
`;

// const AddPetImg = styled.img`
//   width: 80px;
//   height: 80px;
//   background-color: ${({ theme }) => theme.textColors.secondary};
//   border: 1px solid ${({ theme }) => theme.textColors.primary};
//   border-radius: 50%;
//   cursor: pointer;
// `;

// const PetButton = styledMui(Button)(({ value }) => ({
//   width: '100%',
//   backgroundColor: value === 'true' ? '#279EFF' : '#A6A6A6',

//   ':hover': {
//     backgroundColor: value === 'true' ? '#1D8CE7' : '#757575',
//   },
// }));

const ButtonContainer = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledButton = styled.button`
  border-radius: 8px;
  width: 100%;
  padding: 12px;
  border: none;
  background-color: ${({ theme }) => theme.colors.mainBlue};
  color: white;
  cursor: pointer;
  ${({ theme }) => theme.fontSize.s16h24};

  &:hover {
    background-color: ${({ theme }) => theme.colors.subBlue};
  }
  &:active {
    background-color: ${({ theme }) => theme.colors.darkBlue};
    box-shadow: ${({ theme }) => theme.shadow.inset};
  }
`;
