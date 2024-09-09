import { useState } from 'react';
import { useNavigate } from 'react-router';

import styled from 'styled-components';
import { useFormContext } from 'react-hook-form';

import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { TextField } from '@mui/material';

import { GoChecklist } from 'react-icons/go';
import { Column, Row } from 'commonStyle';

import dayjs from 'dayjs';
import SelectedPetsitter from './component/step3/SelectedPetsitterCard';
import SelectedPets from './component/step3/SelectedPets';
import Confirm from './component/step3/Confirm';
import { useCustomMutation } from 'hooks/useCustomMutation';
import { createReservation } from './api';
import { Loading } from '@components/Loading';

interface IPetsitter {
  nickname: string;
  star: number;
  reviewCount: number;
  possibleLocation: string;
  possibleDay: string;
  photo: { id: number; url: string };
}

export interface IPet {
  name: string;
  age: number;
  petId: number;
  male: boolean;
  photo: string;
  species: string;
}

export default function Step3() {
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

  // reservation create
  const {
    isLoading,
    data,
    mutate: createReservationMutate,
  } = useCustomMutation({
    mutationFn: createReservation,
    onSuccess: () => {
      window.alert('에약 신청이 완료되었습니다');
      navigate('/cares');
    },
  });

  const onSubmit = async (data: any) => {
    const { date, startTime, endTime, address, detailAddress, body, checkedPets, petsitter } = data;
    const formattedDate = dayjs(date).format('YYYY-MM-DD');
    const formattedStartTime = dayjs(startTime).format('HH:mm:ss');
    const formattedEndTime = dayjs(endTime).format('HH:mm:ss');
    const formattedAddress = `${address} ${detailAddress}`;
    const formattedPetId = checkedPets.map((pet: any) => pet.id);

    const formattedData = {
      date: formattedDate,
      startTime: formattedStartTime,
      endTime: formattedEndTime,
      address: formattedAddress,
      petId: formattedPetId,
      body,
      petsitterId: petsitter.id,
    };

    createReservationMutate({ data: formattedData });
  };

  return (
    <MainContainer>
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
          <ReservationSpan>{`${address} ${detailAddress}`}</ReservationSpan>
        </ResultWrapper>
        <ResultWrapper>
          <ReservationLabel>예약 날짜</ReservationLabel>
          <ReservationSpan>{dayjs(date).format('YYYY-MM-DD')}</ReservationSpan>
        </ResultWrapper>
        <ResultWrapper>
          <ReservationLabel>예약 시간</ReservationLabel>
          <ReservationSpan>{`${dayjs(startTime).format('HH:mm')} ~ ${dayjs(endTime).format('HH:mm')}`}</ReservationSpan>
        </ResultWrapper>
      </ReservationResult>

      <SelectedPets checkedPets={checkedPets} />

      <FormContainer onSubmit={handleSubmit(onSubmit)}>
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

          <ContactContainer>
            <RequestText>연락처</RequestText>
            <TextContainer>
              <ContactText>010-8131-0409</ContactText>
              <ContactSubText>프로필 번호로 카카오 알림톡 전송</ContactSubText>
            </TextContainer>
          </ContactContainer>
        </RequestContactSection>

        <CofirmButtonContainer>
          <Confirm isChecked={isChecked} setIsChecked={setIsChecked} />

          <ButtonContainer>
            <StyledButton type="submit" disabled={isLoading || !isChecked || watch('body') === ''}>
              {isLoading ? <Loading size="27px" /> : <span>예약하기</span>}
            </StyledButton>
          </ButtonContainer>
        </CofirmButtonContainer>
      </FormContainer>
    </MainContainer>
  );
}

const MainContainer = styled.main`
  display: flex;
  flex-direction: column;
  padding: 12px;
  gap: 8px;
`;

const CheckTitleText = styled.h1`
  ${(props) => props.theme.fontSize.s20h30};
  font-weight: ${(props) => props.theme.fontWeights.extrabold};
`;

const CheckIconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-itmems: center;
  background-color: ${(props) => props.theme.colors.mainBlue};
  padding: 8px;
  border-radius: 50%;
`;

const TitleContainer = styled(Row)`
  justify-content: center;
  align-items: center;
  gap: 20px;
  padding: 12px;
`;

const ReservationResult = styled.section`
  display: flex;
  flex-direction: column;
  padding: 24px;
  border-radius: 12px;
  gap: 16px;
  background-color: ${(props) => props.theme.colors.white};
  box-shadow: ${(props) => props.theme.shadow.dp01};
`;

const ResultWrapper = styled(Row)`
  align-items: center;
  justify-content: space-between;
`;

const ReservationLabel = styled.span`
  ${(props) => props.theme.fontSize.s16h24};
  font-weight: ${(props) => props.theme.fontWeights.bold};
  color: ${(props) => props.theme.textColors.gray30};
  white-space: nowrap;
`;

const ReservationSpan = styled.span`
  ${(props) => props.theme.fontSize.s14h21};
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
  background-color: ${(props) => props.theme.colors.white};
  box-shadow: ${(props) => props.theme.shadow.dp01};
`;

const RequestContainer = styled(Column)`
  gap: 8px;
`;

const RequestText = styled.h2`
  ${(props) => props.theme.fontSize.s16h24};
  font-weight: ${(props) => props.theme.fontWeights.bold};
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

const ContactText = styled.span`
  ${(props) => props.theme.fontSize.s14h21};
  font-weight: ${(props) => props.theme.fontWeights.light};
`;

const ContactSubText = styled.div`
  ${(props) => props.theme.fontSize.s12h18};
  font-weight: ${(props) => props.theme.fontWeights.light};
  color: ${(props) => props.theme.textColors.primary};
`;

const CofirmButtonContainer = styled.section`
  display: flex;
  flex-direction: column;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px;
`;

const StyledButton = styled.button`
  border-radius: 8px;
  width: 100%;
  padding: 12px;
  border: none;
  background-color: ${(props) => props.theme.colors.mainBlue};
  color: white;
  cursor: pointer;
  ${(props) => props.theme.fontSize.s16h24};

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:hover {
    background-color: ${(props) => props.theme.colors.subBlue};
  }

  &:active {
    background-color: ${(props) => props.theme.colors.darkBlue};
    box-shadow: ${(props) => props.theme.shadow.inset};
  }
`;
