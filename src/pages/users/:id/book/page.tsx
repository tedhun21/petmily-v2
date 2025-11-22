import { useState } from 'react';

import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import dayjs from 'dayjs';
import { toast } from 'react-toastify';

import useSWR from 'swr';
import { useAuthSWR, useAuthSWRMutation } from '@/hooks/authSWR';

import styled from '@emotion/styled';
import { Modal, TextField } from '@mui/material';

import { timeRange } from '@/utils/date';
import { fetcher, poster } from '@/api';
import SelectPets from './component/SelectPets';
import { Divider, SubTitle } from '@/styles/commonStyle';

import Confirm from '@pages/users/:id/book/component/Confirm';

import Loading from '@components/Loading';
import CustomDaumPostcode from '@components/CustomDaumPostcode';
import SelectedPetsitter from './component/SelectedPetsitter';
import BackHeader from '@components/headers/BackHeader';
import { Button } from '@/components/styled/Button';
import { Text } from '@components/styled/Text';
import Box from '@components/styled/Box';
import Flex from '@components/styled/Flex';

const schema = yup.object().shape({
  checkedPets: yup.array().min(1, '적도오 한 마리의 펫을 선택해야 합니다.'),
  zipcode: yup.string(),
  address: yup.string().required('주소를 입력해 주세요.'),
  detailAddress: yup.string().required('상세 주소를 입력해주세요.'),
  body: yup.string().max(200, '200자 이내로 입력해주세요.'),
});

export default function BookPage() {
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

  const { data: me } = useAuthSWR('/users/me', fetcher);
  const { data: petsitter } = useSWR(`/users?q=${nickname}`, fetcher);
  const { isMutating, trigger } = useAuthSWRMutation('/reservations', poster);

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

    trigger(formattedData, {
      onSuccess: () => {
        toast.success('예약 요청을 보냈습니다');
        navigate('/cares');
      },
      onError: () => {
        toast.error('예약 요청에 실패했습니다');
      },
    });
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <Main>
          <BackHeader title="예약 요청" />
          <Container>
            <SelectedPetsitter petsitter={petsitter} />

            <Reservation>
              <SubTitle>예약 정보</SubTitle>

              <Flex direction="column">
                <Flex justifyContent="space-between" alignItems="center">
                  <Text size="base" weight="bold">
                    예약 날짜
                  </Text>
                  <Text size="sm">{date}</Text>
                </Flex>
                <Flex justifyContent="space-between" alignItems="center">
                  <Text size="base" weight="bold">
                    예약 시간
                  </Text>
                  <Text size="sm">{timeRange(startTime, endTime)}</Text>
                </Flex>
              </Flex>

              <span></span>
            </Reservation>

            {me ? (
              <>
                <SelectPets />

                <Divider />

                <Flex as="section" direction="column" gap="lg">
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
                      <CustomDaumPostcode onComplete={handleComplete} />
                    </div>
                  </Modal>
                </Flex>

                <Divider />

                <Flex as="section" direction="column" gap="lg">
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
                </Flex>
              </>
            ) : (
              <>
                <Divider />
                <div>
                  <span>예약하려면 로그인 하세요</span>
                </div>
              </>
            )}
          </Container>

          <ButtonContainer>
            <Confirm isChecked={isChecked} setIsChecked={setIsChecked} />

            <Button disabled={disabled} size="lg" borderRadius="lg" fullWidth>
              {isMutating ? <Loading /> : <span>예약하기</span>}
            </Button>
          </ButtonContainer>
        </Main>
      </form>
    </FormProvider>
  );
}

const Main = styled.main`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

// TODO
const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: auto;
  overflow-y: auto;
  height: 100%;
  padding: ${({ theme }) => theme.spacing.xl};
  gap: ${({ theme }) => theme.spacing.xl};
`;

// TODO
const Reservation = styled.section`
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => theme.spacing['2xl']};
  background-color: ${({ theme }) => theme.colors.background.box.default.primary};
  border-radius: ${({ theme }) => theme.spacing.md};
  box-shadow: ${({ theme }) => theme.shadow.dp01};
  gap: ${({ theme }) => theme.spacing.lg};
`;

const StyledTextField = styled(TextField)`
  /* 라벨 */
  .MuiInputLabel-root {
    color: ${({ theme }) => theme.colors.text.active};
    ${({ theme }) => theme.typeScale.sm};
  }

  /* input 배경 */
  .MuiOutlinedInput-root {
    background-color: ${({ theme }) => theme.colors.background.input.primary};
    border-radius: ${({ theme }) => theme.radius.sm};

    &:hover {
      background-color: ${({ theme }) => theme.colors.background.input.hover};
    }
  }

  /* value */
  .MuiOutlinedInput-input {
    color: ${({ theme }) => theme.colors.text.active};
    ${({ theme }) => theme.typeScale.sm};
  }

  /* 포커스 상태 스타일 */
  .Mui-focused .MuiOutlinedInput-input {
    color: ${({ theme }) => theme.colors.text.active};
  }
`;

// TODO
const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xl};
  background-color: ${({ theme }) => theme.colors.background.primary};
  gap: ${({ theme }) => theme.spacing.sm};
`;
