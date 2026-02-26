import { useNavigate, useParams } from 'react-router-dom';
import { FormProvider, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import useSWR from 'swr';
import { useAuthSWR, useAuthSWRMutation } from '@/hooks/authSWR';

import { fetcher, poster } from '@/api';
import SelectPets from './component/SelectPets';

import Text from '@/components/styled/Text';
import Box from '@/components/styled/Box';
import Flex from '@/components/styled/Flex';
import { Input } from '@/components/styled/Input';
import { useDispatch, useSelector } from 'react-redux';
import { closeModal, ModalType, openModal } from '@/store/slices/modalSlice';
import type { RootState } from '@/store';
import Button from '@/components/styled/Button';
import SelectTimes from './component/SelectTimes';
import SelectDate from './component/SelectDate';
import { toast } from 'react-toastify';
import type { Pet } from '@/types/pet.type';
import Header from '@/components/headers/Header';
import BackButton from '@/components/buttons/BackButton';
import Accordion from '@/components/Accordion';
import CustomDaumPostcode, { type PostcodeData } from '@/components/CustomDaumPostcode';
import { useState } from 'react';
import BottomCTA from '@/components/BottomCTA';
import Modal from '@/components/Modal';

const schema = yup.object().shape({
  checkedPets: yup.array().min(1, '적어도 한 마리의 펫을 선택해야 합니다.'),
  startTime: yup.string(),
  endTime: yup.string(),
  date: yup.string(),
  zipcode: yup.string(),
  address: yup.string().required('주소를 입력해 주세요.'),
  detailAddress: yup.string().required('상세 주소를 입력해주세요.'),
  body: yup.string().max(200, '200자 이내로 입력해주세요.'),
});

export default function BookPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const [currentStep, setCurrentStep] = useState(0);

  const methods = useForm({
    resolver: yupResolver(schema),
  });

  const { data: me } = useAuthSWR('/users/me', fetcher);
  const { data: petsitter } = useSWR(id ? `/users/${id}` : null, fetcher);
  const { isMutating, trigger } = useAuthSWRMutation('/reservations', poster, {
    onSuccess: () => {
      toast.success('예약 요청을 보냈어요.');
      navigate('/cares');
    },
    onError: () => {
      toast.error('예약 요청을 실패했어요.');
    },
  });

  const { currentModal } = useSelector((state: RootState) => state.modal);

  const handlePostcodeModalOpen = () => {
    dispatch(openModal(ModalType.POSTCODE));
  };

  const handlePostcodeModalClose = () => {
    dispatch(closeModal());
  };

  const handleComplete = (data: PostcodeData) => {
    const { address, zonecode } = data;

    if (data) {
      methods.clearErrors('address');
    }

    methods.setValue('address', address);
    methods.setValue('zipcode', zonecode);

    handlePostcodeModalClose();
  };

  const onSubmit = async (data: any) => {
    const { checkedPets, date, startTime, endTime, zipcode, address, detailAddress, body } = data;

    const formattedPetIds = checkedPets.map((pet: Pet) => pet.id);

    const formattedData = {
      petIds: formattedPetIds,
      date,
      startTime,
      endTime,
      zipcode,
      address,
      detailAddress,
      body,
      petsitterId: petsitter.id,
    };

    trigger(formattedData);
  };

  const checkedPets = methods.watch('checkedPets');

  return (
    <>
      <Header left={<BackButton />} center={<Text size="lg">예약</Text>} />
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <Box p="md">
            <Flex direction="column" gap="md">
              {/* 1. 펫 선택 */}
              <Box p="lg" br="lg" shadow="dp03">
                <Accordion isOpen={currentStep === 1} onToggle={() => setCurrentStep(currentStep === 1 ? 0 : 1)}>
                  <Accordion.Trigger>
                    <Flex justifyContent="space-between" alignItems="center">
                      <Text size="lg">1. 맡기실 펫을 선택해주세요</Text>
                      {checkedPets && checkedPets.length > 0 && currentStep !== 1 && (
                        <Button type="button">변경</Button>
                      )}
                    </Flex>
                  </Accordion.Trigger>

                  <Accordion.Content>
                    <Flex direction="column">
                      <SelectPets />
                      <Button
                        type="button"
                        disabled={checkedPets?.length === 0}
                        onClick={() => setCurrentStep(2)}
                        css={{ alignSelf: 'flex-end' }}
                      >
                        다음
                      </Button>
                    </Flex>
                  </Accordion.Content>
                </Accordion>
              </Box>

              {/* 2. 날짜 및 시간 선택 */}
              <Box p="lg" br="lg" shadow="dp03">
                <Accordion isOpen={currentStep === 2} onToggle={() => setCurrentStep(currentStep === 2 ? 0 : 2)}>
                  <Accordion.Trigger>
                    <Text size="lg">2. 언제 방문할까요?</Text>
                  </Accordion.Trigger>

                  <Accordion.Content>
                    <Box mt="lg">
                      <Flex direction="column" alignItems="flex-start" gap="lg">
                        <SelectDate possibleDays={petsitter?.possibleDays} />

                        <SelectTimes petsitter={petsitter} />
                      </Flex>
                    </Box>
                  </Accordion.Content>
                </Accordion>
              </Box>

              {/* 3. 방문 주소 선택 */}
              <Box p="lg" br="lg" shadow="dp03">
                <Accordion>
                  <Accordion.Trigger>
                    <Text size="lg">3. 어디로 방문할까요?</Text>
                  </Accordion.Trigger>

                  <Flex direction="column" gap="md">
                    <button type="button" onClick={handlePostcodeModalOpen}>
                      <Input
                        {...methods.register('address')}
                        placeholder="주소를 입력해주세요"
                        autoComplete="off"
                        fullWidth
                      />
                    </button>
                    <Input {...methods.register('detailAddress')} placeholder="상세주소를 입력해주세요" />
                  </Flex>
                </Accordion>

                {/* <Modal open={currentModal === ModalType.POSTCODE} onClose={handlePostcodeModalClose}>
                  <CustomDaumPostcode onComplete={handleComplete} />
                </Modal> */}
              </Box>

              {/* 4. 요청사항 */}
              <Box p="lg" br="lg" shadow="dp03">
                <Text size="lg">4. 요청사항 (선택)</Text>

                <Input
                  {...methods.register('body')}
                  placeholder="예) 산책중에 아무거나 잘 삼켜서 주의해주셔야 해요."
                  fullWidth
                />
              </Box>
            </Flex>
          </Box>

          <BottomCTA>
            <Button type="submit" size="lg" fullWidth>
              예약하기
            </Button>
          </BottomCTA>
        </form>
      </FormProvider>
    </>
  );
}
