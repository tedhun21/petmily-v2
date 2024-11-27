import { useState } from 'react';
import { useNavigate } from 'react-router';

import styled from 'styled-components';
import { useFormContext } from 'react-hook-form';
import useSWRMutation from 'swr/mutation';

import { TextField } from '@mui/material';
import dayjs from 'dayjs';

import { GoChecklist } from 'react-icons/go';

import { BlueButton, BottomFixed, CenterContainer, Column, Row, Texts12h18, Texts14h21, Texts16h24 } from 'commonStyle';
import SelectedPetsitter from './component/step4/SelectedPetsitterCard';
import SelectedPets from './component/step4/SelectedPets';
import Confirm from './component/step4/Confirm';

import { fetcherWithCookie, posterWithCookie } from 'api';
import useSWR from 'swr';
import { timeRange } from 'utils/date';
import Loading from '@components/Loading';
import { toast } from 'react-toastify';

const API_URL = process.env.REACT_APP_API_URL;

export default function Step4() {
  const navigate = useNavigate();

  const [isChecked, setIsChecked] = useState(false);

  const {
    register,
    getValues,
    handleSubmit,
    watch,
    formState: { errors },
  } = useFormContext();

  const { date, startTime, endTime, address, detailAddress, checkedPets, petsitter } = getValues();

  const { data: me } = useSWR(`${API_URL}/users/me`, fetcherWithCookie);

  // reservation create
  const { trigger, isMutating } = useSWRMutation(`${API_URL}/reservations`, posterWithCookie, {
    onSuccess: () => {
      navigate('/cares');
      toast.success('예약 신청이 완료되었습니다!');
    },
  });

  const onSubmit = async (data: any) => {
    const { date, startTime, endTime, address, detailAddress, body, checkedPets, petsitter } = data;
    const formattedDate = dayjs(date).format('YYYY-MM-DD');
    const formattedStartTime = dayjs(startTime).format('HH:mm:ss');
    const formattedEndTime = dayjs(endTime).format('HH:mm:ss');
    const formattedPetIds = checkedPets.map((pet: any) => pet.id);

    const formattedData = {
      date: formattedDate,
      startTime: formattedStartTime,
      endTime: formattedEndTime,
      address,
      detailAddress,
      petIds: formattedPetIds,
      body,
      petsitterId: petsitter.id,
      status: 'Pending',
    };

    try {
      await trigger({ formData: formattedData });
    } catch (e) {
      toast.error('에약 신청에 실패했습니다.');
    }
  };

  return (
    <MainContainer>
      <FormContainer onSubmit={handleSubmit(onSubmit)}>
        <InfoContainer>
          <TitleContainer>
            {/* <CheckTitleText>{nickName}님</CheckTitleText> */}
            <CheckTitleText>예약내역을 확인해주세요</CheckTitleText>
            <CheckIconWrapper>
              <GoChecklist size="32px" color="white" />
            </CheckIconWrapper>
          </TitleContainer>

          <SelectedPetsitter petsitter={petsitter} />

          <ReservationResult>
            <ResultWrapper>
              <ReservationLabel>주소</ReservationLabel>
              <Texts14h21>{`${address} ${detailAddress}`}</Texts14h21>
            </ResultWrapper>
            <ResultWrapper>
              <ReservationLabel>예약 날짜</ReservationLabel>
              <Texts14h21>{dayjs(date).format('YYYY-MM-DD')}</Texts14h21>
            </ResultWrapper>
            <ResultWrapper>
              <ReservationLabel>예약 시간</ReservationLabel>
              <Texts14h21>{timeRange(startTime, endTime)}</Texts14h21>
            </ResultWrapper>
          </ReservationResult>

          <SelectedPets checkedPets={checkedPets} />

          <RequestContactSection>
            <RequestContainer>
              <RequestText>요청사항</RequestText>
              <StyledTextField
                {...register('body', { required: true })}
                id="outlined-basic"
                label={'예) 산책중에 아무거나 잘 삼켜서 주의해주셔야 해요.'}
                variant="outlined"
                error={errors.body?.type === 'required'}
                fullWidth
                multiline
              />
            </RequestContainer>

            {/* <ContactContainer>
            <RequestText>연락처</RequestText>
            <TextContainer>
              <ContactText>{me?.phone}</ContactText>
              <ContactSubText>프로필 번호로 카카오 알림톡 전송</ContactSubText>
            </TextContainer>
          </ContactContainer> */}
          </RequestContactSection>
        </InfoContainer>

        <BottomFixed>
          <CofirmButtonContainer>
            <Confirm isChecked={isChecked} setIsChecked={setIsChecked} />

            <ButtonContainer>
              <StyledButton type="submit" disabled={isMutating || !isChecked || watch('body') === ''}>
                {isMutating ? <Loading /> : <span>예약하기</span>}
              </StyledButton>
            </ButtonContainer>
          </CofirmButtonContainer>
        </BottomFixed>
      </FormContainer>
    </MainContainer>
  );
}

const MainContainer = styled.main`
  display: flex;
  flex-direction: column;
`;

const InfoContainer = styled(Column)`
  gap: 16px;
  padding: 12px;
`;

const CheckTitleText = styled.h1`
  font-weight: ${({ theme }) => theme.fontWeight.extrabold};
  ${({ theme }) => theme.fontSize.s20h30};
`;

const CheckIconWrapper = styled(CenterContainer)`
  padding: 8px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.background.highlight};
`;

const TitleContainer = styled(CenterContainer)`
  padding: 12px;
  gap: 20px;
`;

const ReservationResult = styled.section`
  display: flex;
  flex-direction: column;
  padding: 24px;
  border-radius: 12px;
  gap: 16px;
  background-color: ${({ theme }) => theme.background.box.default.primary};
  box-shadow: ${({ theme }) => theme.shadow.dp01};
`;

const ResultWrapper = styled(Row)`
  align-items: center;
  justify-content: space-between;
`;

const ReservationLabel = styled(Texts16h24)`
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.text.active};
  white-space: nowrap;
`;

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const RequestContactSection = styled.section`
  display: flex;
  flex-direction: column;
  padding: 24px;
  border-radius: 12px;
  gap: 16px;
  background-color: ${({ theme }) => theme.background.box.default.primary};
  box-shadow: ${({ theme }) => theme.shadow.dp01};
`;

const RequestContainer = styled(Column)`
  gap: 8px;
`;

const RequestText = styled.h2`
  ${({ theme }) => theme.fontSize.s16h24};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
`;

const StyledTextField = styled(TextField)`
  .MuiInputLabel-root {
    color: #d9d9d9;
    font-size: 14px;
  }
`;

const ContactContainer = styled(Row)`
  gap: 20px;
`;

const TextContainer = styled(Column)``;

const ContactText = styled(Texts14h21)`
  font-weight: ${({ theme }) => theme.fontWeight.light};
`;

const ContactSubText = styled(Texts12h18)`
  font-weight: ${({ theme }) => theme.fontWeight.light};
  color: ${({ theme }) => theme.text.active};
`;

const CofirmButtonContainer = styled.section`
  display: flex;
  flex-direction: column;
`;

const ButtonContainer = styled(CenterContainer)`
  padding: 8px;
`;

const StyledButton = styled(BlueButton)`
  border-radius: 8px;
  width: 100%;
  padding: 12px;
  border: none;

  ${({ theme }) => theme.fontSize.s16h24};

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
