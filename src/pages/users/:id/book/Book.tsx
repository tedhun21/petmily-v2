import { useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { Controller, FormProvider, useForm } from 'react-hook-form';
import useSWR from 'swr';
import DaumPostcode from 'react-daum-postcode';
import styled from 'styled-components';

import { timeRange } from 'utils/date';
import { fetcherWithCookie, posterWithCookie } from 'api';
import SelectPets from './component/SelectPets';
import { Modal, TextField } from '@mui/material';
import {
  BlueButton,
  BottomFixed,
  Column,
  DefaultDivider,
  Float,
  Row,
  SubTitle,
  Texts14h21,
  Texts16h24,
  Title,
} from 'commonStyle';
import SelectedPetsitter from '@pages/reservation/component/step4/SelectedPetsitterCard';
import Confirm from '@pages/reservation/component/step4/Confirm';
import useSWRMutation from 'swr/mutation';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import Loading from '@components/Loading';

const schema = yup.object().shape({
  checkedPets: yup.array().min(1, '적도오 한 마리의 펫을 선택해야 합니다.'),
  zipcode: yup.string(),
  address: yup.string().required('주소를 입력해 주세요.'),
  detailAddress: yup.string().required('상세 주소를 입력해주세요.'),
  body: yup.string().max(200, '200자 이내로 입력해주세요.'),
});

const API_URL = process.env.REACT_APP_API_URL;

export default function Book() {
  const navigate = useNavigate();
  const { nickname } = useParams();
  const [searchParams] = useSearchParams();
  const date = searchParams.get('date');
  const startTime = searchParams.get('checkIn');
  const endTime = searchParams.get('checkOut');

  // 주소 모달
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 약관 동의 체크
  const [isChecked, setIsChecked] = useState(false);

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: { checkedPets: [], zipcode: '', address: '', detailAddress: '', body: '' },
  });

  const { checkedPets, address, detailAddress } = methods.watch();

  const disabled = checkedPets?.length === 0 || address === '' || detailAddress === '' || !isChecked;

  const { data: me } = useSWR(`${API_URL}/users/me`, fetcherWithCookie);
  const { data: petsitter } = useSWR(`${API_URL}/users?q=${nickname}`, fetcherWithCookie);
  const { isMutating, trigger } = useSWRMutation(`${API_URL}/reservations`, posterWithCookie);

  const onToggleModal = () => {
    setIsModalOpen(true);
  };

  const handleComplete = (data: any) => {
    const { address, zonecode } = data;
    if (data) {
      methods.clearErrors('address');
    }

    methods.setValue('address', address);
    methods.setValue('zipcode', zonecode);
    setIsModalOpen(false);
  };

  const onSubmit = async (data: any) => {
    const { checkedPets, zipcode, address, detailAddress, body } = data;

    const formattedStartTime = dayjs(startTime, 'HH:mm').format('HH:mm:ss');
    const formattedEndTime = dayjs(endTime, 'HH:mm').format('HH:mm:ss');
    const formattedPetIds = checkedPets.map((pet: any) => pet.id);
    console.log(formattedStartTime);
    console.log(formattedEndTime);

    const formattedData = {
      date,
      startTime: formattedStartTime,
      endTime: formattedEndTime,
      zipcode,
      address,
      detailAddress,
      body,
      petIds: formattedPetIds,
      petsitterId: petsitter.id,
      status: 'Pending',
    };

    trigger(
      { formData: formattedData },
      {
        onSuccess: () => {
          toast.success('예약 요청을 보냈습니다');
          navigate('/cares');
        },
        onError: () => {
          toast.error('예약 요청에 실패했습니다');
        },
      },
    );
  };

  return (
    <FormProvider {...methods}>
      <Main>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <Container>
            <Title>예약 요청</Title>
            <SelectedPetsitter petsitter={petsitter} />

            <Reservation>
              <SubTitle>예약 정보</SubTitle>

              <Column>
                <ReservationWrapper>
                  <ReservationLabel>예약 날짜</ReservationLabel>
                  <Texts14h21>{date}</Texts14h21>
                </ReservationWrapper>
                <ReservationWrapper>
                  <ReservationLabel>예약 시간</ReservationLabel>
                  <Texts14h21>{timeRange(startTime, endTime)}</Texts14h21>
                </ReservationWrapper>
              </Column>

              <span></span>
            </Reservation>

            {me ? (
              <>
                <SelectPets />

                <DefaultDivider />

                <AddressSection>
                  <SubTitle>어디로 방문할까요?</SubTitle>
                  <Controller
                    name="address"
                    control={methods.control}
                    rules={{ required: '주소를 입력해주세요' }}
                    render={({ field }) => (
                      <StyledTextField {...field} label="주소를 입력해주세요" onClick={onToggleModal} />
                    )}
                  />

                  <Controller
                    name="detailAddress"
                    control={methods.control}
                    rules={{ required: '상세주소를 확인해주세요' }}
                    render={({ field }) => <StyledTextField {...field} label="상세주소를 입력해주세요" />}
                  />

                  <Modal
                    open={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <div style={{ width: '360px' }}>
                      <DaumPostcode onComplete={handleComplete} />
                    </div>
                  </Modal>
                </AddressSection>

                <DefaultDivider />

                <RequestSection>
                  <SubTitle>요청사항</SubTitle>
                  <Controller
                    name="body"
                    render={({ field }) => (
                      <StyledTextField
                        {...field}
                        label={'예) 산책중에 아무거나 잘 삼켜서 주의해주셔야 해요.'}
                        multiline
                      />
                    )}
                  />
                </RequestSection>
              </>
            ) : (
              <>
                <DefaultDivider />
                <div>
                  <span>예약하려면 로그인 하세요</span>
                </div>
              </>
            )}
          </Container>

          <BottomFixed>
            <FloatButtonContainer>
              <Confirm isChecked={isChecked} setIsChecked={setIsChecked} />

              <StyledButton disabled={disabled}>{isMutating ? <Loading /> : <span>예약하기</span>}</StyledButton>
            </FloatButtonContainer>
          </BottomFixed>
        </form>
      </Main>
    </FormProvider>
  );
}

const Main = styled.main`
  height: 100%;
  overflow: auto;
  padding-bottom: 160px;
`;

const Reservation = styled.section`
  display: flex;
  flex-direction: column;
  padding: 24px;
  border-radius: 12px;
  gap: 16px;
  background-color: ${({ theme }) => theme.background.box.default.primary};
`;

const Container = styled(Column)`
  padding: 16px;
  gap: 16px;j
`;

const ReservationWrapper = styled(Row)`
  align-items: center;
  justify-content: space-between;
`;

const ReservationLabel = styled(Texts16h24)`
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.text.inactive};
`;

const AddressSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const StyledTextField = styled(TextField)`
  // 라벨
  .MuiInputLabel-root {
    color: ${({ theme }) => theme.text.active};
    ${({ theme }) => theme.fontSize.s14h21};
  }

  // input 배경
  .MuiOutlinedInput-root {
    border-radius: 12px;
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
    color: ${({ theme }) => theme.text.active};
  }
`;

const RequestSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FloatButtonContainer = styled(Float)`
  left: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 0px 20px 20px 20px;
  background-color: ${({ theme }) => theme.background.primary};
`;

const StyledButton = styled(BlueButton)<{ disabled: boolean }>`
  border-radius: 8px;
  width: 100%;
  padding: 12px;

  // hover와 active 스타일을 disabled일 때 비활성화
  pointer-events: ${({ disabled }) => (disabled ? 'none' : 'auto')};

  background-color: ${({ theme, disabled }) =>
    disabled ? theme.background.box.blue.disabled : theme.background.box.blue.primary};

  ${({ theme }) => theme.fontSize.s16h24}
`;
